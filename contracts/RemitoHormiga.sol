// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RemitoHormiga is ERC721Enumerable, ReentrancyGuard {
    struct Remito {
        uint256 valorDeclarado;
        uint256 recompensa;
        uint256 tiempoLimite;
        address liberatingWallet;
        string imageURI;
        bool entregado;
    }

    mapping(uint256 => Remito) public remitos;
    mapping(uint256 => address) public originalMinters;

    IERC20 public hormigaToken;
    address public FEV;
    address public FER;

    event Created(uint256 tokenId);
    event Delivered(uint256 tokenId);
    event RefundClaimed(uint256 tokenId, address minter);

    constructor(
        address _hormigaToken,
        address _FEV,
        address _FER
    ) ERC721("Remito Hormiga", "RHT") {
        hormigaToken = IERC20(_hormigaToken);
        FEV = _FEV;
        FER = _FER;
    }

    function mintRemito(
        uint256 _valorDeclarado,
        uint256 _recompensa,
        uint256 _tiempoLimite,
        address _liberatingWallet,
        string memory _imageURI
    ) external nonReentrant {
        require(_valorDeclarado > 0, "Valor declarado debe ser mayor que cero");
        require(_recompensa > 0, "Recompensa debe ser mayor que cero");
        require(
            _tiempoLimite > block.timestamp,
            "El tiempo limite debe ser mayor que el tiempo actual"
        );
        require(
            bytes(_imageURI).length > 0,
            "URI de la imagen no puede estar vacio"
        );

        uint256 tokenId = totalSupply() + 1;

        Remito memory newRemito = Remito({
            valorDeclarado: _valorDeclarado,
            recompensa: _recompensa,
            tiempoLimite: _tiempoLimite,
            liberatingWallet: _liberatingWallet,
            imageURI: _imageURI,
            entregado: false
        });

        remitos[tokenId] = newRemito;
        originalMinters[tokenId] = msg.sender;

        if (!hormigaToken.transferFrom(msg.sender, FER, _recompensa)) {
            revert("Failed to transfer reward to FER");
        }
        if (!hormigaToken.transferFrom(msg.sender, FEV, _valorDeclarado)) {
            revert("Failed to transfer declared value to FEV");
        }

        _safeMint(msg.sender, tokenId);

        emit Created(tokenId);
    }

    modifier onlyLiberatingWallet(uint256 tokenId) {
        require(
            msg.sender == remitos[tokenId].liberatingWallet,
            "You are not the liberating wallet"
        );
        _;
    }

    function deliver(
        uint256 tokenId
    ) external nonReentrant onlyLiberatingWallet(tokenId) {
        Remito storage remito = remitos[tokenId];

        require(!remito.entregado, "Already delivered");
        
        address currentOwner = ownerOf(tokenId);

        require(
            hormigaToken.transferFrom(FER, currentOwner, remito.recompensa),
            "Failed to transfer reward from FER"
        );
        require(
            hormigaToken.transferFrom(FEV, currentOwner, remito.valorDeclarado),
            "Failed to transfer declared value from FEV"
        );

        remito.entregado = true;

        emit Delivered(tokenId);
    }

    modifier onlyOriginalMinter(uint256 tokenId) {
        require(
            msg.sender == originalMinters[tokenId],
            "Only the original minter can claim a refund"
        );
        _;
    }

    function claimRefund(
    uint256 tokenId
) external nonReentrant onlyLiberatingWallet(tokenId) {
    Remito storage remito = remitos[tokenId];

    require(!remito.entregado, "Already delivered");
    require(
        block.timestamp > remito.tiempoLimite,
        "Time limit not yet exceeded"
    );

    require(
        hormigaToken.transferFrom(FEV, msg.sender, remito.valorDeclarado),
        "Failed to transfer declared value from FEV"
    );
    
    require(
        hormigaToken.transferFrom(FER, msg.sender, remito.recompensa),
        "Failed to transfer reward from FER"
    );

    emit RefundClaimed(tokenId, msg.sender);
}

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return remitos[tokenId].imageURI;
    }

  
    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

 
    function getNFTs(
        address account,
        string memory filter
    ) external view returns (uint256[] memory) {
        uint256 total = totalSupply();
        uint256[] memory filteredNFTs = new uint256[](total);

        uint256 counter = 0;
        for (uint256 i = 0; i < total; i++) {
            uint256 tokenId = i + 1;

            address tokenOwner = ownerOf(tokenId);
            Remito memory remito = remitos[tokenId];

            if (compareStrings(filter, "completedByHolder")) {
                if (tokenOwner == account && remito.entregado) {
                    filteredNFTs[counter] = tokenId;
                    counter++;
                }
            } else if (compareStrings(filter, "mintedBy")) {
                if (originalMinters[tokenId] == account) {
                    filteredNFTs[counter] = tokenId;
                    counter++;
                }
            } else if (compareStrings(filter, "liberatingWallet")) {
                if (remito.liberatingWallet == account) {
                    filteredNFTs[counter] = tokenId;
                    counter++;
                }
            }
        }

        uint256[] memory result = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = filteredNFTs[i];
        }

        return result;
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}

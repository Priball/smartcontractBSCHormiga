const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Aquí es donde debes especificar la dirección del token Hormiga ya desplegado
  const hormigaTokenAddress = "0x88ACB78402B4CD2750ADAd7A065D9E879DCFCB7B"; 

  const FEVPoolFactory = await hre.ethers.getContractFactory("FEVPool");
  const fevpool = await FEVPoolFactory.deploy(hormigaTokenAddress);

  await fevpool.deployed();

  console.log("FEVPool deployed to:", fevpool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

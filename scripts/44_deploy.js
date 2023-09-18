const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:",deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const hormigaTokenAddress = "0xed1Ac3E4449cc216dcC8E698b5216C0da041d6B4"; // Actualiza esto con la dirección de tu token Hormiga
  const FEVAddress = "0xB4a081117043654Eb14D6c93D91609d16242E9C8"; // Actualiza esto con la dirección de tu FEV
  const FERAddress = "0x2D0237Cc2Eef991C87deDF7db03c5b53009824eB"; // Actualiza esto con la dirección de tu FER

  const RemitoHormiga = await hre.ethers.getContractFactory("RemitoHormiga");
  const remitoHormiga = await RemitoHormiga.deploy(hormigaTokenAddress, FEVAddress, FERAddress);

  await remitoHormiga.deployed();

  console.log("RemitoHormiga deployed to:", remitoHormiga.address);
}

// Le decimos a Hardhat que ejecute nuestra función `main` si alguien ejecuta este script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


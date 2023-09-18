const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const remitoHormigaAddress = "0xFf01Db854Dd754033840dCe1f91F055B66aEb6e3";
  const hormigaTokenAddress = "0x88ACB78402B4CD2750ADAd7A065D9E879DCFCB7B";

  // Desplegar HormigaMarketplace
  const HormigaMarketplace = await hre.ethers.getContractFactory("HormigaMarketplace");
  const hormigaMarketplace = await HormigaMarketplace.deploy(remitoHormigaAddress, hormigaTokenAddress);

  await hormigaMarketplace.deployed();
  console.log("HormigaMarketplace deployed to:", hormigaMarketplace.address);
}

// Se ejecuta el script de implementación
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

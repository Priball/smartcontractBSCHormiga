const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Aquí es donde debes especificar la dirección del token Hormiga ya desplegado
  const hormigaTokenAddress = "0x88ACB78402B4CD2750ADAd7A065D9E879DCFCB7B"; 

  const FERPoolFactory = await hre.ethers.getContractFactory("FERPool");
  const ferpool = await FERPoolFactory.deploy(hormigaTokenAddress);

  await ferpool.deployed();

  console.log("FERPool deployed to:", ferpool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Carga el contrato compilado
  const HormigaTokenArtifact = await hre.artifacts.readArtifact("HormigaToken");

  // Crea una nueva fábrica de contratos
  const HormigaTokenFactory = new ethers.ContractFactory(
    HormigaTokenArtifact.abi,
    HormigaTokenArtifact.bytecode,
    deployer
  );

  // Despliega el contrato
  const hormigaToken = await HormigaTokenFactory.deploy();

  // Espera hasta que el contrato esté desplegado
  await hormigaToken.deployTransaction.wait();

  console.log("HormigaToken address:", hormigaToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

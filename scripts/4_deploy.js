const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const hormigaTokenAddress = "0x88ACB78402B4CD2750ADAd7A065D9E879DCFCB7B";
  const FEVAddress = "0xc01FAa2Ad710B7d7c762304c426B92a53E40f33c";
  const FERAddress = "0x66e011b283880070B6ae098bfECdf2E5bf482C91";

  const RemitoHormigaFactory = await hre.ethers.getContractFactory("RemitoHormiga");
  try {
    const remitoHormiga = await RemitoHormigaFactory.deploy(hormigaTokenAddress, FEVAddress, FERAddress);
    console.log("RemitoHormiga deployed to:", remitoHormiga.address);
  } catch (error) {
    console.error("An error occurred while deploying the contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

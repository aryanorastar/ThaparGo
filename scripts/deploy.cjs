// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  console.log("Deploying SocietyFactory contract...");

  const SocietyFactory = await hre.ethers.getContractFactory("SocietyFactory");
  const societyFactory = await SocietyFactory.deploy();

  await societyFactory.deployed();

  console.log(`SocietyFactory deployed to: ${societyFactory.address}`);

  console.log("Waiting for block confirmations...");
  // Wait for a few confirmations to ensure the contract is deployed
  await hre.ethers.provider.waitForTransaction(societyFactory.deployTransaction.hash, 5);

  console.log("Contract deployed successfully!");

  // Verify the contract on Etherscan if not on a local network
  const network = hre.network.name;
  if (network !== "hardhat" && network !== "localhost") {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: societyFactory.address,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

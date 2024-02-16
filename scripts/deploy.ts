import { ethers } from "hardhat";

async function main() {

  const token = await ethers.deployContract("Token");

  await token.waitForDeployment();

  const savings = await ethers.deployContract("SaveERC20", [token.target]);

  await savings.waitForDeployment();

  console.log(
    `Token contract deployed at ${token.target}... savings deployed at ${savings.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

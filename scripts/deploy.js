// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello World");

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();

  const NDToken = await hre.ethers.getContractFactory("NDToken");
  const ndToken = await NDToken.deploy("Nader Debit Token", "NDT20");

  await greeter.deployed();
  await token.deployed();
  await ndToken.deployed();

  console.log(`Greter successfully deployed to ${greeter.address}`);
  console.log(`Token successfully deployed to ${token.address}`);
  console.log(`NDToken successfully deployed to ${ndToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

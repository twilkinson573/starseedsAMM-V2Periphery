const { ethers } = require("hardhat");

const main = async () => {

  // VARS =============================================

  const [deployer, bob, jane] = await hre.ethers.getSigners();

  console.log('Deploying contracts with account: ', deployer.address);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

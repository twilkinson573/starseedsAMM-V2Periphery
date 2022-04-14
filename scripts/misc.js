const { ethers } = require("hardhat");

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();

  // SCRIPT TO EXECUTE ARBITRARY CODE
  
  const factory = await hre.ethers.getContractAt("UniswapV2Factory", "0x4c2Df2C4e7B6a391A269509293cfe06ae53342A3");

  // await factory.setFeeTo(deployer.address);

  console.log('Factory fees accrue to: ', await factory.feeTo());
  
  // ... whatever ...
  

  // const router = await hre.ethers.getContractAt("UniswapV2Router02", "0x9d90362832aF5aAdb7fed481b53450F28C84F2EC");

  // console.log('Router # trading pairs:: ', await router.);
  

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

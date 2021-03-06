const { ethers } = require("hardhat");

const main = async () => {

  // SET DEPLOYER =============================================================
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  const starAdd = "0x8440178087C4fd348D43d0205F4574e0348a06F0";
  const ethAdd = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  const daoAdd = "0x17840DF7CAa07e298b16E8612157B90ED231C973";

  console.log('Deploying contracts with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  // DEPLOY FACTORY ===========================================================
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();

  console.log('Factory deployed to: ', factory.address);
  console.log(' ');

  console.log('Factory fees accrue to: ', await factory.feeTo());
  console.log(' ');

  console.log('Configuring feeTo address to collect fees...')
  await factory.setFeeTo(deployer.address);

  console.log('Factory fees accrue to: ', await factory.feeTo());
  console.log(' ');

  // DEPLOY ROUTER ============================================================
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, process.env.WETH_ADDRESS)
  await router.deployed();

  console.log('Router deployed to: ', await router.address);
  console.log('Router factory: ', await router.factory());
  console.log('Router WETH: ', await router.WETH());
  console.log(' ');

  // CREATE PAIRS =============================================================

  await factory.createPair(starAdd, ethAdd);
  await factory.createPair(starAdd, daoAdd);
  
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

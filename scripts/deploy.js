const { ethers } = require("hardhat");

const main = async () => {

  // SET DEPLOYER =============================================================
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

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
  // Todo - replace this weth address with an env var from .env to allow multiple envs 
  const router = await Router.deploy(factory.address, process.env.WETH_ADDRESS)
  await router.deployed();

  console.log('Router deployed to: ', await router.address);
  console.log('Router factory: ', await router.factory());
  console.log('Router WETH: ', await router.WETH());
  console.log(' ');
  
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

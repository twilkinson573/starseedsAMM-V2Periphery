const { ethers } = require("hardhat");

const main = async () => {

  // VARS =====================================================================

  const [deployer, bob, jane] = await hre.ethers.getSigners();
  console.log('Deploying contracts with master account: ', deployer.address);
  console.log(' ');

  // ENV SETUP ================================================================

  console.log('####### Setting up Mock ERC20 tokens for testing \n');

  const Usdc = await hre.ethers.getContractFactory("ERC20");
  const usdc = await Usdc.deploy("USDC", "USDC", hre.ethers.utils.parseUnits("1000000.0"));
  await usdc.deployed();

  console.log('USDC ERC20 deployed to: ', usdc.address);
  console.log('USDC total supply: ', await usdc.totalSupply());
  console.log(' ');

  const Matic = await hre.ethers.getContractFactory("ERC20");
  const matic = await Matic.deploy("MATIC", "MATIC", hre.ethers.utils.parseUnits("1000000.0"));
  await matic.deployed();

  console.log('MATIC ERC20 deployed to: ', matic.address);
  console.log('MATIC total supply: ', await matic.totalSupply());
  console.log(' ');

  const Dai = await hre.ethers.getContractFactory("ERC20");
  const dai = await Dai.deploy("MATIC", "MATIC", hre.ethers.utils.parseUnits("1000000.0"));
  await dai.deployed();

  console.log('DAI ERC20 deployed to: ', dai.address);
  console.log('DAI total supply: ', await dai.totalSupply());
  console.log(' ');

  console.log('####### Setting up & topping up wETH for testing \n');
  const Weth = await hre.ethers.getContractFactory("WETH9");
  const weth = await Weth.deploy();
  await weth.deployed();

  // Deposit 5000 ETH from deployer account to fund test amounts of wETH
  await weth.deposit({value: ethers.utils.parseEther("5000.0")})

  console.log('wETH deployed to: ', weth.address);
  console.log('wETH total supply: ', await weth.totalSupply());
  console.log(' ');


  // Deploy & configure the factory contract
  console.log('####### Deploying V2 Core (StarSeeds AMM Factory) \n')

  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();
  console.log('Factory deployed to: ', factory.address);
  console.log(' ');

  console.log('Factory fees accrue to: ', await factory.feeTo());

  console.log('Configuring feeTo address to collect fees...')
  await factory.setFeeTo(deployer.address);
  console.log('Factory fees accrue to: ', await factory.feeTo());
  console.log(' ');

  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, weth.address)
  await router.deployed();

  console.log('Router deployed to: ', router.address);
  console.log(' ');
 

  // NOTE - The following (rightfully) won't work due to the Factory's permissions
  // console.log('Illegal attempt to change fee collection address (should fail)...')
  // const bobSetFeeToTxn = await factory.connect(bob).setFeeTo(bob.address);
  // await bobSetFeeToTxn.wait();

  // Call Factory#createPair to instantiate a few trading pairs
  console.log("####### Creating trading pairs")
  console.log('Create USDC / MATIC trading pair...')
  await factory.createPair(usdc.address, matic.address);
  console.log('USDC / MATIC trading pair deployed to: ', await factory.allPairs(0));

  console.log('Create DAI / MATIC trading pair...')
  await factory.createPair(dai.address, matic.address);
  console.log('DAI / MATIC trading pair deployed to: ', await factory.allPairs(1));

  console.log('Create USDC / DAI trading pair...')
  await factory.createPair(usdc.address, dai.address);
  console.log('USDC / DAI trading pair deployed to: ', await factory.allPairs(2));

  // NOTE - The following (rightfully) won't work due to pair existing protections
  // console.log('Attempting to create duplicate MATIC / USDC trading pair (should fail)...')
  // await factory.createPair(matic.address, usdc.address);

  console.log('Amount of trading pairs #: ', await factory.allPairsLength());

  // NOTE This is currently failing (correctly) due to insufficient liquidity (as none has been provided yet)
  // Just a sanity check that everything is working - we will make swaps below using V2Router02
  // console.log('Making test swap')
  // const pair1 = await hre.ethers.getContractAt("UniswapV2Pair", await factory.allPairs(0));
  // await pair1.swap(10, 10, bob.address, "0x00");


  // !!! TODO !!! FURTHER - THIS USES V2-PERIPHERY 

  // todo: SET UP ROUTER

  // todo: Add liquidity with Router

  // todo: Retail users make swaps using the pairs

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

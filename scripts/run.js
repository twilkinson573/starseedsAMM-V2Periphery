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

  // Deploy & configure the factory contract
  console.log('####### Deploying V2 Core (StarSeeds AMM Factory) \n')

  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const fct = await Factory.deploy(deployer.address);
  await fct.deployed();
  console.log('Factory deployed to: ', fct.address);
  console.log(' ');

  console.log('Factory fees accrue to: ', await fct.feeTo());

  console.log('Configuring feeTo address to collect fees...')
  await fct.setFeeTo(deployer.address);
  console.log('Factory fees accrue to: ', await fct.feeTo());
  console.log(' ');

  // NOTE - The following (rightfully) won't work due to the Factory's permissions
  // console.log('Illegal attempt to change fee collection address (should fail)...')
  // const bobSetFeeToTxn = await fct.connect(bob).setFeeTo(bob.address);
  // await bobSetFeeToTxn.wait();

  // Call Factory#createPair to instantiate a few trading pairs
  console.log("Creating trading pairs")
  console.log('Create USDC / MATIC trading pair...')
  await fct.createPair(usdc.address, matic.address);
  console.log('USDC / MATIC trading pair deployed to: ', await fct.allPairs(0));

  console.log('Create DAI / MATIC trading pair...')
  await fct.createPair(dai.address, matic.address);
  console.log('DAI / MATIC trading pair deployed to: ', await fct.allPairs(1));

  console.log('Create USDC / DAI trading pair...')
  await fct.createPair(usdc.address, dai.address);
  console.log('USDC / DAI trading pair deployed to: ', await fct.allPairs(2));

  // NOTE - The following (rightfully) won't work due to pair existing protections
  // console.log('Attempting to create duplicate MATIC / USDC trading pair (should fail)...')
  // await fct.createPair(matic.address, usdc.address);

  console.log('Amount of trading pairs #: ', await fct.allPairsLength());

  // NOTE This is currently failing (correctly) due to insufficient liquidity (as none has been provided yet)
  console.log('Making test swap')
  const pair1 = await hre.ethers.getContractAt("UniswapV2Pair", await fct.allPairs(0));
  await pair1.swap(10, 10, bob.address, "0x00");


  // !!! TODO !!! FURTHER - THIS USES V2-PERIPHERY 

  // todo: Add liquidity

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

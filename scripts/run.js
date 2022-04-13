const { ethers } = require("hardhat");

const main = async () => {

  // VARS =====================================================================

  // deployer == highly funded protocol dev account to provide liquidty
  // bob, jane == retail users
  const [deployer, bob, jane] = await hre.ethers.getSigners();
  console.log('Deploying contracts with master account: ', deployer.address);
  console.log(' ');

  // ENV SETUP ================================================================

  console.log('####### Setting up Mock ERC20 tokens for testing \n');

  const Usdc = await hre.ethers.getContractFactory("ERC20");
  const usdc = await Usdc.deploy("USDC", "USDC", hre.ethers.utils.parseUnits("1000000.0"));
  await usdc.deployed();

  await usdc.transfer(deployer.address, ethers.utils.parseUnits("100000.0"));
  await usdc.transfer(bob.address, ethers.utils.parseUnits("10000.0"));
  await usdc.transfer(jane.address, ethers.utils.parseUnits("20000.0"));

  console.log('USDC ERC20 deployed to: ', usdc.address);
  console.log('USDC total supply: ', await usdc.totalSupply());
  console.log(' ');

  const Matic = await hre.ethers.getContractFactory("ERC20");
  const matic = await Matic.deploy("MATIC", "MATIC", hre.ethers.utils.parseUnits("1000000.0"));
  await matic.deployed();

  await matic.transfer(deployer.address, ethers.utils.parseUnits("100000.0"));
  await matic.transfer(bob.address, ethers.utils.parseUnits("10000.0"));
  await matic.transfer(jane.address, ethers.utils.parseUnits("20000.0"));

  console.log('MATIC ERC20 deployed to: ', matic.address);
  console.log('MATIC total supply: ', await matic.totalSupply());
  console.log(' ');

  const Dai = await hre.ethers.getContractFactory("ERC20");
  const dai = await Dai.deploy("MATIC", "MATIC", hre.ethers.utils.parseUnits("1000000.0"));
  await dai.deployed();

  await dai.transfer(deployer.address, ethers.utils.parseUnits("100000.0"));
  await dai.transfer(bob.address, ethers.utils.parseUnits("10000.0"));
  await dai.transfer(jane.address, ethers.utils.parseUnits("20000.0"));

  console.log('DAI ERC20 deployed to: ', dai.address);
  console.log('DAI total supply: ', await dai.totalSupply());
  console.log(' ');

  console.log('####### Setting up & topping up wETH for testing \n');
  const Weth = await hre.ethers.getContractFactory("WETH9");
  const weth = await Weth.deploy();
  await weth.deployed();

  // Deposit 500 ETH from deployer account to fund test amounts of wETH
  await weth.deposit({value: ethers.utils.parseEther("500.0")})

  const bobWethDepositTxn = await weth.connect(bob).deposit({value: ethers.utils.parseEther("5.0")})
  await bobWethDepositTxn.wait();
  const janeWethDepositTxn = await weth.connect(jane).deposit({value: ethers.utils.parseEther("15.0")})
  await janeWethDepositTxn.wait();
 
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

  console.log('####### Deploying V2Router \n')

  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, weth.address)
  await router.deployed();

  console.log('Router deployed to: ', await router.address);
  console.log('Router factory: ', await router.factory());
  console.log('Router WETH: ', await router.WETH());
  console.log(' ');
 

  // NOTE - The following (rightfully) won't work due to the Factory's permissions
  // console.log('Illegal attempt to change fee collection address (should fail)...')
  // const bobSetFeeToTxn = await factory.connect(bob).setFeeTo(bob.address);
  // await bobSetFeeToTxn.wait();

  // Call Factory#createPair to instantiate a few trading pairs
  console.log("####### Creating the AMM trading pairs \n")
  console.log('Create USDC / MATIC trading pair...')
  await factory.createPair(usdc.address, matic.address);
  console.log('USDC / MATIC trading pair deployed to: ', await factory.allPairs(0));

  console.log('Create DAI / MATIC trading pair...')
  await factory.createPair(dai.address, matic.address);
  console.log('DAI / MATIC trading pair deployed to: ', await factory.allPairs(1));

  console.log('Create USDC / DAI trading pair...')
  await factory.createPair(usdc.address, dai.address);
  console.log('USDC / DAI trading pair deployed to: ', await factory.allPairs(2));

  console.log('Create USDC / WETH trading pair...')
  await factory.createPair(usdc.address, weth.address);
  console.log('USDC / WETH trading pair deployed to: ', await factory.allPairs(2));

  // NOTE - The following (rightfully) won't work due to pair existing protections
  // console.log('Attempting to create duplicate MATIC / USDC trading pair (should fail)...')
  // await factory.createPair(matic.address, usdc.address);

  console.log('Amount of trading pairs #: ', await factory.allPairsLength());
  console.log(' ');

  // NOTE This fails (rightfully) due to insufficient liquidity (as none has been provided yet)
  // Just a sanity check that everything is working - we will make swaps below using V2Router02
  // console.log('Making test swap (should fail)')
  // const pair1 = await hre.ethers.getContractAt("UniswapV2Pair", await factory.allPairs(0));
  // await pair1.swap(10, 10, bob.address, "0x00");

  console.log("####### Adding liquidity to Trading Pairs using V2Router \n")

  console.log("Adding USDC / MATIC Liquidity...")

  // give allowances for deployer to addLiquidity
  const deployerApproveUsdcTxn = await usdc.approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await deployerApproveUsdcTxn.wait();
  const deployerApproveMaticTxn = await matic.approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await deployerApproveMaticTxn.wait();
  const deployerApproveDaiTxn = await dai.approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await deployerApproveDaiTxn.wait();

  const pair1 = await hre.ethers.getContractAt("UniswapV2Pair", await factory.getPair(usdc.address, matic.address));
  const pair2 = await hre.ethers.getContractAt("UniswapV2Pair", await factory.getPair(usdc.address, dai.address));
  const pair3 = await hre.ethers.getContractAt("UniswapV2Pair", await factory.getPair(dai.address, matic.address));

  const bobapproveusdctxn = await usdc.connect(bob).approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await bobapproveusdctxn.wait();
  const janeApproveMaticTxn = await matic.connect(jane).approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await janeApproveMaticTxn.wait();
  const janeApproveDaiTxn = await dai.connect(jane).approve(router.address, ethers.utils.parseUnits("1000000.0"));
  await janeApproveDaiTxn.wait();

  const timestamp = new Date().getTime() + 3600*1000;

  await router.addLiquidity(
    usdc.address, 
    matic.address,
    hre.ethers.utils.parseUnits("10000.0"),
    hre.ethers.utils.parseUnits("5000.0"),
    hre.ethers.utils.parseUnits("10000.0"),
    hre.ethers.utils.parseUnits("5000.0"),
    deployer.address,
    timestamp
  )

  await router.addLiquidity(
    usdc.address, 
    dai.address,
    hre.ethers.utils.parseUnits("1000.0"),
    hre.ethers.utils.parseUnits("1000.0"),
    hre.ethers.utils.parseUnits("1000.0"),
    hre.ethers.utils.parseUnits("1000.0"),
    deployer.address,
    timestamp
  )

  await router.addLiquidity(
    dai.address, 
    matic.address,
    hre.ethers.utils.parseUnits("10000.0"),
    hre.ethers.utils.parseUnits("5000.0"),
    hre.ethers.utils.parseUnits("10000.0"),
    hre.ethers.utils.parseUnits("5000.0"),
    deployer.address,
    timestamp
  )

  let [usdcReserve, maticReserve, _] = await pair1.getReserves();
  let [usdcReserve1, daiReserve, _1] = await pair2.getReserves();
  let [daiReserve1, maticReserve1, _2] = await pair3.getReserves();
  console.log(`USDC/MATIC reserves: ${ethers.utils.formatEther(usdcReserve)} USDC / ${ethers.utils.formatEther(maticReserve)} MATIC`);
  console.log(" ");

  console.log("######## Perfoming Swap #1:");
  
  const amountIn1 = hre.ethers.utils.parseUnits("1000.0");

  const amountOutMin1 = await router.connect(bob).getAmountOut(
    amountIn1,
    usdcReserve,
    maticReserve
  )
  console.log("amountIn = ", ethers.utils.formatEther(amountIn1));
  console.log("amountOutMin = ", ethers.utils.formatEther(amountOutMin1));
  console.log(`Bob swaps ${ethers.utils.formatEther(amountIn1)} USDC for ${ethers.utils.formatEther(amountOutMin1)} MATIC`)

  console.log("Quote:", ethers.utils.formatEther(await router.quote(amountIn1, usdcReserve, maticReserve)));

  await router.connect(bob).swapExactTokensForTokens(
    amountIn1,
    amountOutMin1,
    [usdc.address, matic.address],
    bob.address,
    timestamp
  );

  console.log("USDC/MATIC reserves: ", await pair1.getReserves());
  console.log(" ");

  console.log("######## Perfoming Swap #2:");

  [usdcReserve, maticReserve, _] = await pair1.getReserves();
  const amountIn2 = hre.ethers.utils.parseUnits("100.0");

  const amountOutMin2 = await router.connect(jane).getAmountOut(
    amountIn2,
    maticReserve,
    usdcReserve
  )

  console.log("amountIn = ", ethers.utils.formatEther(amountIn2));
  console.log("amountOutMin = ", ethers.utils.formatEther(amountOutMin2));
  console.log(`Jane swaps ${ethers.utils.formatEther(amountIn2)} MATIC for ${ethers.utils.formatEther(amountOutMin2)} USDC`)

  console.log("Quote:", ethers.utils.formatEther(await router.quote(amountIn2, maticReserve, usdcReserve)));

  await router.connect(jane).swapExactTokensForTokens(
    amountIn2,
    amountOutMin2,
    [matic.address, usdc.address],
    jane.address,
    timestamp
  );

  console.log("USDC/MATIC reserves: ", await pair1.getReserves());
  console.log(" ");


  console.log("######## Perfoming Swap #3 (multi-pair):");
  [usdcReserve, maticReserve, _] = await pair1.getReserves();
  const amountIn3 = hre.ethers.utils.parseUnits("150.0");
  const amountsOutMin3 = await router.connect(jane).getAmountsOut(
    amountIn3,
    [dai.address, usdc.address, matic.address]
  )

  console.log("Multiswap route, amounts out at each stage:", amountsOutMin3);

  console.log("amountIn = ", ethers.utils.formatEther(amountIn3));
  console.log("amountOutMin = ", ethers.utils.formatEther(amountsOutMin3[2]));
  console.log(`Jane swaps ${ethers.utils.formatEther(amountIn3)} DAI for ${ethers.utils.formatEther(amountsOutMin3[2])} MATIC via USDC`)

  await router.connect(jane).swapExactTokensForTokens(
    amountIn3,
    amountsOutMin3[2],
    [dai.address, usdc.address, matic.address],
    jane.address,
    timestamp
  );

  console.log("USDC/MATIC reserves: ", await pair1.getReserves());
  console.log("USDC/DAI reserves: ", await pair2.getReserves());
  console.log("DAI/MATIC reserves: ", await pair3.getReserves());
  console.log(" ");


  // remove liquidity (with rewards?)


  // check all fees are accrueing correctly to both protocol & LP holders


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

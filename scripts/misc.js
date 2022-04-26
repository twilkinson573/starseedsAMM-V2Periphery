const { ethers } = require("hardhat");

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();

  // SCRIPT TO EXECUTE ARBITRARY CODE
  
  // const factory = await hre.ethers.getContractAt("UniswapV2Factory", "0x4c2Df2C4e7B6a391A269509293cfe06ae53342A3");

  // await factory.setFeeTo(deployer.address);

  // console.log('Factory fees accrue to: ', await factory.feeTo());
  
  // ... whatever ...
  

  const router = await hre.ethers.getContractAt("UniswapV2Router02", "0x745D96c5AAC3BC8E65CFB2BDE769af3290128DF6");
  console.log("Router factory:", await router.factory());
  console.log("Router weth:", await router.WETH());


  // console.log('Router # trading pairs:: ', await router.);
  const starAdd = "0x8440178087C4fd348D43d0205F4574e0348a06F0";
  const ethAdd = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  const daoAdd = "0x17840DF7CAa07e298b16E8612157B90ED231C973";

  const ethStarPair = await hre.ethers.getContractAt("UniswapV2Pair", "0x38f3e3358f4567769Df673a5FAd9C541Cae0f849");

  console.log("ETH/STAR token 0:", await ethStarPair.token0());
  console.log("ETH/STAR token 1:", await ethStarPair.token1());
  console.log("ETH/STAR Reserves:", await ethStarPair.getReserves());

  const daoEthPair = await hre.ethers.getContractAt("UniswapV2Pair", "0x31fd0f069df69a5a6435fc8a61630584e06b5b63");

  console.log("DAO/ETH token 0:", await daoEthPair.token0());
  console.log("DAO/ETH token 1:", await daoEthPair.token1());
  console.log("DAO/ETH Reserves:", await daoEthPair.getReserves());

  const daoStarPair = await hre.ethers.getContractAt("UniswapV2Pair", "0x9464cdab87fe8b519c948ffe76d1841fe45db47a");

  console.log("DAO/STAR token 0:", await daoStarPair.token0());
  console.log("DAO/STAR token 1:", await daoStarPair.token1());
  console.log("DAO/STAR Reserves:", await daoStarPair.getReserves());

  // console log tx id to inspect

  // add liquidity first pair

  // const starERC20 = await hre.ethers.getContractAt("ERC20", starAdd);
  // const daoERC20 = await hre.ethers.getContractAt("ERC20", daoAdd);
  // const ethERC20 = await hre.ethers.getContractAt("ERC20", ethAdd);

  // Give allowances? There's never allowance declared!?!??! Is that the issue all along? 

  // console.log("STAR allowance granted to router:", await starERC20.allowance(deployer.address, router.address));

  // const deployerApproveStarTxn = await starERC20.approve(router.address, ethers.utils.parseUnits("1000000.0"));
  // await deployerApproveStarTxn.wait();

  // const deployerApproveDaoTxn = await daoERC20.approve(router.address, ethers.utils.parseUnits("1000000.0"));
  // await deployerApproveDaoTxn.wait();

  // const deployerApproveEthTxn = await ethERC20.approve(router.address, ethers.utils.parseUnits("0.1"));
  // await deployerApproveEthTxn.wait();

  // console.log("STAR allowance granted to router:", await starERC20.allowance(deployer.address, router.address));
  // console.log("DAO allowance granted to router:", await daoERC20.allowance(deployer.address, router.address));
  // console.log("ETH allowance granted to router:", await ethERC20.allowance(deployer.address, router.address));


  // const addLiqTx = await router.addLiquidity(
  //   starAdd, 
  //   ethAdd,
  //   hre.ethers.utils.parseUnits("0.4"),
  //   hre.ethers.utils.parseUnits("0.002"),
  //   hre.ethers.utils.parseUnits("0.4"),
  //   hre.ethers.utils.parseUnits("0.002"),
  //   deployer.address,
  //   Math.floor(Date.now() / 1000) + 60 * 20
  //   // {
  //   //   gasPrice: 0.00000000000000005,
  //   //   gasLimit: 30000000
  //   // }
  // );

  // console.log("1")

  // await router.addLiquidity(
  //   starAdd, 
  //   daoAdd,
  //   hre.ethers.utils.parseUnits("0.4"),
  //   hre.ethers.utils.parseUnits('2.0'),
  //   hre.ethers.utils.parseUnits("0.0001"),
  //   hre.ethers.utils.parseUnits("0.0001"),
  //   deployer.address,
  //   Math.floor(Date.now() / 1000) + 60 * 2,
  //   {
  //     gasPrice: ethers.BigNumber.from(70000000000),
  //     gasLimit: 30000000
  //   }
  // );
  // const addLiqTx = await router.addLiquidity(
  //   starAdd, 
  //   daoAdd,
  //   hre.ethers.utils.parseUnits("0.4"),
  //   hre.ethers.utils.parseUnits('2.0'),
  //   hre.ethers.utils.parseUnits("0.0001"),
  //   hre.ethers.utils.parseUnits("0.0001"),
  //   deployer.address,
  //   Math.floor(Date.now() / 1000) + 60 * 20
  // );
  // await addLiqTx.wait();
  const amountsOutMin3 = await router.getAmountsOut(
    hre.ethers.utils.parseUnits("0.5"),
    [daoAdd, starAdd, ethAdd]
  );

  console.log("Amount out min: ", amountsOutMin3);

  // console.log("Pair0 Reserves:", await pair0.getReserves());
  // console.log("Pair1 Reserves:", await pair1.getReserves());
  // console.log("Pair2 Reserves:", await pair2.getReserves());

  // await router.swapExactTokensForTokens(
  //   // hre.ethers.utils.parseUnits("0.5"),
  //   // amountsOutMin3[2],
  //   hre.ethers.utils.parseUnits("0.01"),
  //   1,
  //   [starAdd, ethAdd],
  //   deployer.address,
  //   Date.now() + 1000 * 60 * 3,
  //   // {
  //   //   gasPrice: ethers.BigNumber.from(80000000000),
  //   //   gasLimit: 30000000
  //   // }
  // );

  // console.log("2")


  // console.log("Liq TX Hash:", await addLiqTx.hash());

  // // console.log("Tx ID:", await addLiqTx.chainId());
  // // console.log("Data:", await addLiqTx.data());


  // const receipt = await addLiqTx.wait();
  // console.log("Liq TX Hash:", await receipt.hash());
  // console.log('Transaction receipt: \n');
  // console.log(receipt); 

  // console.log("Pair0 Reserves:", await pair0.getReserves());
  // console.log("Pair1 Reserves:", await pair1.getReserves());
  // console.log("Pair2 Reserves:", await pair2.getReserves());

  // add liquidity second pair
  

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

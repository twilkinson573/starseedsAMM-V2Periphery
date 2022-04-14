import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers';

// import "@nomiclabs/hardhat-waffle";
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.0",
      },
      {
        version: "0.5.16",
      },

      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
    overrides: {
      "contracts/v2-core/contracts/test/Context.sol": {
        version: "0.8.0",
        settings: { }
      },
      "contracts/v2-core/contracts/test/ERC20.sol": {
        version: "0.8.0",
        settings: { }
      },
      "contracts/v2-core/contracts/test/IERC20.sol": {
        version: "0.8.0",
        settings: { }
      },
      "contracts/v2-core/contracts/test/IERC20Metadata.sol": {
        version: "0.8.0",
        settings: { }
      },
    },
    networks: {
      mumbai: {
        url: process.env.API_URL,
        accounts: [process.env.PRIVATE_KEY]
      },
      matic: {
        url: process.env.API_URL,
        accounts: [process.env.PRIVATE_KEY]
      },
    },
  },
};
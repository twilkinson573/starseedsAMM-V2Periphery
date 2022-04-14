# StarSeeds AMM V2

[![Actions Status](https://github.com/Uniswap/uniswap-v2-core/workflows/CI/badge.svg)](https://github.com/Uniswap/uniswap-v2-core/actions)
[![Version](https://img.shields.io/npm/v/@uniswap/v2-core)](https://www.npmjs.com/package/@uniswap/v2-core)

[![Actions Status](https://github.com/Uniswap/uniswap-v2-periphery/workflows/CI/badge.svg)](https://github.com/Uniswap/uniswap-v2-periphery/actions)
[![npm](https://img.shields.io/npm/v/@uniswap/v2-periphery?style=flat-square)](https://npmjs.com/package/@uniswap/v2-periphery)

Fork of Uniswap V2-Periphery containing a modified version of Uniswap V2-Core.
In-depth documentation on Uniswap V2 is available at [uniswap.org](https://uniswap.org/docs).

The built contract artifacts can be browsed via [unpkg.com](https://unpkg.com/browse/@uniswap/v2-core@latest/).

# Hardhat Local Development 

Hardhat docs can be found [here](https://hardhat.org/getting-started/)

## Install dependencies

`yarn`

## Run a local node:
`npx hardhat node`

## Run a Hardhat console
`npx hardhat console --network localhost`

## Run a script (requires a local node running)
`npx hardhat run scripts/run.js --network localhost`


# Deployment

Create an env file in the project root for each environment you wish to deploy in:

`$ touch .env.ENV_NAME`

.env files should contain the following values:
```
API_URL="GET_AN_API_KEY_FROM_ALCHEMY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY_TO_DEPLOY_FROM"
WETH_ADDRESS="THE_WETH_CONTRACT_ADDRESS_ON_TARGET_CHAIN"
ETHERSCAN_API_KEY="GET_AN_ETHERSCAN_API_KEY_FROM_TARGET_BLOCK_EXPLORER"
```

Run deployment-related commends with the NODE_ENV set to target chain
eg:

`$ NODE_ENV=matic npx hardhat run scripts/deploy.js --network matic`

-----------------

# Deprecated

## Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`


# Uniswap V2

[![Actions Status](https://github.com/Uniswap/uniswap-v2-periphery/workflows/CI/badge.svg)](https://github.com/Uniswap/uniswap-v2-periphery/actions)
[![npm](https://img.shields.io/npm/v/@uniswap/v2-periphery?style=flat-square)](https://npmjs.com/package/@uniswap/v2-periphery)

In-depth documentation on Uniswap V2 is available at [uniswap.org](https://uniswap.org/docs).

The built contract artifacts can be browsed via [unpkg.com](https://unpkg.com/browse/@uniswap/v2-periphery@latest/).

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`

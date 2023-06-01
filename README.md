# Testnet Contract Migrations Script

This repository contains a script for deploying contracts to a testnet network. The script allows you to prepare the contracts for deployment by downloading the source code of previously deployed contracts on the testnet network (configured in FROM_NETWORK), replacing external library imports, configuring the required versions of Solidity, and generating a deployment script for each contract.

## Prerequisites

Before running the deployment script, make sure to set up the following environment variables in a `.env` file (you can follow the example of the `.env.example` file)):

- `VERIFYING_RPC_URL`: The RPC URL of the new testnet network. You can find this information for Sepolia i.e., on websites like [Chainlist](https://chainlist.org/chain/11155111).
- `CHAIN_ID`: The chain ID of the Sepolia network.
- `ETHERSCAN_API_KEY`: Your API key for Etherscan. Refer to the [Etherscan API documentation](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics) for more information.
- `FROM_NETWORK`: The name of the previous testnet network where the contracts were deployed (e.g., Goerli).

Also, make sure to set up the addresses of the contracts you want to migrate from the previous testnet network in the `constants.ts` file under the `addresses` variable.

## Preparation and Deployment

1. Run the contract preparation script to download and modify the contract source code:
   `npx hardhat run scripts/prepareContracts.ts --network deploy ` (optional `--no-compile`)

   This script prepares the contracts for deployment by replacing the necessary imports and generating deployment scripts.

2. Configure the constructor arguments for each contract (if applicable) in the generated deployment scripts.

3. Deploy the contracts by executing the deployment script for each contract:
   `npx hardhat run scripts/deploy{ContractName}.ts --network deploy`

Replace `ContractName` with the actual name of the contract you want to deploy.

Make sure to have the necessary dependencies installed by running `npm install`.

**Note:** Ensure that you have the correct network configurations in the Hardhat `hardhat.config.ts` file.

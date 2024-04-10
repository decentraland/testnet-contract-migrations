# Testnet Contract Migrations

This repository contains a collection of scripts dedicated to migrating Decentraland contracts from Mainnet to another testnet. Currently, the target testnet is Sepolia, but the goal is to support any target chain through configuration, ideally without any code modifications.

## Getting Started

Start by copying the `.env.example` file into `.env` and filling in the necessary variables:

**TARGET_CHAIN_ID**

This is the identifier of the chain to which contracts will be migrated. It should be the identifier of the chain, not the name. For instance, Sepolia has a chain ID of `11155111`.

Ganache (Local Blockchain for testing) has a chain ID of `1337`. If you define this chain ID, the migration will be run against a local blockchain. We recommend using this approach before the actual migration.

**ORIGIN_CHAIN_ID**

This is the identifier of the chain from which contracts will be migrated. It should be the identifier of the chain, not the name. For instance, Sepolia has a chain ID of `11155111`. By default it will be set to `1` (Mainnet).

**FORK_CHAIN_ID**

This is the identifier of the chain from which blockchain will be forked. It should be the identifier of the chain, not the name. For instance, Sepolia has a chain ID of `11155111`. By default it will be `undefined` so the development blockchain will start empty.

**ETHERSCAN_API_KEY**

This key provides access to the Etherscan API, from which the origin contract data is downloaded, and where contract verifications are performed.

**PRIVATE_KEYS**

This consists of comma-separated private keys for accounts used to deploy the contracts. While it's not required when using the Ganache chain ID (as some test accounts are used), it's mandatory for real deployment. The order in which the keys are defined determines the index of each account. For example, `signers[0]` will correspond to the account from the first PK, and `signers[1]` will be the second. Ensure these accounts have sufficient ETH in the target chain; otherwise, the migration will fail due to insufficient gas.

**INFURA_API_KEY**

Infura is used as the RPC node for deploying the contracts and all other blockchain-related tasks. Without this API key, these tasks can't be completed.

## Usage

**1 - Download contract data from mainnet**

This step only needs to be executed once unless new contracts are added when a new migration is required. This is because blockchain data is immutable, making multiple fetches unnecessary.

Running `npm run prepare` will download mainnet contract data from the Etherscan API, as defined in <https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes>. It also downloads the contract creation code that was used to deploy the contracts. With both the source code data and the creation code, we can deploy, initialize, and verify the contracts in the following steps.

The contract data that will be downloaded is defined by the map in `scripts/prepare/config.ts`. Whenever something new is added to that map, we recommend running the prepare command again to have all new data available.

The downloaded data can be found in the `scripts/prepare/downloads` directory.

**2 - Run the migration**

Once you have prepared the necessary data, you can execute `npm run migrate` to begin migrations.

Configurations can be found in the `scripts/migrate/config.ts` file, where the following parameters can be defined:

**deploymentOrder**

As the name suggests, this parameter determines the order in which contracts will be migrated. Not only does it establish the sequence, but it also identifies the contracts that will be deployed. You can select to deploy just a subset of contracts.

**contractDeployerPickers**

This map specifies which account from the provided **PRIVATE_KEYS** will deploy each contract.

**constructorFactories**

This map of factories determines how constructor arguments are built for each contract to be deployed.

**postDeployments**

This map defines what actions are to be performed after a contract is deployed. These could range from initializations to checks or mints.

Contracts will be deployed sequentially. Whether the migration succeeds or fails, a `scripts/migrate/migrations/{chainId}.json` file will be created, containing the addresses of the deployed contracts and the constructors used to deploy them, presented in hexadecimal format. If you run the migration again, it will skip over contracts that have already been deployed. This feature is useful if a migration fails due to an incorrect configuration or a gas shortage, as it prevents the need for re-deployment.

To redeploy all contracts, simply delete the file and run the migration again. If you need to redeploy certain contracts but not all, remove their specific entries from the file.

**3 - Verify contracts**

Once all contracts have been migrated, you can verify them on Etherscan by executing `npx ts-node scripts/verify`. The script uses the same list of contracts that were used for the deployment to perform the verification.

The verification process will continue even if a specific contract fails to verify. It merely requests verification and logs the result. You can refer to this log to address any potential issues or make necessary modifications.

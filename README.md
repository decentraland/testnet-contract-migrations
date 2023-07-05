# Testnet Contract Migrations

This repo contains a bunch of scripts dedicated to migrating Decentraland contracts from mainnet to another testnet. In this case the other testnet is Sepolia, but it would be great to support any target chain by config with as little (or non at all) code modifications.

## Getting Started

Copy the `.env.example` file into `.env` and fill in the variables.

**TARGET_CHAIN_ID**

It is the chain into which contracts will be migrated to, it has to be the identifier of the chain, not the name. For example, Sepolia has a chain id `11155111`

The Ganache (Local Blockchain for testing) chain id is `1337`. Defining this chain id will run the migration against a local blockchain. I recommend using it before the real migration.

**ETHERSCAN_API_KEY**

The key used to access the Etherscan API, from which origin contract data is downloaded from, as well as were contract verifications are made.

**PRIVATE_KEYS**

Comma separated private keys for accounts used to deploy the contracts. Not required if using the Ganache chain id as some test accounts are used, but for the real deal they are required. The order in which they are defined determined the index of each account. For example, `signers[0]` will be the account from the first PK while `signers[1]` will be the second. Make sure that these accounts have ETH in the target chain or else migration will fail due to insufficient gas.

**INFURA_API_KEY**

Infura is used as the RPC node for deploying the contracts and all other blockchain related requirements. Without the api key, this cannot be done.

## Usage

**1 - Download contract data from mainnet**

This step only has to be run once unless new contracts are added when the need for a new migration arrives. This is because blockchain data is immutable and fetching it more than once is unnecessary for the case needed.

Running `npx ts-node scripts/prepare` will download mainnet contract data from the etherscan api as defined in https://docs.etherscan.io/api-endpoints/contracts#get-contract-source-code-for-verified-contract-source-codes. It will also download the contract creation code that was used to deploy the contracts. With both the source code data and the creation code, we can deploy, initialize and verify the contracts on the following steps.

The contract data that will be downloaded is defined by the map in `scripts/prepare/config.ts`. Whenever something new is added to that map, I recommend running the prepare command again to have all new data available.

Downloaded data can be found in the `scripts/prepare/downloads` directory.

**2 - Run the migration**

Once preparations have been made. You can run `npx ts-node scripts/prepare` to start migrations. 

Configurations can be found on the `scripts/migrate/config.ts` file were the following things can be defined:

**deploymentOrder**

As the name suggests, the order in which contracts will be migrated. This not only determines the order, but also the contracts that will be deployed. Maybe you just want to deploy only 3 contracts and this will give you the possibility.

**contractDeployerPickers**

A map that determines which account from the provided **PRIVATE_KEYS** will be used to deploy the contract.

**constructorFactories**

A map of factories that determine how constructor arguments are built for each contract to be deployed.

**postDeployments**

A map that determines what is to be done after a contract is deployed. Could be anything from initializations to checks or mints. Anything is possible.

Contracts will be deployed one after the other. If the migration succeeds or fails, it will dump a `scripts/migrate/migrations/{chainId}.json` file containing the addresses of the contracts deployed and the constructors used to deploy them in hex format. Running the migration again will ignore contracts that have already been deployed. This is useful in the case that a migration fails due to invalid configuration or maybe running out of gas, by preventing the need of redeploying things.

If you need to redeploy everything again you can delete the file and run migrations again. If you need to redeploy some but not all of the contracts, just delete their entries from the file.

**3 - Verify contracts**

Once all contracts have been migrated, you can verify them on etherscan by running `npx ts-node scripts/verify`. Will use the same list of contracts use for the deployment order to verify them. 

It will not stop executing if a verification fails. It will just request verification and log the result. With the log you can check any modifications or issues that need to be resolved.

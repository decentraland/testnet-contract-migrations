import { ethers } from "ethers";
import fs from "fs";
import { ContractName } from "../common/types";
import { ConstructorFactory } from "./constructors/ConstructorFactory";
import { PostDeployment } from "./postDeployments/PostDeployment";
import { ChainId, OriginContractData, SourceCodeData } from "./types";
import {
  CatalystProxyPostDeployment,
  DCLControllerV2PostDeployment,
  DCLRegistrarPostDeployment,
  ERC721BidPostDeployment,
  EstateProxyPostDeployment,
  EstateRegistryPostDeployment,
  ExclusiveMasksCollectionPostDeployment,
  LANDProxyPostDeployment,
  LANDRegistryPostDeployment,
  MarketplacePostDeployment,
  MarketplaceProxyPostDeployment,
  NameDenyListProxyPostDeployment,
  OwnableBatchVestingImplPostDeployment,
  POIAllowListProxyPostDeployment,
  RentalsProxyPostDeployment,
  VestingImplPostDeployment,
} from "./postDeployments/impl";
import { creationCodesDir, sourceCodesDir } from "../common/paths";
import {
  CatalystProxyConstructorFactory,
  DCLControllerV2ConstructorFactory,
  DCLRegistrarConstructorFactory,
  ERC721BidConstructorFactory,
  EstateProxyConstructorFactory,
  ExclusiveMasksCollectionConstructorFactory,
  MarketplaceProxyConstructorFactory,
  NameDenyListProxyConstructorFactory,
  POIAllowListProxyConstructorFactory,
  RentalsProxyConstructorFactory,
} from "./constructors/impl";
import { migrationsDir } from "./paths";

// The chain into which contracts will be migrated to.
export const targetChainId: ChainId = (() => {
  const env = process.env.TARGET_CHAIN_ID;

  if (!env) {
    throw new Error("TARGET_CHAIN_ID env var not found");
  }

  const num = Number(env);

  if (!ChainId[num]) {
    throw new Error("Invalid TARGET_CHAIN_ID");
  }

  return num;
})();

// The order in which contracts will be deployed.
export const deploymentOrder: ContractName[] = [
  ContractName.MANAToken,
  ContractName.LANDRegistry,
  ContractName.LANDProxy,
  ContractName.Marketplace,
  ContractName.MarketplaceProxy,
  ContractName.EstateRegistry,
  ContractName.EstateProxy,
  ContractName.ERC721Bid,
  ContractName.ExclusiveMasksCollection,
  ContractName.DCLRegistrar,
  ContractName.DCLControllerV2,
  ContractName.Catalyst,
  ContractName.CatalystProxy,
  ContractName.BaseList,
  ContractName.POIAllowListProxy,
  ContractName.NameDenyListProxy,
  ContractName.RentalsImplementation,
  ContractName.RentalsProxyAdmin,
  ContractName.RentalsProxy,
  ContractName.VestingImpl,
  ContractName.PeriodicTokenVestingImpl,
  ContractName.VestingFactory,
  ContractName.BatchVesting,
  ContractName.OwnableBatchVestingImpl,
  ContractName.MinimalProxyFactory,
];

// Origin data of each contract.
// Contains information about ABIs, source codes and other important information from the original contracts.
export const originContractsData = new Map<ContractName, OriginContractData>();

// The addresses of contracts that have been deployed to the target chain.
export const deployedContractAddresses = new Map<ContractName, string>();

// The constructor arguments in hex format used to deploy the contracts to the target chain.
// Required for verifying the contracts on Etherscan.
export const deployedContractConstructorHexes = new Map<ContractName, string>();

// Determines which signer will be used to deploy each contract.
// If not defined, the first signer will be used.
export const contractDeployerPickers = new Map<ContractName, (signers: ethers.Signer[]) => ethers.Signer>();

// Builds the constructor arguments for each contract.
export const constructorFactories = new Map<ContractName, ConstructorFactory>();

// Executes post deployment steps for each contract.
// This steps might contain initializations for proxy contracts as well as checks to determine the deployment
// has been executed correctly.
export const postDeployments = new Map<ContractName, PostDeployment>();

// Loads the data that has been downloaded through the `prepare` script.
loadOriginContractsData();

// Loads the data of contracts that have already been deployed to the target chain.
loadDeployedContractData();

// Contract Deployers

contractDeployerPickers.set(ContractName.LANDProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.MarketplaceProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.EstateProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.CatalystProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.POIAllowListProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.NameDenyListProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.RentalsProxyAdmin, pickSigner(1));

// Constructor Factories

constructorFactories.set(ContractName.EstateProxy, new EstateProxyConstructorFactory());
constructorFactories.set(ContractName.MarketplaceProxy, new MarketplaceProxyConstructorFactory());
constructorFactories.set(ContractName.ERC721Bid, new ERC721BidConstructorFactory());
constructorFactories.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionConstructorFactory());
constructorFactories.set(ContractName.DCLRegistrar, new DCLRegistrarConstructorFactory());
constructorFactories.set(ContractName.DCLControllerV2, new DCLControllerV2ConstructorFactory());
constructorFactories.set(ContractName.CatalystProxy, new CatalystProxyConstructorFactory());
constructorFactories.set(ContractName.POIAllowListProxy, new POIAllowListProxyConstructorFactory());
constructorFactories.set(ContractName.NameDenyListProxy, new NameDenyListProxyConstructorFactory());
constructorFactories.set(ContractName.RentalsProxy, new RentalsProxyConstructorFactory());

// Post Deployments

postDeployments.set(ContractName.LANDRegistry, new LANDRegistryPostDeployment());
postDeployments.set(ContractName.LANDProxy, new LANDProxyPostDeployment());
postDeployments.set(ContractName.Marketplace, new MarketplacePostDeployment());
postDeployments.set(ContractName.MarketplaceProxy, new MarketplaceProxyPostDeployment());
postDeployments.set(ContractName.EstateRegistry, new EstateRegistryPostDeployment());
postDeployments.set(ContractName.EstateProxy, new EstateProxyPostDeployment());
postDeployments.set(ContractName.ERC721Bid, new ERC721BidPostDeployment());
postDeployments.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionPostDeployment());
postDeployments.set(ContractName.CatalystProxy, new CatalystProxyPostDeployment());
postDeployments.set(ContractName.POIAllowListProxy, new POIAllowListProxyPostDeployment());
postDeployments.set(ContractName.NameDenyListProxy, new NameDenyListProxyPostDeployment());
postDeployments.set(ContractName.RentalsProxy, new RentalsProxyPostDeployment());
postDeployments.set(ContractName.VestingImpl, new VestingImplPostDeployment());
postDeployments.set(ContractName.OwnableBatchVestingImpl, new OwnableBatchVestingImplPostDeployment());
postDeployments.set(ContractName.DCLControllerV2, new DCLControllerV2PostDeployment());
postDeployments.set(ContractName.DCLRegistrar, new DCLRegistrarPostDeployment());

// Misc

function loadOriginContractsData() {
  for (const contract of deploymentOrder) {
    const sourceCode = load<SourceCodeData>(sourceCodesDir, contract);
    const creationCode = removeConstructorArgs(load<[string]>(creationCodesDir, contract)[0], sourceCode);

    originContractsData.set(contract, {
      creationCode,
      sourceCode,
    });
  }

  function load<T>(dir: string, contractName: ContractName): T {
    return JSON.parse(fs.readFileSync(`${dir}/${ContractName[contractName]}.json`, `utf-8`));
  }

  function removeConstructorArgs(creationCode: string, sourceCodeData: SourceCodeData): string {
    return creationCode.replace(new RegExp(`${sourceCodeData.ConstructorArguments}$`), "");
  }
}

function pickSigner(index: number) {
  return (signers: ethers.Signer[]) => signers[index];
}

function loadDeployedContractData() {
  const file = `${migrationsDir}/${targetChainId}.json`;

  if (!fs.existsSync(file)) {
    return;
  }

  const migratedContent = fs.readFileSync(file, `utf-8`);

  const { addresses, constructors } = JSON.parse(migratedContent);

  for (const key in addresses) {
    deployedContractAddresses.set(ContractName[key as keyof typeof ContractName], addresses[key]);

    if (constructors[key]) {
      deployedContractConstructorHexes.set(ContractName[key as keyof typeof ContractName], constructors[key]);
    }
  }
}

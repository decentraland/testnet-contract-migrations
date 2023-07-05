import { ethers } from "ethers";
import fs from "fs";
import { ContractName } from "../common/types";
import { ConstructorFactory } from "./constructors/ConstructorFactory";
import { PostDeployment } from "./postDeployments/PostDeployment";
import { ChainId, OriginContractData, SourceCodeData } from "./types";
import {
  CatalystProxyPostDeployment,
  ERC721BidPostDeployment,
  EstateProxyPostDeployment,
  EstateRegistryPostDeployment,
  ExclusiveMasksCollectionPostDeployment,
  LANDProxyPostDeployment,
  LANDRegistryPostDeployment,
  MANATokenPostDeployment,
  MarketplacePostDeployment,
  MarketplaceProxyPostDeployment,
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
} from "./constructors/impl";

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

export const deploymentOrder: ContractName[] = [
  // ContractName.MANAToken,
  // ContractName.LANDRegistry,
  // ContractName.LANDProxy,
  // ContractName.Marketplace,
  // ContractName.MarketplaceProxy,
  // ContractName.EstateRegistry,
  // ContractName.EstateProxy,
  // ContractName.ERC721Bid,
  // ContractName.ExclusiveMasksCollection,
  // ContractName.DCLRegistrar,
  // ContractName.DCLControllerV2,
  ContractName.Catalyst,
  ContractName.CatalystProxy,
  // ContractName.BaseList,
  // ContractName.POIAllowListProxy,
  // ContractName.NameDenyListProxy,
  // ContractName.RentalsProxyAdmin,
  // ContractName.RentalsProxy,
  // ContractName.RentalsImplementation,
  // ContractName.VestingImpl,
  // ContractName.PeriodicTokenVestingImpl,
  // ContractName.VestingFactory,
  // ContractName.BatchVesting,
  // ContractName.OwnableBatchVestingImpl,
  // ContractName.MinimalProxyFactory,
];

export const originContractsData = loadOriginContractsData();

export const deployedContractAddresses = new Map<ContractName, string>();

export const contractDeployers = new Map<ContractName, (signers: ethers.Signer[]) => ethers.Signer>();

export const constructorFactories = new Map<ContractName, ConstructorFactory>();

export const postDeployments = new Map<ContractName, PostDeployment>();

// Contract Deployers

contractDeployers.set(ContractName.LANDProxy, pickSigner(1));
contractDeployers.set(ContractName.MarketplaceProxy, pickSigner(1));
contractDeployers.set(ContractName.EstateProxy, pickSigner(1));
contractDeployers.set(ContractName.CatalystProxy, pickSigner(1));

// Constructor Factories

constructorFactories.set(ContractName.EstateProxy, new EstateProxyConstructorFactory());
constructorFactories.set(ContractName.MarketplaceProxy, new MarketplaceProxyConstructorFactory());
constructorFactories.set(ContractName.ERC721Bid, new ERC721BidConstructorFactory());
constructorFactories.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionConstructorFactory());
constructorFactories.set(ContractName.DCLRegistrar, new DCLRegistrarConstructorFactory());
constructorFactories.set(ContractName.DCLControllerV2, new DCLControllerV2ConstructorFactory());
constructorFactories.set(ContractName.CatalystProxy, new CatalystProxyConstructorFactory());

// Post Deployments

postDeployments.set(ContractName.MANAToken, new MANATokenPostDeployment());
postDeployments.set(ContractName.LANDRegistry, new LANDRegistryPostDeployment());
postDeployments.set(ContractName.LANDProxy, new LANDProxyPostDeployment());
postDeployments.set(ContractName.Marketplace, new MarketplacePostDeployment());
postDeployments.set(ContractName.MarketplaceProxy, new MarketplaceProxyPostDeployment());
postDeployments.set(ContractName.EstateRegistry, new EstateRegistryPostDeployment());
postDeployments.set(ContractName.EstateProxy, new EstateProxyPostDeployment());
postDeployments.set(ContractName.ERC721Bid, new ERC721BidPostDeployment());
postDeployments.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionPostDeployment());
postDeployments.set(ContractName.CatalystProxy, new CatalystProxyPostDeployment());

// Misc

function loadOriginContractsData() {
  const originContractDataMap = new Map<ContractName, OriginContractData>();

  for (const contract of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contract]);

    const sourceCode = load<SourceCodeData>(sourceCodesDir, contract);
    const creationCode = removeConstructorArgs(load<[string]>(creationCodesDir, contract)[0], sourceCode);

    originContractDataMap.set(contract, {
      creationCode,
      sourceCode,
    });
  }

  return originContractDataMap;

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

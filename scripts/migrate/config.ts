import { ethers } from "ethers";
import fs from "fs";
import { ContractName } from "../common/types";
import { ConstructorFactory } from "./constructors/ConstructorFactory";
import { PostDeployment } from "./postDeployments/PostDeployment";
import { OriginContractData, SourceCodeData } from "./types";
import {
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
  NAMEDenylistPostDeployment,
  OwnableBatchVestingImplPostDeployment,
  POIAllowlistPostDeployment,
  RentalsProxyPostDeployment,
  TPRPostDeployment,
  VestingImplPostDeployment,
} from "./postDeployments/impl";
import { creationCodesDir, sourceCodesDir } from "../common/paths";
import { isPolygonNetwork, originChainId, targetChainId } from "../common/utils";
import {
  DCLControllerV2ConstructorFactory,
  DCLRegistrarConstructorFactory,
  ERC721BidConstructorFactory,
  EstateProxyConstructorFactory,
  ExclusiveMasksCollectionConstructorFactory,
  MarketplaceProxyConstructorFactory,
  RentalsProxyConstructorFactory,
  CommitteeConstructorFactory,
  MarketplaceV2ConstructorFactory,
  CollectionManagerConstructorFactory,
  CollectionFactoryV3ConstructorFactory,
  UpgradeableBeaconConstructorFactory,
  DummyDataFeedConstructorFactory,
  RaritiesWithOracleConstructorFactory,
  ChainlinkOracleConstructorFactory,
  ForwarderConstructorFactory,
  CollectionStoreConstructorFactory,
  POIConstructorFactory,
  PolygonERC721BidConstructorFactory
} from "./constructors/impl";
import { migrationsDir } from "./paths";

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
  ContractName.RentalsImplementation,
  ContractName.RentalsProxyAdmin,
  ContractName.RentalsProxy,
  ContractName.VestingImpl,
  ContractName.PeriodicTokenVestingImpl,
  ContractName.VestingFactory,
  ContractName.BatchVesting,
  ContractName.OwnableBatchVestingImpl,
  ContractName.MinimalProxyFactory,
  ContractName.NAMEDenylist,
  ContractName.Catalyst,
  ContractName.POIAllowlist,
];

export const polygonDeploymentOrder: ContractName[] = [
  ContractName.MetaTxForwarder,
  ContractName.DummyDataFeed,
  ContractName.ChainlinkOracle,
  ContractName.RoyaltiesManager,
  ContractName.MarketplaceV2,
  ContractName.ERC721Bid,
  ContractName.RaritiesWithOracle,
  ContractName.CollectionImplementation,
  ContractName.UpgradeableBeacon,
  ContractName.Committee,
  ContractName.CollectionManager,
  ContractName.Forwarder,
  ContractName.CollectionFactoryV3,
  ContractName.CollectionStore,
  ContractName.TPR,
  // TODO: Deploy TPRAdmin contract
  // ContractName.TPRAdmin,
  // TODO: Deploy TPRProxy contract
  // ContractName.TPRProxy,
  ContractName.POI,
  ContractName.Checker
]

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
export const polygonConstructorFactories = new Map<ContractName, ConstructorFactory>();

// Executes post deployment steps for each contract.
// This steps might contain initializations for proxy contracts as well as checks to determine the deployment
// has been executed correctly.
export const postDeployments = new Map<ContractName, PostDeployment>();
export const polygonPostDeployments = new Map<ContractName, PostDeployment>();

// Loads the data that has been downloaded through the `prepare` script.
loadOriginContractsData();

// Loads the data of contracts that have already been deployed to the target chain.
loadDeployedContractData();

// Contract Deployers
contractDeployerPickers.set(ContractName.LANDProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.MarketplaceProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.EstateProxy, pickSigner(1));
contractDeployerPickers.set(ContractName.RentalsProxyAdmin, pickSigner(1));

// Constructor Factories
constructorFactories.set(ContractName.EstateProxy, new EstateProxyConstructorFactory());
constructorFactories.set(ContractName.MarketplaceProxy, new MarketplaceProxyConstructorFactory());
constructorFactories.set(ContractName.ERC721Bid, new ERC721BidConstructorFactory());
constructorFactories.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionConstructorFactory());
constructorFactories.set(ContractName.DCLRegistrar, new DCLRegistrarConstructorFactory());
constructorFactories.set(ContractName.DCLControllerV2, new DCLControllerV2ConstructorFactory());
constructorFactories.set(ContractName.RentalsProxy, new RentalsProxyConstructorFactory());

// Polygon Constructor Factories
polygonConstructorFactories.set(ContractName.DummyDataFeed, new DummyDataFeedConstructorFactory());
polygonConstructorFactories.set(ContractName.ChainlinkOracle, new ChainlinkOracleConstructorFactory());
polygonConstructorFactories.set(ContractName.MarketplaceV2, new MarketplaceV2ConstructorFactory());
polygonConstructorFactories.set(ContractName.ERC721Bid, new PolygonERC721BidConstructorFactory());
polygonConstructorFactories.set(ContractName.RaritiesWithOracle, new RaritiesWithOracleConstructorFactory());
polygonConstructorFactories.set(ContractName.UpgradeableBeacon, new UpgradeableBeaconConstructorFactory());
polygonConstructorFactories.set(ContractName.Committee, new CommitteeConstructorFactory());
polygonConstructorFactories.set(ContractName.CollectionManager, new CollectionManagerConstructorFactory());
polygonConstructorFactories.set(ContractName.CollectionFactoryV3, new CollectionFactoryV3ConstructorFactory());
polygonConstructorFactories.set(ContractName.CollectionStore, new CollectionStoreConstructorFactory());
polygonConstructorFactories.set(ContractName.Forwarder, new ForwarderConstructorFactory());
polygonConstructorFactories.set(ContractName.POI, new POIConstructorFactory());

// Post Deployments
postDeployments.set(ContractName.LANDRegistry, new LANDRegistryPostDeployment());
postDeployments.set(ContractName.LANDProxy, new LANDProxyPostDeployment());
postDeployments.set(ContractName.Marketplace, new MarketplacePostDeployment());
postDeployments.set(ContractName.MarketplaceProxy, new MarketplaceProxyPostDeployment());
postDeployments.set(ContractName.EstateRegistry, new EstateRegistryPostDeployment());
postDeployments.set(ContractName.EstateProxy, new EstateProxyPostDeployment());
postDeployments.set(ContractName.ERC721Bid, new ERC721BidPostDeployment());
postDeployments.set(ContractName.ExclusiveMasksCollection, new ExclusiveMasksCollectionPostDeployment());
postDeployments.set(ContractName.RentalsProxy, new RentalsProxyPostDeployment());
postDeployments.set(ContractName.VestingImpl, new VestingImplPostDeployment());
postDeployments.set(ContractName.OwnableBatchVestingImpl, new OwnableBatchVestingImplPostDeployment());
postDeployments.set(ContractName.DCLControllerV2, new DCLControllerV2PostDeployment());
postDeployments.set(ContractName.DCLRegistrar, new DCLRegistrarPostDeployment());
postDeployments.set(ContractName.NAMEDenylist, new NAMEDenylistPostDeployment());
postDeployments.set(ContractName.POIAllowlist, new POIAllowlistPostDeployment());

polygonPostDeployments.set(ContractName.TPR, new TPRPostDeployment());

// Misc
export function getDeployedContracts(contractName: ContractName) {
  return deployedContractAddresses.get(contractName);
}

export function getDeploymentOrder(): ContractName[] {
  if (isPolygonNetwork(originChainId)) {
    return polygonDeploymentOrder
  }

  return deploymentOrder
}

export function getPostDeployment(contractName: ContractName): PostDeployment | undefined {
  if (isPolygonNetwork(originChainId)) {
    return polygonPostDeployments.get(contractName)
  }

  return postDeployments.get(contractName);
}

export function getConstructorFactory(contractName: ContractName): ConstructorFactory | undefined {
  if (isPolygonNetwork(originChainId)) {
    return polygonConstructorFactories.get(contractName)
  }

  return constructorFactories.get(contractName);
}

function loadOriginContractsData() {
  for (const contract of getDeploymentOrder()) {
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

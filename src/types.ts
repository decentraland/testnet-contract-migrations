import { ethers } from "ethers";

export enum ChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  GANACHE = 1337,
}

export enum ContractName {
  MANAToken,
  LANDRegistry,
  LANDProxy,
  Marketplace,
  MarketplaceProxy,
  EstateRegistry,
  EstateProxy,
  ERC721Bid,
  ExclusiveMasksCollection,
  DCLRegistrar,
  DCLControllerV2,
  Catalyst,
  CatalystProxy,
  POIAllowListProxy,
  NameDenyListProxy,
  VestingImpl,
  PeriodicTokenVestingImpl,
  VestingFactory,
  BatchVesting,
  OwnableBatchVestingImpl,
  MinimalProxyFactory,
  RentalsProxyAdmin,
}

export type SourceCodeData = {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
};

export type CreationData = {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
};

export type CreationCode = [string];

export type CreationTransaction = {
  receipt: ethers.TransactionReceipt;
  transaction: ethers.TransactionResponse;
};

export type OriginContractData = {
  sourceCode: SourceCodeData;
  creationData: CreationData;
  creationCode: CreationCode;
  creationTransaction: CreationTransaction;
};

export type DeployedContractAddresses = Map<ContractName, string>;

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

export type OriginContractData = {
  sourceCode: SourceCodeData;
  creationCode: string;
};

export type OriginContractDataMap = Map<ContractName, OriginContractData>;

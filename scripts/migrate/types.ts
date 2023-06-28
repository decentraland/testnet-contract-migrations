export enum ChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  GANACHE = 1337,
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

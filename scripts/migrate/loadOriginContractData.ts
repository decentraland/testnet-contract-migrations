import fs from "fs";
import { deploymentOrder } from "../../src/config";
import {
  OriginContractData,
  ContractName,
  CreationCode,
  CreationData,
  CreationTransaction,
  SourceCodeData,
} from "../../src/types";
import { creationCodesDir, creationDataDir, creationTransactionsDir, sourceCodesDir } from "../../src/paths";

export function loadOriginContractData() {
  const originContractDataMap = new Map<ContractName, OriginContractData>();

  for (const contractName of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contractName]);

    originContractDataMap.set(contractName, {
      creationCode: load<CreationCode>(creationCodesDir, contractName),
      sourceCode: load<SourceCodeData>(sourceCodesDir, contractName),
      creationData: load<CreationData>(creationTransactionsDir, contractName),
      creationTransaction: load<CreationTransaction>(creationDataDir, contractName),
    });
  }

  return originContractDataMap;

  function load<T>(dir: string, contractName: ContractName): T {
    return JSON.parse(fs.readFileSync(`${dir}/${ContractName[contractName]}.json`, `utf-8`));
  }
}

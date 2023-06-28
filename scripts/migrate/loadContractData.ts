import fs from "fs";
import { deploymentOrder } from "../../src/config";
import {
  ContractData,
  ContractName,
  CreationCode,
  CreationData,
  CreationTransaction,
  SourceCodeData,
} from "../../src/types";
import { creationCodesDir, creationDataDir, creationTransactionsDir, sourceCodesDir } from "../../src/paths";

export function loadContractData() {
  const contractDataMap = new Map<ContractName, ContractData>();

  for (const contractName of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contractName]);

    contractDataMap.set(contractName, {
      origin: {
        creationCode: load<CreationCode>(creationCodesDir, contractName),
        sourceCode: load<SourceCodeData>(sourceCodesDir, contractName),
        creationData: load<CreationData>(creationTransactionsDir, contractName),
        creationTransaction: load<CreationTransaction>(creationDataDir, contractName),
      },
    });
  }

  return contractDataMap;

  function load<T>(dir: string, contractName: ContractName): T {
    return JSON.parse(fs.readFileSync(`${dir}/${ContractName[contractName]}.json`, `utf-8`));
  }
}

import fs from "fs";
import { ContractName } from "../common/types";
import { creationCodesDir, sourceCodesDir } from "../common/paths";
import { deploymentOrder } from "./config";
import { OriginContractData, SourceCodeData } from "./types";

export function loadOriginContractsData() {
  const originContractDataMap = new Map<ContractName, OriginContractData>();

  for (const contractName of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contractName]);

    const sourceCode = load<SourceCodeData>(sourceCodesDir, contractName);
    const creationCode = removeConstructorArgs(load<[string]>(creationCodesDir, contractName)[0], sourceCode);

    originContractDataMap.set(contractName, {
      creationCode,
      sourceCode,
    });
  }

  return originContractDataMap;
}

function load<T>(dir: string, contractName: ContractName): T {
  return JSON.parse(fs.readFileSync(`${dir}/${ContractName[contractName]}.json`, `utf-8`));
}

function removeConstructorArgs(creationCode: string, sourceCodeData: SourceCodeData): string {
  return creationCode[0].replace(new RegExp(`${sourceCodeData.ConstructorArguments}$`), "");
}

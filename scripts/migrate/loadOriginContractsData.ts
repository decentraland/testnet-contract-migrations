import fs from "fs";
import { deploymentOrder } from "./config";
import { OriginContractData, ContractName, CreationCode, SourceCodeData } from "../../common/types";
import { creationCodesDir, sourceCodesDir } from "../../common/paths";

export function loadOriginContractsData() {
  const originContractDataMap = new Map<ContractName, OriginContractData>();

  for (const contractName of deploymentOrder) {
    console.log("Loading contract data for", ContractName[contractName]);

    const sourceCode = load<SourceCodeData>(sourceCodesDir, contractName);
    const creationCode = removeConstructorArgs(sourceCode, load<CreationCode>(creationCodesDir, contractName));

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

function removeConstructorArgs(sourceCodeData: SourceCodeData, creationCode: CreationCode): CreationCode {
  return [creationCode[0].replace(new RegExp(`${sourceCodeData.ConstructorArguments}$`), "")];
}

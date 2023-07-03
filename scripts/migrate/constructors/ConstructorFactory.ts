import { ethers } from "ethers";
import { ContractName } from "../../common/types";
import { deployedContractAddresses, originContractsData } from "../config";

export abstract class ConstructorFactory {
  abstract name: ContractName;

  abstract getConstructorArgs(): ethers.ContractMethodArgs<any[]>;

  getConstructorArgsHex = (): string => {
    const args = this.getConstructorArgs();
    const abi = this.getAbi(this.name);

    return new ethers.Interface(abi).encodeDeploy(args);
  };

  protected getAddress = (contract: ContractName): string => {
    const address = deployedContractAddresses.get(contract);
    if (!address) throw new Error(`Address not found for ${contract}`);
    return address;
  };

  private getAbi = (contract: ContractName): string => {
    const abi = originContractsData.get(contract)?.sourceCode.ABI;
    if (!abi) throw new Error(`ABI not found for ${contract}`);
    return abi;
  };
}

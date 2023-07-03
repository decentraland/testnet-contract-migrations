import { ethers } from "ethers";
import { ContractName } from "../../common/types";
import { deployedContractAddresses } from "../config";

export abstract class ConstructorFactory {
  abstract getConstructorArgs(): ethers.ContractMethodArgs<any[]>;

  getAddress = (contract: ContractName): string => {
    const address = deployedContractAddresses.get(contract);
    if (!address) throw new Error(`Address not found for ${contract}`);
    return address;
  };
}

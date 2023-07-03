import { ethers } from "ethers";
import { ContractName } from "../../common/types";
import { deployedContractAddresses, originContractsData } from "../config";

export abstract class PostDeployment {
  abstract exec(signers: ethers.Signer[]): Promise<void>;

  getAddress = (contract: ContractName): string => {
    const address = deployedContractAddresses.get(contract);
    if (!address) throw new Error(`Address not found for ${contract}`);
    return address;
  };

  getAbi = (contract: ContractName): string => {
    const abi = originContractsData.get(contract)?.sourceCode.ABI;
    if (!abi) throw new Error(`ABI not found for ${contract}`);
    return abi;
  };
}

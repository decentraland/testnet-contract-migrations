import { ethers } from "ethers";
import { ContractName } from "../../common/types";
import { getAbi } from "../utils";

export abstract class ConstructorFactory {
  abstract name: ContractName;

  abstract getConstructorArgs(signers: ethers.Signer[]): Promise<ethers.ContractMethodArgs<any[]>>;

  getConstructorArgsHex = async (signers: ethers.Signer[]): Promise<string> => {
    const args = await this.getConstructorArgs(signers);
    const abi = getAbi(this.name);

    return new ethers.Interface(abi).encodeDeploy(args);
  };
}

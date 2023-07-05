import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class DCLRegistrarConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.DCLRegistrar;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [
      "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      "eth",
      "dcl",
      "''",
    ];
  }
}

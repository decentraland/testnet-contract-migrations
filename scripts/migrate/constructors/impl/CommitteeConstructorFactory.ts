import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { ConstructorFactory } from "../ConstructorFactory";

export class CommitteeConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.Committee;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [owner, []];
  }
}

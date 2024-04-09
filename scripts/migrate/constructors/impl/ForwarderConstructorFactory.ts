import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class ForwarderConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.Forwarder;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [owner, getAddress(ContractName.CollectionManager)];
  }
}

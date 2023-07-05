import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class DCLControllerV2ConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.DCLControllerV2;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [this.getAddress(ContractName.MANAToken), this.getAddress(ContractName.DCLRegistrar), owner, owner];
  }
}

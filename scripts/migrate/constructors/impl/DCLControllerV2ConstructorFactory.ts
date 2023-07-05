import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class DCLControllerV2ConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.DCLControllerV2;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [getAddress(ContractName.MANAToken), getAddress(ContractName.DCLRegistrar), owner, owner];
  }
}

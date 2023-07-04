import { ContractMethodArgs } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class EstateProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.EstateProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.EstateRegistry)];
  }
}

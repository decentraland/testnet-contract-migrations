import { ContractMethodArgs } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class NameDenyListProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.NameDenyListProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.BaseList)];
  }
}

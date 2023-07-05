import { ContractMethodArgs } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class POIAllowListProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.POIAllowListProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.BaseList)];
  }
}

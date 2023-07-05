import { ContractMethodArgs } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class POIAllowListProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.POIAllowListProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.BaseList)];
  }
}

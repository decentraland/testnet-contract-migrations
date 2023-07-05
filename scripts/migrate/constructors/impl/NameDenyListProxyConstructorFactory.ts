import { ContractMethodArgs } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class NameDenyListProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.NameDenyListProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.BaseList)];
  }
}

import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class CatalystProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.CatalystProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.Catalyst)];
  }
}

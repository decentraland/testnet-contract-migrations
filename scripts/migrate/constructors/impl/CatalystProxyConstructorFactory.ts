import { ContractMethodArgs } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class CatalystProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.CatalystProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.Catalyst)];
  }
}

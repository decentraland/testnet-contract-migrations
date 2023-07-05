import { ContractMethodArgs } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class EstateProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.EstateProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.EstateRegistry)];
  }
}

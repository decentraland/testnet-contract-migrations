import { ContractMethodArgs, getAddress } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class EstateProxyConstructorFactory extends ConstructorFactory {
  getConstructorArgs(): ContractMethodArgs<any[]> {
    return [this.getAddress(ContractName.EstateRegistry)];
  }
}

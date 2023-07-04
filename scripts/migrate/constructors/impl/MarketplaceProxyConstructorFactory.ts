import { ContractMethodArgs } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class MarketplaceProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.MarketplaceProxy;

  getConstructorArgs(): ContractMethodArgs<any[]> {
    return [this.getAddress(ContractName.Marketplace)];
  }
}

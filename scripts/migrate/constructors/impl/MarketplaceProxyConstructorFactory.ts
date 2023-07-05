import { ContractMethodArgs } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class MarketplaceProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.MarketplaceProxy;

  async getConstructorArgs(): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.Marketplace)];
  }
}

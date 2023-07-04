import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class ERC721BidProxyConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.MarketplaceProxy;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.MANAToken), await signers[0].getAddress()];
  }
}

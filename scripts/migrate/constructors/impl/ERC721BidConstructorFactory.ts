import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class ERC721BidConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.ERC721Bid;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [this.getAddress(ContractName.MANAToken), await signers[0].getAddress()];
  }
}

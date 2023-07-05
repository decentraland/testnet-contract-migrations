import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class ERC721BidConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.ERC721Bid;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.MANAToken), await signers[0].getAddress()];
  }
}

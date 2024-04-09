import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export const OWNER_CUT_PER_MILLION = 25000

export class CollectionStoreConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.CollectionStore;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [
      owner,
      getAddress(ContractName.MANAToken),
      owner,
      OWNER_CUT_PER_MILLION
    ];
  }
}

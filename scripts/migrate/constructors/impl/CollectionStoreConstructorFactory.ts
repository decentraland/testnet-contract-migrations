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
      "0x7AD72b9f944eA9793cf4055D88F81138Cc2C63a0", // MANA Token address
      owner,
      OWNER_CUT_PER_MILLION
    ];
  }
}

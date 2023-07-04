import { ContractMethodArgs, ethers } from "ethers";
import { ConstructorFactory } from "../ConstructorFactory";
import { ContractName } from "../../../common/types";

export class ExclusiveMasksCollectionConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.ExclusiveMasksCollection;

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [
      "dcl://exclusive_masks",
      "DCLEXCLSVMSKS",
      await signers[0].getAddress(),
      "https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/exclusive_masks/wearables/",
    ];
  }
}

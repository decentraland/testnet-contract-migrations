import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class CollectionFactoryV3ConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.CollectionFactoryV3;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.Forwarder), getAddress(ContractName.UpgradeableBeacon)];
  }
}

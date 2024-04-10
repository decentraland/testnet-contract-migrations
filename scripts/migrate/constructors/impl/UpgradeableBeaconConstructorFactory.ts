import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class UpgradeableBeaconConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.UpgradeableBeacon;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return [getAddress(ContractName.CollectionImplementation)];
  }
}

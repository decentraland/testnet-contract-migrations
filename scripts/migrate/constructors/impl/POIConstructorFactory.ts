import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { ConstructorFactory } from "../ConstructorFactory";

export class POIConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.POI;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    return ["Points of Interest"];
  }
}

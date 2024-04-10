import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class DummyDataFeedConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.DummyDataFeed;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const decimals = 8
    const answer = 10 ** decimals

    return [decimals, answer, 0];
  }
}

import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export class ChainlinkOracleConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.ChainlinkOracle;

  async getConstructorArgs(_signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const decimals = 18

    return [getAddress(ContractName.DummyDataFeed), decimals, 60];
  }
}

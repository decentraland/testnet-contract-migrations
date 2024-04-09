import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export const FEES_COLLECTOR_CUT_PER_MILLION = 0
export const ROYALTIES_CUT_PER_MILLION = 25000

export class MarketplaceV2ConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.MarketplaceV2;

  /*
    address _owner,
    address _feesCollector,
    address _acceptedToken,
    IRoyaltiesManager _royaltiesManager,
    uint256 _feesCollectorCutPerMillion,
    uint256 _royaltiesCutPerMillion
   */
  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [
      owner,
      owner,
      '0x7ad72b9f944ea9793cf4055d88f81138cc2c63a0', // MANA Token address
      getAddress(ContractName.RoyaltiesManager),
      FEES_COLLECTOR_CUT_PER_MILLION,
      ROYALTIES_CUT_PER_MILLION
    ];
  }
}

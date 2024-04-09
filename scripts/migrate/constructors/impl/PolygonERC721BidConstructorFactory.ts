import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { ConstructorFactory } from "../ConstructorFactory";
import { ROYALTIES_CUT_PER_MILLION } from "./MarketplaceV2ConstructorFactory";
import { getAddress } from "../../utils";

export const FEES_COLLECTOR_CUT_PER_MILLION = 0;

export class PolygonERC721BidConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.ERC721Bid;

  /*
    * @param _owner - owner
    * @param _feesCollector - fees collector
    * @param _manaToken - Address of the ERC20 accepted for this marketplace
    * @param _royaltiesManager - Royalties manager contract
    * @param _feesCollectorCutPerMillion - fees collector cut per million
    * @param _royaltiesCutPerMillion - royalties cut per million
    */
  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [
      owner,
      owner,
      getAddress(ContractName.MANAToken),
      getAddress(ContractName.RoyaltiesManager),
      FEES_COLLECTOR_CUT_PER_MILLION,
      ROYALTIES_CUT_PER_MILLION
    ];
  }
}

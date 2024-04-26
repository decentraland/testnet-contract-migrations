import { ContractMethodArgs, ethers } from "ethers";
import { ContractName } from "../../../common/types";
import { getAddress } from "../../utils";
import { ConstructorFactory } from "../ConstructorFactory";

export const RESCUE_ITEMS_SELECTOR = '0x3c963655'
export const SET_APPROVE_COLLECTION_SELECTOR = '0x46d5a568'
export const SET_EDITABLE_SELECTOR = '0x2cb0d48a'

export class CollectionManagerConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.CollectionManager;

  /*
    * @param _owner - owner of the contract
    * @param _acceptedToken - accepted ERC20 token for collection deployment
    * @param _committee - committee contract
    * @param _feesCollector - fees collector
    * @param _rarities - rarities with oracle contract
    * @param _committeeMethods - method selectors
    * @param _committeeValues - whether the method is allowed or not
    */
  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress();

    return [
      owner,
      getAddress(ContractName.MANAToken),
      getAddress(ContractName.Committee),
      owner,
      getAddress(ContractName.RaritiesWithOracle),
      [RESCUE_ITEMS_SELECTOR, SET_APPROVE_COLLECTION_SELECTOR, SET_EDITABLE_SELECTOR],
      [true, true, true]
    ];
  }
}

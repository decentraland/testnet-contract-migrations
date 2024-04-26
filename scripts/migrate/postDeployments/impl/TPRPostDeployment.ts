import { ethers, toBigInt } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";
import { targetChainId } from "../../../common/utils";

/**
  * @notice Initialize the contract
  * @param _owner - owner of the contract
  * @param _thirdPartyAggregator - third party aggregator
  * @param _feesCollector - fees collector
  * @param _committee - committee smart contract
  * @param _acceptedToken - accepted token
  * @param _oracle - oracle smart contract
  * @param _itemSlotPrice - item price in USD dollar. 18 decimals
  */
export class TPRPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.TPR);
    const abi = getAbi(ContractName.TPR);
    const contract = new ethers.Contract(address, abi, signers[0]);

    const owner = (await signers[0].getAddress()).toLowerCase()
    const committee = getAddress(ContractName.Committee).toLowerCase()
    const acceptedToken = getAddress(ContractName.MANAToken).toLowerCase()
    const oracle = getAddress(ContractName.ChainlinkOracle).toLowerCase()
    const itemSlotPrice = toBigInt(0)
    const chainId = toBigInt(targetChainId)

    const initializeTx = await contract.initialize(
      owner,
      owner,
      owner,
      committee,
      acceptedToken,
      oracle,
      itemSlotPrice
    );
    await initializeTx.wait();

    expect((await contract.owner()).toLowerCase()).equal(owner)
    expect((await contract.thirdPartyAggregator()).toLowerCase()).equal(owner)
    expect((await contract.feesCollector()).toLowerCase()).equal(owner)
    expect((await contract.committee()).toLowerCase()).equal(committee)
    expect((await contract.acceptedToken()).toLowerCase()).equal(acceptedToken)
    expect((await contract.oracle()).toLowerCase()).equal(oracle)
    expect(await contract.itemSlotPrice()).equal(itemSlotPrice)
    expect(await contract.getChainId()).equal(chainId)
  }
}

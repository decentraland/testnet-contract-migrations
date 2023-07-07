import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../common/types";
import { getAbi, getAddress } from "../../utils";
import { PostDeployment } from "../PostDeployment";

export class ExclusiveMasksCollectionPostDeployment extends PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const address = getAddress(ContractName.ExclusiveMasksCollection);
    const abi = getAbi(ContractName.ExclusiveMasksCollection);
    const contract = new ethers.Contract(address, abi, signers[0]);

    expect(await contract.name()).to.equal("dcl://exclusive_masks");
    expect(await contract.symbol()).to.equal("DCLEXCLSVMSKS");
    expect(await contract.allowed(await signers[0].getAddress())).to.be.true;
    expect(await contract.baseURI()).to.equal(
      "https://wearable-api.decentraland.org/v2/standards/erc721-metadata/collections/exclusive_masks/wearables/"
    );

    const maxIssuance = 100000n;

    const wearables = [
      "bird_mask",
      "classic_mask",
      "clown_nose",
      "asian_fox",
      "killer_mask",
      "serial_killer_mask",
      "theater_mask",
      "tropical_mask",
    ];

    for (let i = 0; i < wearables.length; i++) {
      console.log("Adding wearable:", wearables[i]);

      const wearable = wearables[i];

      const addWearableTx = await contract.addWearable(wearable, maxIssuance);
      await addWearableTx.wait();

      expect(await contract.wearables(i)).to.equal(wearable);
    }

    console.log("Completing collection...");

    const completeCollectionTx = await contract.completeCollection();
    await completeCollectionTx.wait();

    expect(await contract.isComplete()).to.be.true;
  }
}

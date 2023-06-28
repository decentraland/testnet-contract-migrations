import { ethers } from "ethers";
import { expect } from "chai";
import { ContractName } from "../../../../common/types";
import { deployedContractAddresses, originContractsData } from "../../config";
import { PostDeployment } from "../PostDeployment";

export class MANATokenPostDeployment implements PostDeployment {
  async exec(signers: ethers.Signer[]): Promise<void> {
    const manaTokenAddress = deployedContractAddresses.get(ContractName.MANAToken);

    if (!manaTokenAddress) {
      throw new Error("Address not found");
    }

    const manaTokenAbi = originContractsData.get(ContractName.MANAToken)?.sourceCode.ABI;

    if (!manaTokenAbi) {
      throw new Error("ABI not found");
    }

    const minter = signers[0];

    const minterAddress = await minter.getAddress();

    const mintAmount = ethers.parseEther("21000000");

    const manaToken = new ethers.Contract(manaTokenAddress, manaTokenAbi, minter);

    const mintTx = await manaToken.mint(minterAddress, mintAmount);

    await mintTx.wait();

    const minterBalance = await manaToken.balanceOf(minterAddress);

    expect(minterBalance).to.equal(mintAmount);

    const finishMintingTx = await manaToken.finishMinting();

    await finishMintingTx.wait();

    const mintingFinished = await manaToken.mintingFinished();

    expect(mintingFinished).to.equal(true);
  }
}

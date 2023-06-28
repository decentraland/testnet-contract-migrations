import { ethers } from "ethers";
import { ChainId, ContractName, DeployedContractAddresses, OriginContractData, OriginContractDataMap } from "./types";
import { expect } from "chai";

export const targetChainId: ChainId = ChainId.SEPOLIA;

export const deploymentOrder = [
  ContractName.MANAToken,
  // ContractName.LANDRegistry,
  // ContractName.LANDProxy,
  // ContractName.EstateRegistry,
  // ContractName.EstateProxy,
];

export const contractAddressesMap = new Map<ContractName, string>();

contractAddressesMap.set(ContractName.MANAToken, "0x0f5d2fb29fb7d3cfee444a200298f468908cc942");
contractAddressesMap.set(ContractName.LANDRegistry, "0x554bb6488ba955377359bed16b84ed0822679cdc");
contractAddressesMap.set(ContractName.LANDProxy, "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d");
contractAddressesMap.set(ContractName.EstateRegistry, "0x1784ef41af86e97f8d28afe95b573a24aeda966e");
contractAddressesMap.set(ContractName.EstateProxy, "0x959e104e1a4db6317fa58f8295f586e1a978c297");

export const constructorArgsFactories = new Map<
  ContractName,
  (args: {
    originContractDataMap: OriginContractDataMap;
    deployedContractAddresses: DeployedContractAddresses;
  }) => ethers.ContractMethodArgs<any[]>
>();

constructorArgsFactories.set(ContractName.EstateProxy, ({ deployedContractAddresses }) => {
  const estateRegistryAddress = deployedContractAddresses.get(ContractName.EstateRegistry);

  if (!estateRegistryAddress) {
    throw new Error("Address not found");
  }

  return [estateRegistryAddress];
});

export const postDeploymentInstructions = new Map<
  ContractName,
  (args: {
    originContractDataMap: OriginContractDataMap;
    deployedContractAddresses: DeployedContractAddresses;
    signers: ethers.Signer[];
  }) => Promise<void>
>();

postDeploymentInstructions.set(
  ContractName.MANAToken,
  async ({ originContractDataMap, deployedContractAddresses, signers }) => {
    const manaTokenAddress = deployedContractAddresses.get(ContractName.MANAToken);

    if (!manaTokenAddress) {
      throw new Error("Address not found");
    }

    const manaTokenAbi = originContractDataMap.get(ContractName.MANAToken)?.sourceCode.ABI;

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
);

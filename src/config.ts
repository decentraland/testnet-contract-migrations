import { ethers } from "ethers";
import { ChainId, ContractName, DeployedContractAddresses, OriginContractData } from "./types";

export const targetChainId = ChainId.GANACHE;

export const deploymentOrder = [
  ContractName.MANAToken,
  ContractName.LANDRegistry,
  ContractName.LANDProxy,
  ContractName.EstateRegistry,
  ContractName.EstateProxy,
];

export const contractAddressesMap = new Map<ContractName, string>();

contractAddressesMap.set(ContractName.MANAToken, "0x0f5d2fb29fb7d3cfee444a200298f468908cc942");
contractAddressesMap.set(ContractName.LANDRegistry, "0x554bb6488ba955377359bed16b84ed0822679cdc");
contractAddressesMap.set(ContractName.LANDProxy, "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d");
contractAddressesMap.set(ContractName.EstateRegistry, "0x1784ef41af86e97f8d28afe95b573a24aeda966e");
contractAddressesMap.set(ContractName.EstateProxy, "0x959e104e1a4db6317fa58f8295f586e1a978c297");

export const constructorArgsFactories = new Map<
  ContractName,
  (
    originContractData: OriginContractData,
    deployedContractAddresses: DeployedContractAddresses
  ) => ethers.ContractMethodArgs<any[]>
>();

constructorArgsFactories.set(ContractName.EstateProxy, (_originContractData, deployedContractAddresses) => {
  const estateRegistryAddress = deployedContractAddresses.get(ContractName.EstateRegistry);
  if (!estateRegistryAddress) throw new Error("Address not found");
  return [estateRegistryAddress];
});

import { ethers } from "ethers";
import { ChainId, ContractData, ContractName } from "./types";

export const deploymentOrder: ContractName[] = [ContractName.MANAToken, ContractName.LANDRegistry];

export const migrationData = {
  origin: {
    chainId: ChainId.MAINNET,
  },
  target: {
    chainId: ChainId.GANACHE,
  },
};

export const contractDataMap: Map<ContractName, ContractData> = new Map();

contractDataMap.set(ContractName.MANAToken, {
  name: ContractName.MANAToken,
  original: {
    address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
  },
  target: {},
});

contractDataMap.set(ContractName.LANDRegistry, {
  name: ContractName.LANDRegistry,
  original: {
    address: "0x554bb6488ba955377359bed16b84ed0822679cdc",
  },
  target: {
    getInitializationData: () => {
      const landRegistry = contractDataMap.get(ContractName.LANDRegistry);

      if (!landRegistry) {
        throw new Error("LANDRegistry not found");
      }

      const abi = landRegistry.original.sourceCodeData?.ABI;

      if (!abi) {
        throw new Error("LANDRegistry ABI not found");
      }

      return new ethers.Interface(abi).encodeFunctionData("initialize", [ethers.toUtf8Bytes("Nando")]);
    },
  },
});

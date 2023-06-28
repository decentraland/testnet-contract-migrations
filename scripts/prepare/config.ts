import { ContractName } from "../common/types";

export const originContractAddresses = new Map<ContractName, string>();

originContractAddresses.set(ContractName.MANAToken, "0x0f5d2fb29fb7d3cfee444a200298f468908cc942");
originContractAddresses.set(ContractName.LANDRegistry, "0x554bb6488ba955377359bed16b84ed0822679cdc");
originContractAddresses.set(ContractName.LANDProxy, "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d");
originContractAddresses.set(ContractName.EstateRegistry, "0x1784ef41af86e97f8d28afe95b573a24aeda966e");
originContractAddresses.set(ContractName.EstateProxy, "0x959e104e1a4db6317fa58f8295f586e1a978c297");

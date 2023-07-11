import { ChainId, ContractName } from "../common/types";

export const originContractAddresses = new Map<ContractName, string>();

export const originContractChains = new Map<ContractName, ChainId>();

// Addresses

originContractAddresses.set(ContractName.MANAToken, "0x0f5d2fb29fb7d3cfee444a200298f468908cc942");
originContractAddresses.set(ContractName.LANDRegistry, "0x554bb6488ba955377359bed16b84ed0822679cdc");
originContractAddresses.set(ContractName.LANDProxy, "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d");
originContractAddresses.set(ContractName.Marketplace, "0x19a8ed4860007a66805782ed7e0bed4e44fc6717");
originContractAddresses.set(ContractName.MarketplaceProxy, "0x8e5660b4ab70168b5a6feea0e0315cb49c8cd539");
originContractAddresses.set(ContractName.EstateRegistry, "0x1784ef41af86e97f8d28afe95b573a24aeda966e");
originContractAddresses.set(ContractName.EstateProxy, "0x959e104e1a4db6317fa58f8295f586e1a978c297");
originContractAddresses.set(ContractName.ERC721Bid, "0xe479dfd9664c693b2e2992300930b00bfde08233");
originContractAddresses.set(ContractName.ExclusiveMasksCollection, "0xc04528c14c8ffd84c7c1fb6719b4a89853035cdd");
originContractAddresses.set(ContractName.DCLRegistrar, "0x2a187453064356c898cae034eaed119e1663acb8");
originContractAddresses.set(ContractName.DCLControllerV2, "0xbe92b49aee993adea3a002adcda189a2b7dec56c");
originContractAddresses.set(ContractName.RentalsProxyAdmin, "0xb49882c17281d3451972ae7e476cb3e0698af712");
originContractAddresses.set(ContractName.RentalsProxy, "0x3a1469499d0be105d4f77045ca403a5f6dc2f3f5");
originContractAddresses.set(ContractName.RentalsImplementation, "0xe90636e24d8faf02aa0e01c26d72dab9629865cb");
originContractAddresses.set(ContractName.VestingImpl, "0x42f32e19365d8045661a006408cc6d1064039fbf");
originContractAddresses.set(ContractName.PeriodicTokenVestingImpl, "0xb76b389cd04595321d51f575f5d950df1cef3dd7");
originContractAddresses.set(ContractName.VestingFactory, "0xe357273545c152f07afe2c38257b7b653fd3f6d0");
originContractAddresses.set(ContractName.BatchVesting, "0xc57185366bcda81cde363380e2099758712038d0");
originContractAddresses.set(ContractName.OwnableBatchVestingImpl, "0x24b18ac1c0cc1cfa14b03fe5c4580ab85191608a");
originContractAddresses.set(ContractName.MinimalProxyFactory, "0x38971125599c5e5b618072601c4eb803d7b24796");
originContractAddresses.set(ContractName.NAMEDenylist, "0x71c84760df0537f7db286274817462dc2e6c1366");
originContractAddresses.set(ContractName.Catalyst, "0x380e46851c47b73b6aa9bea50cf3b50e2cf637cf");
originContractAddresses.set(ContractName.POIAllowlist, "0xb8c7a7afd42675ab61f0a3732f8d0491825a933b");

// Chains
// There is no need to define contracts deployed to Mainnet here.

originContractChains.set(ContractName.NAMEDenylist, ChainId.GOERLI);
originContractChains.set(ContractName.Catalyst, ChainId.GOERLI);
originContractChains.set(ContractName.POIAllowlist, ChainId.GOERLI);

import { ChainId, ContractName } from '../common/types'
import { isPolygonNetwork, originChainId } from '../common/utils'

export const originContractAddresses = new Map<ContractName, string>()
export const originPolygonContractAddresses = new Map<ContractName, string>()

export const originContractChains = new Map<ContractName, ChainId>()

// Addresses

// Ethereum Contracts
originContractAddresses.set(ContractName.MANAToken, '0x0f5d2fb29fb7d3cfee444a200298f468908cc942')
originContractAddresses.set(ContractName.LANDRegistry, '0x554bb6488ba955377359bed16b84ed0822679cdc')
originContractAddresses.set(ContractName.LANDProxy, '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d')
originContractAddresses.set(ContractName.Marketplace, '0x19a8ed4860007a66805782ed7e0bed4e44fc6717')
originContractAddresses.set(ContractName.MarketplaceProxy, '0x8e5660b4ab70168b5a6feea0e0315cb49c8cd539')
originContractAddresses.set(ContractName.EstateRegistry, '0x1784ef41af86e97f8d28afe95b573a24aeda966e')
originContractAddresses.set(ContractName.EstateProxy, '0x959e104e1a4db6317fa58f8295f586e1a978c297')
originContractAddresses.set(ContractName.ERC721Bid, '0xe479dfd9664c693b2e2992300930b00bfde08233')
originContractAddresses.set(ContractName.ExclusiveMasksCollection, '0xc04528c14c8ffd84c7c1fb6719b4a89853035cdd')
originContractAddresses.set(ContractName.DCLRegistrar, '0x2a187453064356c898cae034eaed119e1663acb8')
originContractAddresses.set(ContractName.DCLControllerV2, '0xbe92b49aee993adea3a002adcda189a2b7dec56c')
originContractAddresses.set(ContractName.RentalsProxyAdmin, '0xb49882c17281d3451972ae7e476cb3e0698af712')
originContractAddresses.set(ContractName.RentalsProxy, '0x3a1469499d0be105d4f77045ca403a5f6dc2f3f5')
originContractAddresses.set(ContractName.RentalsImplementation, '0xe90636e24d8faf02aa0e01c26d72dab9629865cb')
originContractAddresses.set(ContractName.VestingImpl, '0x42f32e19365d8045661a006408cc6d1064039fbf')
originContractAddresses.set(ContractName.PeriodicTokenVestingImpl, '0xb76b389cd04595321d51f575f5d950df1cef3dd7')
originContractAddresses.set(ContractName.VestingFactory, '0xe357273545c152f07afe2c38257b7b653fd3f6d0')
originContractAddresses.set(ContractName.BatchVesting, '0xc57185366bcda81cde363380e2099758712038d0')
originContractAddresses.set(ContractName.OwnableBatchVestingImpl, '0x24b18ac1c0cc1cfa14b03fe5c4580ab85191608a')
originContractAddresses.set(ContractName.MinimalProxyFactory, '0x38971125599c5e5b618072601c4eb803d7b24796')
originContractAddresses.set(ContractName.NAMEDenylist, '0x71c84760df0537f7db286274817462dc2e6c1366')
originContractAddresses.set(ContractName.Catalyst, '0x380e46851c47b73b6aa9bea50cf3b50e2cf637cf')
originContractAddresses.set(ContractName.POIAllowlist, '0xb8c7a7afd42675ab61f0a3732f8d0491825a933b')

// Polygon Contracts
originPolygonContractAddresses.set(ContractName.MetaTxForwarder, '0x0babda04f62c549a09ef3313fe187f29c099ff3c')
originPolygonContractAddresses.set(ContractName.DummyDataFeed, '0x5521ade5494225e0936c74f97e474107d73c406e')
originPolygonContractAddresses.set(ContractName.ChainlinkOracle, '0x1a91dd8d4eeddc2fac31f36818604b7093dc95e0')
originPolygonContractAddresses.set(ContractName.RoyaltiesManager, '0x90958D4531258ca11D18396d4174a007edBc2b42')
originPolygonContractAddresses.set(ContractName.MarketplaceV2, '0x480a0f4e360E8964e68858Dd231c2922f1df45Ef')
originPolygonContractAddresses.set(ContractName.ERC721Bid, '0xb96697FA4A3361Ba35B774a42c58dACcaAd1B8E1')
originPolygonContractAddresses.set(ContractName.RaritiesWithOracle, '0xA9158E22F89Bb3F69c5600338895Cb5FB81e5090')
originPolygonContractAddresses.set(ContractName.CollectionImplementation, '0x006080C6061C4aF79b39Da0842a3a22A7b3f185e')
originPolygonContractAddresses.set(ContractName.UpgradeableBeacon, '0xDDb3781Fff645325C8896AA1F067bAa381607ecc')
originPolygonContractAddresses.set(ContractName.Committee, '0xaeec95a8aa671a6d3fec56594827d7804964fa70')
originPolygonContractAddresses.set(ContractName.CollectionManager, '0x9D32AaC179153A991e832550d9F96441Ea27763A')
originPolygonContractAddresses.set(ContractName.Forwarder, '0xBF6755A83C0dCDBB2933A96EA778E00b717d7004')
originPolygonContractAddresses.set(ContractName.CollectionFactoryV3, '0x3195e88aE10704b359764CB38e429D24f1c2f781')
originPolygonContractAddresses.set(ContractName.CollectionStore, '0x214ffC0f0103735728dc66b61A22e4F163e275ae')
originPolygonContractAddresses.set(ContractName.TPR, '0x1f8063CC04398Be214a7d8dD25B6b6e2b870d99e')
// TODO: Validate TPRAdmin contract
// originPolygonContractAddresses.set(ContractName.TPRAdmin, '0xF44063d872C88eEBab2EFC0318194e75a5218C1E')
// TODO: Validate TPRProxy contract
// originPolygonContractAddresses.set(ContractName.TPRProxy, '0x1C436C1EFb4608dFfDC8bace99d2B03c314f3348')
originPolygonContractAddresses.set(ContractName.POI, '0xFEC09d5C192aaf7Ec7E2C89Cc8D3224138391B2E')
originPolygonContractAddresses.set(ContractName.Checker, '0xC2D0637FE019817b7B307b9B966E4400EB4aC165')

// There is no need to define contracts deployed to Mainnet here.
// Ethereum Chains
originContractChains.set(ContractName.NAMEDenylist, ChainId.GOERLI)
originContractChains.set(ContractName.Catalyst, ChainId.GOERLI)
originContractChains.set(ContractName.POIAllowlist, ChainId.GOERLI)
// Polygon Chains
originContractChains.set(ContractName.DummyDataFeed, ChainId.MUMBAI)

export function getOriginContractAddresses(): Map<ContractName, string> {
  if (isPolygonNetwork(originChainId)) {
    return originPolygonContractAddresses
  }

  return originContractAddresses
}

export function getOriginContractChains(contractName: ContractName): ChainId {
  if (isPolygonNetwork(originChainId)) {
    return originContractChains.get(contractName) || ChainId.MATIC
  }

  return originContractChains.get(contractName) || ChainId.MAINNET
}

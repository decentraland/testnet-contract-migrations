import dotenv from 'dotenv'
dotenv.config()

import { AbstractProvider, Signer, ethers, toBigInt } from 'ethers'
import { getAbi, getAddress, getRpcUrl } from '../../migrate/utils'
import { targetChainId } from '../../common/utils'
import { ContractName } from '../../common/types'

async function main() {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(targetChainId))
  const signers: Signer[] = process.env.PRIVATE_KEYS!.split(',').map((pk) => new ethers.Wallet(pk, provider as AbstractProvider))
  const signer = signers[0]
  const signerAddress = await signer.getAddress()
  console.log('signerAddress', signerAddress)

  const contractAddress = getAddress(ContractName.TPR)
  console.log('contractAddress', contractAddress)
  const contractAbi = getAbi(ContractName.TPR)
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)

  const tprManagers = [
    '0x...', // manager 1
  ]
  const managersValues = [
    true, // manager 1
  ]

  const thirdParty = [
    'urn:decentraland:amoy:collections-thirdparty:dcl-tests', // id
    'tp:1:third party 1: the third party 1 desc', // metadata
    'https://third-party-resolver-api.decentraland.zone/v1', // api-resolver
    tprManagers,
    managersValues,
    toBigInt(50), // item slots
  ]

  const txn = await contract.updateThirdParties([thirdParty])
  await txn.wait()
}

main()

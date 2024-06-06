import dotenv from 'dotenv'
dotenv.config()

import { AbstractProvider, Signer, ethers } from 'ethers'
import { getAbi, getAddress, getRpcUrl } from '../../migrate/utils'
import { targetChainId } from '../../common/utils'
import { ContractName } from '../../common/types'

async function main() {
  const provider = new ethers.JsonRpcProvider(getRpcUrl(targetChainId))
  const signers: Signer[] = process.env.PRIVATE_KEYS!.split(',').map((pk) => new ethers.Wallet(pk, provider as AbstractProvider))
  const signer = signers[0]
  const signerAddress = await signer.getAddress()
  console.log('signerAddress', signerAddress)

  const contractAddress = getAddress(ContractName.Committee)
  const contractAbi = getAbi(ContractName.Committee)
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)

  const committeeMember = '0x...'
  console.log('Adding committee member', committeeMember)
  const txn = await contract.setMembers([committeeMember], [true])
  await txn.wait()
  console.log(`${committeeMember} is committee member: `, await contract.members(committeeMember))
}

main()

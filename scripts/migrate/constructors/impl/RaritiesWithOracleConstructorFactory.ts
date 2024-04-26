import { ContractMethodArgs, ethers } from 'ethers'
import { ContractName } from '../../../common/types'
import { ConstructorFactory } from '../ConstructorFactory'
import { getAddress } from '../../utils'

export const RARITIES = [
  { name: 'common', index: 0, value: 100000 },
  { name: 'uncommon', index: 1, value: 10000 },
  { name: 'rare', index: 2, value: 5000 },
  { name: 'epic', index: 3, value: 1000 },
  { name: 'legendary', index: 4, value: 100 },
  { name: 'exotic', index: 5, value: 50 },
  { name: 'mythic', index: 6, value: 10 },
  { name: 'unique', index: 7, value: 1 },
]

export const DEFAULT_RARITY_PRICE = '1000000000000000000' // 1 MANA

export class RaritiesWithOracleConstructorFactory extends ConstructorFactory {
  name: ContractName = ContractName.RaritiesWithOracle

  async getConstructorArgs(signers: ethers.Signer[]): Promise<ContractMethodArgs<any[]>> {
    const owner = await signers[0].getAddress()
    const rarities = RARITIES.map(rarity => [
      rarity.name,
      rarity.value,
      DEFAULT_RARITY_PRICE
    ])

    return [owner, rarities, getAddress(ContractName.ChainlinkOracle)]
  }
}

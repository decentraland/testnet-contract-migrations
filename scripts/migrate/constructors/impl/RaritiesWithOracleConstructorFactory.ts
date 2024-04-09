import { ContractMethodArgs, ethers } from 'ethers'
import { ContractName } from '../../../common/types'
import { ConstructorFactory } from '../ConstructorFactory'
import { DEFAULT_RARITY_PRICE, RARITIES } from './RaritiesConstructorFactory'
import { getAddress } from '../../utils'


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

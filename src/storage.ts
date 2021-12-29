import { u32 } from '@polkadot/types'
import { u8aConcat, u8aToHex } from '@polkadot/util'
import { blake2AsU8a } from '@polkadot/util-crypto'

export function createChildKey (trieIndex: u32) {
  return u8aToHex(
    u8aConcat(
      ':child_storage:default:',
      blake2AsU8a(
        u8aConcat('crowdloans', trieIndex.toU8a())
      )
    )
  )
}

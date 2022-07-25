import { u32 } from '@polkadot/types'
import { u8aConcat, u8aToHex } from '@polkadot/util'
import { blake2AsU8a } from '@polkadot/util-crypto'
import { ChildStorageKind } from './types'

export function createChildKey (trieIndex: u32) {
  return u8aToHex(
    u8aConcat(':child_storage:default:', blake2AsU8a(u8aConcat('crowdloan', trieIndex.toU8a())))
  )
}

// Follow https://github.com/parallel-finance/parallel/blob/master/pallets/crowdloans/src/lib.rs#L868
export function createVaultChildKey (trieIndex: u32, kind: ChildStorageKind) {
  const prefix = 'crowdloan:' + kind.valueOf()
  // logger.debug(`childstorage prefix: ${prefix}`)

  return u8aToHex(
    u8aConcat(':child_storage:default:', blake2AsU8a(u8aConcat(prefix, trieIndex.toU8a())))
  )
}

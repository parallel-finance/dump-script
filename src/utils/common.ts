import { ParaId } from '@polkadot/types/interfaces'
import { u8aConcat } from '@polkadot/util'
import { api } from './api'
import { CROWD_PREFIX } from './constants'

const EMPTY_U8A = new Uint8Array(32)

export function createAddress (paraId: ParaId): Uint8Array {
  const id = api.createType('ParaId', paraId)
  return u8aConcat(CROWD_PREFIX, id.toU8a(), EMPTY_U8A).subarray(0, 32)
}

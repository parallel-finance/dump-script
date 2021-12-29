import { Api, api } from './utils/api'
import { ParaId } from '@polkadot/types/interfaces'
import * as fs from 'fs'
import dotenv from 'dotenv'
import { Campaign } from './types'
import { logger } from './utils/logger'
import { SUBSTRATE_SS58_PREFIX } from './utils/constants'
import { fetchCrowdloan } from './query'
import { parseFunds } from './parser'
import { createChildKey } from './storage'
import { encodeAddress } from '@polkadot/util-crypto'

dotenv.config()

async function main () {
  const paraId: number = parseInt(process.env.PARAID || '2012')
  await Api.init(process.env.ENDPOINT || 'wss://localhost:9944')
  const dumpJson = process.env.DUMP_PATH || ''

  const crowdloan = await fetchCrowdloan(paraId)
  const campaigns: Campaign[] = await parseFunds([[[paraId as unknown as ParaId]], [crowdloan]])
  if (!campaigns.length) {
    logger.error(`No campaigns found for paraId ${paraId}`)
    process.exit(1)
  }

  const trieIndex = api.createType('u32', campaigns[0].info.trieIndex)
  const childKey = createChildKey(trieIndex)
  logger.debug(`childKey: ${childKey}`)

  const keys = await api.rpc.childstate.getKeys(childKey, '0x')
  const ss58Keys = keys.map(
    k => encodeAddress(k, parseInt(process.env.SS58_PREFIX || SUBSTRATE_SS58_PREFIX))
  )
  // logger.debug(`keys: ${ss58Keys}`);

  const values = await Promise.all(keys.map(k => api.rpc.childstate.getStorage(childKey, k)))
  const contributions = values.map((v, idx) => ({
    from: ss58Keys[idx],
    data: api.createType('(Balance, Vec<u8>)', v.unwrap()).toJSON()
  }))
  logger.debug(`contributions.len = ${contributions.length}`)

  if (dumpJson) {
    const jsonStr = JSON.stringify(contributions, undefined, 2)
    fs.writeFileSync(dumpJson, jsonStr, { encoding: 'utf-8' })
  }
}

main().catch(console.error).finally(() => process.exit())

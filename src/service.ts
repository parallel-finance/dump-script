import { Api, paraApi } from './utils/api'
import { ParaId } from '@polkadot/types/interfaces'
import * as fs from 'fs'
import dotenv from 'dotenv'
import { Campaign, VaultInfo } from './types'
import { logger } from './utils/logger'
import { SUBSTRATE_SS58_PREFIX } from './utils/constants'
import { fetchCrowdloan, fetchVault } from './query'
import { parseFunds, parseVault } from './parser'
import { createChildKey, createVaultChildKey } from './storage'
import { encodeAddress } from '@polkadot/util-crypto'

interface ApiServiceConfig {
    paraEndpoint: string;
    relayEndpoint: string | undefined;
    dumpPath: string;
    paraId: number;
}

export class Service {
    static dumpPath: string
    static paraId: number
    static async build (
      { paraEndpoint, relayEndpoint, dumpPath, paraId }: ApiServiceConfig
    ) {
      await Api.init(paraEndpoint, relayEndpoint)
      this.dumpPath = dumpPath
      this.paraId = paraId
      return new Service()
    }

    public async run () {
      const paraId = Service.paraId
      
      // TODO: Try to get multiple-vaults
      const valut = await fetchVault(paraId, 0)
      const vaultsInfo: VaultInfo[] = await parseVault([[[paraId as unknown as ParaId]], [valut]])
      logger.debug(`Found valuts count: ${vaultsInfo.length}`)

      const trieIndex = paraApi.createType('u32', vaultsInfo[0].info.trieIndex)
  
      const pendingChildKeys = createVaultChildKey(trieIndex, true)
      const contributedChildKeys = createVaultChildKey(trieIndex, false)
      logger.debug(`pendingKeys: ${pendingChildKeys}`)
      logger.debug(`contributedKeys: ${contributedChildKeys}`)

      await this.processChildKey(pendingChildKeys, 'pending.json')
      await this.processChildKey(contributedChildKeys, 'contributed.json')
    }
    
    public async processChildKey (childKeys: string | Uint8Array, filename: string) {
      const keys = await paraApi.rpc.childstate.getKeys(childKeys, '0x')
      const ss58Keys = keys.map(
        k => encodeAddress(k, parseInt(process.env.SS58_PREFIX || SUBSTRATE_SS58_PREFIX))
      )
      const values = await Promise.all(ss58Keys.map(
        k => paraApi.rpc.childstate.getStorage(childKeys, k))
      )
      const contributions = values.map((v, idx) => ({
        from: ss58Keys[idx],
        data: paraApi.createType('(Balance, Vec<u8>)', v.unwrap()).toJSON()
      }))
      logger.debug(`contributions.len = ${contributions.length}`)
      const jsonStr = JSON.stringify(contributions, undefined, 2)
      fs.writeFileSync(Service.dumpPath+filename, jsonStr, { encoding: 'utf-8' })
    }
}

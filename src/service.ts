import { Api, paraApi } from './utils/api'
import { ParaId } from '@polkadot/types/interfaces'
import * as fs from 'fs'
import { ChildStorageKind, VaultInfo } from './types'
import { logger } from './utils/logger'
import { fetchVault } from './query'
import { parseVault } from './parser'
import { createVaultChildKey } from './storage'
import { encodeAddress } from '@polkadot/util-crypto'
import getConfig from './utils/config'

const { vaultConfig } = getConfig()

interface ApiServiceConfig {
  paraEndpoint: string;
  relayEndpoint: string | undefined;
  dumpPath: string;
  paraSS58Prefix: number;
  blockHeight: number;
}

export class Service {
  static dumpPath: string;
  static paraSS58Prefix: number;
  static blockHeight: number;
  static async build ({
    paraEndpoint,
    relayEndpoint,
    dumpPath,
    paraSS58Prefix,
    blockHeight
  }: ApiServiceConfig) {
    await Api.init(paraEndpoint, relayEndpoint)
    this.dumpPath = dumpPath
    this.paraSS58Prefix = paraSS58Prefix
    this.blockHeight = blockHeight
    return new Service()
  }

  public async run () {
    const blockHeight =
      Service.blockHeight || (await paraApi.query.system.number())
    const at = (await paraApi.rpc.chain.getBlockHash(blockHeight)).toString()

    if (at) {
      logger.debug(`Fetch data from block #${blockHeight}, block hash: ${at}`)
    }

    // TODO: Try to get multiple-vaults
    const vault = await fetchVault(
      vaultConfig.paraId,
      vaultConfig.leaseStart,
      vaultConfig.leaseEnd
    )
    if (!vault) {
      logger.error('Run script failed')
      return
    }
    const vaultsInfo: VaultInfo[] = await parseVault([
      [[vaultConfig.paraId as unknown as ParaId]],
      [vault]
    ])
    logger.debug(`Found vaults count: ${vaultsInfo.length}`)

    const trieIndex = paraApi.createType('u32', vaultsInfo[0].info.trieIndex)

    const pendingChildKeys = createVaultChildKey(
      trieIndex,
      ChildStorageKind.Pending
    )
    const flyingChildKeys = createVaultChildKey(
      trieIndex,
      ChildStorageKind.Flying
    )
    const contributedChildKeys = createVaultChildKey(
      trieIndex,
      ChildStorageKind.Contributed
    )
    logger.debug(`flyingKeys: ${flyingChildKeys}`)
    logger.debug(`pendingKeys: ${pendingChildKeys}`)
    logger.debug(`contributedKeys: ${contributedChildKeys}`)

    await this.processChildKey(flyingChildKeys, 'flying.json', at)
    await this.processChildKey(pendingChildKeys, 'pending.json', at)
    await this.processChildKey(contributedChildKeys, 'contributed.json', at)
  }

  public async processChildKey (
    childKeys: string | Uint8Array,
    filename: string,
    at?: string
  ) {
    const keys = await paraApi.rpc.childstate.getKeys(childKeys, '0x', at)
    const ss58Keys = keys.map((k) => encodeAddress(k, Service.paraSS58Prefix))
    const values = await Promise.all(
      keys.map((k) => paraApi.rpc.childstate.getStorage(childKeys, k, at))
    )
    const contributions = values.map((v, idx) => ({
      from: ss58Keys[idx],
      data: paraApi.createType('(Balance, Vec<u8>)', v.unwrap()).toJSON()
    }))
    logger.debug(`${filename.split('.')[0]}.len = ${contributions.length}`)
    let totalAmount = BigInt(0)
    contributions.forEach((item) => {
      const amount = Number((item.data as unknown as [number, string])[0])
      // logger.debug(`amount is ${amount}`)
      totalAmount = totalAmount + BigInt(amount)
    })
    logger.debug(`total amount is ${totalAmount}`)
    const jsonStr = JSON.stringify(contributions, undefined, 2)
    fs.writeFileSync(Service.dumpPath + '/' + filename, jsonStr, {
      encoding: 'utf-8'
    })
  }
}

import { paraApi } from './utils/api'
import { logger } from './utils/logger'
import type { PolkadotRuntimeCommonCrowdloanFundInfo as CrowdloanFundInfo } from '@polkadot/types/lookup'
import { Vault } from './types'

export const fetchCrowdloan = async (paraId: number): Promise<CrowdloanFundInfo> => {
  const fund = await paraApi.query.crowdloan.funds(paraId)
  logger.info(`Fetched crowloan ${paraId}: ${JSON.stringify(fund, null, 2)}`)
  if (!fund) logger.error(`Failed to fetch crowdloan ${paraId}`)
  return fund.toJSON() as unknown as CrowdloanFundInfo
}

export const fetchVault = async (paraId: number, leaseStart: number, leaseEnd: number): Promise<Vault> => {
  const vault = await paraApi.query.crowdloans.vaults(paraId, leaseStart, leaseEnd)

  if (!vault) logger.error(`Failed to fetch crowdloan ${paraId}`)

  const vaultData = vault.toJSON() as unknown as Vault
  logger.info(`Fetched vault ${paraId}: ${JSON.stringify(vaultData, null, 2)}`)
  console.log({
    ...vaultData,
    contributed: BigInt(vaultData.contributed.toString()).toString(),
    cap: BigInt(vaultData.cap.toString()).toString()
  }
  )
  return vaultData
}

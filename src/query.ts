import { api } from './utils/api'
import { logger } from './utils/logger'
import type { PolkadotRuntimeCommonCrowdloanFundInfo as CrowdloanFundInfo } from '@polkadot/types/lookup'

export const fetchCrowdloan = async (paraId: number): Promise<CrowdloanFundInfo> => {
  const fund = await api.query.crowdloan.funds(paraId)
  logger.info(`Fetched crowloan ${paraId}: ${JSON.stringify(fund, null, 2)}`)
  if (!fund) logger.error(`Failed to fetch crowdloan ${paraId}`)
  return fund.toJSON() as unknown as CrowdloanFundInfo
}

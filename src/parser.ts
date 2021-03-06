import { ParaId } from '@polkadot/types/interfaces'
import { Campaign, Vault, VaultInfo } from './types'
import { createAddress } from './utils/common'
import { encodeAddress } from '@polkadot/util-crypto'
import type { PolkadotRuntimeCommonCrowdloanFundInfo as CrowdloanFundInfo } from '@polkadot/types/lookup'

export const parseFunds = async ([[paraIds], optFunds]: [[ParaId[]], CrowdloanFundInfo[]]): Promise<
  Campaign[]
> =>
  paraIds
    .map((paraId, i): [ParaId, CrowdloanFundInfo | null] => [paraId, optFunds[i]])
    .filter((v): v is [ParaId, CrowdloanFundInfo] => !!v[1])
    .map(
      ([paraId, info]): Campaign => ({
        accountId: encodeAddress(createAddress(paraId)),
        firstSlot: info.firstPeriod,
        info,
        isCrowdloan: true,
        key: paraId.toString(),
        lastSlot: info.lastPeriod,
        paraId,
        value: info.raised
      })
    )
    .sort(
      (a, b) =>
        a.info.end.cmp(b.info.end) ||
        a.info.firstPeriod.cmp(b.info.firstPeriod) ||
        a.info.lastPeriod.cmp(b.info.lastPeriod) ||
        a.paraId.cmp(b.paraId)
    )

export const parseVault = async ([[paraIds], vaults]: [[ParaId[]], Vault[]]): Promise<
  VaultInfo[]
> =>
  paraIds
    .map((paraId, i): [ParaId, Vault | null] => [paraId, vaults[i]])
    .filter((v): v is [ParaId, Vault] => !!v[1])
    .map(
      ([paraId, info]): VaultInfo => ({
        paraId,
        ctoken: info.ctoken,
        isCrowdloan: true,
        info,
        contributed: info.contributed,
        pending: info.pending
      })
    )
    .sort((a, b) => a.info.endBlock.cmp(b.info.endBlock) || a.paraId.cmp(b.paraId))

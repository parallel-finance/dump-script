import { ParaId } from '@polkadot/types/interfaces'
import { PolkadotRuntimeCommonCrowdloanFundInfo } from '@polkadot/types/lookup'
import BN from 'bn.js'
import { BN_ZERO } from '@polkadot/util'

export interface WinnerData {
    accountId: string;
    firstSlot: BN;
    isCrowdloan: boolean;
    key: string;
    lastSlot: BN;
    paraId: ParaId;
    value: BN;
}

export interface Campaign extends WinnerData {
    info: PolkadotRuntimeCommonCrowdloanFundInfo;
    isCapped?: boolean;
    isEnded?: boolean;
    isWinner?: boolean;
}

export interface Campaigns {
    activeCap: BN;
    activeRaised: BN;
    funds: Campaign[] | null;
    totalCap: BN;
    totalRaised: BN;
}

export const EMPTY: Campaigns = {
  activeCap: BN_ZERO,
  activeRaised: BN_ZERO,
  funds: null,
  totalCap: BN_ZERO,
  totalRaised: BN_ZERO
}

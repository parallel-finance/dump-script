import { ParaId } from '@polkadot/types/interfaces'
import { PolkadotRuntimeCommonCrowdloanFundInfo } from '@polkadot/types/lookup'
import BN from 'bn.js'
import { BN_ZERO } from '@polkadot/util'
import { Enum, Struct, u128, u32 } from '@polkadot/types'

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


export interface VaultPhase extends Enum {
    readonly Pending: u32;
    readonly Contributing: u32;
    readonly Closed: u32;
    readonly Failed: u32;
    readonly Succeeded: u32;
    readonly Expired: u32;
}
export interface ContributionStrategy extends Enum {
    readonly XCM: u32;
}

export interface Vault extends Struct {
    // Vault ID
    readonly id: u32,
    // Asset used to represent the shares of currency
    // to be claimed back later on
    readonly ctoken: u32,
    // Which phase the vault is at
    readonly phase: VaultPhase,
    // Tracks how many coins were contributed on the relay chain
    readonly contributed: u128,
    /// Tracks how many coins were gathered but not contributed on the relay chain
    readonly pending: u128,
    /// How we contribute coins to the crowdloan
    readonly contributionStrategy: ContributionStrategy,
    /// parallel enforced limit
    readonly cap: u128,
    /// block that vault ends
    readonly endBlock: u128,
    /// child storage trie index where we store all contributions
    readonly trieIndex: u32,
}

export interface ValidVaultData {
    paraId: ParaId;
    ctoken: BN;
    isCrowdloan: boolean;
    contributed: BN;
    pending: BN;
}

export interface VaultInfo extends ValidVaultData{
    info: Vault;
}

export interface VaultInfos {
    vaults: VaultInfo[];
}

export enum ChildStorageKind {
    Pending = 'pending',
    Flying = 'flying',
    Contributed = 'contributed',
    Default = '',
}
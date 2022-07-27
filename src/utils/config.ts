import { getNumEnv, getStringEnv, getStringOrUndefinedEnv } from './getEnv'

interface SubstrateConfig {
  paraEndpoint: string
  relayEndpoint: string | undefined
  paraSS58Prefix: number
  blockHeight: number
}

interface VaultInterface {
  paraId: number
  leaseStart: number
  leaseEnd: number
}

interface Config {
  substrate: SubstrateConfig
  vaultConfig: VaultInterface
  dumpPath: string
}

const getConfig = (): Config => ({
  substrate: {
    paraEndpoint: getStringEnv('PARA_ENDPOINT'),
    relayEndpoint: getStringOrUndefinedEnv('RELAY_ENDPOINT', false),
    paraSS58Prefix: getNumEnv('PARA_SS58_PREFIX'),
    blockHeight: getNumEnv('BLOCK_HEIGHT') || 0
  },
  vaultConfig: {
    paraId: getNumEnv('PARAID'),
    leaseStart: getNumEnv('LEASE_START'),
    leaseEnd: getNumEnv('LEASE_END')
  },
  dumpPath: getStringEnv('DUMP_PATH')
})

export default getConfig

import { getNumEnv, getStringEnv, getStringOrUndefinedEnv } from './getEnv'

interface SubstrateConfig {
  paraEndpoint: string
  relayEndpoint: string | undefined
  paraSS58Prefix: number
}

interface Config {
  substrate: SubstrateConfig
  paraId: number
  dumpPath: string
}

const getConfig = (): Config => ({
  substrate: {
    paraEndpoint: getStringEnv('PARA_ENDPOINT'),
    relayEndpoint: getStringOrUndefinedEnv('RELAY_ENDPOINT', false),
    paraSS58Prefix: getNumEnv('PARA_SS58_PREFIX')
  },
  paraId: getNumEnv('PARAID'),
  dumpPath: getStringEnv('DUMP_PATH')
})

export default getConfig

import { ApiOptions } from '@polkadot/api/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { logger } from '../utils/logger'

export let paraApi: ApiPromise
export let relayApi: ApiPromise

export namespace Api {
  export async function init (paraEndpoint?: string, relayerEndpoint?: string) {
    if (paraEndpoint) {
      logger.debug(`connected endpoint: ${paraEndpoint}`)
      paraApi = await ApiPromise.create(
        { provider: new WsProvider(paraEndpoint) } as ApiOptions
    )
    }
    if (relayerEndpoint) {
      logger.debug(`connected endpoint: ${relayerEndpoint}`)
      relayApi = await ApiPromise.create(
        { provider: new WsProvider(relayerEndpoint) } as ApiOptions
      )
    }
  }
}

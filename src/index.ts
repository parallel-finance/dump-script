import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { Service } from './service'
import getConfig from './utils/config'
import { LOCAL_ENDPOINT, SUBSTRATE_SS58_PREFIX } from './utils/constants'

dotenv.config()

async function main () {
  const { substrate, dumpPath } = getConfig()
  const service = await Service.build({
    paraEndpoint: substrate.paraEndpoint || LOCAL_ENDPOINT,
    relayEndpoint: undefined,
    dumpPath: dumpPath || './',
    paraSS58Prefix: substrate.paraSS58Prefix || SUBSTRATE_SS58_PREFIX,
    blockHeight: substrate.blockHeight
  })
  await service.run()
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    logger.error(e.message)
    process.exit(1)
  })

process.on('unhandledRejection', err => logger.error(err))

import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { Service } from './service'
import getConfig from './utils/config'

dotenv.config()

async function main () {
  const { substrate, dumpPath, paraId } = getConfig()
  const service = await Service.build({
    paraEndpoint: substrate.paraEndpoint || 'wss://localhost:9944',
    relayEndpoint: undefined,
    dumpPath: dumpPath || './',
    paraId: paraId || 2012
  })
  await service.run()
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e.message)
    process.exit(1)
  })

process.on('unhandledRejection', (err) => logger.error(err))

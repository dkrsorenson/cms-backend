import 'reflect-metadata'

import { setupContainer } from './ioc/container'
import { ApplicationServer } from './server'

// Build app
const container = setupContainer()
const server = new ApplicationServer(container)

// Start the server
if (process.env.NODE_ENV !== 'prd') {
  server.start()
}

export default server

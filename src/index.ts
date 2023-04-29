import { ApplicationServer } from './server'

// Build app
const server = new ApplicationServer()

// Start the server
if (process.env.NODE_ENV !== 'prd') {
  server.start()
}

export default server

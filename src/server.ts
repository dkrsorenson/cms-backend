import express, { Application } from 'express'
import { Server } from 'http'

import config from './configs/env.config'
import routes from './routes'

export class ApplicationServer {
  private expressApp: Application
  private server?: Server

  constructor() {
    this.expressApp = this.createExpressApplication()
  }

  public start(): Promise<void> {
    return new Promise(done => {
      this.server = this.expressApp.listen(config.PORT, () => {
        console.log(`Listening on: http://${config.HOST}:${config.PORT}/`)

        done()
      })
    })
  }

  public async stop(): Promise<void> {
    if (!this.server) {
      throw new Error('Server is already stopped')
    }

    console.log('Server is stopping...')

    await new Promise<void>((res, rej) => this.server?.close(err => (err ? rej(err) : res())))

    console.log('Server is stopped.')
  }

  private createExpressApplication(): express.Application {
    const app: Application = express()

    app.disable('x-powered-by')
    app.use('/', routes)

    //app.use(cors())
    //app.use(compression())
    //app.use(bodyParser.json())

    return app
  }
}

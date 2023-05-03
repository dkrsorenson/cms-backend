import 'reflect-metadata'
import express, { Application } from 'express'
import { Server } from 'http'

import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'

import config from './configs/env.config'

export class ApplicationServer {
  private expressApp: Application
  private server?: Server

  constructor(container: Container) {
    this.expressApp = this.createExpressApplication(container)
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

  private createExpressApplication(container: Container): express.Application {
    const server = new InversifyExpressServer(container)
    server.setConfig(app => {
      app.disable('x-powered-by')
      app.use(express.json())
    })

    return server.build()
  }
}

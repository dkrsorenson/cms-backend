import { injectable } from 'inversify'
import { DataSource, DataSourceOptions, ObjectType, Repository } from 'typeorm'

export interface IDatabaseService {
  getRepository(entity: ObjectType<any>): Repository<any>
}

@injectable()
export class DatabaseService implements IDatabaseService {
  private dataSource: DataSource

  constructor(options: DataSourceOptions) {
    this.dataSource = new DataSource(options)

    this.initializeDataSource()
  }

  private initializeDataSource(): DataSource {
    if (this.dataSource?.isInitialized) {
      return this.dataSource
    }

    this.dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
      })
      .catch(err => {
        console.error('Error during Data Source initialization', err)
      })

    return this.dataSource
  }

  public getRepository(entity: ObjectType<any>): Repository<any> {
    return this.dataSource.getRepository(entity)
  }
}

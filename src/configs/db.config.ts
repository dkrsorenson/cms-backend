import path from 'path'
import { DataSourceOptions } from 'typeorm'

import config from './env.config'

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: true,
}

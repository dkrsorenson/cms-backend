import { DataSource } from 'typeorm'

import { dataSourceConfig } from '../configs/db.config'

// Create the data source
export const appDataSource = new DataSource(dataSourceConfig)

// Initialze the datasource
appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err)
  })

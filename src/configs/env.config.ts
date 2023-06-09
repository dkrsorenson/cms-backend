import path from 'path'
import dotenv from 'dotenv'

// Parsing the env file
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') })

// Type to load env variables
type ENV = {
  PORT: number | undefined
  HOST: string | undefined
  DB_HOST: string | undefined
  DB_USER: string | undefined
  DB_DATABASE: string | undefined
  DB_PASSWORD: string | undefined
  DB_PORT: number | undefined
  JWT_SECRET: string | undefined
  JWT_EXPIRATION: string | undefined
}

// Type for configs
type Config = {
  PORT: number
  HOST: string
  DB_HOST: string
  DB_USER: string
  DB_DATABASE: string
  DB_PASSWORD: string
  DB_PORT: number
  JWT_SECRET: string
  JWT_EXPIRATION: string
}

// Loading process.env as ENV type
const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    HOST: process.env.HOST ? String(process.env.HOST) : undefined,
    DB_HOST: process.env.DB_HOST ? String(process.env.DB_HOST) : undefined,
    DB_USER: process.env.DB_USER ? String(process.env.DB_USER) : undefined,
    DB_DATABASE: process.env.DB_DATABASE ? String(process.env.DB_DATABASE) : undefined,
    DB_PASSWORD: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    JWT_SECRET: process.env.JWT_SECRET ? String(process.env.JWT_SECRET) : undefined,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION ? String(process.env.JWT_EXPIRATION) : undefined,
  }
}

// Throw an Error if any fields are undefined
const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

const config = getConfig()
const sanitizedConfig = getSanitzedConfig(config)

export default sanitizedConfig

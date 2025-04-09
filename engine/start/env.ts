/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for web3.storage
  |----------------------------------------------------------
  */
  WEB3_STORAGE_EMAIL: Env.schema.string(),
  WEB3_STORAGE_SPACE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for encryption/decryption
  |----------------------------------------------------------
  */
  ENCRYPTION_ALGORITHM: Env.schema.string(),
  ENCRYPTION_SALT: Env.schema.number(),
  ENCRYPTION_IV: Env.schema.number(),
  ENCRYPTION_TAG: Env.schema.number(),
  ENCRYPTION_ITERATIONS: Env.schema.number(),
  ENCRYPTION_KEY: Env.schema.number(),
  ENCRYPTION_PASSWORD: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring key pairs
  |----------------------------------------------------------
  */
  PRIVATE_KEY: Env.schema.string(),
  PUBLIC_KEY: Env.schema.string(),

  /*
|----------------------------------------------------------
| Variables for signature data
|----------------------------------------------------------
*/
  VOTE_TALLY_SIGNATURE_DATA: Env.schema.string(),
})

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { DATABASE_URL_NUMBER_THREADS } from '@/constants/env'
import * as schema from './schema'

const connectionString = DATABASE_URL_NUMBER_THREADS

if (!connectionString) {
  throw new Error('DATABASE_URL_NUMBER_THREADS is not set')
}

const client = postgres(connectionString)

export const db = drizzle(client, { schema })

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/routes/ellty/number-threads/-server/schema.ts',
  out: './drizzle/number-threads',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_NUMBER_THREADS!,
  },
})

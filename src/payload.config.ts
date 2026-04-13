import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Rooms } from './collections/Rooms'
import { Users } from './collections/Users'
import { SalesChannel } from './globals/SalesChannel'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    timezones: {
      defaultTimezone: 'America/Fortaleza',
    },
  },
  collections: [Users, Media, Rooms, Products],
  globals: [SalesChannel],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    /* `migrate:create` exige prompts interativos; em Windows use `PAYLOAD_DB_PUSH=true` só em dev até gerar migração em ambiente com TTY. Produção: `push` desligado. */
    push: process.env.PAYLOAD_DB_PUSH === 'true' && process.env.NODE_ENV !== 'production',
    migrationDir: './migrations',
  }),
  email: resendAdapter({
    defaultFromAddress: 'noreply@baita.dev.br',
    defaultFromName: 'Baita Dev',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  localization: {
    locales: ['pt-BR'],
    defaultLocale: 'pt-BR',
  },
})

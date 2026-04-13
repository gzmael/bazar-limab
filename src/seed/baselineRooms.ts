/**
 * Idempotent baseline rooms (FR-002). Run: pnpm seed:rooms
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const BASELINE = [
  { slug: 'quarto', title: 'Quarto', sort: 10 },
  { slug: 'cozinha', title: 'Cozinha', sort: 20 },
  { slug: 'garagem', title: 'Garagem', sort: 30 },
  { slug: 'lavanderia', title: 'Lavanderia', sort: 40 },
] as const

async function main() {
  const payload = await getPayload({ config })

  for (const row of BASELINE) {
    const existing = await payload.find({
      collection: 'rooms',
      where: { slug: { equals: row.slug } },
      limit: 1,
      locale: 'pt-BR',
    })
    if (existing.docs[0]) {
      console.info(`Skip existing room slug=${row.slug}`)
      continue
    }
    await payload.create({
      collection: 'rooms',
      locale: 'pt-BR',
      data: {
        slug: row.slug,
        title: row.title,
        sort: row.sort,
        storeStatus: 'draft',
      },
    })
    console.info(`Created room slug=${row.slug}`)
  }

  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

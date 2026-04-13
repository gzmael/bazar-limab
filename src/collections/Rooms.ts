import type { CollectionConfig } from 'payload'

import { revalidateAllStorefront, revalidateRoomListing } from '@/lib/revalidateStorefront'

const storeStatusOptions = [
  { label: 'Rascunho', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Arquivado', value: 'archived' },
] as const

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  labels: { singular: 'Ambiente', plural: 'Ambientes' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sort', 'storeStatus', 'updatedAt'],
    group: 'Catálogo',
    description:
      'Cômodos ou áreas da casa (ex.: Quarto, Cozinha). Ordem define a grade na vitrine.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return { storeStatus: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Nome',
      admin: { description: 'Nome exibido na vitrine (pt-BR).' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: { description: 'Segmento de URL (ex.: quarto). Único em todo o site.' },
    },
    {
      name: 'sort',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Ordem no seletor',
      admin: { description: 'Menor número aparece primeiro na escolha de ambientes.' },
    },
    {
      name: 'storeStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status na vitrine',
      options: [...storeStatusOptions],
      admin: {
        description:
          'Somente **Publicado** aparece para visitantes. **Arquivado** oculta o ambiente da vitrine.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => {
        const slug = typeof doc.slug === 'string' ? doc.slug : ''
        const prevSlug = typeof previousDoc?.slug === 'string' ? previousDoc.slug : undefined
        if (slug) revalidateRoomListing(slug, prevSlug)
        revalidateAllStorefront()
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const slug = typeof doc.slug === 'string' ? doc.slug : ''
        if (slug) revalidateRoomListing(slug)
        revalidateAllStorefront()
      },
    ],
  },
}

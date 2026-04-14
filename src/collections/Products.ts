import type { CollectionConfig } from 'payload'

import { revalidateAllStorefront, revalidateProductAndRoom } from '@/lib/revalidateStorefront'

const storeStatusOptions = [
  { label: 'Rascunho', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Arquivado', value: 'archived' },
] as const

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'room', 'price', 'storeStatus', 'sort', 'updatedAt'],
    group: 'Catálogo',
    description:
      'Até **3 fotos** por produto. Ordem numérica dentro do ambiente controla a listagem pública.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      /* Relação com ambiente publicado é garantida nas consultas da vitrine (storefront). */
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
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: { description: 'URL única do produto (ex.: cadeira-estofada).' },
    },
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'rooms',
      required: true,
      label: 'Ambiente',
      admin: { description: 'Cada produto pertence a um único ambiente.' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Preço (BRL)',
      admin: { description: 'Valor em reais (número decimal).' },
    },
    {
      name: 'condition',
      type: 'select',
      required: true,
      label: 'Estado',
      options: [
        { label: 'Novo', value: 'novo' },
        { label: 'Seminovo', value: 'seminovo' },
        { label: 'Usado', value: 'usado' },
        { label: 'Usado — bom estado', value: 'usado_bom' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      maxLength: 500,
      label: 'Descrição curta',
      admin: {
        description: 'Máximo 500 caracteres. Aparece na vitrine e no WhatsApp.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxPurchaseQty',
          type: 'number',
          required: true,
          defaultValue: 99,
          min: 1,
          label: 'Quantidade máxima por pedido',
          admin: { description: 'Limite de unidades no carrinho para este produto.' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Destaque na página inicial',
        },
        {
          name: 'familyPick',
          type: 'checkbox',
          defaultValue: false,
          label: 'Selo família (destaque curadoria)',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'notesDimensions',
          type: 'text',
          label: 'Notas — dimensões',
          admin: { description: 'Opcional (ex.: 80×40 cm).' },
        },
        {
          name: 'notesBrand',
          type: 'text',
          label: 'Notas — marca',
        },
        {
          name: 'notesYear',
          type: 'text',
          label: 'Notas — ano',
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      labels: { singular: 'Foto', plural: 'Fotos (máx. 3)' },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagem',
        },
      ],
      admin: {
        description: 'Entre 1 e 3 imagens por produto.',
      },
    },
    {
      name: 'sort',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Ordem na listagem do ambiente',
      admin: { description: 'Menor número aparece primeiro na listagem pública desse ambiente.' },
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
          'Somente **Publicado** (com ambiente publicado) aparece para visitantes. **Arquivado** remove da vitrine.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const g = data?.gallery
        if (Array.isArray(g) && g.length > 3) {
          return 'No máximo 3 fotos por produto.'
        }
        if (Array.isArray(g) && g.length < 1) {
          return 'Adicione pelo menos uma foto.'
        }
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        const slug = typeof doc.slug === 'string' ? doc.slug : ''
        let roomSlug: string | undefined
        const roomRef = doc.room
        const roomId =
          typeof roomRef === 'object' && roomRef && 'id' in roomRef ? roomRef.id : roomRef
        if (typeof roomId === 'number') {
          const room = await req.payload.findByID({
            collection: 'rooms',
            id: roomId,
            depth: 0,
          })
          roomSlug = typeof room.slug === 'string' ? room.slug : undefined
        }
        if (slug) revalidateProductAndRoom(slug, roomSlug)
        revalidateAllStorefront()
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const slug = typeof doc.slug === 'string' ? doc.slug : ''
        let roomSlug: string | undefined
        const roomRef = doc.room
        const roomId =
          typeof roomRef === 'object' && roomRef && 'id' in roomRef ? roomRef.id : roomRef
        if (typeof roomId === 'number') {
          const room = await req.payload.findByID({
            collection: 'rooms',
            id: roomId,
            depth: 0,
          })
          roomSlug = typeof room.slug === 'string' ? room.slug : undefined
        }
        if (slug) revalidateProductAndRoom(slug, roomSlug)
        revalidateAllStorefront()
      },
    ],
  },
}

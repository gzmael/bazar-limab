import type { GlobalConfig } from 'payload'

import { revalidateAllStorefront } from '@/lib/revalidateStorefront'

export const SalesChannel: GlobalConfig = {
  slug: 'sales-channel',
  label: 'Canal de vendas',
  admin: {
    group: 'Catálogo',
    description: 'WhatsApp e moeda exibida na vitrine e no pedido.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'whatsappE164',
      type: 'text',
      required: true,
      label: 'WhatsApp (E.164)',
      admin: {
        description: 'Número com código do país, ex.: +5511987654321 (usado em wa.me).',
      },
      validate: (value: string | null | undefined) => {
        if (!value || !/^\+[1-9]\d{6,14}$/.test(value.trim())) {
          return 'Informe o número em formato E.164 (começando com + e código do país).'
        }
        return true
      },
    },
    {
      name: 'displayCurrency',
      type: 'select',
      required: true,
      defaultValue: 'BRL',
      label: 'Moeda exibida',
      options: [{ label: 'Real (BRL)', value: 'BRL' }],
    },
    {
      name: 'storefrontTitle',
      type: 'text',
      label: 'Título opcional da vitrine',
      localized: true,
      admin: {
        description: 'Se vazio, a marca padrão “Bazar Lima Basilio” é usada no cabeçalho.',
      },
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidateAllStorefront()
      },
    ],
  },
}

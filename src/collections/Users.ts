import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Operadores autenticados gerenciam ambientes, produtos e o canal de vendas.',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'operator',
      label: 'Função',
      options: [
        { label: 'Operador', value: 'operator' },
        { label: 'Administrador', value: 'admin' },
      ],
    },
  ],
}

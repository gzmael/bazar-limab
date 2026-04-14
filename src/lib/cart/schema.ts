import { z } from 'zod'

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPriceBrl: z.number().min(0),
  title: z.string().min(1),
  slug: z.string().optional(),
  /** When absent (legacy cart JSON), callers treat as 99. */
  maxPurchaseQty: z.number().int().min(1).optional(),
})

export type CartLine = z.infer<typeof cartLineSchema>

export const cartStorageSchema = z.object({
  version: z.literal(1),
  lines: z.array(cartLineSchema),
})

export type CartStorage = z.infer<typeof cartStorageSchema>

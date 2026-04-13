import { z } from 'zod'

export const checkoutDraftSchema = z.object({
  buyerName: z.string().min(1),
  buyerContact: z.string().min(3),
})

export type CheckoutDraft = z.infer<typeof checkoutDraftSchema>

export function parseCheckoutDraft(input: unknown) {
  return checkoutDraftSchema.safeParse(input)
}

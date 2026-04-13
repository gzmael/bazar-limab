import { revalidatePath } from 'next/cache'

function safeRevalidate(fn: () => void) {
  try {
    fn()
  } catch {
    /* Outside Next request or build — hooks may still run */
  }
}

export function revalidateAllStorefront() {
  safeRevalidate(() => {
    revalidatePath('/browse')
    revalidatePath('/cart')
    revalidatePath('/checkout')
  })
}

export function revalidateRoomListing(slug: string, previousSlug?: string) {
  safeRevalidate(() => {
    revalidatePath('/browse')
    revalidatePath(`/rooms/${slug}`)
    if (previousSlug && previousSlug !== slug) {
      revalidatePath(`/rooms/${previousSlug}`)
    }
  })
}

export function revalidateProductAndRoom(productSlug: string, roomSlug?: string) {
  safeRevalidate(() => {
    revalidatePath('/browse')
    revalidatePath(`/products/${productSlug}`)
    if (roomSlug) {
      revalidatePath(`/rooms/${roomSlug}`)
    }
  })
}

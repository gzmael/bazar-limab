'use client'

/**
 * Uso isolado de “efeito” leve para a vitrine; mantenha importações apenas deste módulo.
 */
export function StorefrontAccent() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/10 to-transparent motion-reduce:hidden rounded-2xl"
    />
  )
}

'use client'

import NumberFlow, { type Format, usePrefersReducedMotion } from '@number-flow/react'

type Props = {
  value: number
  className?: string
  locales?: Intl.LocalesArgument
  format?: Format
}

/**
 * Animated numerals with reduced-motion fallback (FR-012).
 */
export function FlowNumber({ value, className, locales = 'pt-BR', format }: Props) {
  const reduced = usePrefersReducedMotion()
  if (reduced) {
    const text = format
      ? new Intl.NumberFormat(locales, format as Intl.NumberFormatOptions).format(value)
      : String(value)
    return <span className={className}>{text}</span>
  }
  return <NumberFlow className={className} format={format} locales={locales} value={value} />
}

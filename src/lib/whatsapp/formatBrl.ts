const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBrl(value: number) {
  return brl.format(value)
}

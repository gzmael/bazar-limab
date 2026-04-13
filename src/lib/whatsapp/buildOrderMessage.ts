import { formatBrl } from '@/lib/whatsapp/formatBrl'

const MAX_BODY_UTF16 = 3500

const NOTICE =
  '\n\n[Pedido abreviado para abrir no WhatsApp — use o texto completo na opção copiar.]'

export type OrderLineInput = { quantity: number; title: string; unitPriceBrl: number }

function lineText(l: OrderLineInput) {
  return `- ${l.quantity}x ${l.title} — ${formatBrl(l.unitPriceBrl)} cada`
}

function assembleBody(
  buyerName: string,
  buyerContact: string,
  linesBlock: string,
  totalBrl: string,
) {
  return `Olá! Pedido pelo catálogo Bazar Lima Basilio:

Nome: ${buyerName}
Contato: ${buyerContact}

Itens:
${linesBlock}

Total: ${totalBrl}`
}

/**
 * fullText = always complete (for copy). textForWaMeUrl may be shortened per contract.
 */
export function buildOrderMessage(params: {
  buyerName: string
  buyerContact: string
  lines: OrderLineInput[]
  totalBrl: string
}): { fullText: string; textForWaMeUrl: string; truncatedForUrl: boolean } {
  const linesBlock = params.lines.map(lineText).join('\n')
  const fullText = assembleBody(params.buyerName, params.buyerContact, linesBlock, params.totalBrl)

  if (fullText.length <= MAX_BODY_UTF16) {
    return { fullText, textForWaMeUrl: fullText, truncatedForUrl: false }
  }

  let lines = [...params.lines]
  while (lines.length > 0) {
    const block = lines.map(lineText).join('\n')
    const candidateCore = assembleBody(
      params.buyerName,
      params.buyerContact,
      block,
      params.totalBrl,
    )
    const candidate = `${candidateCore}${NOTICE}`
    if (candidate.length <= MAX_BODY_UTF16) {
      return { fullText, textForWaMeUrl: candidate, truncatedForUrl: true }
    }
    lines = lines.slice(0, -1)
  }

  const minimalBlock = '(itens omitidos — ver mensagem completa na cópia)'
  const fallback = assembleBody(
    params.buyerName,
    params.buyerContact,
    minimalBlock,
    params.totalBrl,
  )
  const withNotice = `${fallback}${NOTICE}`
  const textForWaMeUrl =
    withNotice.length <= MAX_BODY_UTF16 ? withNotice : withNotice.slice(0, MAX_BODY_UTF16)
  return { fullText, textForWaMeUrl, truncatedForUrl: true }
}

export function cartTotalBrl(lines: OrderLineInput[]) {
  const sum = lines.reduce((acc, l) => acc + l.quantity * l.unitPriceBrl, 0)
  return formatBrl(sum)
}

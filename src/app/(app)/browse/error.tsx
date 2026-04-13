'use client'

export default function BrowseError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="font-medium text-foreground">Não foi possível carregar os ambientes.</p>
      <p className="mt-2 text-sm text-muted-foreground">Tente de novo em instantes.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Tentar novamente
      </button>
    </div>
  )
}

'use client'

export default function RoomError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="font-medium text-foreground">Não foi possível carregar esta listagem.</p>
      <p className="mt-2 text-sm text-muted-foreground">Verifique sua conexão e tente outra vez.</p>
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

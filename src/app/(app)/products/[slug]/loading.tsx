export default function ProductLoading() {
  return (
    <div className="space-y-4 motion-safe:animate-pulse" aria-hidden>
      <div className="aspect-square w-full rounded-xl bg-muted" />
      <div className="h-8 w-3/4 rounded bg-muted" />
      <div className="h-6 w-24 rounded bg-muted" />
      <div className="h-20 w-full rounded bg-muted" />
    </div>
  )
}

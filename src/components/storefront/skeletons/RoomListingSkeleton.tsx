export function RoomListingSkeleton() {
  return (
    <div className="space-y-4 motion-safe:animate-pulse" aria-hidden>
      <div className="h-7 w-40 rounded-md bg-muted" />
      <ul className="grid grid-cols-2 gap-3">
        {(['a', 'b', 'c', 'd', 'e', 'f'] as const).map((id) => (
          <li key={id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-square bg-muted" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

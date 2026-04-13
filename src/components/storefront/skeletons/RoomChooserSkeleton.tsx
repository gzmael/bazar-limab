export function RoomChooserSkeleton() {
  return (
    <div className="space-y-4 motion-safe:animate-pulse" aria-hidden>
      <div className="h-8 w-48 rounded-md bg-muted" />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(['a', 'b', 'c', 'd', 'e', 'f'] as const).map((id) => (
          <li key={id} className="aspect-[4/3] rounded-xl bg-muted" />
        ))}
      </ul>
    </div>
  )
}

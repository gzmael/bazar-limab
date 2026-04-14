'use client'

import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

export type RoomCarouselItem = {
  id: number
  title: string
  slug: string
  iconUrl: string | null
}

type Props = {
  rooms: RoomCarouselItem[]
}

export function RoomsCarousel({ rooms }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  if (rooms.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum ambiente publicado ainda. Volte em breve.
      </p>
    )
  }

  return (
    <div className="relative">
      {rooms.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm md:flex"
            aria-label="Ambientes anteriores"
            onClick={() => scrollBy(-280)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className="absolute right-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm md:flex"
            aria-label="Próximos ambientes"
            onClick={() => scrollBy(280)}
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      ) : null}
      <section
        ref={scrollerRef}
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none]',
          'snap-x snap-mandatory md:snap-none',
          '[&::-webkit-scrollbar]:hidden',
        )}
        aria-label="Lista de ambientes"
      >
        {rooms.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.slug}`}
            className={cn(
              'flex w-[9.5rem] shrink-0 snap-start flex-col items-center gap-2 rounded-2xl bg-muted/50 p-3 text-center',
              'motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-md',
            )}
          >
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-card shadow-sm">
              {room.iconUrl ? (
                <Image
                  src={room.iconUrl}
                  alt={room.title}
                  width={64}
                  height={64}
                  className="size-full object-cover"
                  sizes="64px"
                />
              ) : (
                <ImageIcon className="size-8 text-muted-foreground" aria-hidden />
              )}
            </div>
            <span className="line-clamp-2 text-xs font-medium leading-tight text-foreground">
              {room.title}
            </span>
          </Link>
        ))}
      </section>
      <div className="mt-3 flex justify-center">
        <Link
          href="/browse"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver todos os ambientes
        </Link>
      </div>
    </div>
  )
}

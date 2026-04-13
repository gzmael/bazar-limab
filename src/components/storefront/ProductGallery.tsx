'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { useNavVisibility } from '@/components/storefront/NavVisibilityProvider'

type Slide = { src: string; alt: string }

type Props = {
  slides: Slide[]
  productTitle: string
}

export function ProductGallery({ slides, productTitle }: Props) {
  const [index, setIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const { setNavVisible } = useNavVisibility()

  const safeSlides = slides.length > 0 ? slides : []
  const current = safeSlides[index] ?? safeSlides[0]

  const openFs = useCallback(() => {
    setFullscreen(true)
    setNavVisible(false)
  }, [setNavVisible])

  const closeFs = useCallback(() => {
    setFullscreen(false)
    setNavVisible(true)
  }, [setNavVisible])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFs()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen, closeFs])

  if (!current) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        Sem fotos
      </div>
    )
  }

  const go = (dir: -1 | 1) => {
    setIndex((i) => {
      const n = safeSlides.length
      if (n < 2) return i
      return (i + dir + n) % n
    })
  }

  return (
    <div className="relative w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 28rem"
          priority={index === 0}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        {safeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow backdrop-blur-sm motion-safe:active:scale-95"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow backdrop-blur-sm motion-safe:active:scale-95"
              aria-label="Próxima foto"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={openFs}
          className="absolute bottom-2 right-2 rounded-md bg-background/85 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm"
        >
          Tela cheia
        </button>
      </div>
      {safeSlides.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {safeSlides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              className={`size-2 rounded-full motion-safe:transition-colors ${i === index ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              aria-label={`Ir para foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-label={`Fotos de ${productTitle}`}
        >
          <div className="flex items-center justify-end p-2">
            <button
              type="button"
              onClick={closeFs}
              className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Fechar"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {safeSlides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="size-7" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
                  aria-label="Próxima"
                >
                  <ChevronRight className="size-7" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

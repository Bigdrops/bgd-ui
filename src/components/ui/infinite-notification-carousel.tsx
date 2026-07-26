import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/lib/utils'

interface NotificationSlide {
  type: string
  ref: string
  client: string
  amount: string
  time: string
  desc: string
}

interface InfiniteNotificationCarouselProps {
  slides: NotificationSlide[]
  autoplayInterval?: number
  className?: string
  renderSlide?: (slide: NotificationSlide, index: number) => React.ReactNode
  onSlideAction?: (slide: NotificationSlide) => void
}

function InfiniteNotificationCarousel({
  slides,
  autoplayInterval = 4500,
  className,
  renderSlide,
  onSlideAction,
}: InfiniteNotificationCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef(false)

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    if (!emblaApi || isPausedRef.current) return
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext()
    }, autoplayInterval)
  }, [emblaApi, autoplayInterval, stopAutoplay])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const snap = emblaApi.selectedScrollSnap()
      setSelectedIndex(snap)
    }

    const onPointerDown = () => {
      isPausedRef.current = true
      stopAutoplay()
    }

    const onPointerUp = () => {
      isPausedRef.current = false
      startAutoplay()
    }

    const onSettle = () => {
      if (!isPausedRef.current) {
        startAutoplay()
      }
    }

    emblaApi.on('select', onSelect)
    emblaApi.on('pointerDown', onPointerDown)
    emblaApi.on('pointerUp', onPointerUp)
    emblaApi.on('settle', onSettle)

    onSelect()
    startAutoplay()

    return () => {
      stopAutoplay()
      emblaApi.off('select', onSelect)
      emblaApi.off('pointerDown', onPointerDown)
      emblaApi.off('pointerUp', onPointerUp)
      emblaApi.off('settle', onSettle)
    }
  }, [emblaApi, startAutoplay, stopAutoplay])

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const defaultRenderSlide = (slide: NotificationSlide) => (
    <div className="select-none">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="bg-[#043f2e] text-[#c8f169] text-[10px] font-semibold px-2 py-0.5 rounded-[4px] uppercase tracking-[0.06em]">
            {slide.type}
          </span>
          <span className="text-xs font-mono text-[#242423]">{slide.ref}</span>
        </div>
        <span className="text-[10px] text-[#767676] font-mono">{slide.time}</span>
      </div>

      <div className="py-1">
        <h3 className="text-sm font-semibold text-[#043f2e]">{slide.client}</h3>
        <p className="text-xs text-[#242423] mt-0.5">{slide.desc}</p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#043f2e]/10 flex items-center justify-between">
        <span className="font-serif text-lg text-[#043f2e]">{slide.amount}</span>
        <button
          onClick={() => onSlideAction?.(slide)}
          className="bg-[#c8f169] text-[#000000] text-xs font-semibold px-3 py-1.5 rounded-[4px] transition-transform active:scale-95 flex items-center space-x-1 uppercase tracking-[0.06em]"
        >
          <span>View File</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.ref}
              className="min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
            >
              {renderSlide ? renderSlide(slide, index) : defaultRenderSlide(slide)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-1.5 mt-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === selectedIndex ? 'w-5 bg-[#043f2e]' : 'w-1.5 bg-[#043f2e]/20'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export { InfiniteNotificationCarousel }
export type { NotificationSlide }

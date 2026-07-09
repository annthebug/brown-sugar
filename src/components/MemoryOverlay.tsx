import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { MemoryEntry } from '../stores/useGalleryStore'

type MemoryOverlayProps = {
  memory: MemoryEntry
  onContinue: () => void
}

export function MemoryOverlay({ memory, onContinue }: MemoryOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const pixelRef = useRef<HTMLDivElement | null>(null)
  const photoRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.set([photoRef.current, buttonRef.current], {
        opacity: 0,
        y: 18,
      })

      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28 })
        .fromTo(
          pixelRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.35 },
          '<',
        )
        .to(pixelRef.current, { opacity: 0.34, duration: 0.42 })
        .to(photoRef.current, { opacity: 1, y: 0, duration: 0.58 }, '-=0.18')
        .to(buttonRef.current, { opacity: 1, y: 0, duration: 0.34 }, '-=0.12')
    }, overlayRef)

    return () => {
      context.revert()
    }
  }, [memory.id])

  const handleContinue = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: onContinue,
    })
  }

  return (
    <div className="memory-overlay" ref={overlayRef} role="dialog" aria-modal="true">
      <div className="memory-overlay-card memory-overlay-card--photo-only">
        <div ref={pixelRef} className="memory-pixel-veil" aria-hidden="true" />
        <div ref={photoRef} className="memory-overlay-photo">
          <img src={memory.photoUrl} alt={`Memory ${memory.order}`} />
        </div>
        <button ref={buttonRef} type="button" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

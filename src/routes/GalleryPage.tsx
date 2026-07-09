import { useState } from 'react'
import { AppNav } from '../components/AppNav'
import { MemoryCard } from '../components/MemoryCard'
import { MemoryOverlay } from '../components/MemoryOverlay'
import { MEMORY_COUNT } from '../data/memories'
import { type MemoryEntry, useGalleryStore } from '../stores/useGalleryStore'

export function GalleryPage() {
  const [activeMemory, setActiveMemory] = useState<MemoryEntry | null>(null)
  const memories = useGalleryStore((state) => state.memories)
  const resetGallery = useGalleryStore((state) => state.resetGallery)
  const unlockedCount = memories.filter((memory) => memory.unlocked).length

  return (
    <main className="page-shell" aria-labelledby="gallery-title">
      <AppNav />
      <section className="page-card">
        <p className="eyebrow">Gallery</p>
        <h1 id="gallery-title">Memory Album</h1>
        <p className="hero-copy gallery-summary">
          {unlockedCount} / {MEMORY_COUNT} memories unlocked
        </p>
        <div className="memory-grid">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onReplay={() => setActiveMemory(memory)}
            />
          ))}
        </div>
        <button type="button" className="secondary-action page-action" onClick={resetGallery}>
          Reset gallery
        </button>
      </section>
      {activeMemory ? (
        <MemoryOverlay memory={activeMemory} onContinue={() => setActiveMemory(null)} />
      ) : null}
    </main>
  )
}

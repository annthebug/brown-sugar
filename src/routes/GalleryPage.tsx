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
        <p className="eyebrow">相簿</p>
        <h1 id="gallery-title">回憶相簿</h1>
        {memories.length === 0 ? (
          <p className="hero-copy gallery-empty-state">
            相簿裡還沒有回憶照片，之後放入的照片會在這裡出現。
          </p>
        ) : (
          <>
            <p className="hero-copy gallery-summary">
              {unlockedCount} / {MEMORY_COUNT} 張回憶已解鎖
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
          </>
        )}
        <button type="button" className="secondary-action page-action" onClick={resetGallery}>
          重設相簿
        </button>
      </section>
      {activeMemory ? (
        <MemoryOverlay memory={activeMemory} onContinue={() => setActiveMemory(null)} />
      ) : null}
    </main>
  )
}

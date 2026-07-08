import { useState } from 'react'
import { AppNav } from '../components/AppNav'
import { MemoryOverlay } from '../components/MemoryOverlay'
import { type MemoryEntry, useGalleryStore } from '../stores/useGalleryStore'

export function GalleryPage() {
  const [activeMemory, setActiveMemory] = useState<MemoryEntry | null>(null)
  const memories = useGalleryStore((state) => state.memories)
  const resetGallery = useGalleryStore((state) => state.resetGallery)

  return (
    <main className="page-shell" aria-labelledby="gallery-title">
      <AppNav />
      <section className="page-card">
        <p className="eyebrow">Gallery</p>
        <h1 id="gallery-title">Memory Album</h1>
        {memories.length > 0 ? (
          <div className="memory-grid">
            {memories.map((memory, index) => (
              <article key={memory.id} className="memory-card">
                <div className="memory-photo-frame">
                  {memory.unlocked ? (
                    <img src={memory.photoUrl} alt={`Memory ${index + 1}`} />
                  ) : (
                    <span aria-label="Locked memory">?</span>
                  )}
                </div>
                <div>
                  <p className="panel-label">{memory.dateLabel}</p>
                  <strong>{memory.title}</strong>
                  <p>{memory.unlocked ? memory.caption : 'Collect 100 Memory Shards to unlock.'}</p>
                </div>
                <button
                  type="button"
                  disabled={!memory.unlocked}
                  onClick={() => setActiveMemory(memory)}
                >
                  Replay memory
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="hero-copy">把照片放進 assets/memories 後，相簿會自動載入。</p>
        )}
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

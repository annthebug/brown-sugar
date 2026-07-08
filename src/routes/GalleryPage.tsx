import { AppNav } from '../components/AppNav'
import { useGalleryStore } from '../stores/useGalleryStore'

export function GalleryPage() {
  const memories = useGalleryStore((state) => state.memories)
  const unlockMemory = useGalleryStore((state) => state.unlockMemory)
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
                <button type="button" onClick={() => unlockMemory(memory.id)}>
                  Unlock
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
    </main>
  )
}

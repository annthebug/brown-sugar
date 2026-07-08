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
        <p className="hero-copy">
          這裡先用佔位回憶驗證 Gallery store 的解鎖與持久化。
        </p>
        <div className="memory-grid">
          {memories.map((memory) => (
            <article key={memory.id} className="memory-card">
              <span>{memory.unlocked ? 'Unlocked' : 'Locked'}</span>
              <h2>{memory.title}</h2>
              <p>{memory.unlocked ? memory.caption : '收集更多碎片後解鎖。'}</p>
              <button type="button" onClick={() => unlockMemory(memory.id)}>
                Unlock
              </button>
            </article>
          ))}
        </div>
        <button type="button" className="secondary-action page-action" onClick={resetGallery}>
          Reset gallery
        </button>
      </section>
    </main>
  )
}

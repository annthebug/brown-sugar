import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'

const memoryPreviewItems = [
  'Collect Memory Shards',
  'Talk with gentle NPCs',
  'Find the glass matcha bowl',
]

export function HomePage() {
  return (
    <main className="home-shell" aria-labelledby="home-title">
      <AppNav />
      <section className="hero-card">
        <p className="eyebrow">Pixel RPG Story Adventure</p>
        <h1 id="home-title">Quest for the Perfect Bowl</h1>
        <p className="hero-copy">
          跟著黑糖在淡藍天空下旅行，收集回憶碎片，找回那只玻璃抹茶碗。
        </p>
        <div className="hero-actions" aria-label="Game actions">
          <Link to="/game">Start</Link>
          <Link to="/gallery" className="secondary-action">
            Gallery
          </Link>
        </div>
      </section>

      <section className="journey-panel" aria-label="Journey preview">
        <div className="pixel-cat" aria-hidden="true">
          <span className="cat-ear left-ear" />
          <span className="cat-ear right-ear" />
          <span className="cat-face">ฅ</span>
        </div>
        <ul>
          {memoryPreviewItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

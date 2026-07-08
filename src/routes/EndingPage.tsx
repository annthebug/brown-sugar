import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { useGalleryStore } from '../stores/useGalleryStore'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

export function EndingPage() {
  const memoryShards = useGameStore((state) => state.memoryShards)
  const unlockedCount = useGalleryStore(
    (state) => state.memories.filter((memory) => memory.unlocked).length,
  )
  const scores = useMbtiStore((state) => state.scores)

  return (
    <main className="page-shell" aria-labelledby="ending-title">
      <AppNav />
      <section className="page-card">
        <p className="eyebrow">Ending Preview</p>
        <h1 id="ending-title">The Bowl Is Waiting</h1>
        <p className="hero-copy">
          結局頁先彙整 stores 狀態，未來會接上玻璃碗生成、寶箱與 Credits。
        </p>
        <dl className="ending-summary">
          <div>
            <dt>Memory Shards</dt>
            <dd>{memoryShards}</dd>
          </div>
          <div>
            <dt>Unlocked Memories</dt>
            <dd>{unlockedCount}</dd>
          </div>
          <div>
            <dt>E/I Score</dt>
            <dd>{scores.EI}</dd>
          </div>
        </dl>
        <Link to="/game" className="page-link">
          Continue journey
        </Link>
      </section>
    </main>
  )
}

import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { PhaserGame } from '../components/PhaserGame'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

export function GamePage() {
  const memoryShards = useGameStore((state) => state.memoryShards)
  const collectMemoryShard = useGameStore((state) => state.collectMemoryShard)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const eiScore = useMbtiStore((state) => state.scores.EI)
  const answerQuestion = useMbtiStore((state) => state.answerQuestion)

  return (
    <main className="game-shell" aria-labelledby="game-title">
      <AppNav />
      <header className="game-header">
        <Link to="/" className="back-link">
          Home
        </Link>
        <div>
          <p className="eyebrow">Task 003 · Router + Zustand</p>
          <h1 id="game-title">Pale Blue Sky Scene</h1>
        </div>
      </header>
      <PhaserGame />
      <section className="store-panel" aria-label="Game store controls">
        <div>
          <p className="panel-label">Memory Shards</p>
          <strong>{memoryShards} / 100</strong>
        </div>
        <button type="button" onClick={collectMemoryShard}>
          Collect shard
        </button>
        <button type="button" className="secondary-action" onClick={resetProgress}>
          Reset progress
        </button>
        <div>
          <p className="panel-label">Hidden E/I score</p>
          <strong>{eiScore}</strong>
        </div>
        <button type="button" onClick={() => answerQuestion('EI', 'first')}>
          Choose lively path
        </button>
      </section>
    </main>
  )
}

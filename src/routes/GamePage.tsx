import { PhaserGame } from '../components/PhaserGame'

export function GamePage() {
  return (
    <main className="game-shell" aria-labelledby="game-title">
      <header className="game-header">
        <a href="/" className="back-link">
          Home
        </a>
        <div>
          <p className="eyebrow">Task 002 · Phaser Integration</p>
          <h1 id="game-title">Pale Blue Sky Scene</h1>
        </div>
      </header>
      <PhaserGame />
    </main>
  )
}

import { AchievementPanel } from '../components/AchievementPanel'
import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { getGameRouteForChapter, hasContinuableProgress } from '../data/chapters'
import { usePwaInstall } from '../services/pwa'
import { useAchievementStore } from '../stores/useAchievementStore'
import { useGameStore } from '../stores/useGameStore'

const memoryPreviewItems = [
  'Collect Memory Shards',
  'Talk with gentle NPCs',
  'Find the glass matcha bowl',
]

export function HomePage() {
  const currentChapter = useGameStore((state) => state.currentChapter)
  const memoryShards = useGameStore((state) => state.memoryShards)
  const totalMemoryShards = useGameStore((state) => state.totalMemoryShards)
  const forestChapterCleared = useGameStore((state) => state.forestChapterCleared)
  const unlockedAchievementIds = useAchievementStore((state) => state.unlockedIds)
  const { canInstall, isInstalled, install } = usePwaInstall()
  const canContinue = hasContinuableProgress({
    currentChapter,
    memoryShards,
    totalMemoryShards,
    forestChapterCleared,
  })

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
          {canContinue ? (
            <Link to={getGameRouteForChapter(currentChapter)} className="secondary-action">
              Continue · {currentChapter}
            </Link>
          ) : (
            <button type="button" className="secondary-action" disabled>
              Continue
            </button>
          )}
          <Link to="/gallery" className="secondary-action">
            Gallery
          </Link>
          <Link to="/settings" className="secondary-action">
            Settings
          </Link>
        </div>
        <div className="pwa-install-panel" aria-label="Install game">
          <p className="panel-label">PWA</p>
          <strong>{isInstalled ? 'Installed on this device' : 'Install to your home screen'}</strong>
          <span>
            {isInstalled
              ? 'Launch the journey like an app, even when the network is quiet.'
              : 'Save the game as a standalone app and keep core assets ready for offline launch.'}
          </span>
          {canInstall ? (
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                void install()
              }}
            >
              Install App
            </button>
          ) : (
            <button type="button" className="secondary-action" disabled>
              {isInstalled ? 'Installed' : 'Install available on supported devices'}
            </button>
          )}
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
      <AchievementPanel unlockedIds={unlockedAchievementIds} />
    </main>
  )
}

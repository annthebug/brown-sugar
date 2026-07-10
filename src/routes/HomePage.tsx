import { AchievementPanel } from '../components/AchievementPanel'
import { BlackSugarSprite } from '../components/BlackSugarSprite'
import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { CHAPTER_DISPLAY_NAMES, getGameRouteForChapter, hasContinuableProgress } from '../data/chapters'
import { useAchievementStore } from '../stores/useAchievementStore'
import { useGameStore } from '../stores/useGameStore'

const memoryPreviewItems = [
  '收集回憶碎片',
  '和溫柔的 NPC 對話',
  '找回玻璃抹茶碗',
]

export function HomePage() {
  const currentChapter = useGameStore((state) => state.currentChapter)
  const memoryShards = useGameStore((state) => state.memoryShards)
  const totalMemoryShards = useGameStore((state) => state.totalMemoryShards)
  const forestChapterCleared = useGameStore((state) => state.forestChapterCleared)
  const unlockedAchievementIds = useAchievementStore((state) => state.unlockedIds)
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
        <p className="eyebrow">像素冒險物語</p>
        <h1 id="home-title">Quest for the Perfect Bowl</h1>
        <p className="hero-copy">
          跟著黑糖在淡藍天空下旅行，收集回憶碎片，找回那只玻璃抹茶碗。
        </p>
        <div className="hero-actions" aria-label="遊戲操作">
          <Link to="/game">開始旅程</Link>
          {canContinue ? (
            <Link to={getGameRouteForChapter(currentChapter)} className="secondary-action">
              繼續旅程 · {CHAPTER_DISPLAY_NAMES[currentChapter]}
            </Link>
          ) : (
            <button type="button" className="secondary-action" disabled>
              繼續旅程
            </button>
          )}
          <Link to="/gallery" className="secondary-action">
            回憶相簿
          </Link>
          <Link to="/settings" className="secondary-action">
            設定
          </Link>
        </div>
      </section>

      <section className="journey-panel" aria-label="旅程預覽">
        <BlackSugarSprite
          styleOverrides={{
            backgroundSize: '700px 600px',
            backgroundPosition: '-10px 0',
          }}
        />
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

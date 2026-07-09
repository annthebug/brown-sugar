import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { MBTI_QUESTION_COUNT } from '../data/mbti'
import {
  MBTI_BOWL_NAMES,
  MBTI_BOWL_SHEET_URL,
  getBowlAssetKey,
  getBowlIdForType,
  getBowlSheetBackgroundPosition,
} from '../services/mbti'
import { useGalleryStore } from '../stores/useGalleryStore'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

export function EndingPage() {
  const memoryShards = useGameStore((state) => state.memoryShards)
  const unlockedCount = useGalleryStore(
    (state) => state.memories.filter((memory) => memory.unlocked).length,
  )
  const answeredCount = useMbtiStore((state) => state.answeredQuestionIds.length)
  const scores = useMbtiStore((state) => state.scores)
  const isComplete = useMbtiStore((state) => state.isComplete())
  const mbtiResult = useMbtiStore((state) => state.getMbtiResult())

  const bowlId = mbtiResult ? getBowlIdForType(mbtiResult) : null
  const bowlName = mbtiResult ? MBTI_BOWL_NAMES[mbtiResult] : null

  return (
    <main className="page-shell" aria-labelledby="ending-title">
      <AppNav />
      <section className="page-card ending-card">
        <p className="eyebrow">Ending Preview</p>
        <h1 id="ending-title">The Bowl Is Waiting</h1>
        <p className="hero-copy">
          當所有隱藏式對話完成後，黑糖的玻璃抹茶碗會依照內在傾向顯現不同花紋。
        </p>

        <section className="ending-mbti-panel" aria-label="MBTI result">
          <p className="panel-label">Hidden journey answers</p>
          <p className="ending-mbti-progress">
            {answeredCount} / {MBTI_QUESTION_COUNT} questions answered
          </p>

          {isComplete && mbtiResult && bowlId && bowlName ? (
            <div className="ending-bowl-reveal">
              <div
                className="ending-bowl-frame"
                role="img"
                aria-label={`${mbtiResult} glass bowl`}
                style={{
                  backgroundImage: `url(${MBTI_BOWL_SHEET_URL})`,
                  backgroundPosition: getBowlSheetBackgroundPosition(mbtiResult),
                }}
              />
              <div className="ending-bowl-meta">
                <p className="panel-label">Your bowl pattern</p>
                <strong className="ending-mbti-type">{mbtiResult}</strong>
                <p className="ending-bowl-name">{bowlName}</p>
                <p className="ending-bowl-asset">
                  Asset key: <code>{getBowlAssetKey()}</code> · frame <code>{bowlId}</code>
                </p>
              </div>
            </div>
          ) : (
            <p className="hero-copy ending-mbti-pending">
              完成五章對話中的所有選項後，這裡會顯示四碼結果與對應玻璃碗。
            </p>
          )}
        </section>

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
            <dt>MBTI Progress</dt>
            <dd>
              {answeredCount}/{MBTI_QUESTION_COUNT}
            </dd>
          </div>
        </dl>

        <dl className="ending-score-grid" aria-label="Dimension scores">
          <div>
            <dt>E / I</dt>
            <dd>{scores.EI}</dd>
          </div>
          <div>
            <dt>S / N</dt>
            <dd>{scores.SN}</dd>
          </div>
          <div>
            <dt>T / F</dt>
            <dd>{scores.TF}</dd>
          </div>
          <div>
            <dt>J / P</dt>
            <dd>{scores.JP}</dd>
          </div>
        </dl>

        <Link to="/game" className="page-link">
          Continue journey
        </Link>
      </section>
    </main>
  )
}

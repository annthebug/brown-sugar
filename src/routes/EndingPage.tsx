import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
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
import { ENDING_BLACK_SUGAR_SLEEP_URL } from '../game/assets/assetManifest'

export function EndingPage() {
  const memoryShards = useGameStore((state) => state.memoryShards)
  const gameCompleted = useGameStore((state) => state.gameCompleted)
  const endingRef = useRef<HTMLElement | null>(null)
  const revealRef = useRef<HTMLDivElement | null>(null)
  const photoRef = useRef<HTMLDivElement | null>(null)
  const sleepRef = useRef<HTMLDivElement | null>(null)
  const creditsViewportRef = useRef<HTMLDivElement | null>(null)
  const creditsTrackRef = useRef<HTMLDivElement | null>(null)
  const unlockedCount = useGalleryStore(
    (state) => state.memories.filter((memory) => memory.unlocked).length,
  )
  const answeredCount = useMbtiStore((state) => state.answeredQuestionIds.length)
  const scores = useMbtiStore((state) => state.scores)
  const isComplete = useMbtiStore((state) => state.isComplete())
  const mbtiResult = useMbtiStore((state) => state.getMbtiResult())

  const bowlId = mbtiResult ? getBowlIdForType(mbtiResult) : null
  const bowlName = mbtiResult ? MBTI_BOWL_NAMES[mbtiResult] : null
  const generatedBowlStyle =
    isComplete && mbtiResult
      ? {
          backgroundImage: `url(${MBTI_BOWL_SHEET_URL})`,
          backgroundPosition: getBowlSheetBackgroundPosition(mbtiResult),
        }
      : undefined

  const credits = useMemo(
    () => [
      '尋找完美的碗',
      '',
      '黑糖',
      '一路收集的回憶',
      '終於足夠的那只碗',
      '',
      `MBTI 結果 · ${mbtiResult ?? '尚未完成'}`,
      bowlName ?? '你的玻璃碗還在等待顯現',
      '',
      `回憶碎片 · ${memoryShards}`,
      `已解鎖回憶 · ${unlockedCount}`,
      '',
      '有些禮物，不需要完美。',
      '真正重要的是裡面的心意。',
      '',
      '謝謝你溫柔地走到最後。',
    ],
    [bowlName, mbtiResult, memoryShards, unlockedCount],
  )

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (!revealRef.current || !photoRef.current || !sleepRef.current) {
        return
      }

      gsap.set([revealRef.current, photoRef.current, sleepRef.current], {
        opacity: 0,
        y: 18,
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
      })

      timeline
        .to(revealRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(photoRef.current, { opacity: 1, y: 0, duration: 0.75 }, '-=0.18')
        .to(sleepRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.1')

      if (creditsViewportRef.current && creditsTrackRef.current) {
        const distance = Math.max(creditsTrackRef.current.scrollHeight - creditsViewportRef.current.clientHeight + 72, 0)

        if (distance > 0) {
          timeline.fromTo(
            creditsTrackRef.current,
            { y: 0 },
            {
              y: -distance,
              duration: 18,
              ease: 'none',
            },
            '-=0.1',
          )
        }
      }
    }, endingRef)

    return () => {
      context.revert()
    }
  }, [credits, gameCompleted, isComplete, mbtiResult])

  return (
    <main ref={endingRef} className="page-shell" aria-labelledby="ending-title">
      <AppNav />
      <section className="page-card ending-card">
        <p className="eyebrow">{gameCompleted ? '結局' : '結局預覽'}</p>
        <h1 id="ending-title">玻璃碗回家了</h1>
        <p className="hero-copy">
          當所有隱藏式對話完成後，黑糖的玻璃抹茶碗會依照內在傾向顯現不同花紋。
        </p>
        <p className="hero-copy">
          {gameCompleted ? '黑糖已經把心意安穩地送到了終點。' : '終章尚未完成，這裡先顯示結局預覽。'}
        </p>

        <section ref={revealRef} className="ending-reveal-flow" aria-label="結局揭示流程">
          <section className="ending-mbti-panel" aria-label="MBTI 結果">
            <p className="panel-label">旅途中悄悄留下的答案</p>
            <p className="ending-mbti-progress">
              {answeredCount} / {MBTI_QUESTION_COUNT} 題已回答
            </p>

            {isComplete && mbtiResult && bowlId && bowlName ? (
              <div className="ending-bowl-reveal">
                <div
                  className="ending-bowl-影格"
                  role="img"
                  aria-label={`${mbtiResult} 玻璃碗`}
                  style={generatedBowlStyle}
                />
                <div className="ending-bowl-meta">
                  <p className="panel-label">你的碗紋樣</p>
                  <strong className="ending-mbti-type">{mbtiResult}</strong>
                  <p className="ending-bowl-name">{bowlName}</p>
                  <p className="ending-bowl-asset">
                    素材鍵： <code>{getBowlAssetKey()}</code> · 影格 <code>{bowlId}</code>
                  </p>
                </div>
              </div>
            ) : (
              <p className="hero-copy ending-mbti-pending">
                完成五章對話中的所有選項後，這裡會顯示四碼結果與對應玻璃碗。
              </p>
            )}
          </section>

          <section className="ending-photo-section" aria-label="玻璃碗揭示">
            <div ref={photoRef} className="ending-photo-card">
              <div className="ending-photo-header">
                <span>真正的玻璃碗</span>
                <span>{mbtiResult ?? '尚未完成'}</span>
              </div>
              <div
                className="ending-photo-bowl"
                role="img"
                aria-label={mbtiResult ? `${mbtiResult} 最終玻璃碗` : '最終玻璃碗'}
                style={generatedBowlStyle}
              />
              <p className="ending-photo-copy">
                留下的不是更完美的形狀，而是終於願意停下來珍惜的心意。
              </p>
            </div>
          </section>

          <section ref={sleepRef} className="ending-sleep-section" aria-label="黑糖休息中">
            <div className="ending-rest-scene">
              <img
                className="ending-black-sugar-sleep-art"
                src={ENDING_BLACK_SUGAR_SLEEP_URL}
                alt="黑糖在地毯上安穩地睡著"
                draggable={false}
              />
            </div>
          </section>

          <section className="ending-credits-card" aria-label="製作名單">
            <p className="panel-label">製作名單</p>
            <div ref={creditsViewportRef} className="ending-credits-viewport">
              <div ref={creditsTrackRef} className="ending-credits-track">
                {credits.map((line, index) => (
                  <p key={`${line}-${index}`} className={index === 0 ? 'ending-credits-title' : 'ending-credits-line'}>
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </section>

        <dl className="ending-summary">
          <div>
            <dt>回憶碎片</dt>
            <dd>{memoryShards}</dd>
          </div>
          <div>
            <dt>已解鎖回憶</dt>
            <dd>{unlockedCount}</dd>
          </div>
          <div>
            <dt>MBTI 進度</dt>
            <dd>
              {answeredCount}/{MBTI_QUESTION_COUNT}
            </dd>
          </div>
          <div>
            <dt>旅程</dt>
            <dd>{gameCompleted ? '已完成' : '進行中'}</dd>
          </div>
        </dl>

        <dl className="ending-score-grid" aria-label="向度分數">
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
          繼續旅程
        </Link>
      </section>
    </main>
  )
}

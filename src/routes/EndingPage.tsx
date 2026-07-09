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

export function EndingPage() {
  const memoryShards = useGameStore((state) => state.memoryShards)
  const gameCompleted = useGameStore((state) => state.gameCompleted)
  const endingRef = useRef<HTMLElement | null>(null)
  const revealRef = useRef<HTMLDivElement | null>(null)
  const chestRef = useRef<HTMLDivElement | null>(null)
  const chestLidRef = useRef<HTMLDivElement | null>(null)
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
      'Quest for the Perfect Bowl',
      '',
      'Black Sugar',
      'The memories you gathered',
      'The bowl that became enough',
      '',
      `MBTI Result · ${mbtiResult ?? 'Pending'}`,
      bowlName ?? 'Your glass bowl is still waiting',
      '',
      `Memory Shards · ${memoryShards}`,
      `Unlocked Memories · ${unlockedCount}`,
      '',
      'Some gifts do not need perfection.',
      'What matters is the heart inside them.',
      '',
      'Thank you for walking gently to the end.',
    ],
    [bowlName, mbtiResult, memoryShards, unlockedCount],
  )

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (!revealRef.current || !chestRef.current || !chestLidRef.current || !photoRef.current || !sleepRef.current) {
        return
      }

      gsap.set([revealRef.current, photoRef.current, sleepRef.current], {
        opacity: 0,
        y: 18,
      })
      gsap.set(chestLidRef.current, {
        rotate: 0,
        transformOrigin: '50% 100%',
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
      })

      timeline
        .to(revealRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          chestRef.current,
          { scale: 0.92, y: 12 },
          { scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.6)' },
          '-=0.18',
        )
        .to(chestRef.current, { y: -8, duration: 0.28, yoyo: true, repeat: 1, ease: 'sine.inOut' })
        .to(chestLidRef.current, { rotate: -22, y: -22, x: -8, duration: 0.65, ease: 'power3.out' })
        .to(photoRef.current, { opacity: 1, y: 0, duration: 0.75 }, '-=0.2')
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
        <p className="eyebrow">{gameCompleted ? 'Ending' : 'Ending Preview'}</p>
        <h1 id="ending-title">The Bowl Is Home</h1>
        <p className="hero-copy">
          當所有隱藏式對話完成後，黑糖的玻璃抹茶碗會依照內在傾向顯現不同花紋。
        </p>
        <p className="hero-copy">
          {gameCompleted ? '黑糖已經把心意平穩地送到終點。' : '終章尚未完成，這裡先顯示結局預覽。'}
        </p>

        <section ref={revealRef} className="ending-reveal-flow" aria-label="Ending reveal flow">
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
                  style={generatedBowlStyle}
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

          <section className="ending-chest-section" aria-label="Treasure chest reveal">
            <div ref={chestRef} className="ending-chest">
              <div ref={chestLidRef} className="ending-chest-lid" />
              <div className="ending-chest-body" />
              <div className="ending-chest-lock" />
              <div className="ending-chest-glow" />
            </div>
            <div ref={photoRef} className="ending-photo-card">
              <div className="ending-photo-header">
                <span>True Bowl Keepsake</span>
                <span>{mbtiResult ?? 'Pending'}</span>
              </div>
              <div
                className="ending-photo-bowl"
                role="img"
                aria-label={mbtiResult ? `${mbtiResult} final glass bowl keepsake` : 'Final glass bowl keepsake'}
                style={generatedBowlStyle}
              />
              <p className="ending-photo-copy">
                寶箱打開後，留下的不是更完美的形狀，而是終於願意停下來珍惜的心意。
              </p>
            </div>
          </section>

          <section ref={sleepRef} className="ending-sleep-section" aria-label="Black Sugar resting">
            <div className="ending-rest-scene">
              <div className="ending-rest-bowl" aria-hidden="true" />
              <div className="ending-black-sugar-sleep" aria-hidden="true">
                <span className="sleep-ear sleep-ear--left" />
                <span className="sleep-ear sleep-ear--right" />
                <span className="sleep-body" />
                <span className="sleep-tail" />
                <span className="sleep-paw sleep-paw--left" />
                <span className="sleep-paw sleep-paw--right" />
                <span className="sleep-zzz">zZ</span>
              </div>
            </div>
          </section>

          <section className="ending-credits-card" aria-label="Credits">
            <p className="panel-label">Credits</p>
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
          <div>
            <dt>Journey</dt>
            <dd>{gameCompleted ? 'Completed' : 'In progress'}</dd>
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

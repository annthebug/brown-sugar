import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { DialogueBox } from '../components/DialogueBox'
import { MemoryOverlay } from '../components/MemoryOverlay'
import { PauseMenu } from '../components/PauseMenu'
import { PhaserGame, type PhaserGameHandle } from '../components/PhaserGame'
import { CHAPTER_LABELS, getPlayableChapter } from '../data/chapters'
import { MBTI_QUESTION_COUNT } from '../data/mbti'
import {
  DIALOGUE_SCRIPTS,
  type DialogueChoice,
  type DialogueChoiceResult,
  type DialogueScriptId,
} from '../data/dialogues'
import { gameEventBus } from '../game/events/eventBus'
import { type MemoryEntry, useGalleryStore } from '../stores/useGalleryStore'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

const CITY_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  cityBarista: 'cityBarista',
  cityTraveler: 'cityTraveler',
  timeMonster: 'timeMonster',
}

function resolveDialogueId(npcId?: string): DialogueScriptId | null {
  if (!npcId) {
    return null
  }

  if (npcId === 'forestElder') {
    return 'forestElder'
  }

  return CITY_NPC_DIALOGUES[npcId] ?? null
}

export function GamePage() {
  const phaserRef = useRef<PhaserGameHandle>(null)
  const [memoryQueue, setMemoryQueue] = useState<MemoryEntry[]>([])
  const [activeDialogueId, setActiveDialogueId] = useState<DialogueScriptId | null>(null)
  const [lastDialogueChoice, setLastDialogueChoice] = useState<string>('No dialogue choice yet')
  const [isPaused, setIsPaused] = useState(false)
  const memoryShards = useGameStore((state) => state.memoryShards)
  const totalMemoryShards = useGameStore((state) => state.totalMemoryShards)
  const currentChapter = useGameStore((state) => state.currentChapter)
  const forestChapterCleared = useGameStore((state) => state.forestChapterCleared)
  const cityChapterCleared = useGameStore((state) => state.cityChapterCleared)
  const collectMemoryShards = useGameStore((state) => state.collectMemoryShards)
  const completeForestChapter = useGameStore((state) => state.completeForestChapter)
  const completeCityChapter = useGameStore((state) => state.completeCityChapter)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const unlockNextMemory = useGalleryStore((state) => state.unlockNextMemory)
  const unlockMemoryByNumber = useGalleryStore((state) => state.unlockMemoryByNumber)
  const answeredQuestionIds = useMbtiStore((state) => state.answeredQuestionIds)
  const answerQuestion = useMbtiStore((state) => state.answerQuestion)
  const resetMbtiScores = useMbtiStore((state) => state.resetScores)
  const isMbtiComplete = useMbtiStore((state) => state.isComplete())
  const mbtiResult = useMbtiStore((state) => state.getMbtiResult())
  const activeMemory = memoryQueue[0]
  const activeDialogue = activeDialogueId ? DIALOGUE_SCRIPTS[activeDialogueId] : null

  const playableChapter = useMemo(
    () =>
      getPlayableChapter({
        requestedChapter: null,
        currentChapter,
        forestChapterCleared,
        cityChapterCleared,
      }),
    [cityChapterCleared, currentChapter, forestChapterCleared],
  )

  const chapterMeta = CHAPTER_LABELS[playableChapter]
  const chapterProgressHint = cityChapterCleared
    ? 'City cleared'
    : forestChapterCleared
      ? chapterMeta.hint
      : chapterMeta.hint

  const collectShards = useCallback(
    (amount: number) => {
      const result = collectMemoryShards(amount)
      const unlockedMemories = Array.from({ length: result.unlockedMemoryCount })
        .map(() => unlockNextMemory())
        .filter((memory): memory is MemoryEntry => memory !== null)

      if (unlockedMemories.length > 0) {
        setMemoryQueue((currentQueue) => [...currentQueue, ...unlockedMemories])
      }
    },
    [collectMemoryShards, unlockNextMemory],
  )

  const openDialogue = useCallback((dialogueId: DialogueScriptId) => {
    setActiveDialogueId(dialogueId)
  }, [])

  useEffect(() => {
    const unsubscribeShard = gameEventBus.on('memory-shard-collected', (payload) => {
      collectShards(payload.amount)
    })

    const unsubscribeTalk = gameEventBus.on('player:talk-start', (payload) => {
      const dialogueId = resolveDialogueId(payload.npcId)

      if (dialogueId) {
        openDialogue(dialogueId)
      }
    })

    const unsubscribeForestChapter = gameEventBus.on('chapter:forest-cleared', () => {
      completeForestChapter()
      const unlockedMemory = unlockMemoryByNumber(1)

      if (unlockedMemory) {
        setMemoryQueue((currentQueue) => [...currentQueue, unlockedMemory])
      }
    })

    const unsubscribeCityChapter = gameEventBus.on('chapter:city-cleared', () => {
      completeCityChapter()
      const unlockedMemory = unlockMemoryByNumber(2)

      if (unlockedMemory) {
        setMemoryQueue((currentQueue) => [...currentQueue, unlockedMemory])
      }
    })

    return () => {
      unsubscribeShard()
      unsubscribeTalk()
      unsubscribeForestChapter()
      unsubscribeCityChapter()
    }
  }, [collectShards, completeCityChapter, completeForestChapter, openDialogue, unlockMemoryByNumber])

  const handleChoiceResult = useCallback(
    (result: DialogueChoiceResult, choice: DialogueChoice) => {
      if (result.kind === 'mbti') {
        const recorded = answerQuestion(result.questionId, result.preference)
        setLastDialogueChoice(
          recorded
            ? choice.label
            : `${choice.label} (already answered — score unchanged)`,
        )
        return
      }

      if (result.kind === 'story' && result.trigger === 'time-monster-understood') {
        gameEventBus.emit('boss:time-monster-understood', {})
        setLastDialogueChoice(choice.label)
        return
      }

      setLastDialogueChoice(choice.label)
    },
    [answerQuestion],
  )

  const closeDialogue = useCallback(() => {
    setActiveDialogueId(null)
    gameEventBus.emit('dialogue:closed', {})
  }, [])

  const continueMemory = () => {
    setMemoryQueue((currentQueue) => currentQueue.slice(1))
  }

  const openPauseMenu = useCallback(() => {
    setIsPaused(true)
    phaserRef.current?.pauseActiveScene()
  }, [])

  const resumeGame = useCallback(() => {
    setIsPaused(false)
    phaserRef.current?.resumeActiveScene()
  }, [])

  const restartChapter = useCallback(() => {
    setIsPaused(false)
    setActiveDialogueId(null)
    setMemoryQueue([])
    phaserRef.current?.restartActiveScene()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }

      event.preventDefault()

      if (isPaused) {
        resumeGame()
        return
      }

      openPauseMenu()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPaused, openPauseMenu, resumeGame])

  return (
    <main className="game-shell" aria-labelledby="game-title">
      <AppNav />
      <header className="game-header">
        <Link to="/" className="back-link">
          Home
        </Link>
        <div>
          <p className="eyebrow">{chapterMeta.eyebrow}</p>
          <h1 id="game-title">{chapterMeta.title}</h1>
        </div>
      </header>
      <div className="game-playfield">
        <PhaserGame ref={phaserRef} isPaused={isPaused} />
        <button
          type="button"
          className="game-pause-button"
          aria-label="Pause game"
          onClick={openPauseMenu}
        >
          Pause
        </button>
      </div>
      <section className="store-panel" aria-label="Game store controls">
        <div>
          <p className="panel-label">Memory Shards</p>
          <strong>{memoryShards} / 100</strong>
          <span>{totalMemoryShards} total</span>
        </div>
        <div>
          <p className="panel-label">Chapter progress</p>
          <strong>{currentChapter}</strong>
          <span>{chapterProgressHint}</span>
        </div>
        <button type="button" onClick={() => collectShards(1)}>
          Collect shard
        </button>
        <button type="button" onClick={() => collectShards(100)}>
          Collect 100 shards
        </button>
        <button type="button" className="secondary-action" onClick={resetProgress}>
          Reset progress
        </button>
        <div>
          <p className="panel-label">MBTI progress</p>
          <strong>
            {answeredQuestionIds.length} / {MBTI_QUESTION_COUNT}
          </strong>
          <span>{isMbtiComplete && mbtiResult ? `Result: ${mbtiResult}` : lastDialogueChoice}</span>
        </div>
        <button type="button" onClick={() => openDialogue('forestElder')}>
          Talk to Forest Elder
        </button>
        <button type="button" onClick={() => openDialogue('cityBarista')}>
          Talk to Barista
        </button>
        <button type="button" onClick={() => openDialogue('cityTraveler')}>
          Talk to Traveler
        </button>
        <button type="button" onClick={() => openDialogue('timeMonster')}>
          Talk to Time Monster
        </button>
        <button type="button" onClick={() => openDialogue('snowSpirit')}>
          Talk to Snow Spirit
        </button>
        <button type="button" onClick={() => openDialogue('glassMaster')}>
          Talk to Glass Master
        </button>
        <button type="button" onClick={() => openDialogue('innerGuide')}>
          Talk to Inner Guide
        </button>
        <button type="button" className="secondary-action" onClick={resetMbtiScores}>
          Reset MBTI
        </button>
      </section>
      {activeDialogue ? (
        <DialogueBox
          script={activeDialogue}
          onChoiceResult={handleChoiceResult}
          onClose={closeDialogue}
        />
      ) : null}
      {activeMemory ? <MemoryOverlay memory={activeMemory} onContinue={continueMemory} /> : null}
      {isPaused ? <PauseMenu onResume={resumeGame} onRestart={restartChapter} /> : null}
    </main>
  )
}

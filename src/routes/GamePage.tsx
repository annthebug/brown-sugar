import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AchievementToastStack } from '../components/AchievementToastStack'
import { AppNav } from '../components/AppNav'
import { DialogueBox } from '../components/DialogueBox'
import { MemoryOverlay } from '../components/MemoryOverlay'
import { PauseMenu } from '../components/PauseMenu'
import { PhaserGame, type PhaserGameHandle } from '../components/PhaserGame'
import { TouchControlsOverlay } from '../components/TouchControlsOverlay'
import { useIsMobileGameShell } from '../hooks/useIsMobileGameShell'
import { useShouldShowTouchControls } from '../hooks/useShouldShowTouchControls'
import { CHAPTER_DISPLAY_NAMES, CHAPTER_LABELS, getPlayableChapter } from '../data/chapters'
import { MBTI_QUESTION_COUNT } from '../data/mbti'
import {
  DIALOGUE_SCRIPTS,
  type DialogueChoice,
  type DialogueChoiceResult,
  type DialogueScriptId,
} from '../data/dialogues'
import { gameEventBus } from '../game/events/eventBus'
import { ACHIEVEMENT_DEFINITIONS } from '../data/achievements'
import { type MemoryEntry, useGalleryStore } from '../stores/useGalleryStore'
import { useAchievementStore } from '../stores/useAchievementStore'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

const CITY_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  cityBarista: 'cityBarista',
  cityTraveler: 'cityTraveler',
  timeMonster: 'timeMonster',
}

const SNOW_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  snowSpirit: 'snowSpirit',
  snowSpiritBoss: 'snowSpiritBoss',
}

const GLASS_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  glassMaster: 'glassMaster',
  glassMasterBoss: 'glassMasterBoss',
}

const RETRY_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  innerGuide: 'innerGuide',
  innerDoubtBoss: 'innerDoubtBoss',
}

const FINAL_NPC_DIALOGUES: Record<string, DialogueScriptId> = {
  perfectionismBoss: 'perfectionismBoss',
}

function resolveDialogueId(npcId?: string): DialogueScriptId | null {
  if (!npcId) {
    return null
  }

  if (npcId === 'forestElder') {
    return 'forestElder'
  }

  return (
    CITY_NPC_DIALOGUES[npcId] ??
    SNOW_NPC_DIALOGUES[npcId] ??
    GLASS_NPC_DIALOGUES[npcId] ??
    RETRY_NPC_DIALOGUES[npcId] ??
    FINAL_NPC_DIALOGUES[npcId] ??
    null
  )
}

export function GamePage() {
  const navigate = useNavigate()
  const isMobileGameShell = useIsMobileGameShell()
  const shouldShowTouchControls = useShouldShowTouchControls()
  const phaserRef = useRef<PhaserGameHandle>(null)
  const [memoryQueue, setMemoryQueue] = useState<MemoryEntry[]>([])
  const [activeDialogueId, setActiveDialogueId] = useState<DialogueScriptId | null>(null)
  const [lastDialogueChoice, setLastDialogueChoice] = useState<string>('尚未做出對話選擇')
  const [isPaused, setIsPaused] = useState(false)
  const memoryShards = useGameStore((state) => state.memoryShards)
  const totalMemoryShards = useGameStore((state) => state.totalMemoryShards)
  const currentChapter = useGameStore((state) => state.currentChapter)
  const forestChapterCleared = useGameStore((state) => state.forestChapterCleared)
  const cityChapterCleared = useGameStore((state) => state.cityChapterCleared)
  const snowChapterCleared = useGameStore((state) => state.snowChapterCleared)
  const glassChapterCleared = useGameStore((state) => state.glassChapterCleared)
  const retryChapterCleared = useGameStore((state) => state.retryChapterCleared)
  const gameCompleted = useGameStore((state) => state.gameCompleted)
  const collectMemoryShards = useGameStore((state) => state.collectMemoryShards)
  const completeForestChapter = useGameStore((state) => state.completeForestChapter)
  const completeCityChapter = useGameStore((state) => state.completeCityChapter)
  const completeSnowChapter = useGameStore((state) => state.completeSnowChapter)
  const completeGlassChapter = useGameStore((state) => state.completeGlassChapter)
  const completeRetryChapter = useGameStore((state) => state.completeRetryChapter)
  const completeFinalStage = useGameStore((state) => state.completeFinalStage)
  const unlockNextMemory = useGalleryStore((state) => state.unlockNextMemory)
  const unlockMemoryByNumber = useGalleryStore((state) => state.unlockMemoryByNumber)
  const memories = useGalleryStore((state) => state.memories)
  const unlockedAchievementIds = useAchievementStore((state) => state.unlockedIds)
  const toastQueue = useAchievementStore((state) => state.toastQueue)
  const unlockAchievement = useAchievementStore((state) => state.unlockAchievement)
  const dismissToast = useAchievementStore((state) => state.dismissToast)
  const answeredQuestionIds = useMbtiStore((state) => state.answeredQuestionIds)
  const answerQuestion = useMbtiStore((state) => state.answerQuestion)
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
        snowChapterCleared,
        glassChapterCleared,
        retryChapterCleared,
      }),
    [cityChapterCleared, currentChapter, forestChapterCleared, glassChapterCleared, retryChapterCleared, snowChapterCleared],
  )

  const chapterMeta = CHAPTER_LABELS[playableChapter]
  const chapterProgressHint = gameCompleted
    ? '旅程完成'
    : retryChapterCleared
      ? chapterMeta.hint
    : glassChapterCleared
      ? chapterMeta.hint
      : snowChapterCleared
        ? chapterMeta.hint
        : cityChapterCleared
          ? chapterMeta.hint
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
    if (totalMemoryShards >= 1) {
      unlockAchievement('first-shard')
    }

    if (memories.some((memory) => memory.unlocked)) {
      unlockAchievement('first-memory')
    }

    if (forestChapterCleared) {
      unlockAchievement('forest-chapter')
    }

    if (memories.length > 0 && memories.every((memory) => memory.unlocked)) {
      unlockAchievement('all-memories')
    }

    if (isMbtiComplete) {
      unlockAchievement('mbti-complete')
    }

    if (gameCompleted) {
      unlockAchievement('journey-complete')
    }
  }, [
    forestChapterCleared,
    gameCompleted,
    isMbtiComplete,
    memories,
    totalMemoryShards,
    unlockAchievement,
  ])

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

    const unsubscribeSnowChapter = gameEventBus.on('chapter:snow-cleared', () => {
      completeSnowChapter()
      const unlockedMemory = unlockMemoryByNumber(3)

      if (unlockedMemory) {
        setMemoryQueue((currentQueue) => [...currentQueue, unlockedMemory])
      }
    })

    const unsubscribeGlassChapter = gameEventBus.on('chapter:glass-cleared', () => {
      completeGlassChapter()
      const unlockedMemory = unlockMemoryByNumber(4)

      if (unlockedMemory) {
        setMemoryQueue((currentQueue) => [...currentQueue, unlockedMemory])
      }
    })

    const unsubscribeRetryChapter = gameEventBus.on('chapter:retry-cleared', () => {
      completeRetryChapter()
      const unlockedMemory = unlockMemoryByNumber(5)

      if (unlockedMemory) {
        setMemoryQueue((currentQueue) => [...currentQueue, unlockedMemory])
      }
    })

    const unsubscribeFinalChapter = gameEventBus.on('chapter:final-cleared', () => {
      completeFinalStage()
      navigate('/ending')
    })

    return () => {
      unsubscribeShard()
      unsubscribeTalk()
      unsubscribeForestChapter()
      unsubscribeCityChapter()
      unsubscribeSnowChapter()
      unsubscribeGlassChapter()
      unsubscribeRetryChapter()
      unsubscribeFinalChapter()
    }
  }, [
    collectShards,
    completeCityChapter,
    completeForestChapter,
    completeGlassChapter,
    completeFinalStage,
    completeRetryChapter,
    completeSnowChapter,
    navigate,
    openDialogue,
    unlockMemoryByNumber,
  ])

  const handleChoiceResult = useCallback(
    (result: DialogueChoiceResult, choice: DialogueChoice) => {
      if (result.kind === 'mbti') {
        const recorded = answerQuestion(result.questionId, result.preference)
        setLastDialogueChoice(
          recorded
            ? choice.label
            : `${choice.label}（已回答，不重複計分）`,
        )
        return
      }

      if (result.kind === 'story' && result.trigger === 'time-monster-understood') {
        gameEventBus.emit('boss:time-monster-understood', {})
        setLastDialogueChoice(choice.label)
        return
      }

      if (result.kind === 'story' && result.trigger === 'snow-spirit-understood') {
        gameEventBus.emit('boss:snow-spirit-understood', {})
        setLastDialogueChoice(choice.label)
        return
      }

      if (result.kind === 'story' && result.trigger === 'glass-master-understood') {
        gameEventBus.emit('boss:glass-master-understood', {})
        setLastDialogueChoice(choice.label)
        return
      }

      if (result.kind === 'story' && result.trigger === 'inner-doubt-understood') {
        gameEventBus.emit('boss:inner-doubt-understood', {})
        setLastDialogueChoice(choice.label)
        return
      }

      if (result.kind === 'story' && result.trigger === 'perfectionism-understood') {
        gameEventBus.emit('boss:perfectionism-understood', {})
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

  useEffect(() => {
    if (!isMobileGameShell) {
      return
    }

    document.body.classList.add('game-play-active')

    return () => {
      document.body.classList.remove('game-play-active')
    }
  }, [isMobileGameShell])

  const gameShellClassName = isMobileGameShell ? 'game-shell game-shell--mobile' : 'game-shell'

  return (
    <main
      className={gameShellClassName}
      aria-labelledby={isMobileGameShell ? undefined : 'game-title'}
      aria-label={isMobileGameShell ? `${chapterMeta.title} 遊戲畫面` : undefined}
    >
      {isMobileGameShell ? null : <AppNav />}
      {isMobileGameShell ? null : (
        <header className="game-header">
          <Link to="/" className="back-link">
            首頁
          </Link>
          <div>
            <p className="eyebrow">{chapterMeta.eyebrow}</p>
            <h1 id="game-title">Quest for the Perfect Bowl</h1>
          </div>
        </header>
      )}
      <div className="game-playfield">
        <PhaserGame ref={phaserRef} isPaused={isPaused} />
      </div>
      {isMobileGameShell ? null : (
      <section className="store-panel" aria-label="遊戲控制面板">
        <div>
          <p className="panel-label">回憶碎片</p>
          <strong>{memoryShards} / 100</strong>
          <span>{totalMemoryShards} 累計</span>
        </div>
        <div>
          <p className="panel-label">章節進度</p>
          <strong>{CHAPTER_DISPLAY_NAMES[currentChapter]}</strong>
          <span>{chapterProgressHint}</span>
        </div>
        <div>
          <p className="panel-label">MBTI 進度</p>
          <strong>
            {answeredQuestionIds.length} / {MBTI_QUESTION_COUNT}
          </strong>
          <span>{isMbtiComplete && mbtiResult ? `結果：${mbtiResult}` : lastDialogueChoice}</span>
        </div>
        <div>
          <p className="panel-label">成就</p>
          <strong>
            {unlockedAchievementIds.length} / {ACHIEVEMENT_DEFINITIONS.length}
          </strong>
          <span>這趟旅程的溫柔里程碑。</span>
        </div>
      </section>
      )}
      {activeDialogue ? (
        <DialogueBox
          script={activeDialogue}
          onChoiceResult={handleChoiceResult}
          onClose={closeDialogue}
        />
      ) : null}
      {activeMemory ? <MemoryOverlay memory={activeMemory} onContinue={continueMemory} /> : null}
      {isPaused ? (
        <PauseMenu
          onResume={resumeGame}
          onRestart={restartChapter}
          isMobileGameShell={isMobileGameShell}
        />
      ) : null}
      <TouchControlsOverlay
        visible={shouldShowTouchControls && !isPaused && !activeMemory && !activeDialogue}
      />
      <AchievementToastStack toasts={toastQueue} onDismiss={dismissToast} />
    </main>
  )
}

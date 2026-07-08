import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { DialogueBox } from '../components/DialogueBox'
import { MemoryOverlay } from '../components/MemoryOverlay'
import { PhaserGame } from '../components/PhaserGame'
import { DIALOGUE_SCRIPTS, type DialogueChoice, type DialogueChoiceResult } from '../data/dialogues'
import { gameEventBus } from '../game/events/eventBus'
import { type MemoryEntry, useGalleryStore } from '../stores/useGalleryStore'
import { useGameStore } from '../stores/useGameStore'
import { useMbtiStore } from '../stores/useMbtiStore'

export function GamePage() {
  const [memoryQueue, setMemoryQueue] = useState<MemoryEntry[]>([])
  const [activeDialogueId, setActiveDialogueId] = useState<keyof typeof DIALOGUE_SCRIPTS | null>(null)
  const [lastDialogueChoice, setLastDialogueChoice] = useState<string>('No dialogue choice yet')
  const memoryShards = useGameStore((state) => state.memoryShards)
  const totalMemoryShards = useGameStore((state) => state.totalMemoryShards)
  const collectMemoryShards = useGameStore((state) => state.collectMemoryShards)
  const resetProgress = useGameStore((state) => state.resetProgress)
  const unlockNextMemory = useGalleryStore((state) => state.unlockNextMemory)
  const eiScore = useMbtiStore((state) => state.scores.EI)
  const answerQuestion = useMbtiStore((state) => state.answerQuestion)
  const activeMemory = memoryQueue[0]
  const activeDialogue = activeDialogueId ? DIALOGUE_SCRIPTS[activeDialogueId] : null

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

  const openForestDialogue = useCallback(() => {
    setActiveDialogueId('forestElder')
  }, [])

  useEffect(() => {
    const unsubscribeShard = gameEventBus.on('memory-shard-collected', (payload) => {
      collectShards(payload.amount)
    })

    const unsubscribeTalk = gameEventBus.on('player:talk-start', () => {
      openForestDialogue()
    })

    return () => {
      unsubscribeShard()
      unsubscribeTalk()
    }
  }, [collectShards, openForestDialogue])

  const handleChoiceResult = useCallback(
    (result: DialogueChoiceResult, choice: DialogueChoice) => {
      if (result.kind === 'mbti') {
        answerQuestion(result.dimension, result.preference)
      }

      setLastDialogueChoice(choice.label)
    },
    [answerQuestion],
  )

  const closeDialogue = useCallback(() => {
    setActiveDialogueId(null)
  }, [])

  const continueMemory = () => {
    setMemoryQueue((currentQueue) => currentQueue.slice(1))
  }

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
          <span>{totalMemoryShards} total</span>
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
          <p className="panel-label">Dialogue signal</p>
          <strong>{eiScore}</strong>
          <span>{lastDialogueChoice}</span>
        </div>
        <button type="button" onClick={openForestDialogue}>
          Talk to Forest Elder
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
    </main>
  )
}

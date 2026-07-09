import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Chapter =
  | 'Forest'
  | 'City'
  | 'Snow Mountain'
  | 'Glass Studio'
  | 'Retry'
  | 'Final Stage'

export type MemoryShardCollectionResult = {
  memoryShards: number
  totalMemoryShards: number
  unlockedMemoryCount: number
}

type GameState = {
  currentChapter: Chapter
  forestChapterCleared: boolean
  cityChapterCleared: boolean
  memoryShards: number
  totalMemoryShards: number
  collectMemoryShards: (amount?: number) => MemoryShardCollectionResult
  collectMemoryShard: () => MemoryShardCollectionResult
  completeForestChapter: () => void
  completeCityChapter: () => void
  resetProgress: () => void
}

const SHARDS_PER_MEMORY = 100

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChapter: 'Forest',
      forestChapterCleared: false,
      cityChapterCleared: false,
      memoryShards: 0,
      totalMemoryShards: 0,
      collectMemoryShards: (amount = 1) => {
        const safeAmount = Math.max(0, Math.floor(amount))
        const nextRawShards = get().memoryShards + safeAmount
        const unlockedMemoryCount = Math.floor(nextRawShards / SHARDS_PER_MEMORY)
        const memoryShards = nextRawShards % SHARDS_PER_MEMORY
        const totalMemoryShards = get().totalMemoryShards + safeAmount

        set({ memoryShards, totalMemoryShards })

        return {
          memoryShards,
          totalMemoryShards,
          unlockedMemoryCount,
        }
      },
      collectMemoryShard: () => get().collectMemoryShards(1),
      completeForestChapter: () => {
        if (get().forestChapterCleared) {
          return
        }

        set({
          forestChapterCleared: true,
          currentChapter: 'City',
        })
      },
      completeCityChapter: () => {
        if (get().cityChapterCleared) {
          return
        }

        set({
          cityChapterCleared: true,
          currentChapter: 'Snow Mountain',
        })
      },
      resetProgress: () =>
        set({
          currentChapter: 'Forest',
          forestChapterCleared: false,
          cityChapterCleared: false,
          memoryShards: 0,
          totalMemoryShards: 0,
        }),
    }),
    {
      name: 'perfect-bowl-game',
      merge: (persistedState, currentState) => {
        const persisted =
          typeof persistedState === 'object' && persistedState !== null ? persistedState : {}

        return {
          ...currentState,
          ...persisted,
          forestChapterCleared:
            typeof persisted === 'object' &&
            persisted !== null &&
            'forestChapterCleared' in persisted &&
            typeof persisted.forestChapterCleared === 'boolean'
              ? persisted.forestChapterCleared
              : currentState.forestChapterCleared,
          cityChapterCleared:
            typeof persisted === 'object' &&
            persisted !== null &&
            'cityChapterCleared' in persisted &&
            typeof persisted.cityChapterCleared === 'boolean'
              ? persisted.cityChapterCleared
              : currentState.cityChapterCleared,
        }
      },
    },
  ),
)

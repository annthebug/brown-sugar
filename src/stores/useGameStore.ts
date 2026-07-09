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

type StoryFlags = {
  hasImperfectBowl: boolean
  hasTrueBowl: boolean
}

type GameState = {
  currentChapter: Chapter
  forestChapterCleared: boolean
  cityChapterCleared: boolean
  snowChapterCleared: boolean
  glassChapterCleared: boolean
  retryChapterCleared: boolean
  storyFlags: StoryFlags
  memoryShards: number
  totalMemoryShards: number
  collectMemoryShards: (amount?: number) => MemoryShardCollectionResult
  collectMemoryShard: () => MemoryShardCollectionResult
  completeForestChapter: () => void
  completeCityChapter: () => void
  completeSnowChapter: () => void
  completeGlassChapter: () => void
  completeRetryChapter: () => void
  resetProgress: () => void
}

const SHARDS_PER_MEMORY = 100

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChapter: 'Forest',
      forestChapterCleared: false,
      cityChapterCleared: false,
      snowChapterCleared: false,
      glassChapterCleared: false,
      retryChapterCleared: false,
      storyFlags: {
        hasImperfectBowl: false,
        hasTrueBowl: false,
      },
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
      completeSnowChapter: () => {
        if (get().snowChapterCleared) {
          return
        }

        set({
          snowChapterCleared: true,
          currentChapter: 'Glass Studio',
        })
      },
      completeGlassChapter: () => {
        if (get().glassChapterCleared) {
          return
        }

        set({
          glassChapterCleared: true,
          currentChapter: 'Retry',
          storyFlags: {
            ...get().storyFlags,
            hasImperfectBowl: true,
          },
        })
      },
      completeRetryChapter: () => {
        if (get().retryChapterCleared) {
          return
        }

        set({
          retryChapterCleared: true,
          currentChapter: 'Final Stage',
          storyFlags: {
            ...get().storyFlags,
            hasTrueBowl: true,
          },
        })
      },
      resetProgress: () =>
        set({
          currentChapter: 'Forest',
          forestChapterCleared: false,
          cityChapterCleared: false,
          snowChapterCleared: false,
          glassChapterCleared: false,
          retryChapterCleared: false,
          storyFlags: {
            hasImperfectBowl: false,
            hasTrueBowl: false,
          },
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
          snowChapterCleared:
            typeof persisted === 'object' &&
            persisted !== null &&
            'snowChapterCleared' in persisted &&
            typeof persisted.snowChapterCleared === 'boolean'
              ? persisted.snowChapterCleared
              : currentState.snowChapterCleared,
          glassChapterCleared:
            typeof persisted === 'object' &&
            persisted !== null &&
            'glassChapterCleared' in persisted &&
            typeof persisted.glassChapterCleared === 'boolean'
              ? persisted.glassChapterCleared
              : currentState.glassChapterCleared,
          storyFlags:
            typeof persisted === 'object' &&
            persisted !== null &&
            'storyFlags' in persisted &&
            typeof persisted.storyFlags === 'object' &&
            persisted.storyFlags !== null
              ? {
                  hasImperfectBowl:
                    'hasImperfectBowl' in persisted.storyFlags &&
                    typeof persisted.storyFlags.hasImperfectBowl === 'boolean'
                      ? persisted.storyFlags.hasImperfectBowl
                      : currentState.storyFlags.hasImperfectBowl,
                  hasTrueBowl:
                    'hasTrueBowl' in persisted.storyFlags &&
                    typeof persisted.storyFlags.hasTrueBowl === 'boolean'
                      ? persisted.storyFlags.hasTrueBowl
                      : currentState.storyFlags.hasTrueBowl,
                }
              : currentState.storyFlags,
          retryChapterCleared:
            typeof persisted === 'object' &&
            persisted !== null &&
            'retryChapterCleared' in persisted &&
            typeof persisted.retryChapterCleared === 'boolean'
              ? persisted.retryChapterCleared
              : currentState.retryChapterCleared,
        }
      },
    },
  ),
)

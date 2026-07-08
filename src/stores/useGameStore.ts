import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Chapter = 'Forest' | 'City' | 'Snow Mountain' | 'Glass Studio' | 'Retry' | 'Final Stage'

export type MemoryShardCollectionResult = {
  memoryShards: number
  totalMemoryShards: number
  unlockedMemoryCount: number
}

type GameState = {
  currentChapter: Chapter
  memoryShards: number
  totalMemoryShards: number
  collectMemoryShards: (amount?: number) => MemoryShardCollectionResult
  collectMemoryShard: () => MemoryShardCollectionResult
  resetProgress: () => void
}

const SHARDS_PER_MEMORY = 100

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentChapter: 'Forest',
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
      resetProgress: () =>
        set({ currentChapter: 'Forest', memoryShards: 0, totalMemoryShards: 0 }),
    }),
    {
      name: 'perfect-bowl-game',
    },
  ),
)

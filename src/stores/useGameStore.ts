import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Chapter = 'Forest' | 'City' | 'Snow Mountain' | 'Glass Studio' | 'Retry' | 'Final Stage'

type GameState = {
  currentChapter: Chapter
  memoryShards: number
  collectMemoryShard: () => void
  resetProgress: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      currentChapter: 'Forest',
      memoryShards: 0,
      collectMemoryShard: () =>
        set((state) => ({ memoryShards: Math.min(state.memoryShards + 1, 100) })),
      resetProgress: () => set({ currentChapter: 'Forest', memoryShards: 0 }),
    }),
    {
      name: 'perfect-bowl-game',
    },
  ),
)

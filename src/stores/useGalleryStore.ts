import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MemoryEntry = {
  id: string
  title: string
  caption: string
  unlocked: boolean
}

type GalleryState = {
  memories: MemoryEntry[]
  unlockMemory: (id: string) => void
  resetGallery: () => void
}

const initialMemories: MemoryEntry[] = [
  {
    id: 'memory-001',
    title: 'Memory #1',
    caption: '一段等待正式照片放入的柔和回憶。',
    unlocked: false,
  },
  {
    id: 'memory-002',
    title: 'Memory #2',
    caption: '更多碎片會在旅途中慢慢亮起。',
    unlocked: false,
  },
]

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      memories: initialMemories,
      unlockMemory: (id) =>
        set((state) => ({
          memories: state.memories.map((memory) =>
            memory.id === id ? { ...memory, unlocked: true } : memory,
          ),
        })),
      resetGallery: () => set({ memories: initialMemories }),
    }),
    {
      name: 'perfect-bowl-gallery',
    },
  ),
)

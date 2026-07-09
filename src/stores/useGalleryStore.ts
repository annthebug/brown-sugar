import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MEMORY_DEFINITIONS } from '../data/memories'

export type MemoryEntry = {
  id: string
  order: number
  photoUrl: string
  unlocked: boolean
  unlockedAt?: string
}

type GalleryState = {
  memories: MemoryEntry[]
  unlockMemory: (id: string) => MemoryEntry | null
  unlockNextMemory: () => MemoryEntry | null
  unlockMemoryByNumber: (memoryNumber: number) => MemoryEntry | null
  resetGallery: () => void
}

function buildMemoryEntries(): MemoryEntry[] {
  return MEMORY_DEFINITIONS.map((definition) => ({
    id: definition.id,
    order: definition.order,
    photoUrl: definition.photoUrl,
    unlocked: false,
  }))
}

const initialMemories = buildMemoryEntries()

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      memories: initialMemories,
      unlockMemory: (id) => {
        const memory = get().memories.find((entry) => entry.id === id) ?? null

        if (!memory) {
          return null
        }

        set((state) => ({
          memories: state.memories.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  unlocked: true,
                  unlockedAt: entry.unlockedAt ?? new Date().toISOString(),
                }
              : entry,
          ),
        }))

        return { ...memory, unlocked: true }
      },
      unlockNextMemory: () => {
        const nextMemory = get().memories.find((memory) => !memory.unlocked) ?? null

        if (!nextMemory) {
          return null
        }

        return get().unlockMemory(nextMemory.id)
      },
      unlockMemoryByNumber: (memoryNumber) => {
        const memory = get().memories.find((entry) => entry.order === memoryNumber) ?? null

        if (!memory) {
          return null
        }

        return get().unlockMemory(memory.id)
      },
      resetGallery: () => set({ memories: buildMemoryEntries() }),
    }),
    {
      name: 'perfect-bowl-gallery',
      merge: (persistedState, currentState) => {
        const persistedMemories =
          typeof persistedState === 'object' &&
          persistedState !== null &&
          'memories' in persistedState &&
          Array.isArray(persistedState.memories)
            ? persistedState.memories
            : []
        const persistedById = new Map(
          persistedMemories
            .filter((memory): memory is Pick<MemoryEntry, 'id' | 'unlocked' | 'unlockedAt'> => {
              return (
                typeof memory === 'object' &&
                memory !== null &&
                'id' in memory &&
                'unlocked' in memory &&
                typeof memory.id === 'string' &&
                typeof memory.unlocked === 'boolean'
              )
            })
            .map((memory) => [memory.id, memory]),
        )

        return {
          ...currentState,
          memories: currentState.memories.map((memory) => ({
            ...memory,
            unlocked: persistedById.get(memory.id)?.unlocked ?? memory.unlocked,
            unlockedAt: persistedById.get(memory.id)?.unlockedAt,
          })),
        }
      },
    },
  ),
)

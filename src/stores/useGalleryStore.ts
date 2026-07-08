import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MemoryEntry = {
  id: string
  title: string
  dateLabel: string
  caption: string
  photoUrl: string
  unlocked: boolean
  unlockedAt?: string
}

type GalleryState = {
  memories: MemoryEntry[]
  unlockMemory: (id: string) => MemoryEntry | null
  unlockNextMemory: () => MemoryEntry | null
  resetGallery: () => void
}

const memoryPhotoModules = import.meta.glob<string>('../../assets/memories/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const getMemoryId = (path: string) => {
  const filename = path.split('/').at(-1) ?? path

  return filename.replace(/\.[^.]+$/, '')
}

const initialMemories: MemoryEntry[] = Object.entries(memoryPhotoModules)
  .map(([path, photoUrl], index) => {
    const memoryNumber = index + 1

    return {
      id: getMemoryId(path),
      title: `Memory #${memoryNumber}`,
      dateLabel: 'Date placeholder',
      caption: 'A soft memory is waiting here.',
      photoUrl,
      unlocked: false,
    }
  })
  .sort((firstMemory, secondMemory) => firstMemory.id.localeCompare(secondMemory.id))

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      memories: initialMemories,
      unlockMemory: (id) => {
        const memory = get().memories.find((entry) => entry.id === id) ?? null

        set((state) => ({
          memories: state.memories.map((memory) =>
            memory.id === id
              ? { ...memory, unlocked: true, unlockedAt: memory.unlockedAt ?? new Date().toISOString() }
              : memory,
          ),
        }))

        return memory ? { ...memory, unlocked: true } : null
      },
      unlockNextMemory: () => {
        const nextMemory = get().memories.find((memory) => !memory.unlocked) ?? null

        if (!nextMemory) {
          return null
        }

        return get().unlockMemory(nextMemory.id)
      },
      resetGallery: () => set({ memories: initialMemories }),
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
            .filter((memory): memory is MemoryEntry => {
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

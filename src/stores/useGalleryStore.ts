import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MemoryEntry = {
  id: string
  photoUrl: string
  unlocked: boolean
}

type GalleryState = {
  memories: MemoryEntry[]
  unlockMemory: (id: string) => void
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
  .map(([path, photoUrl]) => ({
    id: getMemoryId(path),
    photoUrl,
    unlocked: false,
  }))
  .sort((firstMemory, secondMemory) => firstMemory.id.localeCompare(secondMemory.id))

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
      merge: (persistedState, currentState) => {
        const persistedMemories =
          typeof persistedState === 'object' &&
          persistedState !== null &&
          'memories' in persistedState &&
          Array.isArray(persistedState.memories)
            ? persistedState.memories
            : []
        const unlockedById = new Map(
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
            .map((memory) => [memory.id, memory.unlocked]),
        )

        return {
          ...currentState,
          memories: currentState.memories.map((memory) => ({
            ...memory,
            unlocked: unlockedById.get(memory.id) ?? memory.unlocked,
          })),
        }
      },
    },
  ),
)

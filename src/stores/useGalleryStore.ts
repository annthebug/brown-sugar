import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GalleryState {
  unlockedMemories: string[];
  unlockMemory: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  reset: () => void;
}

// 相簿：已解鎖回憶（見 docs/06_GameMechanics.md），持久化於 LocalStorage。
export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      unlockedMemories: [],
      unlockMemory: (id) =>
        set((s) =>
          s.unlockedMemories.includes(id)
            ? s
            : { unlockedMemories: [...s.unlockedMemories, id] },
        ),
      isUnlocked: (id) => get().unlockedMemories.includes(id),
      reset: () => set({ unlockedMemories: [] }),
    }),
    { name: 'qftpb:gallery' },
  ),
);

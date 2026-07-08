import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  chapter: number;
  memoryShards: number;
  achievements: string[];
  startedAt?: number;
  // actions
  hasSave: () => boolean;
  addShards: (n: number) => void;
  setChapter: (chapter: number) => void;
  unlockAchievement: (id: string) => void;
  resetProgress: () => void;
}

// 遊戲進度（見 docs/06_GameMechanics.md、docs/12_Database.md），持久化於 LocalStorage。
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      chapter: 0,
      memoryShards: 0,
      achievements: [],
      startedAt: undefined,
      hasSave: () => {
        const s = get();
        return s.chapter > 0 || s.memoryShards > 0;
      },
      addShards: (n) => set((s) => ({ memoryShards: s.memoryShards + n })),
      setChapter: (chapter) =>
        set((s) => ({ chapter, startedAt: s.startedAt ?? Date.now() })),
      unlockAchievement: (id) =>
        set((s) =>
          s.achievements.includes(id)
            ? s
            : { achievements: [...s.achievements, id] },
        ),
      resetProgress: () =>
        set({ chapter: 0, memoryShards: 0, achievements: [], startedAt: undefined }),
    }),
    { name: 'qftpb:game' },
  ),
);

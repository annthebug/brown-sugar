import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_MAP,
  type AchievementDefinition,
  type AchievementId,
} from '../data/achievements'

export type AchievementToast = AchievementDefinition & {
  unlockedAt: string
}

type AchievementState = {
  unlockedIds: AchievementId[]
  toastQueue: AchievementToast[]
  unlockAchievement: (id: AchievementId) => AchievementDefinition | null
  dismissToast: (id: AchievementId) => void
  resetAchievements: () => void
  isUnlocked: (id: AchievementId) => boolean
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      toastQueue: [],
      unlockAchievement: (id) => {
        if (get().unlockedIds.includes(id)) {
          return null
        }

        const achievement = ACHIEVEMENT_MAP.get(id)

        if (!achievement) {
          return null
        }

        const unlockedAt = new Date().toISOString()

        set((state) => ({
          unlockedIds: [...state.unlockedIds, id],
          toastQueue: [...state.toastQueue, { ...achievement, unlockedAt }],
        }))

        return achievement
      },
      dismissToast: (id) =>
        set((state) => ({
          toastQueue: state.toastQueue.filter((toast) => toast.id !== id),
        })),
      resetAchievements: () =>
        set({
          unlockedIds: [],
          toastQueue: [],
        }),
      isUnlocked: (id) => get().unlockedIds.includes(id),
    }),
    {
      name: 'perfect-bowl-achievements',
      partialize: (state) => ({
        unlockedIds: state.unlockedIds,
      }),
      merge: (persistedState, currentState) => {
        const persistedUnlockedIds =
          typeof persistedState === 'object' &&
          persistedState !== null &&
          'unlockedIds' in persistedState &&
          Array.isArray(persistedState.unlockedIds)
            ? persistedState.unlockedIds.filter(
                (id): id is AchievementId =>
                  typeof id === 'string' && ACHIEVEMENT_MAP.has(id as AchievementId),
              )
            : currentState.unlockedIds

        return {
          ...currentState,
          unlockedIds: persistedUnlockedIds,
          toastQueue: [],
        }
      },
    },
  ),
)

export function getUnlockedAchievementDefinitions(unlockedIds: AchievementId[]) {
  return ACHIEVEMENT_DEFINITIONS.filter((achievement) => unlockedIds.includes(achievement.id))
}

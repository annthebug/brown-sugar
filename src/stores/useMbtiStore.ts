import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Dimension = 'EI' | 'SN' | 'TF' | 'JP'
type Preference = 'first' | 'second'

type MbtiScores = Record<Dimension, number>

type MbtiState = {
  scores: MbtiScores
  answerQuestion: (dimension: Dimension, preference: Preference) => void
  resetScores: () => void
}

const initialScores: MbtiScores = {
  EI: 0,
  SN: 0,
  TF: 0,
  JP: 0,
}

export const useMbtiStore = create<MbtiState>()(
  persist(
    (set) => ({
      scores: initialScores,
      answerQuestion: (dimension, preference) =>
        set((state) => ({
          scores: {
            ...state.scores,
            [dimension]: state.scores[dimension] + (preference === 'first' ? 1 : -1),
          },
        })),
      resetScores: () => set({ scores: initialScores }),
    }),
    {
      name: 'perfect-bowl-mbti',
    },
  ),
)

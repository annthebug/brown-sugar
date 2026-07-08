import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MbtiDimension, MbtiScore } from '@/data/types';
import { computeType, emptyScore } from '@/services/mbti';

interface MbtiState {
  score: MbtiScore;
  answers: Record<string, string>; // questionId -> optionLabel
  result?: string;
  answer: (questionId: string, dimension: MbtiDimension, optionLabel: string) => void;
  finalize: () => string;
  reset: () => void;
}

// MBTI 計分狀態（見 docs/07_MBTISystem.md），持久化於 LocalStorage。
export const useMbtiStore = create<MbtiState>()(
  persist(
    (set, get) => ({
      score: emptyScore(),
      answers: {},
      result: undefined,
      answer: (questionId, dimension, optionLabel) =>
        set((s) => ({
          score: { ...s.score, [dimension]: s.score[dimension] + 1 },
          answers: { ...s.answers, [questionId]: optionLabel },
        })),
      finalize: () => {
        const result = computeType(get().score);
        set({ result });
        return result;
      },
      reset: () => set({ score: emptyScore(), answers: {}, result: undefined }),
    }),
    { name: 'qftpb:mbti' },
  ),
);

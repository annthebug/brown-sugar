import type { MbtiQuestion } from '@/data/types';

/**
 * MBTI 題庫（見 docs/07_MBTISystem.md）。
 * 目標 16~24 題，分散五章。目前僅放一題結構範例，實際題目於 Task 008 填入。
 */
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  {
    id: 'q-forest-1',
    chapter: 1,
    npc: '森林老人',
    prompt: '如果今天迷路，你會？',
    options: [
      { label: '立刻找人。', dimension: 'E' },
      { label: '自己研究。', dimension: 'I' },
    ],
  },
];

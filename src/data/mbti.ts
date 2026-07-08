import type { MbtiQuestion } from '@/data/types';

/**
 * MBTI 題庫（見 docs/07_MBTISystem.md）。
 * 目標 16~24 題、分散五章。目前已填入第一章（森林）E/I、S/N 題目；其餘章節於後續任務補齊。
 */
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  {
    id: 'q-forest-1',
    chapter: 1,
    npc: '森林老人',
    prompt: '如果今天在森林裡迷路，你會？',
    options: [
      { label: '立刻找人一起想辦法。', dimension: 'E' },
      { label: '自己安靜地研究方向。', dimension: 'I' },
    ],
  },
  {
    id: 'q-forest-2',
    chapter: 1,
    npc: '森林老人',
    prompt: '遇到其他小動物時，你通常會？',
    options: [
      { label: '主動上前打招呼。', dimension: 'E' },
      { label: '先在一旁安靜觀察。', dimension: 'I' },
    ],
  },
  {
    id: 'q-forest-3',
    chapter: 1,
    npc: '森林老人',
    prompt: '望向森林深處時，你想到的是？',
    options: [
      { label: '記住沿途的路標與細節。', dimension: 'S' },
      { label: '想像那裡藏著什麼故事。', dimension: 'N' },
    ],
  },
  {
    id: 'q-forest-4',
    chapter: 1,
    npc: '森林老人',
    prompt: '撿到一片落葉，你會注意？',
    options: [
      { label: '它的形狀與紋路。', dimension: 'S' },
      { label: '它讓你聯想到的季節與回憶。', dimension: 'N' },
    ],
  },
];

/** 取得指定章節的 MBTI 題目。 */
export function getQuestionsByChapter(chapter: number): MbtiQuestion[] {
  return MBTI_QUESTIONS.filter((q) => q.chapter === chapter);
}

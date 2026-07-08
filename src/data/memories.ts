import type { Memory } from '@/data/types';

/**
 * 回憶內容（見 docs/06_GameMechanics.md）。
 * 目前為佔位資料，實際照片與文字由擁有者於後續填入（照片放 Firebase Storage）。
 */
export const MEMORIES: Memory[] = [
  {
    id: 'memory-1',
    chapter: 1,
    date: 'TBD',
    caption: '第一次一起出去',
    photoPath: 'memories/memory-1.jpg',
  },
  {
    id: 'memory-2',
    chapter: 2,
    date: 'TBD',
    caption: '（待填）',
    photoPath: 'memories/memory-2.jpg',
  },
  {
    id: 'memory-3',
    chapter: 3,
    date: 'TBD',
    caption: '（待填）',
    photoPath: 'memories/memory-3.jpg',
  },
];

import type { ChapterMeta } from '@/data/types';

// 章節中繼資料（見 docs/02_GameDesign.md）。此處僅定義結構，尚未實作關卡內容。
export const CHAPTERS: ChapterMeta[] = [
  { id: 1, key: 'forest', title: 'Forest 森林', boss: '巨大罐罐', memoryId: 'memory-1' },
  { id: 2, key: 'city', title: 'City 城市', boss: 'Time Monster', memoryId: 'memory-2' },
  { id: 3, key: 'snow', title: 'Snow Mountain 雪山', boss: 'Snow Spirit', memoryId: 'memory-3' },
  { id: 4, key: 'glass', title: 'Glass Studio 玻璃工坊', boss: 'Glass Master' },
  { id: 5, key: 'retry', title: 'Retry 重製', boss: 'Inner Doubt' },
  { id: 6, key: 'final', title: 'Final Stage 最終關', boss: 'Perfectionism' },
];

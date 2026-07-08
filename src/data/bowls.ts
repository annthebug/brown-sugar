import type { Bowl } from '@/data/types';

/**
 * MBTI 對應玻璃碗（見 docs/07_MBTISystem.md）。
 * 目前提供文件中的範例款式；16 型完整設計於後續補齊（Task 019）。
 */
export const BOWLS: Bowl[] = [
  { id: 'bowl-isfj', type: 'ISFJ', name: '守護者之碗', description: '溫柔守護的花紋。' },
  { id: 'bowl-enfp', type: 'ENFP', name: '冒險者之碗', description: '奔放跳躍的花紋。' },
  { id: 'bowl-intj', type: 'INTJ', name: '策略家的玻璃碗', description: '沉穩幾何的花紋。' },
  { id: 'bowl-infp', type: 'INFP', name: 'Dream Bowl', description: '夢幻柔光的花紋。' },
];

/** 依 MBTI 四碼取得對應玻璃碗；未定義者回傳 undefined。 */
export function getBowlForType(type: string): Bowl | undefined {
  return BOWLS.find((b) => b.type === type.toUpperCase());
}

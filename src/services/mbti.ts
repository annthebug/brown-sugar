import type { MbtiScore } from '@/data/types';

/** 建立歸零的四維計分。 */
export function emptyScore(): MbtiScore {
  return { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

/**
 * 依四維分數計算 MBTI 四碼（見 docs/07_MBTISystem.md）。
 * 各維度取較高分的一端，平手時採用第一端（E/S/T/J）。
 */
export function computeType(score: MbtiScore): string {
  const ei = score.E >= score.I ? 'E' : 'I';
  const sn = score.S >= score.N ? 'S' : 'N';
  const tf = score.T >= score.F ? 'T' : 'F';
  const jp = score.J >= score.P ? 'J' : 'P';
  return `${ei}${sn}${tf}${jp}`;
}

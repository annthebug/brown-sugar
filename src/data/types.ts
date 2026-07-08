// 共用型別定義。資料模型對照 docs/12_Database.md 與 docs/07_MBTISystem.md。

export type Language = 'zh-Hant' | 'en';

export type MbtiDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MbtiScore {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MbtiOption {
  label: string;
  dimension: MbtiDimension;
}

export interface MbtiQuestion {
  id: string;
  chapter: number;
  npc: string;
  prompt: string;
  options: MbtiOption[];
}

export interface MbtiResult {
  userId: string;
  score: MbtiScore;
  answers: Record<string, string>; // questionId -> optionLabel
  result?: string; // 例：ENFP
  bowl?: string; // 對應玻璃碗 id
  completedAt?: number;
}

export interface Memory {
  id: string; // memory-1
  chapter: number;
  date: string; // 顯示日期
  caption: string; // 一句話
  photoPath: string; // Firebase Storage 路徑（佔位）
}

export interface Bowl {
  id: string; // bowl-isfj
  type: string; // MBTI 四碼
  name: string; // 例：守護者之碗
  description: string;
}

export interface ChapterMeta {
  id: number;
  key: string; // forest / city / ...
  title: string;
  boss: string;
  memoryId?: string;
}

export interface SaveData {
  userId: string;
  chapter: number;
  position?: { x: number; y: number };
  memoryShards: number;
  unlockedMemories: string[];
  achievements: string[];
  updatedAt: number;
}

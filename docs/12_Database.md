# 12 — 資料庫（Database）

## 技術

- **Firebase Firestore**：結構化資料（存檔、MBTI 結果、相簿狀態）。
- **Firebase Storage**：媒體資源（回憶照片、玻璃碗照片）。
- **LocalStorage**：本機即時進度（離線可用）。

## 存檔策略（v1）

| 層級 | 用途 |
| --- | --- |
| LocalStorage | 即時、離線進度（必備） |
| Firestore | 雲端同步、跨裝置（**選用**，需 Firebase 設定） |
| Auto Save | `services/save.ts` debounce 聚合寫入 |

- 進度以 LocalStorage 為主；連線且已設定 Firebase 時同步至 Firestore。

## 資料模型

### `saves/{userId}`
```ts
interface SaveData {
  userId: string;
  chapter: number;            // 目前章節
  position?: { x: number; y: number };
  memoryShards: number;       // 目前收集數
  unlockedMemories: string[]; // 已解鎖回憶 id
  achievements: string[];
  updatedAt: number;
}
```

### `mbti/{userId}`
```ts
interface MbtiResult {
  userId: string;
  score: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
  };
  answers: Record<string, string>; // questionId -> optionLabel
  result?: string;                  // 例：ENFP
  bowl?: string;                    // 對應玻璃碗
  completedAt?: number;
}
```

### `memories/{memoryId}`（內容定義，可為靜態資料）
```ts
interface Memory {
  id: string;         // memory-1
  chapter: number;
  date: string;       // 顯示日期
  caption: string;    // 一句話
  photoPath: string;  // Firebase Storage 路徑（佔位）
}
```

## Storage 結構

```
storage/
├── memories/       # 回憶照片（佔位，正式由擁有者上傳）
└── bowls/          # 16 型玻璃碗照片 / 最終真實玻璃碗照片
```

## 安全性

- 使用 Firebase Security Rules 限制讀寫（僅本人可讀寫自身存檔）。
- 敏感金鑰以環境變數管理，不進版控。

## 相關文件

- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)
- 部署：[13_Deployment](13_Deployment.md)

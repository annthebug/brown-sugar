# 07 — MBTI 系統（MBTI System）

## 設計原則

NPC 不直接詢問「你的 MBTI 是？」，而是透過自然聊天，讓玩家在情境選項中做選擇。玩家不知道這就是 MBTI。

## 題目範例

> 森林老人：如果今天迷路，你會？
>
> - A：立刻找人。
> - B：自己研究。

每個選項對應一個維度傾向（此題為 E / I）。

## 題數與分佈

- 總共 **16~24 題**。
- 分散於 **五個章節**，融入劇情對話中。
- 每個維度至少涵蓋數題以確保準確度。

## 四維計分

| 維度 | 對立面 |
| --- | --- |
| E / I | 外向 / 內向 |
| S / N | 實感 / 直覺 |
| T / F | 思考 / 情感 |
| J / P | 判斷 / 感知 |

### 計分方式

- 每題選項對某一維度的其中一端 +1。
- 完成所有題目後，各維度取較高分的一端。
- 直接計算得出四碼結果（例：ISFJ、ENFP、INTJ、INFP...）。

### 資料結構範例

```ts
interface MbtiScore {
  E: number; I: number;
  S: number; N: number;
  T: number; F: number;
  J: number; P: number;
}

interface MbtiQuestion {
  id: string;
  chapter: number;
  npc: string;
  prompt: string;
  options: {
    label: string;
    dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
}
```

## 結果對應玻璃碗

依 MBTI 生成不同玻璃碗，花紋皆不同。範例：

| MBTI | 玻璃碗 |
| --- | --- |
| ISFJ | 守護者之碗 |
| ENFP | 冒險者之碗 |
| INTJ | 策略家的玻璃碗 |
| INFP | Dream Bowl |

> 16 型皆需對應一款玻璃碗設計，詳見美術文件 [09_Assets](09_Assets.md)。

## 章節題目分佈建議

| 章節 | 主要維度 | 題數（建議） |
| --- | --- | --- |
| Forest | E/I、S/N | 4~5 |
| City | T/F、J/P | 4~5 |
| Snow Mountain | S/N、E/I | 3~4 |
| Glass Studio | T/F | 3~4 |
| Retry / Final | 綜合補題 | 2~6 |

## 相關文件

- 角色與 NPC：[05_Characters](05_Characters.md)
- 遊戲機制：[06_GameMechanics](06_GameMechanics.md)

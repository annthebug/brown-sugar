# 06 — 遊戲機制（Game Mechanics）

## 移動與操作

| 能力 | 說明 | 建議操作 |
| --- | --- | --- |
| Jump | 基本跳躍 | Space / 上 / 點擊 |
| Double Jump | 空中再跳一次 | 空中再次 Jump |
| Dash | 短距衝刺，可穿越間隙 | Shift / 雙擊方向 |
| Meow | 貓叫，觸發互動或解謎 | M / 專屬鍵 |
| Collect Memory | 拾取 Memory Shards | 碰撞自動拾取 |
| Talk | 與 NPC 對話 | 靠近按確認 |

- 需同時支援鍵盤（桌機）與觸控（行動裝置）。
- 觸控提供虛擬搖桿 + 動作按鈕。

## Memory System（回憶系統）

- 遊戲中不使用金幣，全部改為 **Memory Shards**。
- 收集 **100** 個 Memory Shards 即可解鎖一段回憶。
- 回憶為每章節的情感節點（Memory #1 ~ #3 等）。

### 回憶動畫流程

```
Pixel → Fade → 真正照片 → 一句文字 → Continue → Pixel
```

- 每段回憶包含：日期、一句話、動畫。
- 解鎖後收入相簿（Gallery）。

## 戰鬥 / Boss 機制

- Boss 為情緒化身，戰鬥偏向「理解與釋懷」，非血腥暴力。
- 每個 Boss 對應章節主題，擊敗後推進劇情並解鎖回憶。
- Boss：巨大罐罐 → Time Monster → Snow Spirit → Glass Master → Inner Doubt → Perfectionism。

## 隱藏式 MBTI 機制

- 對話選項即題目，玩家不會被告知「這是測驗」。
- 選擇累積四維分數（E/I、S/N、T/F、J/P）。
- 詳見 [07_MBTISystem](07_MBTISystem.md)。

## 玻璃工坊：吹玻璃小遊戲（第四章）

| 項目 | 規格 |
| --- | --- |
| 觸發 | 靠近吹製台，按 Talk／E（`blowGlassState === 'idle'`） |
| 玩法 | 橘色光暈／玻璃液滴脈動；在亮度峰值（≥ 約 72%）時再按 Talk |
| 目標 | 成功 **3 次**；時機錯誤則進度歸零 |
| 完成後 | 與玻璃師傅 Boss 對話 → 不理想玻璃碗演出（黑糖 🥺） |
| 視覺（v1） | 火爐／吹製台以 Phaser 幾何形狀 + 橘色光暈 tween；不要求獨立場景 sprite 圖集 |
| 火爐互動 | 按 Talk 顯示繁中提示文案 |

## 存檔機制（v1）

| 方式 | 說明 |
| --- | --- |
| LocalStorage | 本機即時保存（Zustand persist + `services/save.ts`） |
| Firebase Sync | **選用**；設定 `VITE_FIREBASE_*` 時雲端同步 |
| Auto Save | 狀態變更 debounce 寫入 |

## 成就機制（v1）

- 晨光微亮（首片碎片）
- 柔軟倒影（首段回憶）
- 森林約定（通關森林）
- 我們的相簿（全部回憶）
- 心意盛開（MBTI 完成）
- 溫柔歸來的碗（旅程完成）

> Speed Run、No Damage **不在 v1 範圍**。

## 相關文件

- 遊戲設計：[02_GameDesign](02_GameDesign.md)
- 資料庫：[12_Database](12_Database.md)

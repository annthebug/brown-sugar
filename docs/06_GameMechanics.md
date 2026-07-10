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
- 觸控提供按鈕式 D-pad + 動作按鈕（`TouchControlsOverlay`，固定於視窗左右）。

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

## 存檔機制

| 方式 | 說明 |
| --- | --- |
| Auto Save | 關鍵節點自動存檔 |
| LocalStorage | 本機即時保存進度 |
| Firebase Sync | 雲端同步，跨裝置延續 |

## 成就機制

本版實作六項旅程成就：

| 成就 | 說明 |
| --- | --- |
| 晨光微亮 | 收集第一片 Memory Shard |
| 柔軟倒影 | 解鎖第一段回憶 |
| 森林約定 | 完成森林章節 |
| 我們的相簿 | 25 張回憶全解鎖 |
| 心意盛開 | 完成 21 題 MBTI 對話 |
| 溫柔歸來的碗 | 抵達結局 |

呈現方式：遊戲中 Toast、首頁成就 Panel；狀態 persist 並可選同步 Firebase。

## 相關文件

- 遊戲設計：[02_GameDesign](02_GameDesign.md)
- 資料庫：[12_Database](12_Database.md)

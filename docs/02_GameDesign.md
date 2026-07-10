# 02 — 遊戲設計（Game Design）

## 設計理念

以「柔軟的冒險」為核心，弱化戰鬥壓力，強化情感與探索。每一關都是一段關係的隱喻，Boss 皆象徵一種情緒或阻礙，擊敗的方式偏向理解與釋懷，而非暴力。

## 視覺基調

- 全遊戲以淡藍色為主視覺，天空背景應維持清透、柔和、低飽和。
- 色彩採莫蘭迪系統，使用灰藍、霧粉、鼠尾草綠、米杏、淺暖灰作為場景與 UI 輔色。
- 關卡可透過光影、材質與局部點綴呈現差異，不以高飽和或厚重暗色改變整體基調。

## 核心迴圈（Core Loop）

```
探索關卡 → 收集 Memory Shards → 與 NPC 對話（隱藏 MBTI 題目）
        → 擊敗 Boss → 解鎖回憶 → 進入下一章
```

## 主角能力

| 能力 | 說明 |
| --- | --- |
| Jump | 基本跳躍 |
| Double Jump | 空中二段跳 |
| Dash | 短距離衝刺，可穿越間隙 |
| Meow | 貓叫，觸發互動 / 解謎 |
| Collect Memory | 拾取 Memory Shards |
| Talk | 與 NPC 對話（含 MBTI 題目） |

## 遊戲流程

```
開始 → 森林 → 城市 → 雪山 → 玻璃工坊 → 重新製作 → 最後 Boss
     → 得到玻璃碗 → MBTI → Credits
```

## 關卡設計

### 第一章：Forest（森林）
- 主題：森林
- 怪物：毛線球、紙箱、小魚乾
- Boss：巨大罐罐
- 完成後：Memory #1（照片：第一次一起出去）

### 第二章：City（城市）
- 場景：咖啡店、公園、捷運
- Boss：Time Monster（象徵：遠距離）
- 完成後：Memory #2

### 第三章：Snow Mountain（雪山）
- 代表：旅行（日本、雪景、合掌村）
- Boss：Snow Spirit
- 完成後：Memory #3

### 第四章：Glass Studio（玻璃工坊）
- 元素：火爐、吹玻璃、玻璃管
- Boss：Glass Master
- 完成後：得到第一個玻璃碗，但不是想要的形狀。黑糖：🥺

### 第五章：Retry（重新製作）
- 重新開始、重新收集材料，象徵：努力
- Boss：Inner Doubt
- 完成後：真正的玻璃碗

### Final Stage：最終關
- Boss：Perfectionism
- 它一直說：「不夠好。」「重做。」「再一次。」
- 玩家擊敗它。
- 畫面訊息：有些禮物，不用完美。真正重要的是：心意。

## 難度曲線

- 前期（森林、城市）：教學導向，低難度，著重探索與對話。
- 中期（雪山、玻璃工坊）：導入平台跳躍與 Dash 挑戰。
- 後期（Retry、Final）：情緒張力最高，機制回收前面所學。

## 系統整合

- 存檔：Auto Save + LocalStorage + Firebase Sync（選用）。
- 成就：六項旅程里程碑（見 [06_GameMechanics](06_GameMechanics.md)）。

## 相關文件

- 遊戲機制細節：[06_GameMechanics](06_GameMechanics.md)
- MBTI 系統：[07_MBTISystem](07_MBTISystem.md)
- 故事腳本：[03_Story](03_Story.md)

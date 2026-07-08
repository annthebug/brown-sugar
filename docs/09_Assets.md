# 09 — 美術資源（Assets）

## 美術風格

- Pixel 16bit
- 暖色系
- 柔和
- Pokémon Pixel Art 感
- 不暴力

## 資源分類

### 角色
- 黑糖（主角）：走路、跳躍、Dash、Meow、待機、情緒表情（含 🥺）。
- NPC：森林老人、咖啡店店員、公園旅人、雪山嚮導、玻璃師傅、內心之聲。
- Boss：巨大罐罐、Time Monster、Snow Spirit、Glass Master、Inner Doubt、Perfectionism。

### 場景 / Tilemap
| 章節 | 場景元素 |
| --- | --- |
| Forest | 樹木、草地、木箱 |
| City | 咖啡店、公園、捷運 |
| Snow Mountain | 雪景、合掌村、日式建築 |
| Glass Studio | 火爐、玻璃管、工作台 |
| Retry | 重製工坊 |
| Final Stage | 抽象內心之境 |

### 收集物
- Memory Shards（回憶碎片）圖示與拾取特效。

### 回憶素材
- 真實照片（佔位，正式由擁有者放置）。
- Pixel → 照片 過場素材。

### 玻璃碗（結局）
- 16 型 MBTI 各一款玻璃碗花紋（如 守護者之碗、冒險者之碗、策略家的玻璃碗、Dream Bowl 等）。
- Pixel Treasure Chest（寶箱）開啟動畫。

### UI 元素
- 按鈕、對話框、HUD、相簿框、設定面板。
- 圖示：BGM / Sound / Language / Fullscreen。

## 命名與存放規範

- 統一存放於 `assets/`，依類型分子資料夾（`characters/`、`scenes/`、`ui/`、`memories/`、`bowls/`、`audio/` 等）。
- 檔名使用小寫與連字號，例如 `black-sugar-idle.png`。
- Sprite sheet 附對應 JSON（Phaser Atlas）。

## 動畫

- 使用 GSAP 處理 UI 與過場動畫。
- Phaser 處理精靈動畫（角色、Boss、特效）。

## 相關文件

- UI/UX：[08_UIUX](08_UIUX.md)
- 音效：[10_Audio](10_Audio.md)

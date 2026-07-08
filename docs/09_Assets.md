# 09 — 美術資源（Assets）

## 美術風格

- Pixel 16bit
- 淡藍色天空背景
- 莫蘭迪色系
- 柔和
- Pokémon Pixel Art 感
- 不暴力

## 色彩規範

- 全遊戲背景以淡藍色天空為主，場景遠景需保留霧藍或水色天空層。
- 主色：灰藍、霧藍、水色。
- 輔色：霧粉、鼠尾草綠、米杏、淺暖灰。
- 禁止以高飽和原色、厚重黑色或大面積暗紅作為主要視覺。
- Memory Shards、玻璃碗與重要互動物可使用柔和玻璃青或低飽和金杏作為亮點。

## 資源分類

### 角色
- 黑糖（主角）：走路、跳躍、Dash、Meow、待機、情緒表情（含 🥺）。
- NPC：森林老人、咖啡店店員、公園旅人、雪山嚮導、玻璃師傅、內心之聲。
- Boss：巨大罐罐、Time Monster、Snow Spirit、Glass Master、Inner Doubt、Perfectionism。

### 場景 / Tilemap
| 章節 | 場景元素 |
| --- | --- |
| Forest | 淡藍天空、低飽和樹木、草地、木箱 |
| City | 淡藍天空、霧杏咖啡店、公園、捷運 |
| Snow Mountain | 淡藍天空、雪景、合掌村、日式建築 |
| Glass Studio | 淡藍窗光、柔橘火爐、玻璃管、工作台 |
| Retry | 淡藍環境光、重製工坊 |
| Final Stage | 霧藍留白、抽象雲層與內心之境 |

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
- UI 素材需使用半透明淺色面板、灰藍描邊與莫蘭迪輔色狀態。

## 命名與存放規範

- 統一存放於 `assets/`，依類型分子資料夾（`characters/`、`scenes/`、`ui/`、`memories/`、`bowls/`、`audio/` 等）。
- 檔名使用小寫與連字號，例如 `black-sugar-idle.png`。
- Sprite sheet 附對應 JSON（Phaser Atlas）。
- 產生型 placeholder 檔名需以 `-placeholder` 結尾；擁有者提供的 memory 原始照片可先保留相機檔名，待相簿資料模型完成後再整理。
- `src/game/assets/assetManifest.ts` 是 Phaser 預載的執行期來源；`assets/manifest.json` 與 `assets/README.md` 作為資源審閱與替換規範。
- 替換正式素材時需保留既有 asset key，避免破壞已接好的 Phaser preload 與場景引用。
- PreloadScene 必須在資源載入失敗時停留在載入畫面並顯示失敗項目，不可靜默進入缺失素材的遊戲場景。

## 動畫

- 使用 GSAP 處理 UI 與過場動畫。
- Phaser 處理精靈動畫（角色、Boss、特效）。

## 相關文件

- UI/UX：[08_UIUX](08_UIUX.md)
- 音效：[10_Audio](10_Audio.md)

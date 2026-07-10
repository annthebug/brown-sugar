# 01 — 產品需求文件（Product Requirements Document, PRD）

Version 1.0

## 專案名稱

Quest for the Perfect Bowl

## 專案定位

一款專屬兩人的 Pixel RPG 網頁遊戲。遊戲以黑糖（貓咪）作為主角，透過冒險收集回憶碎片，逐步拼湊彼此的故事。玩家在遊戲過程中不會察覺自己正在做 MBTI 測驗，而是透過 NPC 對話自然完成 16 Personality 類型分析。

最終獲得：專屬玻璃抹茶碗、MBTI Personality、一路收集的回憶、Credits。

整體主題：找回的不只是玻璃碗，而是一路走過的回憶。

## 遊戲類型

Pixel RPG、Story Adventure、Visual Novel、Personality Test、Memory Album。

## 平台

Web（Desktop / iPad / iPhone / Android），PWA 可安裝。

## 技術需求

| 分類 | 技術 |
| --- | --- |
| Frontend | React、TypeScript、Vite |
| Game Engine | Phaser 3 |
| Animation | GSAP |
| State | Zustand |
| Routing | React Router |
| Database | Firebase |
| Storage | Firebase Storage |
| Deployment | Vercel |

## 功能需求（Functional Requirements）

### 核心玩法
- 玩家控制黑糖，具備 `Jump`、`Double Jump`、`Dash`、`Meow`、`Collect Memory`、`Talk` 能力。
- 五個章節依序進行，每章有主題、怪物與 Boss。

### 回憶系統
- 收集 Memory Shards（取代金幣），每 100 個解鎖一段回憶。
- 回憶動畫：Pixel → Fade → 真正照片 → 一句文字 → Continue → Pixel。

### MBTI 系統
- 透過 NPC 自然對話進行，分散在五個章節，共 16~24 題。
- 計分四維：E/I、S/N、T/F、J/P，完成後直接計算結果。

### 結局
- 依 MBTI 生成不同玻璃碗（花紋皆不同）。
- 最後寶箱打開為真正拍攝的玻璃碗照片；黑糖躺在碗旁睡著，Credits 捲動。

### 系統功能
- 存檔：LocalStorage 即時保存；Firebase 雲端同步（選用，需環境變數）。
- 相簿：每張照片含日期、一句話、動畫。
- 成就：六項里程碑（首片碎片、首段回憶、森林通關、全相簿、MBTI 完成、旅程完成）。
- 設定：繁體中文、Fullscreen。

## 非功能需求（Non-Functional Requirements）

| 項目 | 要求 |
| --- | --- |
| 效能 | 於行動裝置維持流暢畫面（目標 60 FPS） |
| 相容性 | 支援桌機與主流行動瀏覽器 |
| 可安裝 | PWA，可加入主畫面離線啟動 |
| 風格一致 | Pixel 16bit、淡藍色天空背景、莫蘭迪色系、柔和、不暴力 |
| 色彩一致 | 全遊戲以淡藍色為主視覺，輔色使用低飽和灰藍、霧粉、鼠尾草綠、米杏與淺暖灰 |
| 隱私 | 回憶照片以佔位資源處理，正式照片由擁有者自行放置 |

## 成功指標

- 玩家能在不察覺情況下完成 MBTI 測驗。
- 遊戲能完整通關並產出對應玻璃碗與相簿。
- 兩人能在遊玩過程中獲得情感共鳴。

## 範圍界定（Out of Scope）

- 多人連線 / 對戰。
- 內購 / 金流。
- 排行榜社群功能。
- 遊戲內音訊（BGM／SFX）。
- 英文／多語系 i18n（v1 僅繁體中文）。
- Speed Run、No Damage 成就。
- 玻璃工坊獨立場景 sprite 圖集（火爐／吹製台專用 atlas）。
- 手機遊戲內固定暫停／返回首頁按鈕。

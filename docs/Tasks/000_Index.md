# Tasks — 任務索引（Index）

本資料夾為 **Quest for the Perfect Bowl** 的開發任務拆解。每個任務對應一個編號檔案，供實作與追蹤使用。

## 任務清單

| 編號 | 任務 | 分類 | 狀態 |
| --- | --- | --- | --- |
| [001](001.md) | 專案初始化（Vite + React + TS） | 基礎建設 | ✅ 完成 |
| [002](002.md) | 整合 Phaser 3 與 React | 基礎建設 | ✅ 完成 |
| [003](003.md) | 狀態管理（Zustand）與路由（React Router） | 基礎建設 | ✅ 完成 |
| [004](004.md) | 資源預載與美術資源結構 | 資源 | ✅ 完成 |
| [005](005.md) | 主角黑糖：移動與能力 | 玩法 | ✅ 完成 |
| [006](006.md) | Memory 系統（收集與解鎖） | 玩法 | ✅ 完成 |
| [007](007.md) | 對話系統（Visual Novel） | 玩法 | ✅ 完成 |
| [008](008.md) | MBTI 系統（題庫與計分） | 系統 | ✅ 完成 |
| [009](009.md) | 關卡：第一章 Forest | 關卡 | ✅ 完成 |
| [010](010.md) | 關卡：第二章 City | 關卡 | ✅ 完成 |
| [011](011.md) | 關卡：第三章 Snow Mountain | 關卡 | ✅ 完成 |
| [012](012.md) | 關卡：第四章 Glass Studio | 關卡 | ✅ 完成 |
| [013](013.md) | 關卡：第五章 Retry | 關卡 | ✅ 完成 |
| [014](014.md) | Final Stage 與 Boss：Perfectionism | 關卡 | ✅ 完成 |
| [015](015.md) | 音訊系統 | 系統 | ❌ 已取消 |
| [016](016.md) | UI：首頁 / 暫停 / 設定 | UI | 🟨 進行中 |
| [017](017.md) | 相簿（Gallery） | UI | ✅ 完成 |
| [018](018.md) | 存檔系統（LocalStorage + Firebase Sync） | 系統 | ✅ 完成 |
| [019](019.md) | 結局：玻璃碗生成、寶箱、Credits | 玩法 | 🟨 進行中 |
| [020](020.md) | 成就系統 | 系統 | 🟨 進行中 |
| [021](021.md) | PWA 設定 | 平台 | ✅ 完成 |
| [022](022.md) | 部署至 Vercel | 部署 | ✅ 完成 |

## 目前盤點（2026-07-10）

- `package.json` 使用 `phaser@^3.90.0`；`npm run build` 可通過。
- **章節關卡（009–014 完成）：** `ForestScene` → `CityScene` → `SnowMountainScene` → `GlassStudioScene` → `RetryScene` → `FinalScene` 已串接通關鏈；`chapters.ts` / `PreloadScene` 依旗標決定可玩章節與啟動場景。
- **MBTI（008 完成）：** 21 題分散五章；各章 NPC 可於場景內正式觸發；`EndingPage` 顯示四碼結果與玻璃碗 sprite 預覽。
- **核心玩法：** `Player` 全能力、`MemoryShard` overlap 拾取、`DialogueBox` 分支對話、`MemoryOverlay` GSAP 動畫、`GalleryPage` 25 張相簿。
- **觸控／手機（未編號，已實作）：** `TouchControlsOverlay` 固定於視窗左右；`GamePage` 手機沉浸式殼層；橫向對話滿版；PWA + 手機 UI 斷點（820px）。相關設計見 `docs/08_UIUX.md`、`docs/mobile-qa-checklist.md`。
- **音訊：** 已取消（無 BGM/SFX、無音訊函式庫）。
- **UI（016 進行中）：** 首頁 Start / Continue / Gallery / Settings、`PauseMenu`（Esc）、Fullscreen API、`useFullscreenSync` 已完成；**Language 僅 store 值，尚無 i18n 文案套用**（設定頁亦僅 `zh-Hant` 選項）。
- **存檔（018 完成）：** 各 Zustand store LocalStorage persist；`services/save.ts` + `services/firebase.ts` + `useSaveSync`（Firebase 為選用，需 `VITE_FIREBASE_*`）。
- **結局（019 進行中）：** `EndingPage` 已有 MBTI 玻璃碗預覽、GSAP Credits 捲動、黑糖睡覺圖；**尚無寶箱開啟動畫**（素材已備）、**尚無真正拍攝玻璃碗照片**（仍以 sprite sheet 預覽）。
- **成就（020 進行中）：** 6 項成就定義 + `useAchievementStore` + Toast / 首頁 Panel + 存檔同步；**Speed Run、No Damage 尚未實作**。
- **PWA（021 完成）：** `vite-plugin-pwa`、`public/icons/`、`vercel.json` headers。
- **遺留：** `GameScene` 仍保留於 Phaser config 作測試場景；桌機版 `GamePage` 仍有 `store-panel` 狀態面板（非最終玩家 UI）。

## 任務檔案格式

每個任務檔包含：目標、範圍、對應文件、實作步驟、驗收標準、相依任務。

## 狀態圖示

- ⬜ 未開始
- 🟨 進行中
- ✅ 完成
- ❌ 已取消

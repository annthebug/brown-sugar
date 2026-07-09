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
| [012](012.md) | 關卡：第四章 Glass Studio | 關卡 | ⬜ 未開始 |
| [013](013.md) | 關卡：第五章 Retry | 關卡 | ⬜ 未開始 |
| [014](014.md) | Final Stage 與 Boss：Perfectionism | 關卡 | ⬜ 未開始 |
| [015](015.md) | 音訊系統 | 系統 | ❌ 已取消 |
| [016](016.md) | UI：首頁 / 暫停 / 設定 | UI | 🟨 進行中 |
| [017](017.md) | 相簿（Gallery） | UI | ✅ 完成 |
| [018](018.md) | 存檔系統（LocalStorage + Firebase Sync） | 系統 | 🟨 進行中 |
| [019](019.md) | 結局：玻璃碗生成、寶箱、Credits | 玩法 | 🟨 進行中 |
| [020](020.md) | 成就系統 | 系統 | ⬜ 未開始 |
| [021](021.md) | PWA 設定 | 平台 | ⬜ 未開始 |
| [022](022.md) | 部署至 Vercel | 部署 | ⬜ 未開始 |

## 目前盤點（2026-07-09）

- `package.json` 使用 `phaser@^3.90.0`；`npm run build` 可通過。
- **章節關卡（009 / 010 完成）：** `ForestScene`（平台、巡邏怪物、森林老人、巨大罐罐 Boss、Memory Shard 碰撞拾取、通關解鎖 Memory #1 並切換 `CityScene`）；`CityScene`（咖啡店 / 公園 / 捷運區塊、店員 / 旅人 NPC、Time Monster Boss、通關解鎖 Memory #2）。`chapters.ts` 依 `forestChapterCleared` / `cityChapterCleared` 決定可玩章節；第三至五章仍 fallback 至 `ForestScene`，尚無獨立 Scene。
- **MBTI（008 完成）：** `data/mbti.ts` 共 21 題；`services/mbti.ts` 計算四碼類型與玻璃碗對照；`useMbtiStore` 含 `answeredQuestionIds`、防重複計分、`isComplete()`、`getMbtiResult()`；`EndingPage` 答完後顯示 MBTI 與碗型。第三至五章對話腳本已撰寫，目前除 Forest / City 場景 NPC 外，亦可透過 `GamePage` debug 按鈕觸發。
- **核心玩法：** `Player` 全能力、`MemoryShard` overlap 拾取、`DialogueBox` 分支對話、`MemoryOverlay` GSAP 動畫、`GalleryPage` 25 張照片相簿（剪影 / 重播）。
- **音訊：** 已取消（遊戲完全無音訊，無 Howler、無 `services/audio.ts`）。
- **UI（016 進行中）：** 首頁已有 Start / Continue / Gallery / Settings；`PauseMenu`（Esc）、Fullscreen API、`useFullscreenSync` 已有；Language 僅 store 值，尚無 i18n 文案套用。
- **結局（019 進行中）：** `EndingPage` 可預覽 MBTI 結果與玻璃碗 sprite sheet；尚無寶箱動畫、Credits 捲動。
- **存檔（018 進行中）：** 各 Zustand store 已 LocalStorage persist；尚無 Firebase / `services/save.ts`。
- **遺留：** `GameScene` 仍保留於 Phaser config 作測試場景；`GamePage` 仍有 debug 面板（手動 Collect shard、測試對話按鈕等），非最終遊戲 UI。

## 任務檔案格式

每個任務檔包含：目標、範圍、對應文件、實作步驟、驗收標準、相依任務。

## 狀態圖示

- ⬜ 未開始
- 🟨 進行中
- ✅ 完成
- ❌ 已取消

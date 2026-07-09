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
| [008](008.md) | MBTI 系統（題庫與計分） | 系統 | 🟨 進行中 |
| [009](009.md) | 關卡：第一章 Forest | 關卡 | ⬜ 未開始 |
| [010](010.md) | 關卡：第二章 City | 關卡 | ✅ 完成 |
| [011](011.md) | 關卡：第三章 Snow Mountain | 關卡 | ✅ 完成 |
| [012](012.md) | 關卡：第四章 Glass Studio | 關卡 | ⬜ 未開始 |
| [013](013.md) | 關卡：第五章 Retry | 關卡 | ⬜ 未開始 |
| [014](014.md) | Final Stage 與 Boss：Perfectionism | 關卡 | ⬜ 未開始 |
| [015](015.md) | 音訊系統（Howler.js） | 系統 | ⬜ 未開始 |
| [016](016.md) | UI：首頁 / 暫停 / 設定 | UI | 🟨 進行中 |
| [017](017.md) | 相簿（Gallery） | UI | ✅ 完成 |
| [018](018.md) | 存檔系統（LocalStorage + Firebase Sync） | 系統 | 🟨 進行中 |
| [019](019.md) | 結局：玻璃碗生成、寶箱、Credits | 玩法 | 🟨 進行中 |
| [020](020.md) | 成就系統 | 系統 | ⬜ 未開始 |
| [021](021.md) | PWA 設定 | 平台 | ⬜ 未開始 |
| [022](022.md) | 部署至 Vercel | 部署 | ⬜ 未開始 |

## 目前盤點（2026-07-09）

- `package.json` 使用 `phaser@^3.90.0`；基礎 Vite / React / TypeScript、React Router、Zustand stores、`/game` Phaser 掛載與 event bus 已就緒。
- **Task 005 完成**：`Player.ts` 實作 Jump / Double Jump / Dash / Meow / Talk 與動畫狀態機；`InputController`（鍵盤）+ `TouchControls`（觸控按鈕式 D-pad）已串接 `GameScene`。**`GameScene` 仍為測試場景**（標題文字、裝飾用靜態黑糖 sprite 與可操控 Player 並存），正式關卡待 Task 009 起替換。
- **Memory Shard 為點擊拾取**：`GameScene.addMemoryShard()` 以 `pointerdown` 觸發 event bus，非 Player 碰撞；拾取不會呼叫 `player.triggerCollect()`。章節關卡實作後可改為碰撞自動拾取。
- Task 006 / 007 完成：Memory 收集解鎖流程、`MemoryOverlay` GSAP 動畫、Visual Novel 對話與 MBTI 選項 hook 已可用。
- Task 008 進行中：`useMbtiStore` + Forest Elder 單題 EI 對話計分已有；題庫（`data/mbti.ts`）、計分服務、16 型結果與玻璃碗對照表尚未建立。
- Task 016 進行中：首頁（Start / Gallery）與設定頁 UI 已有；Pause 選單、Fullscreen API、Continue / Restart、Howler 音量串接尚未實作。
- Task 017 進行中：`GalleryPage` + `useGalleryStore` + 重播動畫已有；剪影樣式、真實回憶 metadata 與 `assets/memories/` 照片尚待補齊。
- 章節關卡、Howler 音訊、Firebase Sync、PWA、Vercel 部署與成就系統尚未進入核心實作。

## 任務檔案格式

每個任務檔包含：目標、範圍、對應文件、實作步驟、驗收標準、相依任務。

## 狀態圖示

- ⬜ 未開始
- 🟨 進行中
- ✅ 完成

# Tasks — 任務索引（Index）

本資料夾為 **Quest for the Perfect Bowl** 的開發任務拆解。每個任務對應一個編號檔案，供實作與追蹤使用。

## 任務清單

| 編號 | 任務 | 分類 | 狀態 |
| --- | --- | --- | --- |
| [001](001.md) | 專案初始化（Vite + React + TS） | 基礎建設 | ✅ 完成 |
| [002](002.md) | 整合 Phaser 3 與 React | 基礎建設 | ✅ 完成 |
| [003](003.md) | 狀態管理（Zustand）與路由（React Router） | 基礎建設 | ✅ 完成 |
| [004](004.md) | 資源預載與美術資源結構 | 資源 | 🟨 進行中 |
| [005](005.md) | 主角黑糖：移動與能力 | 玩法 | ⬜ 未開始 |
| [006](006.md) | Memory 系統（收集與解鎖） | 玩法 | 🟨 進行中 |
| [007](007.md) | 對話系統（Visual Novel） | 玩法 | ⬜ 未開始 |
| [008](008.md) | MBTI 系統（題庫與計分） | 系統 | 🟨 進行中 |
| [009](009.md) | 關卡：第一章 Forest | 關卡 | ⬜ 未開始 |
| [010](010.md) | 關卡：第二章 City | 關卡 | ⬜ 未開始 |
| [011](011.md) | 關卡：第三章 Snow Mountain | 關卡 | ⬜ 未開始 |
| [012](012.md) | 關卡：第四章 Glass Studio | 關卡 | ⬜ 未開始 |
| [013](013.md) | 關卡：第五章 Retry | 關卡 | ⬜ 未開始 |
| [014](014.md) | Final Stage 與 Boss：Perfectionism | 關卡 | ⬜ 未開始 |
| [015](015.md) | 音訊系統（Howler.js） | 系統 | ⬜ 未開始 |
| [016](016.md) | UI：首頁 / 暫停 / 設定 | UI | 🟨 進行中 |
| [017](017.md) | 相簿（Gallery） | UI | 🟨 進行中 |
| [018](018.md) | 存檔系統（LocalStorage + Firebase Sync） | 系統 | 🟨 進行中 |
| [019](019.md) | 結局：玻璃碗生成、寶箱、Credits | 玩法 | 🟨 進行中 |
| [020](020.md) | 成就系統 | 系統 | ⬜ 未開始 |
| [021](021.md) | PWA 設定 | 平台 | ⬜ 未開始 |
| [022](022.md) | 部署至 Vercel | 部署 | ⬜ 未開始 |

## 目前盤點（2026-07-08）

- `package.json` 已與文件統一為 Phaser 3；目前使用 `phaser@^3.90.0`。
- 已完成基礎 Vite / React / TypeScript、React Router、Zustand stores、`/game` Phaser 掛載與 event bus。
- `PreloadScene`、資源 manifest、首頁 / 設定 / 相簿 / 結局預覽與部分 store 狀態已建立，但仍未達對應任務完整驗收。
- 玩家移動能力、正式 Memory 解鎖流程、對話系統、章節關卡、Howler 音訊服務、Firebase Sync、PWA、Vercel 部署與成就系統尚未進入核心實作。

## 任務檔案格式

每個任務檔包含：目標、範圍、對應文件、實作步驟、驗收標準、相依任務。

## 狀態圖示

- ⬜ 未開始
- 🟨 進行中
- ✅ 完成

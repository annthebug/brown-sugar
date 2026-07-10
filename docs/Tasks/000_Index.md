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
| [012](012.md) | 關卡：第四章 Glass Studio | 關卡 | ✅ 完成（見下方已知缺口） |
| [013](013.md) | 關卡：第五章 Retry | 關卡 | ✅ 完成 |
| [014](014.md) | Final Stage 與 Boss：Perfectionism | 關卡 | ✅ 完成（見下方已知缺口） |
| [015](015.md) | 音訊系統 | 系統 | ❌ 已取消 |
| [016](016.md) | UI：首頁 / 暫停 / 設定 | UI | 🟨 進行中（手機暫停鈕待補） |
| [017](017.md) | 相簿（Gallery） | UI | ✅ 完成 |
| [018](018.md) | 存檔系統（LocalStorage + Firebase Sync） | 系統 | 🟨 進行中 |
| [019](019.md) | 結局：玻璃碗生成、寶箱、Credits | 玩法 | 🟨 進行中 |
| [020](020.md) | 成就系統 | 系統 | 🟨 進行中 |
| [021](021.md) | PWA 設定 | 平台 | ✅ 完成 |
| [022](022.md) | 部署至 Vercel | 部署 | ✅ 完成 |

## 修復計畫（2026-07-10）— 待實作

完整分析、設計決策與分步 prompt 見 **[BUGFIX_PLAN_2026-07-10.md](BUGFIX_PLAN_2026-07-10.md)**。

| # | 問題 | 影響任務 | 狀態 |
| --- | --- | --- | --- |
| 1 | 內在嚮導在 Retry 與 Final 各出現一次；**最終章不應有內在嚮導** | 013、014 | ⬜ 待修 |
| 2 | 玻璃工坊爐火／吹製台無像素素材；吹製需可見動畫 | 004、012 | ⬜ 待修 |
| 3 | 感受爐火時黑糖無 emote 反應 | 012 | ⬜ 待修 |
| 4 | 少數場景 cutscene／提示仍殘留英文（主標題不變） | 007、016 | ⬜ 待修 |
| 5 | 手機沉浸式遊戲頁無返回首頁入口（缺暫停鈕） | 016 | ⬜ 待修 |

相關規格更新：`05_Characters.md`、`06_GameMechanics.md`、`07_MBTISystem.md`、`08_UIUX.md`、`09_Assets.md`、`assets/glass-studio-props.md`。

## 目前盤點（2026-07-10）

### 章節關卡（009–014 完成）

- `ForestScene`、`CityScene`、`SnowMountainScene`、`GlassStudioScene`、`RetryScene`、`FinalScene` 均已實作並於 `chapters.ts` 對應。
- 各章含 Memory Shard 拾取、NPC／Boss 對話、章節通關旗標（`forestChapterCleared` … `finalChapterCleared`）。
- `GlassStudioScene`：吹玻璃節奏小遊戲（Talk 峰值 3 次）已可玩；火爐／吹製台目前為 Phaser 幾何佔位（待補素材，見修復計畫 #2）。
- `RetryScene`：材料收集 + 內在嚮導（MBTI 最後 3 題）+ Inner Doubt Boss。
- `FinalScene`：共鳴點（Meow）+ 內在嚮導 + Perfectionism Boss（內在嚮導應移除，見修復計畫 #1）。

### MBTI（008 完成）

- `data/mbti.ts` 共 21 題，分散六章 NPC 對話；`services/mbti.ts` 計算四碼與玻璃碗對照。
- `useMbtiStore`：`answeredQuestionIds`、防重複計分、`isComplete()`、`getMbtiResult()`。
- `dialogues.ts` 主線對話已為繁體中文；`speakerName`／`title` 為角色稱謂（如「內在嚮導」「玻璃師傅」）。

### 核心玩法

- `Player`：Jump、Double Jump、Dash、Meow、Talk、Collect；`playEmote('happy' | 'sad')`。
- `DialogueBox` 分支對話、`MemoryOverlay` GSAP 過場、`GalleryPage` 相簿（剪影／重播）。
- 桌機：`InputController` 鍵盤；手機：`TouchControlsOverlay` 固定視窗 overlay + `useIsMobileGameShell` 沉浸式殼層。

### 音訊

- **已取消**：遊戲完全無音訊，無 Howler、無 `services/audio.ts`。

### UI（016 進行中）

- 首頁：開始旅程、繼續、相簿、設定（繁體中文）；`PauseMenu`（Esc／暫停後可返回首頁）。
- 桌機 `GamePage`：頂部「首頁」連結 + 精簡進度面板（無 debug 按鈕）。
- 手機 `game-shell--mobile`：隱藏 `AppNav`、header、進度面板；**尚無暫停鈕**（見修復計畫 #5）。
- 設定：繁體中文、Fullscreen API、`useFullscreenSync`。
- PWA（021）、`vercel.json` 部署（022）已完成。

### 結局（019 進行中）

- `EndingPage`：MBTI 玻璃碗 sprite、寶箱分層素材、黑糖入睡圖、GSAP Credits 捲動已有基礎實作。
- 通關後由 `FinalScene` 導向 `/ending`（`gameCompleted`）。

### 存檔（018 進行中）

- 各 Zustand store LocalStorage persist。
- `services/save.ts`、`services/firebase.ts` 已建立；Firebase 需 `.env` 設定後啟用雲端同步。

### 成就（020 進行中）

- `data/achievements.ts`、`useAchievementStore`、`AchievementPanel`／`AchievementToastStack` 已實作部分成就（如首片碎片、章節通關、MBTI 完成、旅程完成）。
- Speed Run、No Damage 等待補。

### 遺留／技術債

- `GameScene` 仍保留於 Phaser config 作測試場景。
- `RetryScene` 部分 cutscene 文案仍為英文（見修復計畫 #4）。
- Task 個別檔案（016、018、019、020）內「目前盤點」日期可能落後本索引，以本檔 **2026-07-10** 盤點為準。

## 任務檔案格式

每個任務檔包含：目標、範圍、對應文件、實作步驟、驗收標準、相依任務。

## 狀態圖示

- ⬜ 未開始
- 🟨 進行中
- ✅ 完成
- ❌ 已取消

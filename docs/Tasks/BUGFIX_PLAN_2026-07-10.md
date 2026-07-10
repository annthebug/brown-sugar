# 修復計畫 — 內在嚮導／玻璃工坊／繁中／手機導覽（2026-07-10）

> **範圍：** 僅分析與規格；實作依下方分步 prompt 執行。  
> **基準分支：** `main`（含 Task 011–014、手機沉浸式殼層 M1–M2）

---

## 總覽

| # | 問題 | 根因摘要 | 優先級 |
| --- | --- | --- | --- |
| 1 | 內在嚮導出現兩次 | Retry 與 Final 皆放置 `innerGuide` NPC，觸發同一套 `innerGuide` 對話 | P0 |
| 2 | 玻璃工坊爐火／吹製無素材 | `placeFurnace`／`placeBlowGlassStation` 僅用 Phaser 幾何圖形，無場景 sprite | P0 |
| 3 | 感受爐火黑糖無反應 | `showFurnaceMessage()` 只顯示文字，未呼叫 `player.playEmote()` | P1 |
| 4 | 對話／提示未全繁中 | 主線對話已繁中；少數場景 cutscene、成就等仍殘留英文 | P1 |
| 5 | 手機版無返回首頁 | `game-shell--mobile` 隱藏 `AppNav` 與 `game-header`，且無暫停鈕 | P0 |

**建議實作順序：** 1 → 5 → 3 → 2 → 4（先解敘事邏輯與手機阻斷，再補素材與文案稽核）

---

## 問題 1：內在嚮導出現兩次

### 根因分析

- `RetryScene`（第五章）在 `INNER_GUIDE_X` 放置 **內在嚮導** NPC，`triggerTalk('innerGuide')` 觸發 MBTI 最後 3 題（`final-tf-01`、`final-jp-01`、`final-ei-01`）。
- `FinalScene`（最終章）在 `INNER_GUIDE_X` **再次**放置同名 NPC，同樣 `triggerTalk('innerGuide')`；若 MBTI 未完成，還會阻擋面對 Perfectionism。
- 規格 `02_GameDesign.md`：第五章 Boss 為 **Inner Doubt**、最終章 Boss 為 **Perfectionism**；內在嚮導並非 Final Boss。
- `05_Characters.md` 原寫「內心之聲｜Retry / Final」造成實作誤解。

### 設計決策（已寫入規格）

| 項目 | 決策 |
| --- | --- |
| 內在嚮導出現章節 | **僅第五章 Retry** |
| MBTI 綜合補題（3 題） | **僅在 Retry 由內在嚮導觸發** |
| 最終章 Final Stage | **不出現內在嚮導 NPC**；保留共鳴點（Meow）＋ Perfectionism |
| MBTI 未完成進入 Final | 顯示引導訊息「請先完成第五章的內在對話」，**不重複觸發題目** |
| Retry 通關條件 | 建議：與內在嚮導對話完成（或 MBTI 21 題齊全）才可解鎖 Inner Doubt |

### 實作步驟

1. `FinalScene`：移除 `placeInnerGuide()`、`innerGuide` 成員、`isNearInnerGuide()` 互動分支。
2. `FinalScene`：Perfectionism 門檻改為 `useMbtiStore.getState().isComplete()`；未完成時 `showMomentText` 引導回 Retry，不開對話。
3. `RetryScene`：確認內在嚮導為 MBTI 最終題唯一入口；通關後 `completeRetryChapter` 寫入 store。
4. `GamePage`：`FINAL_NPC_DIALOGUES` 不含 `innerGuide`（已符合，複查即可）。
5. 更新 `docs/05_Characters.md`、`docs/07_MBTISystem.md`、`docs/Tasks/013.md`、`docs/Tasks/014.md`。

### Prompt（步驟 1）

```
依 docs/Tasks/BUGFIX_PLAN_2026-07-10.md 問題 1 與 docs/Tasks/014.md 修訂規格：

1. 從 FinalScene 完全移除內在嚮導 NPC（sprite、label、互動、guidanceReceived 邏輯）。
2. 最終章僅保留：共鳴點（Meow）→ Perfectionism Boss。
3. 若 MBTI 未完成（answeredQuestionIds < 21），靠近 Perfectionism 時顯示繁中引導：
   「還有一些溫柔的問題在第五章等著你。」不可再觸發 innerGuide 對話。
4. RetryScene 維持內在嚮導為 MBTI 最後 3 題唯一 NPC。
5. 瀏覽器驗證一次：Retry 對話內在嚮導 → 通關 → Final 不再出現內在嚮導。

不要引入音訊。獨立 commit。
```

---

## 問題 2：玻璃工坊爐火／吹製玻璃無素材

### 根因分析

- `GlassStudioScene.placeFurnace()`、`placeBlowGlassStation()` 使用 `rectangle`／`circle`／`ellipse` 程式繪製，**未載入** `assets/scenes/` 專用素材。
- `assetManifest.ts` 有玻璃師傅角色 atlas，**無** `glass-furnace`、`glass-blow-station` 等 key。
- 吹玻璃小遊戲**邏輯已存在**，但視覺僅靠 `blowGlassGlow` 圓形縮放，玩家難以辨識「吹製區」與「爐火」。

### 吹玻璃玩法確認（現行＋規格）

| 項目 | 規格 |
| --- | --- |
| 觸發 | 靠近吹製台且 `blowGlassState === 'idle'`，按 Talk／E |
| 玩法 | **節奏小遊戲**：橘色光暈以 sin 波脈動；在亮度 ≥ 72% 時按 Talk，成功累計 1 次 |
| 目標 | 連續成功 **3 次**（失誤歸零） |
| 完成 | `blowGlassState = success` → 提示與玻璃師傅 Boss 對話 → 不理想碗 cutscene |
| 手機 | `interactPrompt()` 顯示「在光芒最亮時點 Talk」 |
| **必要動畫** | 吹製中：玻璃管末端 **玻璃液滴脹大／收縮**（至少 3–4 幀 sprite 或 Phaser tween + 素材）；火爐：**爐門橘光循環**（2–3 幀） |

### 實作步驟

1. 新增佔位素材（見 `docs/assets/glass-studio-props.md`）並登記 `assetManifest`。
2. `placeFurnace`／`placeBlowGlassStation` 改為 sprite／atlas。
3. 吹玻璃進行中播放 `glass-blob-pulse` 動畫；完成時播放短暫「定型」幀。
4. PreloadScene 驗證載入；缺失時停留載入畫面（依 `09_Assets.md`）。

### Prompt（步驟 2a — 素材）

```
依 docs/assets/glass-studio-props.md 與 docs/09_Assets.md：

1. 建立玻璃工坊場景佔位素材（莫蘭迪、16bit、淡藍窗光＋柔橘火爐）：
   - glass-furnace-sprite-sheet-v1（idle + glow-1/2/3）
   - glass-blow-station-sheet-v1（bench + pipe + blob-idle/pulse-1/2/3）
2. 放入 assets/scenes/，附 Phaser atlas JSON。
3. 更新 assetManifest.ts、assets/manifest.json，保留穩定 asset key。
4. 不修改場景邏輯，僅素材與 manifest。獨立 commit。
```

### Prompt（步驟 2b — 場景接入）

```
依 docs/Tasks/012.md 吹玻璃小遊戲規格與 docs/Tasks/BUGFIX_PLAN_2026-07-10.md 問題 2：

1. GlassStudioScene：placeFurnace、placeBlowGlassStation 改用新素材 sprite。
2. 火爐預設播放 furnace-glow 循環動畫。
3. 吹玻璃小遊戲 active 時：播放 glass-blob-pulse；完成時短暫定格幀。
4. 維持現有節奏玩法（3 次峰值 Talk），提示維持繁中。
5. 瀏覽器驗證一次：爐火與吹製台有可見像素素材與動畫。獨立 commit。
```

---

## 問題 3：感受爐火溫度時黑糖無反應

### 根因分析

- `showFurnaceMessage()` 僅設定 `interactPrompt` 文案「爐火吐出溫暖而耐心的氣息。」，**未**呼叫 `this.player.playEmote()`。
- 同場景 `playImperfectBowlCutscene()` 有 `playEmote('sad')`；森林／城市互動亦有 emote 先例。
- `Player.playEmote` 目前僅支援 `'happy' | 'sad'`。

### 設計決策

| 項目 | 決策 |
| --- | --- |
| 爐火互動情緒 | `playEmote('happy')`（溫暖、放鬆） |
| 附加回饋 | 黑糖短暫停步 0.8s；爐火 glow tween 加速一輪（可選） |
| 防洗頻 | 2.2s 冷卻內不重複 emote（沿用 `furnaceMessageTimer`） |

### Prompt（步驟 3）

```
依 docs/Tasks/BUGFIX_PLAN_2026-07-10.md 問題 3：

在 GlassStudioScene.showFurnaceMessage()：
1. 呼叫 this.player.playEmote('happy')（若 player 存在且非 talk/dash 狀態）。
2. 黑糖面向火爐（可選：setFlipX 依火爐相對位置）。
3. 維持現有繁中提示文案與 2.2s 自動隱藏。
4. 瀏覽器驗證：靠近火爐按 Talk，黑糖播放 happy 表情。獨立 commit。
```

---

## 問題 4：遊戲對話／提示改繁體中文（標題不改）

### 根因分析

- `src/data/dialogues.ts` 主線 **已為繁體中文**（`speakerName`、`text`、`choices.label`）。
- **保留英文／不翻譯**（依需求「標題不要改」）：
  - 遊戲主標題 `Quest for the Perfect Bowl`（Home、Game header）
  - 章節 `eyebrow` 內英文專有名詞若已存在（如 Pixel RPG Story Adventure）
  - 程式識別用 `id`、`questionId`、asset key
- **仍須修正**（稽核發現）：
  - `RetryScene.ts` cutscene：`All materials gathered...`、`The true glass bowl takes shape...`
  - 成就 `achievements.ts` 若有英文 name／description
  - Phaser 場景內殘留英文 `setText`（全面 `rg` 掃描）
  - `PauseMenu`／`AppNav` 已繁中，複查 `aria-label`

### 翻譯原則

| 翻譯 | 不翻譯 |
| --- | --- |
| 對話本文、選項、場景互動提示、cutscene、按鈕、暫停選單 | `Quest for the Perfect Bowl` |
| 教學 HUD（桌機鍵位提示） | 路由 path、程式變數 |
| 成就名稱與說明 | MBTI 四碼（INTJ 等） |

### Prompt（步驟 4）

```
繁體中文文案稽核與補齊（標題 Quest for the Perfect Bowl 不變）：

1. rg 掃描 src/ 內使用者可見英文字串（setText、label、title 顯示用、achievements）。
2. 將殘留英文改為繁體中文（語氣溫柔、簡短）。
3. 明確不修改：Home h1「Quest for the Perfect Bowl」、dialogues 的 title 欄位（已是繁中角色稱謂則保留）。
4. 優先修正 RetryScene 兩段英文 cutscene。
5. 列出修改檔案清單於 commit message。瀏覽器抽測 Retry 通關與一場對話。獨立 commit。
```

---

## 問題 5：手機版遊戲畫面無返回首頁

### 根因分析

- `useIsMobileGameShell()` 為 true 時，`GamePage` **隱藏** `AppNav`、`game-header`（含「首頁」連結）、`store-panel`。
- 桌機版 `game-pause-button` 已移除；手機僅能靠 **Escape** 開暫停選單——觸控裝置無法使用。
- `PauseMenu` 已有「返回首頁」連結，但手機無法進入暫停選單。
- `docs/08_UIUX.md` M1 沉浸式規格未要求保留退出入口。

### 設計決策（已寫入 `08_UIUX.md`）

| 項目 | 規格 |
| --- | --- |
| 手機遊戲頁 | 右上角固定 **暫停鈕**（≥ 44×44px，`safe-area-inset-top/right`） |
| 暫停選單 | 維持「繼續／設定／重新開始本章／**返回首頁**」 |
| 可選 | 長按暫停鈕不新增；避免與 Talk 衝突 |
| 桌機 | 維持 Esc + 可選頂部暫停鈕 |

### Prompt（步驟 5）

```
依 docs/08_UIUX.md 手機遊戲導覽修訂：

1. 當 useIsMobileGameShell() 為 true，在 game-playfield 右上角顯示暫停按鈕（繁中「暫停」或 icon）。
2. 按鈕 fixed／absolute，尊重 safe-area-inset，z-index 高於 canvas、低於對話框。
3. 點擊開啟既有 PauseMenu（含返回首頁 Link）。
4. 對話／回憶播放／暫停中隱藏此鈕（與 TouchControlsOverlay 相同條件）。
5. 瀏覽器驗證：iPhone 尺寸下可暫停並返回首頁。獨立 commit。
```

---

## 驗收總表

| # | 驗收條件 |
| --- | --- |
| 1 | 全流程僅在 Retry 遇見內在嚮導；Final 無內在嚮導 sprite／對話 |
| 2 | 玻璃工坊爐火、吹製台有可見像素素材；吹玻璃時有脈動動畫 |
| 3 | 火爐互動時黑糖播放 happy emote |
| 4 | 無殘留使用者可見英文（主標題除外） |
| 5 | 手機遊戲畫面可開暫停並返回首頁 |

---

## 相關文件

- [05_Characters.md](../05_Characters.md) — 內在嚮導章節歸屬
- [06_GameMechanics.md](../06_GameMechanics.md) — 吹玻璃小遊戲機制
- [07_MBTISystem.md](../07_MBTISystem.md) — MBTI 題目分佈
- [08_UIUX.md](../08_UIUX.md) — 手機暫停／返回首頁
- [09_Assets.md](../09_Assets.md) — 工坊場景素材
- [assets/glass-studio-props.md](../assets/glass-studio-props.md) — 火爐／吹製台素材規格

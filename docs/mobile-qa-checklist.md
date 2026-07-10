# 手機版 QA 檢查清單

本文件供 **iPhone Safari** 與 **Android Chrome** 手動驗收使用。建議在 Vercel **Preview** 或 **Production** 網址上測試（非 `npm run dev`）。

視覺目標：淡藍天空 + 莫蘭迪色系；觸控目標 **≥ 44×44 px**。

---

## 測試前準備

1. 確認最新分支已部署至 Vercel，取得 Preview URL（例如 `https://brown-sugar-xxx.vercel.app`）。
2. 建議使用實機；若用模擬器，寬度 ≤ 820px，並開啟觸控模擬。
3. 清除舊版 PWA（若曾安裝）：刪除主畫面圖示 → 瀏覽器設定清除網站資料 → 重新開啟網址。

---

## 共通檢查（兩平台皆需）

| # | 項目 | 預期 | ✓ |
| --- | --- | --- | --- |
| 1 | 首頁 `/` 載入 | 淡藍天空背景、黑糖預覽、按鈕可點 | |
| 2 | SPA 重新整理 `/game` | 直接開啟或重新整理 **不 404**，進入遊戲頁 | |
| 3 | SPA 重新整理 `/gallery` | 直接開啟或重新整理 **不 404**，進入相簿 | |
| 4 | SPA 重新整理 `/settings` | 不 404 | |
| 5 | 首頁按鈕 | 單欄全寬，點擊區域夠大（拇指易點） | |

---

## iPhone Safari

### 環境
- iOS 16+，Safari（非 Chrome iOS 內建 WebView 亦可作參考）

### 步驟

1. **開啟 Preview URL**  
   輸入 Vercel 網址，確認首頁正常。

2. **SPA 路由**  
   - 點「開始旅程」進入 `/game`  
   - 點網址列重新整理 → 應仍為遊戲頁（非 Safari 404）  
   - 開新分頁直接輸入 `…/gallery` → 應顯示相簿

3. **觸控操作（Forest 第一章）**  
   - 左下 ◀ ▶ 移動；右下 Jump / Dash / Meow / Talk  
   - 按鈕不遮擋角色、彼此不重疊  
   - 收集回憶碎片、與 NPC 對話（Talk 或靠近互動）

4. **對話框**  
   - 全寬底部固定，選項按鈕夠大  
   - 不被虛擬按鈕完全遮住，可捲動閱讀長文

5. **暫停選單**  
   - 點「暫停」→ 全螢幕選單、大按鈕  
   - 「繼續」可回到遊戲

6. **PWA 安裝**  
   - 分享 → **加入主畫面**  
   - 從主畫面開啟 → standalone、天空色 status bar  
   - 離線（飛航模式）開啟 → 至少首頁可載入

7. **Forest 一章完成（選驗）**  
   - 理解巨罐對話 → 章節清除 → 回憶 overlay 播放

---

## Android Chrome

### 環境
- Android 12+，Chrome 最新版

### 步驟

1. **開啟 Preview URL**  
   確認首頁與導覽列可點。

2. **SPA 路由**  
   同 iPhone： `/game`、`/gallery` 重新整理與深連結皆不 404。

3. **觸控操作（Forest）**  
   同 iPhone；建議 **橫向** 遊玩（PWA `orientation: landscape`）。

4. **對話與暫停**  
   同 iPhone 第 4–5 項。

5. **PWA 安裝**  
   - 網址列或選單 → **安裝應用程式** / **加入主畫面**  
   - 安裝後從桌面圖示開啟  
   - 離線開啟首頁

6. **Forest 一章（選驗）**  
   完成移動、跳躍、對話、章節結算。

---

## 已知限制

- 遊戲本體 **無 BGM / 音效**（設計如此）。
- 首次進入 `/game` 需載入 Phaser 與素材，弱網可能較慢。
- Firebase 未設定時僅 LocalStorage 存檔，不影響單機遊玩驗收。

---

## 問題回報格式

```
裝置：iPhone 15 / iOS 18 / Safari
網址：https://…vercel.app/game
步驟：重新整理後
預期：遊戲頁
實際：404 / 白畫面 / …
截圖：（可附）
```

---

## 相關文件

- 部署設定：[13_Deployment.md](13_Deployment.md)
- UI 規格：[08_UIUX.md](08_UIUX.md)
- PWA：[Tasks/021.md](Tasks/021.md)

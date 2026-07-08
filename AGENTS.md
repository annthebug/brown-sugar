# AGENTS.md

## Cursor Cloud specific instructions

本專案為 **Quest for the Perfect Bowl** — React + Vite + Phaser 的 Pixel RPG 網頁遊戲。詳見 `docs/`（架構見 `docs/11_TechnicalArchitecture.md`）。

### 服務與指令
- 單一前端服務（Vite dev server）。標準指令定義於 `package.json` scripts：
  - `npm run dev`（開發，預設 port 5173，`server.host` 已開啟）
  - `npm run build`（`tsc -b` 型別檢查 + `vite build`，同時產生 PWA service worker）
  - `npm run lint`、`npm run typecheck`、`npm run preview`

### 非顯而易見的注意事項
- **Firebase 為選用**：未設定 `VITE_FIREBASE_*` 環境變數時，`src/services/firebase.ts` 的 `getFirebase()` 會回傳 `null`，App 以純 LocalStorage 執行。因此本機開發與測試「不需要」任何密鑰即可完整運作；雲端同步（Firestore）才需要 `.env.local`（範本見 `.env.example`）。
- **路由使用 BrowserRouter**：正式部署需 SPA fallback（Vercel 預設支援）；本機 Vite dev 直接開深層路由沒問題。
- **路徑別名**：`@/` 對應 `src/`（於 `vite.config.ts` 與 `tsconfig.app.json` 同步設定，兩處需一致）。
- **Phaser 打包較大**：`vite build` 會出現「chunk > 500 kB」警告（Phaser 本身約 1.7MB），屬預期，非錯誤。
- **狀態持久化**：Zustand store 以 `persist` 寫入 LocalStorage（keys 前綴 `qftpb:`）。測試存檔相關行為時，清除 LocalStorage 可重置。
- **玩法尚未實作**：目前 `src/game/scenes` 僅有 Boot / Preload / MainMenu 佔位場景；React 頁面為殼層。後續實作對應 `docs/Tasks/`。

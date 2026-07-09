# 13 — 部署（Deployment）

## 平台

- **Vercel**：前端部署與 CI/CD。
- **Firebase**：Firestore + Storage（資料與媒體）。

## 環境變數

於 Vercel 專案設定與本機 `.env.local` 配置（不進版控）。可先複製 repo 內的 `.env.example`：

```bash
cp .env.example .env.local
```

| 變數 | 用途 | 範例 |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication 網域 | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firestore / Firebase 專案 ID | `project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | `project-id.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender id | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase web app id | `1:1234567890:web:abcdef` |

> 若缺少任一 `VITE_FIREBASE_*` 變數，前端會退回本機離線模式，雲端存檔與同步不會啟用。

## 建置指令

| 指令 | 用途 |
| --- | --- |
| `npm install` | 安裝相依 |
| `npm run dev` | 本機開發（Vite dev server） |
| `npm run build` | 產出正式版 |
| `npm run preview` | 本機預覽正式版 |
| `npm run lint` | 程式碼檢查 |

## Vercel 設定

- Framework Preset：Vite。
- Build Command：`npm run build`。
- Output Directory：`dist`。
- Install Command：`npm install`。
- Node.js：使用 Vercel 預設 LTS 即可。
- Environment Variables：如上表，至少同步到 `Preview` 與 `Production`。
- `vercel.json` 已定義 SPA rewrite，讓 `/game`、`/gallery`、`/settings`、`/ending` 等路由可直接開啟。

### `vercel.json` 重點

- 以 `vite` framework 建置。
- 固定使用 `npm run build` 與 `dist` output。
- 對 `manifest.webmanifest` 與 `sw.js` 設定 revalidate/no-cache 標頭。
- 以 rewrite 將非靜態資源路徑導回 `index.html`，確保 React Router 的 client-side routing 正常。

## PWA 部署注意

- 確認 service worker 與 manifest 正確產生。
- 快取策略需在版本更新時失效舊資源。
- 若調整大量資產或主 bundle 體積，需同步檢查 Workbox precache 大小限制。

## 部署流程

```
第一次：在 Vercel 匯入 GitHub repo → 選擇 Vite preset → 填入環境變數 → 建立專案
日常：push 到功能分支 → Vercel 自動建置 Preview URL
正式：merge 到 main → Vercel 產出 Production
```

## Preview / Production 驗證

1. Push 任一功能分支，確認 Vercel 產生 Preview Deployment。
2. 打開 Preview URL，檢查：
   - 首頁可載入。
   - 重新整理 `/game` 或 `/gallery` 不會 404。
   - `manifest.webmanifest` 與 `sw.js` 可正常回應。
3. Merge 到 `main` 後確認 Production Deployment 成功。
4. 於正式站檢查 Firebase 設定、PWA 安裝與離線啟動。

## 上線檢查清單

- [ ] `vercel.json` 已存在於 repo 根目錄
- [ ] Vercel Project 已連結正確 GitHub repo
- [ ] Framework Preset 為 Vite
- [ ] Install Command 為 `npm install`
- [ ] Build Command 為 `npm run build`
- [ ] Output Directory 為 `dist`
- [ ] Firebase 環境變數已於 Vercel 設定
- [ ] Firebase 環境變數已同步到 Preview 與 Production
- [ ] Firestore / Storage Security Rules 已設定
- [ ] Preview Deployment 可成功建置
- [ ] 直接開啟 `/game`、`/gallery`、`/settings` 等路由不會 404
- [ ] PWA 可安裝且離線可啟動
- [ ] 桌機與行動裝置操作皆正常
- [ ] 存檔與雲端同步正常

## 相關文件

- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)
- 資料庫：[12_Database](12_Database.md)

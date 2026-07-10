# 13 — 部署（Deployment）

## 平台

- **Vercel**：前端部署與 CI/CD。
- **Firebase**：Firestore + Storage（資料與媒體）。

## 環境變數

於 Vercel 專案設定與本機 `.env.local` 配置（不進版控）：

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 建置指令

| 指令 | 用途 |
| --- | --- |
| `npm install` | 安裝相依 |
| `npm run dev` | 本機開發（Vite dev server） |
| `npm run build` | 產出正式版 |
| `npm run preview` | 本機預覽正式版 |
| `npm run lint` | 程式碼檢查 |

本機環境變數請複製 `.env.example` 為 `.env.local`（已被 `.gitignore` 排除，不進版控）。

## Vercel 設定

專案根目錄已包含 `vercel.json`：

- Framework Preset：**Vite**
- Build Command：`npm run build`
- Output Directory：`dist`（與 `vite.config.ts` `build.outDir` 一致）
- **SPA Rewrite**：無副檔名之路徑（如 `/game`、`/gallery`）導向 `index.html`；`assets/`、`icons/` 與含副檔名之靜態檔由檔案系統直接提供，避免重新整理 404
- `cleanUrls: false`、`trailingSlash: false`：與 React Router `BrowserRouter` 路徑一致
- Environment Variables：見上表；可參考 `.env.example`

### 手機驗收

實機 QA 步驟見 **[mobile-qa-checklist.md](mobile-qa-checklist.md)**（iPhone Safari、Android Chrome、觸控、對話、暫停、PWA、SPA 重新整理）。

### 首次連結步驟

1. 於 [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project** → 選擇本 GitHub repo。
2. 確認 Build / Output 與 `vercel.json` 一致後 Deploy。
3. 於 Project Settings → Environment Variables 填入 Firebase `VITE_*` 變數（選填；未設定時僅停用雲端同步）。
4. 之後每次 push 分支會產生 Preview；merge 至 `main` 會更新 Production。

## PWA 部署注意

- 確認 service worker 與 manifest 正確產生。
- 快取策略需在版本更新時失效舊資源。

## 部署流程

```
push 到 Git 分支 → Vercel 自動建置 → Preview URL
merge 到主分支 → Vercel 產出 Production
```

## 上線檢查清單

- [ ] Firebase 環境變數已於 Vercel 設定
- [ ] Firestore / Storage Security Rules 已設定
- [ ] PWA 可安裝且離線可啟動
- [ ] `/game`、`/gallery` 重新整理不 404（SPA rewrite）
- [ ] [手機 QA 清單](mobile-qa-checklist.md) 於 Preview URL 通過
- [ ] 桌機與行動裝置操作皆正常
- [ ] 存檔與雲端同步正常

## 相關文件

- 手機 QA：[mobile-qa-checklist.md](mobile-qa-checklist.md)
- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)
- 資料庫：[12_Database](12_Database.md)

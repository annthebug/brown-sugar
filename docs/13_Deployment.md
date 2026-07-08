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

## 建置指令（規劃）

| 指令 | 用途 |
| --- | --- |
| `npm install` | 安裝相依 |
| `npm run dev` | 本機開發（Vite dev server） |
| `npm run build` | 產出正式版 |
| `npm run preview` | 本機預覽正式版 |
| `npm run lint` | 程式碼檢查 |

> 註：目前 repo 尚未有 `package.json`，上述為專案落地後的預期指令。

## Vercel 設定

- Framework Preset：Vite。
- Build Command：`npm run build`。
- Output Directory：`dist`。
- Environment Variables：如上表。

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
- [ ] 桌機與行動裝置操作皆正常
- [ ] 音訊在行動裝置可正常播放
- [ ] 存檔與雲端同步正常

## 相關文件

- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)
- 資料庫：[12_Database](12_Database.md)

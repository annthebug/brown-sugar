# 11 — 技術架構（Technical Architecture）

## 技術棧

| 分類 | 技術 |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Game Engine | Phaser 3 |
| Animation | GSAP |
| State | Zustand |
| Routing | React Router |
| Backend / DB | Firebase（Firestore） |
| Storage | Firebase Storage |
| Deployment | Vercel |

## 架構分層

```
┌─────────────────────────────────────────┐
│  React (UI Shell)                         │
│   - Router：頁面切換（Home / Game / ...）  │
│   - UI 元件：選單、設定、相簿              │
│   - Zustand：全域狀態                     │
├─────────────────────────────────────────┤
│  Phaser 3 (Game Layer)                    │
│   - Scenes：各章節、Boss、回憶播放         │
│   - 玩家控制、物理、碰撞、收集             │
├─────────────────────────────────────────┤
│  Services                                 │
│   - Save Service（LocalStorage + Firebase）│
│   - MBTI Service（計分）                  │
├─────────────────────────────────────────┤
│  Firebase（Firestore + Storage）          │
└─────────────────────────────────────────┘
```

## React 與 Phaser 的整合

- React 負責「殼」（頁面路由、UI、選單、相簿、設定）。
- Phaser 負責「遊戲」（關卡、角色、物理、Boss）。
- 兩者透過事件匯流排（event bus）或 Zustand store 溝通（例如遊戲內解鎖回憶 → 通知 React 顯示回憶動畫）。

## 狀態管理（Zustand）

建議切分多個 store：

- `useGameStore`：進度、章節、Memory Shards。
- `useMbtiStore`：MBTI 計分與結果。
- `useSettingsStore`：Language、Fullscreen。
- `useGalleryStore`：已解鎖回憶。

## 路由（React Router）

| Path | 畫面 |
| --- | --- |
| `/` | Home |
| `/game` | 遊戲（Phaser 掛載） |
| `/gallery` | 相簿 |
| `/settings` | 設定 |
| `/ending` | 結局 / Credits |

## 建議專案結構（src/）

```
src/
├── main.tsx
├── App.tsx
├── routes/
├── components/        # React UI 元件
├── game/              # Phaser
│   ├── scenes/
│   ├── objects/
│   └── config.ts
├── stores/            # Zustand
├── services/          # save / mbti / firebase
├── data/              # MBTI 題庫、關卡設定、回憶內容
└── assets/            # 引用（實體檔於根 assets/）
```

## PWA

- 使用 Vite PWA 外掛產生 manifest 與 service worker。
- 快取遊戲資源以支援離線啟動。

## 效能考量

- Sprite atlas 打包，減少請求數。
- 資源預載（preload scene）。
- 行動裝置控制粒子與特效數量以維持流暢度。

## 相關文件

- 資料庫：[12_Database](12_Database.md)
- 部署：[13_Deployment](13_Deployment.md)

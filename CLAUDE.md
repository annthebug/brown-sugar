# CLAUDE.md — Cursor / Claude AI 專用規則

本文件提供給 Cursor / Claude 等 AI 助手，在協助開發 **Quest for the Perfect Bowl** 時應遵循的規則與脈絡。

---

## 專案脈絡

- 專案為一款 **Pixel RPG 網頁遊戲**，主題是「找回玻璃抹茶碗與一路走過的回憶」。
- 主角是貓咪「黑糖」。
- 遊戲隱藏了一套 **MBTI 測驗**，玩家透過 NPC 對話自然完成，不可讓玩家感覺在「做測驗」。
- 這是一份專屬兩人的禮物，語氣須溫暖、柔和、不暴力，視覺以淡藍色天空與莫蘭迪色系為主。

---

## 溝通語言

- 與使用者互動時，一律使用 **繁體中文**。
- 程式碼、變數、commit message 使用英文；註解可視情況使用繁體中文。

---

## 技術約束

| 分類 | 指定技術 | 不可任意替換 |
| --- | --- | --- |
| Frontend | React + TypeScript + Vite | ✅ |
| Game Engine | Phaser 3 | ✅ |
| Animation | GSAP | ✅ |
| State | Zustand | ✅ |
| Routing | React Router | ✅ |
| Audio | Howler.js | ✅ |
| Backend / DB | Firebase（Firestore + Storage） | ✅ |
| Deploy | Vercel | ✅ |

- 未經討論，**不得**引入上表以外的框架或替代方案。
- 一律使用 TypeScript，避免 `any`。
- 狀態管理集中於 Zustand store，避免散落的全域變數。

---

## 程式風格

- 元件檔案使用 `PascalCase.tsx`；hooks 使用 `useXxx.ts`。
- Phaser 場景（Scene）以 `XxxScene.ts` 命名。
- 遵循單一職責：UI（React）與遊戲邏輯（Phaser）分層清楚。
- 避免無意義的註解；註解只說明「為什麼」，不解釋「做了什麼」。

---

## 內容與敘事規則

- 保持淡藍色天空背景、莫蘭迪色系、柔和、Pokémon Pixel Art 風格。
- 整體遊戲畫面以淡藍色為主，使用低飽和灰藍、霧粉、鼠尾草綠、米杏等莫蘭迪輔色。
- 禁止暴力、血腥、負面攻擊性內容。
- Boss 象徵情緒（時間、距離、完美主義），非傳統敵人，擊敗方式偏向理解與釋懷。
- 回憶（Memory）內容為真實照片＋一句文字，請以佔位資源處理，不得杜撰真實隱私內容。

---

## 開發流程規則

- 進行任何較大變更前，先參考 `docs/` 內對應設計文件。
- 實作任務時對應 `docs/Tasks/` 內的任務編號。
- 每個邏輯變更獨立 commit，訊息清楚。
- 不擅自刪除既有文件或資產。

---

## Development behavior

- Do not start dev servers.
- Do not run demos or previews automatically.
- Do not open browser previews.
- Only modify code and provide instructions.
- Before running any command that starts a server, ask for confirmation.

---

## AI 協作優先順序

1. 系統／使用者的直接指示
2. 本文件（CLAUDE.md）與 `.cursorrules`
3. `docs/` 內設計文件
4. 一般最佳實務

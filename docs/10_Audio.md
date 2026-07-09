# 10 — 音效（Audio）

## 設計決策

**本遊戲不包含任何音訊。** 無背景音樂（BGM）、無音效（SFX）、無音量設定。

體驗以視覺、文字與互動為主，保持安靜、柔和的沉浸感。

## 實作說明

- 不引入 Howler.js 或其他音訊函式庫。
- 不建立 `services/audio.ts` 或 `assets/audio/` 資源。
- 設定頁僅保留 Language、Fullscreen 等與音訊無關的選項。

## 相關文件

- 設定 UI：[08_UIUX](08_UIUX.md)
- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)

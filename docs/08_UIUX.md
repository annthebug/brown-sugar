# 08 — UI / UX

## 設計原則

- Pixel 16bit 風格、暖色系、柔和。
- 介面簡潔，減少文字負擔，強調情感氛圍。
- 同時支援桌機與觸控操作。

## 畫面結構

### 首頁（Home）
- Start
- Continue
- Gallery
- Setting

### 暫停選單（Pause）
- Resume
- Setting
- Restart
- Exit

### 設定（Setting）
- BGM
- Sound
- Language
- Fullscreen

### 相簿（Gallery）
每張照片顯示：
- 日期
- 一句話
- 動畫

## 遊戲內 HUD

- Memory Shards 收集進度（朝向 100 解鎖回憶）。
- 章節 / 位置提示。
- 對話框（NPC 對話、MBTI 選項）。

## 對話 UI

- Visual Novel 風格對話框。
- MBTI 題目以一般對話選項呈現，不標示「測驗」。
- 選項簡短（A / B 形式）。

## 回憶播放 UI

回憶動畫序列：

```
Pixel → Fade → 真正照片 → 一句文字 → Continue → Pixel
```

## 響應式與觸控

| 裝置 | 操作 |
| --- | --- |
| Desktop | 鍵盤 + 滑鼠 |
| iPad / iPhone / Android | 虛擬搖桿 + 動作按鈕（觸控） |

## PWA

- 可安裝至主畫面。
- 提供啟動圖示與載入畫面。

## 無障礙 / 體驗細節

- 提供 Fullscreen 選項。
- 音量可分別調整 BGM 與 Sound。
- 支援語言切換（Language）。

## 相關文件

- 美術：[09_Assets](09_Assets.md)
- 音效：[10_Audio](10_Audio.md)

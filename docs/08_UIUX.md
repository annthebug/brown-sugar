# 08 — UI / UX

## 設計原則

- Pixel 16bit 風格、淡藍色天空背景、莫蘭迪色系、柔和。
- 介面簡潔，減少文字負擔，強調情感氛圍。
- 同時支援桌機與觸控操作。

## 色彩系統

| 用途 | 色彩方向 |
| --- | --- |
| 背景 | 淡藍色天空、霧藍漸層、低飽和雲朵 |
| 主色 | 灰藍、霧藍、水色 |
| 輔色 | 霧粉、鼠尾草綠、米杏、淺暖灰 |
| 文字 | 深灰藍，避免純黑造成突兀 |
| 強調 | 柔和玻璃青或低飽和金杏，用於 Memory Shards 與主要按鈕 |

- 首頁、遊戲場景、暫停選單與相簿底層皆需維持淡藍天空氛圍。
- UI 面板使用半透明淺色底與灰藍描邊，避免厚重暗色面板。
- 按鈕 hover / focus 狀態以亮度與柔和描邊變化呈現，不使用高飽和警示色。

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
- 音量可調整 Sound。
- 支援語言切換（Language）。

## 相關文件

- 美術：[09_Assets](09_Assets.md)
- 音效：[10_Audio](10_Audio.md)

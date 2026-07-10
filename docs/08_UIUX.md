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
- Language（繁體中文）
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
| iPad / iPhone / Android | 按鈕式 D-pad + 動作按鈕（`TouchControlsOverlay`） |

### 手機版規格（≤ 820px）

目標裝置：**iPhone Safari**、**Android Chrome**。視覺維持淡藍天空 + 莫蘭迪色系。

| 項目 | 規格 |
| --- | --- |
| 斷點 | `max-width: 820px`（與 `(pointer: coarse)` 並用於觸控 UI） |
| 觸控目標 | 可點擊區域 **≥ 44×44 px**（按鈕、導覽、對話選項、暫停選單） |
| Safe area | `viewport-fit=cover` + `env(safe-area-inset-*)`；`index.html` 設 `theme-color: #d8edf4` |
| 首頁 | 單欄排列；主要 CTA 全寬、加大行高 |
| 對話框 | 直向：全寬底部 sheet；橫向：全螢幕滿版。對話進行時隱藏觸控按鈕 |
| 暫停選單 | 全螢幕覆蓋、大按鈕縱向排列，拇指易點 |
| 相簿／設定／結局 | 單欄卡片；圖片 `width: 100%` 自適應 |
| 遊戲頁 | 沉浸式殼層；`TouchControlsOverlay` 固定於視窗左下／右下 |

### PWA / 主畫面

- `apple-mobile-web-app-capable`：可加入主畫面後以全螢幕 Web App 開啟。
- `theme-color`：瀏覽器 UI 與天空背景一致（`#d8edf4`）。

## PWA

- 可安裝至主畫面。
- 提供啟動圖示與載入畫面。

## 無障礙 / 體驗細節

- 提供 Fullscreen 選項。
- 語系固定繁體中文（專屬禮物，無多語系切換）。

## 相關文件

- 美術：[09_Assets](09_Assets.md)
- 音效：[10_Audio](10_Audio.md)

# 10 — 音效（Audio）

## 技術

- 使用 **Howler.js** 進行音訊播放與管理。
- 音量分為 **BGM** 與 **Sound（SFX）** 兩軌，可於設定中分別調整。

## 背景音樂（BGM）

| 場景 | 氛圍 |
| --- | --- |
| Forest | 清新、自然 |
| City | 溫暖、都市節奏 |
| Snow Mountain | 靜謐、遼闊 |
| Glass Studio | 專注、暖橘 |
| Retry / Final | 情緒張力、釋然 |
| Ending | Ending Piano（鋼琴收尾） |

## 音效（SFX）

- 森林：風吹
- 貓叫（Meow）
- 腳步
- 玻璃敲擊
- 火焰
- Boss 相關音效
- Ending Piano

## 設計原則

- 柔和、不刺耳，配合暖色系與不暴力基調。
- Boss 音效營造壓力但不驚嚇。
- 回憶播放時搭配柔和過場音樂，強化情感。

## 實作建議

- 建立音訊資源清單與預載機制，避免首次播放延遲。
- 提供靜音 / 音量記憶（存入設定，同步存檔）。
- 行動裝置需處理首次互動後才可播放音訊的限制。

## 相關文件

- 設定 UI：[08_UIUX](08_UIUX.md)
- 技術架構：[11_TechnicalArchitecture](11_TechnicalArchitecture.md)

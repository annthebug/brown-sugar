# Quest for the Perfect Bowl

> 找回的不只是玻璃碗，而是一路走過的回憶。

一款專屬兩人的 **Pixel RPG 網頁遊戲**。玩家操控貓咪主角「黑糖」展開冒險，沿途收集「回憶碎片（Memory Shards）」，逐步拼湊彼此的故事。過程中玩家會在毫無察覺的情況下，透過 NPC 自然對話完成一次 **16 型人格（MBTI）** 分析。

最終將獲得：

- 專屬玻璃抹茶碗（依 MBTI 生成不同花紋）
- MBTI Personality 結果
- 一路收集的回憶相簿
- Credits

---

## 專案定位

| 項目 | 內容 |
| --- | --- |
| 專案名稱 | Quest for the Perfect Bowl |
| 遊戲類型 | Pixel RPG / Story Adventure / Visual Novel / Personality Test / Memory Album |
| 目標受眾 | 專屬兩人（送給對方的禮物型遊戲） |
| 平台 | Web（Desktop / iPad / iPhone / Android）＋ PWA 可安裝 |
| 主題調性 | Pixel 16bit、淡藍色天空背景、莫蘭迪色系、柔和、Pokémon Pixel Art 感、不暴力 |

---

## 技術棧

| 分類 | 技術 |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Game Engine | Phaser 3 |
| Animation | GSAP |
| State | Zustand |
| Routing | React Router |
| Audio | Howler.js |
| Database | Firebase |
| Storage | Firebase Storage |
| Deployment | Vercel |

---

## 專案結構

```
Quest-for-the-Perfect-Bowl/
├── README.md
├── CLAUDE.md                  # Cursor / Claude AI 專用規則
├── .cursorrules               # Cursor Rules
├── docs/
│   ├── 00_ProjectOverview.md
│   ├── 01_ProductRequirements.md
│   ├── 02_GameDesign.md
│   ├── 03_Story.md
│   ├── 04_WorldBuilding.md
│   ├── 05_Characters.md
│   ├── 06_GameMechanics.md
│   ├── 07_MBTISystem.md
│   ├── 08_UIUX.md
│   ├── 09_Assets.md
│   ├── 10_Audio.md
│   ├── 11_TechnicalArchitecture.md
│   ├── 12_Database.md
│   ├── 13_Deployment.md
│   └── Tasks/
│       ├── 000_Index.md
│       ├── 001.md
│       ├── 002.md
│       └── ...
├── assets/
└── src/
```

---

## 文件導覽

| 文件 | 說明 |
| --- | --- |
| [00_ProjectOverview](docs/00_ProjectOverview.md) | 專案總覽 |
| [01_ProductRequirements](docs/01_ProductRequirements.md) | 產品需求（PRD） |
| [02_GameDesign](docs/02_GameDesign.md) | 遊戲設計 |
| [03_Story](docs/03_Story.md) | 故事腳本 |
| [04_WorldBuilding](docs/04_WorldBuilding.md) | 世界觀 |
| [05_Characters](docs/05_Characters.md) | 角色設定 |
| [06_GameMechanics](docs/06_GameMechanics.md) | 遊戲機制 |
| [07_MBTISystem](docs/07_MBTISystem.md) | MBTI 系統 |
| [08_UIUX](docs/08_UIUX.md) | UI / UX |
| [09_Assets](docs/09_Assets.md) | 美術資源 |
| [10_Audio](docs/10_Audio.md) | 音效 |
| [11_TechnicalArchitecture](docs/11_TechnicalArchitecture.md) | 技術架構 |
| [12_Database](docs/12_Database.md) | 資料庫 |
| [13_Deployment](docs/13_Deployment.md) | 部署 |
| [Tasks/](docs/Tasks/000_Index.md) | 開發任務拆解 |

---

## 核心玩法（速覽）

主角：**黑糖**（貓咪）

能力：`Jump`、`Double Jump`、`Dash`、`Meow`、`Collect Memory`、`Talk`

遊戲流程：

```
開始 → 森林 → 城市 → 雪山 → 玻璃工坊 → 重新製作 → 最後 Boss
     → 得到玻璃碗 → MBTI → Credits
```

---

## 版本

Version 1.0

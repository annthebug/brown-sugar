# Glass Studio Scene Props v1

佔位規格：玻璃工坊 **火爐** 與 **吹製工作台** 場景素材。風格與全遊戲一致：Pixel 16bit、淡藍窗光、莫蘭迪色系、柔橘爐火、不暴力。

## 檔案

| Asset key | 檔案 | 說明 |
| --- | --- | --- |
| `glass-furnace` | `assets/scenes/glass-furnace-sprite-sheet-v1.png` + `.json` | 磚砌爐身 + 爐門 + 煙囪 |
| `glass-blow-station` | `assets/scenes/glass-blow-station-sheet-v1.png` + `.json` | 工作台 + 吹管 + 玻璃液滴 |

## glass-furnace 幀

| Frame key | 說明 |
| --- | --- |
| `glass-furnace-idle` | 爐門微光（靜態） |
| `glass-furnace-glow-1` | 橘光較弱 |
| `glass-furnace-glow-2` | 橘光最亮（主循環峰值） |
| `glass-furnace-glow-3` | 橘光回落 |

- 建議動畫 `glass-furnace-glow`：1→2→3→2→1 循環，約 900ms／幀，與現有 `furnaceGlow` tween 節奏一致。
- 主色：爐身灰藍／米杏磚；爐門內柔橘 `#e8b898` 系。

## glass-blow-station 幀

| Frame key | 說明 |
| --- | --- |
| `glass-blow-bench-idle` | 工作台 + 吹管 + 空管 |
| `glass-blob-pulse-1` | 管端玻璃液滴小 |
| `glass-blob-pulse-2` | 液滴中（對應小遊戲光暈 50%） |
| `glass-blob-pulse-3` | 液滴大（對應光暈峰值，玩家應在此時 Talk） |
| `glass-blob-set` | 吹製成功後短暫定型（可選） |

- 建議動畫 `glass-blob-pulse`：在吹玻璃小遊戲 `active` 狀態播放，幀率跟隨 `blowGlassPhase` 或獨立 3 幀循環。
- 玻璃管：半透明玻璃青 `#b8d4e8`；工作台：米杏 `#e8dcc8`。

## 場景接入要點

- `GlassStudioScene.placeFurnace()`：以 sprite 取代 `rectangle`／`circle` 爐體；可保留輕量 particle 或 glow 疊加。
- `GlassStudioScene.placeBlowGlassStation()`：bench + pipe 用 atlas；`blowGlassGlow` 可改為 blob 動畫幀 alpha 而非純圓形。
- 替換時 **保留** 互動熱區座標（`FURNACE_X`、`BLOW_GLASS_X`）與 `INTERACT_RADIUS`。

## 相關文件

- [09_Assets.md](../09_Assets.md)
- [Task 012 — Glass Studio](../Tasks/012.md)
- [BUGFIX_PLAN_2026-07-10.md](../Tasks/BUGFIX_PLAN_2026-07-10.md)

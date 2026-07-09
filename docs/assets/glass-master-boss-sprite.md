# Glass Master Boss Sprite Sheet v1

## Files

- `assets/characters/glass-master-boss-sprite-sheet-v1.png`
- `assets/characters/glass-master-boss-sprite-sheet-v1.json`

## Character

**Glass Master Boss（玻璃師傅 Boss）** — Glass Studio chapter workshop boss.

| Trait | Direction |
| --- | --- |
| Symbolism | Warmth between perfection and devotion — not a violent enemy |
| Personality | Focused, warm, quietly intense but kind |
| Form | Same artisan silhouette as Glass Master NPC (front-facing) |
| Gear | Silver hair, forehead goggles, warm beige apron, glass piece |
| Aura | Soft Morandi orange workshop glow halo (not fire, not horror) |

> Distinct from **Glass Master** NPC (`glass-master` side atlas) at workshop entrance. This boss uses `glass-master-boss-*` frames.

Legacy placeholder frame key: `glass-master-boss-idle` (unified `boss-characters` atlas).

In-game dialogue script: `glassMasterBoss`. Scene: `GlassStudioScene.placeGlassMasterBoss()`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel + soft orange glow, pale blue sky compatible.
- Transparent background; cute-not-scary workshop spirit — original Arrietty-craft archetype, not a direct Ghibli copy.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `glass-master-boss-idle` | Rest |
| 1 | `glass-master-boss-pulse-1` | Furnace glow rising |
| 2 | `glass-master-boss-pulse-2` | Glow peak |
| 3 | `glass-master-boss-pulse-3` | Glow fading |

## Phaser usage

```typescript
import { ASSET_KEYS, GLASS_MASTER_BOSS_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.glassMasterBoss, GLASS_MASTER_BOSS_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'glass-master-boss-glow',
  frames: [
    { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse1 },
    { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse2 },
    { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse3 },
    { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('glass-master-boss-glow')
```

## Regeneration

```bash
python3 scripts/generate-glass-master-boss-sprite.py
```

## Integration

- `GlassStudioScene.placeGlassMasterBoss()` uses `ASSET_KEYS.glassMasterBoss` + `GLASS_MASTER_BOSS_FRAMES.idle`.
- Boss sprite plays `glass-master-boss-glow` animation (3 fps loop).

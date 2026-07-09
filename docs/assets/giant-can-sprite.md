# Giant Can Sprite Sheet v1

## Files

- `assets/characters/giant-can-sprite-sheet-v1.png`
- `assets/characters/giant-can-sprite-sheet-v1.json`

## Character

**Giant Can（巨大罐罐）** — Forest chapter starter challenge boss.

| Trait | Direction |
| --- | --- |
| Symbolism | Starting checkpoint challenge — not a violent enemy |
| Form | Oversized cat-food can (貓罐頭), front-facing |
| Face | Small calm eyes, gentle smile on label band |
| Details | Pull-tab lid, fish motif, soft paw accents |
| Mood | Cute, approachable, warm Morandi tones |

Legacy placeholder frame key: `giant-can-idle` (unified `boss-characters` atlas).

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel, pale blue sky compatible.
- Transparent background; no horror, violence, or dark palette.
- Gentle pulse/glow animation — warm beige aura, not fire or menace.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `giant-can-idle` | Rest |
| 1 | `giant-can-pulse-1` | Glow rising |
| 2 | `giant-can-pulse-2` | Glow peak |
| 3 | `giant-can-pulse-3` | Glow fading |

## Phaser usage

```typescript
import { ASSET_KEYS, GIANT_CAN_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.giantCan, GIANT_CAN_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'giant-can-pulse',
  frames: [
    { key: ASSET_KEYS.giantCan, frame: GIANT_CAN_FRAMES.pulse1 },
    { key: ASSET_KEYS.giantCan, frame: GIANT_CAN_FRAMES.pulse2 },
    { key: ASSET_KEYS.giantCan, frame: GIANT_CAN_FRAMES.pulse3 },
    { key: ASSET_KEYS.giantCan, frame: GIANT_CAN_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('giant-can-pulse')
```

## Regeneration

```bash
python3 scripts/generate-giant-can-sprite.py
```

## Next asset tasks

- Switch `ForestScene.placeGiantJarBoss()` from `boss-characters` atlas to this sheet.
- Play `giant-can-pulse` idle animation on the boss sprite.

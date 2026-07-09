# Inner Doubt Sprite Sheet v1

## Files

- `assets/characters/inner-doubt-sprite-sheet-v1.png`
- `assets/characters/inner-doubt-sprite-sheet-v1.json`

## Character

**Inner Doubt（內在懷疑）** — Retry chapter boss.

| Trait | Direction |
| --- | --- |
| Symbolism | Inner doubt and uncertainty — not a violent enemy |
| Personality | Shy, fluttery, uncertain but not malicious |
| Form | Cluster of 3 cute soot-sprite fuzz balls |
| Eyes | Large white eye dots — cute, not scary |
| Palette | Soft charcoal-gray Morandi tones with warm beige highlights |

Legacy placeholder frame key: `inner-doubt-idle` (unified `boss-characters` atlas).

In-game dialogue script: `innerDoubtBoss`. Scene: `RetryScene.placeInnerDoubtBoss()`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel, pale blue sky compatible.
- Transparent background; susuwatari-inspired cluster — original cute design, not a direct Ghibli copy.
- No sharp teeth, claws, or horror dark palette.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `inner-doubt-idle` | Rest |
| 1 | `inner-doubt-pulse-1` | Wobble + center blink |
| 2 | `inner-doubt-pulse-2` | Bounce + side blink |
| 3 | `inner-doubt-pulse-3` | Wobble return + blink |

## Phaser usage

```typescript
import { ASSET_KEYS, INNER_DOUBT_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.innerDoubt, INNER_DOUBT_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'inner-doubt-wobble',
  frames: [
    { key: ASSET_KEYS.innerDoubt, frame: INNER_DOUBT_FRAMES.pulse1 },
    { key: ASSET_KEYS.innerDoubt, frame: INNER_DOUBT_FRAMES.pulse2 },
    { key: ASSET_KEYS.innerDoubt, frame: INNER_DOUBT_FRAMES.pulse3 },
    { key: ASSET_KEYS.innerDoubt, frame: INNER_DOUBT_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('inner-doubt-wobble')
```

## Regeneration

```bash
python3 scripts/generate-inner-doubt-sprite.py
```

## Next asset tasks

- Switch `RetryScene.placeInnerDoubtBoss()` from `boss-characters` atlas to this sheet.
- Play `inner-doubt-wobble` animation on the boss sprite.

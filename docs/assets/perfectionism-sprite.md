# Perfectionism Sprite Sheet v1

## Files

- `assets/characters/perfectionism-sprite-sheet-v1.png`
- `assets/characters/perfectionism-sprite-sheet-v1.json`

## Character

**Perfectionism（完美主義）** — Final Stage chapter boss.

| Trait | Direction |
| --- | --- |
| Symbolism | The inner voice saying「不夠好、重做、再一次」— not a violent enemy |
| Personality | Distant, repetitive, softly overwhelming but not evil |
| Form | Floating simplified white mask-like face |
| Eyes | Small calm horizontal slits |
| Aura | Pale violet-mist Morandi fog + drifting paper shards (low saturation) |

Legacy placeholder frame key: `perfectionism-idle` (unified `boss-characters` atlas).

In-game dialogue script: `perfectionismBoss`. Scene: `FinalScene.placePerfectionism()`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel + pale violet mist, pale blue sky compatible.
- Transparent background; soft mask-and-paper archetype — original design, not a direct Ghibli copy.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `perfectionism-idle` | Rest |
| 1 | `perfectionism-pulse-1` | Mist rising + paper drift |
| 2 | `perfectionism-pulse-2` | Mist peak + extra shards |
| 3 | `perfectionism-pulse-3` | Mist fading |

## Phaser usage

```typescript
import { ASSET_KEYS, PERFECTIONISM_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.perfectionism, PERFECTIONISM_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'perfectionism-mist',
  frames: [
    { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse1 },
    { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse2 },
    { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse3 },
    { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('perfectionism-mist')
```

## Regeneration

```bash
python3 scripts/generate-perfectionism-sprite.py
```

## Integration

- `FinalScene.placePerfectionism()` uses `ASSET_KEYS.perfectionism` + `PERFECTIONISM_FRAMES.idle`.
- Boss sprite plays `perfectionism-mist` animation (3 fps loop).

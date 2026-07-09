# Snow Spirit Sprite Sheet v1

## Files

- `assets/characters/snow-spirit-sprite-sheet-v1.png`
- `assets/characters/snow-spirit-sprite-sheet-v1.json`

## Character

**Snow Spirit（雪靈 Boss）** — Snow Mountain chapter summit boss.

| Trait | Direction |
| --- | --- |
| Symbolism | Journey's trial, awareness in stillness — not a violent enemy |
| Personality | Still, ethereal, quietly observant |
| Form | Small kodama-like tree spirit |
| Head | Round snow-dusted white head, gentle hollow dark eye dots (not horror) |
| Body | Short sage-green stem and stubby legs |

> Distinct from **Snow Guide** NPC (`snow-guide-*` atlas) at chapter start. This boss uses `snow-spirit-*` frames at the summit.

Legacy placeholder frame key: `snow-spirit-idle` (unified `boss-characters` atlas).

In-game dialogue script: `snowSpiritBoss` (display name「雪靈」). Scene: `SnowMountainScene.placeSnowSpiritBoss()`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel + snow-dusted tones, pale blue sky compatible.
- Transparent background; cute-not-scary kodama archetype — original design, not a direct Ghibli copy.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `snow-spirit-idle` | Rest |
| 1 | `snow-spirit-pulse-1` | Head bob + glow rising |
| 2 | `snow-spirit-pulse-2` | Bob peak + white glow |
| 3 | `snow-spirit-pulse-3` | Bob return + glow fading |

## Phaser usage

```typescript
import { ASSET_KEYS, SNOW_SPIRIT_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.snowSpirit, SNOW_SPIRIT_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'snow-spirit-pulse',
  frames: [
    { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse1 },
    { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse2 },
    { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse3 },
    { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('snow-spirit-pulse')
```

## Regeneration

```bash
python3 scripts/generate-snow-spirit-sprite.py
```

## Integration

- `SnowMountainScene.placeSnowSpiritBoss()` uses `ASSET_KEYS.snowSpirit` + `SNOW_SPIRIT_FRAMES.idle`.
- Boss sprite plays `snow-spirit-pulse` animation (3 fps loop).

# Time Monster Sprite Sheet v1

## Files

- `assets/characters/time-monster-sprite-sheet-v1.png`
- `assets/characters/time-monster-sprite-sheet-v1.json`

## Character

**Time Monster（時間怪獸）** — City chapter boss.

| Trait | Direction |
| --- | --- |
| Symbolism | Long distance, passage of time — not a violent enemy |
| Personality | Quiet, patient, slightly melancholic but not menacing |
| Form | Floating round clock spirit, mist-blue body |
| Face | Gentle clock face with dot markers, small calm eyes, soft stubby hands |
| Accents | Subtle Morandi sage green band |

Legacy placeholder frame key: `time-monster-idle` (unified `boss-characters` atlas).

In-game dialogue script: `timeMonster`. Scene: `CityScene.placeTimeMonsterBoss()`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- SNES 16-bit, Morandi warm pastel + mist-blue, pale blue sky compatible.
- Transparent background; cute-not-scary, no sharp clock hands or dark palette.
- Floating clock spirit archetype — original design, not a direct Ghibli character copy.

## Sprite sheet layout (1024×256)

| Column | Frame key | Animation |
| --- | --- | --- |
| 0 | `time-monster-idle` | Rest |
| 1 | `time-monster-pulse-1` | Pendulum sway + glow rising |
| 2 | `time-monster-pulse-2` | Sway peak + tick glow |
| 3 | `time-monster-pulse-3` | Sway return + glow fading |

## Phaser usage

```typescript
import { ASSET_KEYS, TIME_MONSTER_FRAMES } from '../assets/assetManifest'

const sprite = scene.add.sprite(x, y, ASSET_KEYS.timeMonster, TIME_MONSTER_FRAMES.idle)
sprite.setOrigin(0.5, 1).setScale(0.48)

scene.anims.create({
  key: 'time-monster-pulse',
  frames: [
    { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse1 },
    { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse2 },
    { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse3 },
    { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.idle },
  ],
  frameRate: 3,
  repeat: -1,
})
sprite.play('time-monster-pulse')
```

## Regeneration

```bash
python3 scripts/generate-time-monster-sprite.py
```

## Next asset tasks

- Switch `CityScene.placeTimeMonsterBoss()` from `boss-characters` atlas to this sheet.
- Play `time-monster-pulse` idle animation on the boss sprite.

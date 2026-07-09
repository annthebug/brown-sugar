# Snow Guide Sprite Sheet v1

## Files

- `assets/characters/snow-guide-side-sprite-sheet-v1.png`
- `assets/characters/snow-guide-side-sprite-sheet-v1.json`
- `assets/characters/snow-guide-portrait-v1.png`

## Character

**Snow Guide（雪山嚮導）** — Snow Mountain chapter MBTI guide NPC.

| Trait | Direction |
| --- | --- |
| Personality | Calm, reliable, warm, quietly encouraging |
| Outfit | Dusty-blue hooded cloak, mist-pink scarf |
| Gear | Wooden walking staff, snow-travel boots |
| Face | Round, gentle, small eye dots |

In-game dialogue script: `snowSpirit` (display name「雪靈」). Legacy placeholder frame key: `snow-guide-idle`.

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- Side profile facing **right**; use Phaser `flipX` for left.
- SNES 16-bit, Morandi warm pastel, transparent background.
- Original hooded mountain guide — not an official Ghibli character copy.

## Sprite sheet layout (1024×256)

| Column | Frame key |
| --- | --- |
| 0 | `snow-guide-side-idle` |
| 1 | `snow-guide-side-walk-1` |
| 2 | `snow-guide-side-walk-2` |
| 3 | `snow-guide-side-walk-3` |

## Emotion portrait

- File: `snow-guide-portrait-v1.png` (64×64 front bust).
- Calm encouraging expression, hood, mist-pink scarf, staff hint.

## Phaser usage

```typescript
import { ASSET_KEYS, SNOW_GUIDE_FRAMES } from '../assets/assetManifest'

sprite.setTexture(ASSET_KEYS.snowGuide, SNOW_GUIDE_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)
```

## Regeneration

```bash
python3 scripts/generate-snow-guide-sprite.py
```

## Integration

- `SnowMountainScene.placeMountainGuide()` uses `ASSET_KEYS.snowGuide` + `SNOW_GUIDE_FRAMES.sideIdle`.
- `snowSpirit` dialogue script uses `portraitId: 'snowGuide'`.

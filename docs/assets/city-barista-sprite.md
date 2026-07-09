# City Barista Sprite Sheet v1

## Files

- `assets/characters/city-barista-side-sprite-sheet-v1.png`
- `assets/characters/city-barista-side-sprite-sheet-v1.json`
- `assets/characters/city-barista-portrait-v1.png`

## Character

**City Barista（咖啡店店員）** — City chapter MBTI guide NPC.

| Trait | Direction |
| --- | --- |
| Personality | Warm, attentive, gentle |
| Hair | Short, soft brown |
| Outfit | Dusty-blue shirt, warm-beige apron with mist-pink tie |
| Prop | Coffee cup held forward |
| Expression | Soft smile, small eye dots |

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- Side profile facing **right**; use Phaser `flipX` for left.
- SNES 16-bit density, Morandi warm pastel palette.
- Cute proportions, transparent background.
- No brand logos, photorealism, or large anime eyes.

## Sprite sheet layout (1024×256)

| Column | Frame key |
| --- | --- |
| 0 | `city-barista-side-idle` |
| 1 | `city-barista-side-walk-1` |
| 2 | `city-barista-side-walk-2` |
| 3 | `city-barista-side-walk-3` |

## Emotion portrait

- File: `city-barista-portrait-v1.png` (64×64 front bust).
- Warm attentive smile, apron, short hair, coffee cup.
- Wire into `cityBarista` dialogue when portrait mood series is added.

## Palette reference

| Role | Hex | Usage |
| --- | --- | --- |
| Dusty blue | `#8FB2BF` | Shirt, cup band |
| Warm beige | `#F4EADC` | Apron |
| Mist pink | `#D9B7B1` | Apron tie accent |
| Sage green | `#B7C9BD` | Lower apron / pants |
| Hair | `#9C765E` | Short hair |

## Phaser usage

```typescript
import { ASSET_KEYS, CITY_BARISTA_FRAMES } from '../assets/assetManifest'

sprite.setTexture(ASSET_KEYS.cityBarista, CITY_BARISTA_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)
```

## Regeneration

```bash
python3 scripts/generate-city-barista-sprite.py
```

## Next asset tasks

- Switch `CityScene.placeCoffeeBarista()` from `npc-characters` atlas to `city-barista` atlas.
- Add dialogue portrait URL and mood series for `cityBarista` script.

# Park Traveler Sprite Sheet v1

## Files

- `assets/characters/park-traveler-side-sprite-sheet-v1.png`
- `assets/characters/park-traveler-side-sprite-sheet-v1.json`
- `assets/characters/park-traveler-portrait-v1.png`

## Character

**Park Traveler（公園旅人）** — City chapter MBTI guide NPC (J/P: plan vs spontaneity).

| Trait | Direction |
| --- | --- |
| Personality | Curious, free-spirited, gentle, observant |
| Hair | Dark bob, soft brown-black |
| Outfit | Dusty rose / muted red dress, sage hem |
| Gear | Small travel backpack, folded map in hand |
| Expression | Soft relaxed smile, small eye dots |

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- Side profile facing **right**; mirror with Phaser `flipX` for left.
- SNES 16-bit, Morandi warm pastel, transparent background.
- Original design inspired by map-carrying wanderer archetype — not an official Ghibli character.

## Sprite sheet layout (1024×256)

| Column | Frame key |
| --- | --- |
| 0 | `park-traveler-side-idle` |
| 1 | `park-traveler-side-walk-1` |
| 2 | `park-traveler-side-walk-2` |
| 3 | `park-traveler-side-walk-3` |

## Emotion portrait

- File: `park-traveler-portrait-v1.png` (64×64 front bust).
- Curious gentle smile, bob hair, rose dress, map and backpack visible.

## Phaser usage

```typescript
import { ASSET_KEYS, PARK_TRAVELER_FRAMES } from '../assets/assetManifest'

sprite.setTexture(ASSET_KEYS.parkTraveler, PARK_TRAVELER_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)
```

## Regeneration

```bash
python3 scripts/generate-park-traveler-sprite.py
```

## Next asset tasks

- Switch `CityScene.placeParkTraveler()` from `npc-characters` atlas to this sheet.
- Add `portraitId: 'parkTraveler'` for `cityTraveler` dialogue script.

# Glass Master Sprite Sheet v1

## Files

- `assets/characters/glass-master-side-sprite-sheet-v1.png`
- `assets/characters/glass-master-side-sprite-sheet-v1.json`
- `assets/characters/glass-master-portrait-v1.png`

## Character

**Glass Master（玻璃師傅）** — Glass Studio chapter MBTI guide NPC.

| Trait | Direction |
| --- | --- |
| Personality | Focused, gentle, patient, quietly perfectionist but kind |
| Hair | White / silver short hair |
| Gear | Forehead goggles pushed up, warm beige work apron |
| Prop | Glass rod with small blown-glass piece |
| Face | Round, soft focused expression, small eye dots |

In-game dialogue script: `glassMaster` (display name「玻璃師傅」). Legacy placeholder frame key: `glass-master-idle`.

MBTI theme: perfection vs. compromise (T/F).

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- Side profile facing **right**; use Phaser `flipX` for left.
- SNES 16-bit, Morandi warm pastel with soft glass-blue accents, transparent background.
- Borrowed Arrietty workshop-craft archetype — original design, not a direct Ghibli character copy.

## Sprite sheet layout (1024×256)

| Column | Frame key |
| --- | --- |
| 0 | `glass-master-side-idle` |
| 1 | `glass-master-side-walk-1` |
| 2 | `glass-master-side-walk-2` |
| 3 | `glass-master-side-walk-3` |

## Emotion portrait

- File: `glass-master-portrait-v1.png` (64×64 front bust).
- Soft focused expression, silver hair, pushed-up goggles, beige apron, glass piece hint.

## Phaser usage

```typescript
import { ASSET_KEYS, GLASS_MASTER_FRAMES } from '../assets/assetManifest'

sprite.setTexture(ASSET_KEYS.glassMaster, GLASS_MASTER_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)
```

## Regeneration

```bash
python3 scripts/generate-glass-master-sprite.py
```

## Next asset tasks

- Switch `GlassStudioScene` guide NPC from `npc-characters` atlas to this sheet.
- Add `portraitId: 'glassMaster'` for `glassMaster` dialogue script.

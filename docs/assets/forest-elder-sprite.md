# Forest Elder Sprite Sheet v1

## Files

- `assets/characters/forest-elder-sprite-sheet-v1.png`
- `assets/characters/forest-elder-sprite-sheet-v1.json`
- `assets/characters/forest-elder-portrait-v1.png`

## Character

**Forest Elder（森林長者）** — Forest chapter MBTI guide NPC.

| Trait | Direction |
| --- | --- |
| Personality | Wise, calm, kind |
| Face | Round, soft silhouette; small eye dots (not large anime eyes) |
| Beard | Flowing white beard, warm cream highlights |
| Robe | Layered brown robe, Morandi warm earth tones |
| Gear | Wooden walking stick, large travel backpack, small hip satchel |
| Detail | Autumn leaf accents on backpack (yellow / orange / red pastels) |

## Style direction

- 32×32 px per frame, top-down RPG orientation.
- SNES 16-bit pixel density; cute chibi-adjacent proportions.
- Warm pastel palette aligned with project Morandi accents.
- Soft Ghibli-inspired atmosphere — gentle wanderer, not a branded character.
- Transparent background; no photorealism, horror, or modern clothing.

## Sprite sheet layout (128×128)

Four rows × four columns. Each row is one facing direction; columns are idle + 3-frame walk cycle.

| Row | Direction | Frames |
| --- | --- | --- |
| 0 | Down (front) | idle, walk-1, walk-2, walk-3 |
| 1 | Up (back) | idle, walk-1, walk-2, walk-3 |
| 2 | Left | idle, walk-1, walk-2, walk-3 |
| 3 | Right | idle, walk-1, walk-2, walk-3 |

### Frame keys

- `forest-elder-down-idle`
- `forest-elder-down-walk-1` … `forest-elder-down-walk-3`
- `forest-elder-up-idle`
- `forest-elder-up-walk-1` … `forest-elder-up-walk-3`
- `forest-elder-left-idle`
- `forest-elder-left-walk-1` … `forest-elder-left-walk-3`
- `forest-elder-right-idle`
- `forest-elder-right-walk-1` … `forest-elder-right-walk-3`

## Emotion portrait series

| Mood | File | Expression |
| --- | --- | --- |
| calm | `forest-elder-portrait-calm-v1.png` | Relaxed eyes, gentle small smile |
| thoughtful | `forest-elder-portrait-thoughtful-v1.png` | Slight squint, contemplative |
| warm | `forest-elder-portrait-warm-v1.png` | Soft happy eyes, wider smile |

- All portraits: 64×64, transparent background, warm pastel pixel art.
- `DialogueNode.mood` selects portrait in `dialogues.ts`; `DialogueBox` resolves via `resolveDialogueAvatarUrl()`.
- Legacy `forest-elder-portrait-v1.png` retained; calm mood supersedes it in dialogue.

Regenerate:

```bash
python3 scripts/generate-forest-elder-portraits.py
```

## Palette reference

| Role | Hex | Usage |
| --- | --- | --- |
| Skin highlight | `#EED6BA` | Face, hands |
| Beard light | `#FAF4EC` | Beard highlight |
| Robe mid | `#9E7856` | Main robe body |
| Backpack | `#7C6450` | Travel pack |
| Staff wood | `#B08860` | Walking stick |
| Leaf yellow | `#ECCE88` | Autumn accent |
| Leaf orange | `#DCA072` | Autumn accent |
| Leaf red | `#C8826E` | Autumn accent |

## Regeneration

```bash
python3 scripts/generate-forest-elder-sprite.py
```

## Next asset tasks

- Switch `ForestScene.placeForestElder()` to the side-view atlas — see [forest-elder-side-sprite.md](./forest-elder-side-sprite.md).
- Add Phaser walk animations per direction when a top-down or hybrid map mode is introduced.

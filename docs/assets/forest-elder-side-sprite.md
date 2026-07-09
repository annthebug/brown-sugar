# Forest Elder Side-View Sprite Sheet v1

## Files

- `assets/characters/forest-elder-side-sprite-sheet-v1.png`
- `assets/characters/forest-elder-side-sprite-sheet-v1.json`
- `assets/characters/forest-elder-side-portrait-v1.png`

## Character

**Forest Elder（森林長者）** — side-view variant for platformer chapters (Forest, etc.).

Same identity as the top-down sheet: wise calm wanderer with white beard, brown robe, wooden staff, large backpack, hip satchel, and autumn leaf accents.

## Style direction

- 256×256 px per frame (64×64 pixel art upscaled ×3, bottom-anchored in frame).
- Matches Black Sugar atlas proportions (`256 × 0.44` scene scale).
- Side profile facing **right**; mirror with Phaser `flipX` for left.
- SNES 16-bit warm pastel / Morandi earth tones.
- Cute chibi-adjacent proportions, small eye dot, transparent background.

## Sprite sheet layout (1024×256)

Single row, four frames:

| Column | Frame key | Usage |
| --- | --- | --- |
| 0 | `forest-elder-side-idle` | Standing idle |
| 1 | `forest-elder-side-walk-1` | Walk cycle frame 1 |
| 2 | `forest-elder-side-walk-2` | Walk cycle frame 2 |
| 3 | `forest-elder-side-walk-3` | Walk cycle frame 3 |

## Emotion portrait

- File: `forest-elder-side-portrait-v1.png` (64×64 side bust).
- Calm profile with hood, beard, backpack leaf accent.
- Dialogue UI may continue using front `forest-elder-portrait-v1.png` or switch to this side bust per scene.

## Phaser usage

```typescript
import { ASSET_KEYS, FOREST_ELDER_SIDE_FRAMES } from '../assets/assetManifest'

// Idle (feet on platform)
sprite.setTexture(ASSET_KEYS.forestElderSide, FOREST_ELDER_SIDE_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)

// Walk animation (facing right)
this.anims.create({
  key: 'forest-elder-side-walk',
  frames: [
    { key: ASSET_KEYS.forestElderSide, frame: FOREST_ELDER_SIDE_FRAMES.sideWalk1 },
    { key: ASSET_KEYS.forestElderSide, frame: FOREST_ELDER_SIDE_FRAMES.sideWalk2 },
    { key: ASSET_KEYS.forestElderSide, frame: FOREST_ELDER_SIDE_FRAMES.sideWalk3 },
  ],
  frameRate: 6,
  repeat: -1,
})

// Facing left
sprite.setFlipX(true)
```

## Regeneration

```bash
python3 scripts/generate-forest-elder-side-sprite.py
```

## Related assets

- Top-down sheet: [forest-elder-sprite.md](./forest-elder-sprite.md)
- Front dialogue portrait: `forest-elder-portrait-v1.png`

## Next asset tasks

- Switch `ForestScene.placeForestElder()` from top-down atlas to this side-view atlas.
- Add `forest-elder-side-walk` Phaser animation when elder patrol is introduced.

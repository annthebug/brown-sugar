# Inner Guide Sprite Sheet v1

## Files

- `assets/characters/inner-guide-side-sprite-sheet-v1.png`
- `assets/characters/inner-guide-side-sprite-sheet-v1.json`
- `assets/characters/inner-guide-portrait-v1.png`

## Character

**Inner Guide（內在嚮導 / 內心之聲）** — Retry / Final chapter MBTI guide NPC.

| Trait | Direction |
| --- | --- |
| Personality | Soft, luminous, reassuring, deeply empathetic |
| Outfit | Pale sky-blue flowing robes with gentle translucent glow |
| Face | Short soft hair, small calm eyes, no sharp edges |
| Accents | Subtle glass-teal highlights on robe folds |

In-game dialogue script: `innerGuide` (display name「內在嚮導」). Legacy placeholder frame key: `inner-voice-idle`.

MBTI theme: self-doubt vs. perseverance (integrated final chapter).

## Style direction

- 256×256 px per frame (64×64 pixel art ×3, bottom-anchored).
- Side profile facing **right**; use Phaser `flipX` for left.
- SNES 16-bit, Morandi + pale blue sky palette, transparent background.
- Ethereal cute proportions — warm glow, not horror or dark spirit.
- River guardian spirit archetype — original design, not a direct Ghibli character copy.

## Sprite sheet layout (1024×256)

| Column | Frame key |
| --- | --- |
| 0 | `inner-guide-side-idle` |
| 1 | `inner-guide-side-walk-1` |
| 2 | `inner-guide-side-walk-2` |
| 3 | `inner-guide-side-walk-3` |

## Emotion portrait

- File: `inner-guide-portrait-v1.png` (64×64 front bust).
- Reassuring calm expression, soft glow, pale blue robes, glass-teal highlights.

## Phaser usage

```typescript
import { ASSET_KEYS, INNER_GUIDE_FRAMES } from '../assets/assetManifest'

sprite.setTexture(ASSET_KEYS.innerGuide, INNER_GUIDE_FRAMES.sideIdle)
sprite.setOrigin(0.5, 1).setScale(0.44)
```

## Regeneration

```bash
python3 scripts/generate-inner-guide-sprite.py
```

## Integration

- `RetryScene.placeInnerGuide()` and `FinalScene.placeInnerGuide()` use `ASSET_KEYS.innerGuide` + `INNER_GUIDE_FRAMES.sideIdle`.
- `innerGuide` dialogue script uses `portraitId: 'innerGuide'`.

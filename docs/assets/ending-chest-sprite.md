# Ending Treasure Chest Layered Assets v1

## Files

- `assets/ui/ending-chest-body-v1.png`
- `assets/ui/ending-chest-lid-v1.png`
- `assets/ui/ending-chest-lock-v1.png`
- `assets/ui/ending-chest-glow-v1.png`

## Character

**Ending Treasure Chest（結局寶箱）** — Final Stage / Ending page gift reveal prop.

| Trait | Direction |
| --- | --- |
| Symbolism | Journey's end gift reveal — gentle, not jump-scare |
| Personality | Quiet, precious, warm, slightly magical but grounded |
| Wood | Morandi warm beige + mist-pink grain, rounded corners |
| Lock | Soft gold plate, cute proportion (not pirate) |
| Inner glow | Pale blue glass rim hint — echoes sky + glass bowl |
| Detail | Subtle heart notch on front (Black Sugar keepsake) |

Story beat: chest opens to reveal the real glass bowl photo —「有些禮物，不需要完美」.

## Style direction

- 256×256 px per layer (64×64 pixel art ×4, transparent background).
- Front-facing SNES 16-bit, Morandi warm pastel, pale blue sky compatible.
- Bathhouse storage / gift box atmosphere — original translation, not a direct Ghibli copy.
- Avoid: pirate/skull motifs, dark rust, horror, photorealism, heavy black outlines.

## Layer stack (bottom → top)

| Z | Layer | Asset key | Purpose |
| --- | --- | --- | --- |
| 1 | Glow | `ui-ending-chest-glow` | Inner pale blue glass light (optional) |
| 2 | Body | `ui-ending-chest-body` | Fixed chest box + inner rim |
| 3 | Lock | `ui-ending-chest-lock` | Soft gold lock plate |
| 4 | Lid | `ui-ending-chest-lid` | GSAP rotate target |

## Animation (GSAP)

```typescript
gsap.set(chestLidRef.current, {
  rotate: 0,
  transformOrigin: '50% 100%', // bottom center hinge
})

timeline.to(chestLidRef.current, {
  rotate: -22,
  y: -22,
  x: -8,
  duration: 0.65,
  ease: 'power3.out',
})
```

Lid pivot aligns to the hinge strip at the bottom of `ending-chest-lid-v1.png`.

## React usage

```typescript
import { ENDING_CHEST_LAYER_URLS } from '../game/assets/assetManifest'

<img src={ENDING_CHEST_LAYER_URLS.body} className="ending-chest-body" alt="" aria-hidden />
<img ref={chestLidRef} src={ENDING_CHEST_LAYER_URLS.lid} className="ending-chest-lid" alt="" aria-hidden />
```

## Regeneration

```bash
python3 scripts/generate-ending-chest-sprite.py
```

## Integration

- `src/routes/EndingPage.tsx` — layered PNG replaces CSS gradient chest; GSAP timeline unchanged.
- `src/game/assets/assetManifest.ts` — `ASSET_KEYS.endingChestBody` / `endingChestLid` / `endingChestLock` / `endingChestGlow`.

# Assets Placeholder Guide

This folder contains runtime assets used by Phaser and gallery imports.

## Folder layout

| Folder | Purpose |
| --- | --- |
| `characters/` | Character sprite sheets and Phaser atlas JSON. |
| `scenes/` | Backgrounds, tilemap images, and scene placeholders. |
| `ui/` | Loading panels, HUD elements, buttons, and dialog frames. |
| `memories/` | Owner-provided memory photos. Do not invent replacement content. |
| `bowls/` | MBTI glass bowl sheets and ending bowl placeholders. |

## Placeholder rules

- Generated placeholder filenames use lowercase kebab-case and end with `-placeholder` before the extension.
- Memory photos may keep owner-provided camera filenames until the gallery data model is finalized.
- Placeholder art should use the pale blue sky base and Morandi accents from `assets/manifest.json`.
- Keep manifest keys stable when replacing placeholder files with final assets.
- Sprite sheets must include a matching Phaser atlas JSON beside the texture.
- Regenerate chapter NPC/Boss placeholders with `python3 scripts/generate-character-assets.py` (see `docs/assets/character-sprites.md`).

## Preload manifest

- `src/game/assets/assetManifest.ts` is the runtime source of truth for Phaser preload.
- `assets/manifest.json` mirrors the same keys for documentation and asset review.
- Missing files should fail in `PreloadScene` with a visible message before `GameScene` starts.

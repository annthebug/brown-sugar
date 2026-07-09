# Chapter Character Sprites v2

Ghibli-inspired placeholder pixel art for NPCs and bosses. Style: **16-bit Pokémon RPG readability** with **Morandi palette** and **non-violent** silhouettes.

> These are original placeholder designs inspired by archetypes from Studio Ghibli films. They are not official character reproductions.

## NPC atlas (`npc-characters`)

| Frame key | Role | Visual inspiration | Notes |
| --- | --- | --- | --- |
| `forest-elder-idle` | 森林老人 | Boiler-room grandfather (Kamaji archetype) | White hair, round glasses, rust shirt, blue apron, wooden ladle |
| `coffee-barista-idle` | 咖啡店店員 | Seaside café attendant (Ponyo-era café) | Ponytail, mist-pink apron, small coffee cup |
| `park-traveler-idle` | 公園旅人 | Young wanderer with map (Kiki archetype) | Dark bob, muted red dress, folded map |
| `snow-guide-idle` | 雪山嚮導 | Hooded mountain guide (Mononoke / Laputa explorer) | Dusty-blue hood, pink scarf, walking staff |
| `glass-master-idle` | 玻璃師傅 | Workshop artisan (craft-studio elder) | White hair, forehead goggles, glass rod |
| `inner-voice-idle` | 內心之聲 | Gentle river spirit (Haku archetype) | Pale sky glow, flowing glass-blue robes |

## Boss atlas (`boss-characters`)

| Frame key | Role | Visual inspiration | Notes |
| --- | --- | --- | --- |
| `giant-can-idle` | 巨大罐罐 | Friendly lidded pantry jar spirit | Golden lid, ceramic body, warm smile |
| `time-monster-idle` | Time Monster | Floating clock spirit (Howl moving castle) | Round clock face, mist-blue body, soft hands |
| `snow-spirit-idle` | 雪靈 | Kodama tree spirit | White round head, hollow dark eyes, sage stem |
| `glass-master-boss-idle` | 玻璃師傅 Boss | Artisan with furnace halo | Same master with soft orange workshop glow |
| `inner-doubt-idle` | 內在懷疑 | Soot sprite cluster (susuwatari) | Three black fuzz balls, large white eyes |
| `perfectionism-idle` | 完美主義 | Mask in violet mist (No-Face / paper spirit) | White mask face, floating paper shards |

## Technical spec

| Property | Value |
| --- | --- |
| Sheet files | `assets/characters/npc-sprite-sheet-v1.png`, `boss-sprite-sheet-v1.png` |
| Atlas JSON | Matching `*-v1.json` beside each texture |
| Frame size | 256 × 256 px logical canvas, trimmed atlas packing |
| Pixel density | 1:1 px with soft outline + ground shadow pass |
| Origin in game | `(0.5, 1)` foot anchor via `CharacterSprite` |
| Default scale | NPC `0.44`, Boss `0.48` (matches Black Sugar height) |

## Regeneration

```bash
python3 scripts/generate-character-assets.py
```

Source grids live in `scripts/ghibli_character_art.py`. Keep **asset keys** and **frame names** stable when replacing art.

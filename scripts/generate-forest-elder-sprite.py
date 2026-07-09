#!/usr/bin/env python3
"""Generate Forest Elder NPC pixel art assets (32x32 top-down RPG, SNES warm pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "O": (88, 70, 54, 255),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "S3": (198, 166, 134, 255),
    "B1": (250, 244, 236, 255),
    "B2": (234, 224, 210, 255),
    "B3": (212, 200, 184, 255),
    "R1": (184, 146, 108, 255),
    "R2": (158, 120, 86, 255),
    "R3": (130, 98, 70, 255),
    "R4": (104, 78, 56, 255),
    "K1": (152, 126, 102, 255),
    "K2": (124, 100, 80, 255),
    "K3": (100, 80, 64, 255),
    "W1": (208, 172, 126, 255),
    "W2": (176, 136, 96, 255),
    "W3": (142, 106, 72, 255),
    "T1": (172, 128, 96, 255),
    "T2": (142, 104, 76, 255),
    "L1": (236, 206, 136, 255),
    "L2": (220, 160, 114, 255),
    "L3": (200, 130, 110, 255),
    "E": (76, 58, 44, 255),
    "M": (188, 148, 124, 255),
    "F1": (192, 168, 144, 255),
    "F2": (150, 126, 106, 255),
    "H1": (188, 156, 122, 255),
    "H2": (168, 136, 106, 255),
}

SIZE = 32


def blank() -> list[list[str]]:
    return [["." for _ in range(SIZE)] for _ in range(SIZE)]


def put(g: list[list[str]], x: int, y: int, c: str) -> None:
    if 0 <= x < SIZE and 0 <= y < SIZE:
        g[y][x] = c


def hline(g: list[list[str]], x: int, y: int, w: int, c: str) -> None:
    for i in range(w):
        put(g, x + i, y, c)


def vline(g: list[list[str]], x: int, y: int, h: int, c: str) -> None:
    for i in range(h):
        put(g, x, y + i, c)


def rect(g: list[list[str]], x: int, y: int, w: int, h: int, c: str) -> None:
    for dy in range(h):
        for dx in range(w):
            put(g, x + dx, y + dy, c)


def leaves_on_backpack(g: list[list[str]], x: int, y: int) -> None:
    put(g, x, y, "L2")
    put(g, x + 1, y, "L1")
    put(g, x, y + 1, "L3")
    put(g, x + 2, y + 1, "L2")


def staff(g: list[list[str]], x: int, y: int, h: int) -> None:
    for i in range(h):
        put(g, x, y + i, "W2" if i else "W1")
        if i:
            put(g, x + 1, y + i, "W3")


def feet_pair(g: list[list[str]], cx: int, y: int, phase: int) -> None:
    left = phase == 1
    right = phase == 3
    put(g, cx - 2 - (1 if left else 0), y, "F1")
    put(g, cx - 1 - (1 if left else 0), y, "F2")
    put(g, cx + 1 + (1 if right else 0), y, "F1")
    put(g, cx + 2 + (1 if right else 0), y, "F2")


def draw_down(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    cx = 16

    # hood / round head
    rect(g, cx - 3, 5 + bob, 7, 2, "H1")
    rect(g, cx - 4, 7 + bob, 9, 5, "S1")
    put(g, cx - 4, 7 + bob, "O")
    put(g, cx + 4, 7 + bob, "O")
    put(g, cx - 1, 8 + bob, "E")
    put(g, cx + 1, 8 + bob, "E")
    put(g, cx, 9 + bob, "S2")

    # white beard fan
    hline(g, cx - 3, 10 + bob, 7, "B2")
    hline(g, cx - 4, 11 + bob, 9, "B1")
    hline(g, cx - 5, 12 + bob, 11, "B1")
    hline(g, cx - 4, 13 + bob, 9, "B2")

    # robe body
    rect(g, cx - 5, 14 + bob, 11, 2, "R1")
    rect(g, cx - 6, 16 + bob, 13, 3, "R2")
    rect(g, cx - 6, 19 + bob, 13, 3, "R3")
    rect(g, cx - 5, 22 + bob, 11, 2, "R2")
    rect(g, cx - 4, 24 + bob, 9, 1, "R4")

    # backpack (left side from front)
    rect(g, cx - 9, 15 + bob, 4, 7, "K3")
    rect(g, cx - 8, 16 + bob, 3, 5, "K2")
    rect(g, cx - 8, 17 + bob, 2, 3, "K1")
    leaves_on_backpack(g, cx - 8, 15 + bob)

    # satchel
    rect(g, cx + 5, 19 + bob, 2, 3, "T2")
    put(g, cx + 5, 19 + bob, "T1")

    feet_pair(g, cx, 26 + bob, phase)
    staff(g, 22, 13 + bob, 9)


def draw_up(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    cx = 16

    rect(g, cx - 3, 5 + bob, 7, 2, "H2")
    rect(g, cx - 4, 7 + bob, 9, 3, "H1")
    rect(g, cx - 5, 10 + bob, 11, 2, "K3")
    rect(g, cx - 6, 12 + bob, 13, 5, "K2")
    rect(g, cx - 5, 17 + bob, 11, 3, "K1")
    leaves_on_backpack(g, cx - 2, 13 + bob)
    put(g, cx + 2, 14 + bob, "L1")
    put(g, cx - 1, 16 + bob, "L3")

    rect(g, cx - 6, 20 + bob, 13, 3, "R3")
    rect(g, cx - 5, 23 + bob, 11, 2, "R4")

    feet_pair(g, cx, 26 + bob, phase)
    staff(g, 21, 13 + bob, 9)


def draw_left(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    cx = 14

    rect(g, cx - 2, 5 + bob, 6, 2, "H1")
    rect(g, cx - 3, 7 + bob, 7, 5, "S2")
    put(g, cx - 3, 7 + bob, "O")
    put(g, cx + 3, 9 + bob, "O")
    put(g, cx, 8 + bob, "E")
    put(g, cx + 1, 9 + bob, "S3")

    vline(g, cx + 3, 9 + bob, 4, "B1")
    vline(g, cx + 4, 10 + bob, 3, "B2")
    hline(g, cx - 2, 11 + bob, 5, "B2")

    rect(g, cx - 4, 13 + bob, 8, 2, "R1")
    rect(g, cx - 5, 15 + bob, 9, 3, "R2")
    rect(g, cx - 5, 18 + bob, 8, 3, "R3")
    rect(g, cx - 4, 21 + bob, 7, 2, "R2")

    rect(g, cx - 9, 14 + bob, 4, 8, "K3")
    rect(g, cx - 8, 15 + bob, 3, 6, "K2")
    leaves_on_backpack(g, cx - 8, 14 + bob)

    rect(g, cx + 2, 19 + bob, 2, 3, "T1")
    put(g, cx + 3, 21 + bob, "T2")

    put(g, cx - 2 - (1 if phase == 1 else 0), 26 + bob, "F1")
    put(g, cx - 1 - (1 if phase == 1 else 0), 26 + bob, "F2")
    put(g, cx + 1 + (1 if phase == 3 else 0), 26 + bob, "F1")
    put(g, cx + 2 + (1 if phase == 3 else 0), 26 + bob, "F2")

    staff(g, 20, 12 + bob, 10)


def mirror(g: list[list[str]]) -> list[list[str]]:
    return [list(reversed(row)) for row in g]


def render(g: list[list[str]]) -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            px[x, y] = C[ch]
    return img


def build_frames() -> list[tuple[str, list[list[str]]]]:
    specs: list[tuple[str, str, int]] = []
    for direction in ("down", "up", "left", "right"):
        for i, suffix in enumerate(("idle", "walk-1", "walk-2", "walk-3")):
            phase = 0 if suffix == "idle" else int(suffix[-1])
            specs.append((f"forest-elder-{direction}-{suffix}", direction, phase))

    frames: list[tuple[str, list[list[str]]]] = []
    left_cache: dict[int, list[list[str]]] = {}

    for name, direction, phase in specs:
        if direction == "left":
            g = blank()
            draw_left(g, phase)
            left_cache[phase] = g
            frames.append((name, g))
        elif direction == "right":
            g = mirror(left_cache[phase])
            frames.append((name, g))
        elif direction == "down":
            g = blank()
            draw_down(g, phase)
            frames.append((name, g))
        else:
            g = blank()
            draw_up(g, phase)
            frames.append((name, g))

    return frames


def draw_portrait() -> Image.Image:
    """64x64 bust portrait — calm, wise, kind expression."""
    g = blank()
    cx = 16

    # hood
    rect(g, cx - 8, 4, 17, 3, "H2")
    rect(g, cx - 9, 7, 19, 4, "H1")

    # round face
    rect(g, cx - 7, 11, 15, 8, "S1")
    put(g, cx - 7, 11, "O")
    put(g, cx + 7, 11, "O")
    put(g, cx - 7, 18, "O")
    put(g, cx + 7, 18, "O")

    # kind calm eyes — small curved calm lines (not large)
    put(g, cx - 3, 14, "E")
    put(g, cx - 2, 14, "E")
    put(g, cx + 2, 14, "E")
    put(g, cx + 3, 14, "E")

    # gentle smile
    put(g, cx - 1, 17, "M")
    put(g, cx, 17, "M")
    put(g, cx + 1, 17, "M")

    # flowing white beard
    hline(g, cx - 6, 19, 13, "B2")
    hline(g, cx - 7, 20, 15, "B1")
    hline(g, cx - 8, 21, 17, "B1")
    hline(g, cx - 7, 22, 15, "B1")
    hline(g, cx - 6, 23, 13, "B2")
    hline(g, cx - 4, 24, 9, "B3")

    # robe collar
    rect(g, cx - 9, 25, 19, 2, "R1")
    rect(g, cx - 10, 27, 21, 4, "R2")
    rect(g, cx - 9, 31, 19, 1, "R3")

    # backpack + autumn leaves visible at shoulder
    rect(g, cx - 14, 24, 5, 8, "K3")
    rect(g, cx - 13, 25, 4, 6, "K2")
    leaves_on_backpack(g, cx - 13, 24)
    put(g, cx + 10, 28, "L2")

    # satchel strap hint
    vline(g, cx + 8, 26, 4, "T1")

    return render(g).resize((64, 64), Image.Resampling.NEAREST)


COLS = 4
SHEET = 32


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = build_frames()

    sheet = Image.new("RGBA", (SHEET * COLS, SHEET * COLS), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for i, (name, grid) in enumerate(frames):
        col, row = i % COLS, i // COLS
        x, y = col * SHEET, row * SHEET
        sheet.paste(render(grid), (x, y))
        atlas_frames[name] = {
            "frame": {"x": x, "y": y, "w": SHEET, "h": SHEET},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": SHEET, "h": SHEET},
            "sourceSize": {"w": SHEET, "h": SHEET},
        }

    png = OUT_DIR / "forest-elder-sprite-sheet-v1.png"
    json_path = OUT_DIR / "forest-elder-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "forest-elder-portrait-v1.png"

    sheet.save(png)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "forest-elder-sprite-sheet-v1.png",
                    "size": {"w": SHEET * COLS, "h": SHEET * COLS},
                    "scale": "1",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    draw_portrait().save(portrait_path)

    print(f"Wrote {png}")
    print(f"Wrote {json_path}")
    print(f"Wrote {portrait_path}")


if __name__ == "__main__":
    main()

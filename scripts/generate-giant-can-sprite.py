#!/usr/bin/env python3
"""Generate Giant Can boss sprite assets (256x256 frames, Morandi pastel cat-food can)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi warm pastel — cat-food can, no dark horror tones (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "C1": (244, 236, 224, 255),
    "C2": (232, 220, 204, 255),
    "C3": (214, 200, 182, 255),
    "C4": (196, 182, 164, 255),
    "L1": (200, 218, 224, 255),
    "L2": (176, 204, 214, 255),
    "L3": (152, 186, 200, 255),
    "T1": (238, 220, 176, 255),
    "T2": (220, 198, 148, 255),
    "T3": (200, 176, 128, 255),
    "F1": (232, 198, 188, 255),
    "F2": (210, 176, 168, 255),
    "P1": (183, 201, 189, 255),
    "G1": (248, 244, 232, 70),
    "G2": (240, 232, 210, 110),
    "G3": (232, 220, 196, 150),
    "E": (88, 72, 62, 255),
    "M": (188, 158, 142, 255),
}


def blank() -> list[list[str]]:
    return [["." for _ in range(PIXEL)] for _ in range(PIXEL)]


def put(g: list[list[str]], x: int, y: int, c: str) -> None:
    if 0 <= x < PIXEL and 0 <= y < PIXEL:
        g[y][x] = c


def rect(g: list[list[str]], x: int, y: int, w: int, h: int, c: str) -> None:
    for dy in range(h):
        for dx in range(w):
            put(g, x + dx, y + dy, c)


def draw_glow(g: list[list[str]], cx: int, cy: int, strength: int) -> None:
    if strength <= 0:
        return

    layers = [
        (0, 0, "G1"),
        (-1, 0, "G1"),
        (1, 0, "G1"),
        (0, -1, "G1"),
        (0, 1, "G1"),
    ]
    if strength >= 1:
        layers.extend(
            [
                (-2, -1, "G2"),
                (2, -1, "G2"),
                (-3, 0, "G2"),
                (3, 0, "G2"),
                (-2, 2, "G2"),
                (2, 2, "G2"),
            ]
        )
    if strength >= 2:
        layers.extend(
            [
                (-4, -2, "G3"),
                (4, -2, "G3"),
                (-5, 1, "G3"),
                (5, 1, "G3"),
                (-4, 4, "G3"),
                (4, 4, "G3"),
                (0, -3, "G3"),
                (0, 5, "G3"),
            ]
        )

    for dx, dy, color in layers:
        put(g, cx + dx, cy + dy, color)


def draw_fish_motif(g: list[list[str]], x: int, y: int) -> None:
    for px, py, c in [
        (x, y, "F1"),
        (x + 1, y, "F2"),
        (x + 2, y, "F1"),
        (x + 3, y, "F2"),
        (x + 4, y - 1, "F1"),
        (x - 1, y + 1, "F2"),
        (x + 1, y + 1, "F1"),
        (x + 2, y + 1, "F2"),
    ]:
        put(g, px, py, c)


def draw_cat_can(g: list[list[str]], pulse: int = 0) -> None:
    cx = 32
    glow_strength = {0: 0, 1: 1, 2: 2, 3: 1}[pulse]
    draw_glow(g, cx, 28, glow_strength)

    # pull-tab lid
    rect(g, cx - 4, 8, 8, 2, "T2")
    put(g, cx - 1, 7, "T1")
    put(g, cx, 7, "T3")
    rect(g, cx - 8, 10, 16, 3, "T1")
    rect(g, cx - 9, 13, 18, 2, "T2")

    # can rim + upper body
    rect(g, cx - 10, 15, 20, 2, "C4")
    rect(g, cx - 11, 17, 22, 26, "C2")

    # side shading
    for y in range(17, 43):
        put(g, cx - 11, y, "C3")
        put(g, cx + 10, y, "C3")

    # label band (dusty blue Morandi)
    rect(g, cx - 10, 20, 20, 12, "L1")
    rect(g, cx - 9, 21, 18, 10, "L2")

    # gentle face on label
    put(g, cx - 3, 24, "E")
    put(g, cx + 2, 24, "E")
    put(g, cx, 26, "M")
    put(g, cx - 1, 27, "M")

    # fish motif + paw hint
    draw_fish_motif(g, cx - 2, 29)
    put(g, cx - 5, 30, "P1")
    put(g, cx + 4, 30, "P1")

    # lower can body
    rect(g, cx - 10, 32, 20, 10, "C1")
    rect(g, cx - 11, 42, 22, 2, "C4")

    # subtle inner highlight on pulse peak
    if pulse == 2:
        put(g, cx - 7, 22, "C1")
        put(g, cx + 6, 22, "C1")
        put(g, cx, 34, "C1")


def render_pixel_grid(g: list[list[str]]) -> Image.Image:
    img = Image.new("RGBA", (PIXEL, PIXEL), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            px[x, y] = C[ch]
    return img


def to_frame(pixel_art: Image.Image) -> Image.Image:
    scaled = pixel_art.resize((PIXEL * FRAME_SCALE, PIXEL * FRAME_SCALE), Image.Resampling.NEAREST)
    frame = Image.new("RGBA", (FRAME, FRAME), (0, 0, 0, 0))
    x = (FRAME - scaled.width) // 2
    y = FRAME - scaled.height - 8
    frame.paste(scaled, (x, y))
    return frame


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    names = [
        "giant-can-idle",
        "giant-can-pulse-1",
        "giant-can-pulse-2",
        "giant-can-pulse-3",
    ]
    pulses = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, pulse) in enumerate(zip(names, pulses, strict=True)):
        grid = blank()
        draw_cat_can(grid, pulse)
        frame_img = to_frame(render_pixel_grid(grid))
        x = index * FRAME
        sheet.paste(frame_img, (x, 0))
        atlas_frames[name] = {
            "frame": {"x": x, "y": 0, "w": FRAME, "h": FRAME},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME, "h": FRAME},
            "sourceSize": {"w": FRAME, "h": FRAME},
        }

    png_path = OUT_DIR / "giant-can-sprite-sheet-v1.png"
    json_path = OUT_DIR / "giant-can-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "giant-can-sprite-sheet-v1.png",
                    "size": {"w": sheet_w, "h": FRAME},
                    "scale": "1",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {png_path}")
    print(f"Wrote {json_path}")


if __name__ == "__main__":
    main()

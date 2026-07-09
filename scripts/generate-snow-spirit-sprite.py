#!/usr/bin/env python3
"""Generate Snow Spirit boss sprite assets (256x256 frames, Morandi pastel kodama spirit)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi snow-dusted kodama — gentle, not horror (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "W1": (248, 250, 252, 255),
    "W2": (236, 240, 244, 255),
    "W3": (220, 228, 234, 255),
    "W4": (204, 214, 222, 255),
    "E1": (96, 108, 112, 255),
    "E2": (72, 84, 88, 255),
    "S1": (183, 201, 189, 255),
    "S2": (158, 180, 166, 255),
    "S3": (136, 162, 148, 255),
    "G1": (252, 252, 254, 70),
    "G2": (244, 248, 252, 110),
    "G3": (232, 240, 246, 150),
    "H1": (224, 232, 238, 255),
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


def draw_white_glow(g: list[list[str]], cx: int, cy: int, strength: int) -> None:
    if strength <= 0:
        return
    layers = [(0, 0, "G1"), (-1, 0, "G1"), (1, 0, "G1"), (0, -1, "G1"), (0, 1, "G1")]
    if strength >= 1:
        layers.extend([(-2, -1, "G2"), (2, -1, "G2"), (-2, 1, "G2"), (2, 1, "G2")])
    if strength >= 2:
        layers.extend([(-3, 0, "G3"), (3, 0, "G3"), (0, -2, "G3"), (0, 2, "G3"), (-2, -2, "G3"), (2, -2, "G3")])
    for dx, dy, color in layers:
        put(g, cx + dx, cy + dy, color)


def draw_kodama_head(g: list[list[str]], cx: int, cy: int, tilt: int) -> None:
    ox = tilt
    rect(g, cx - 8 + ox, cy - 6, 16, 4, "W3")
    rect(g, cx - 10 + ox, cy - 2, 20, 8, "W2")
    rect(g, cx - 11 + ox, cy + 6, 22, 8, "W1")
    rect(g, cx - 10 + ox, cy + 14, 20, 4, "W2")
    put(g, cx - 11 + ox, cy + 2, "W4")
    put(g, cx + 10 + ox, cy + 2, "W4")

    # gentle hollow dark eye dots
    for ex in (cx - 4 + ox, cx + 3 + ox):
        put(g, ex, cy + 4, "E2")
        put(g, ex + 1, cy + 4, "E2")
        put(g, ex, cy + 5, "E1")
        put(g, ex + 1, cy + 5, "E1")
        put(g, ex, cy + 6, "E2")

    # snow highlight specks
    put(g, cx - 6 + ox, cy - 1, "H1")
    put(g, cx + 5 + ox, cy, "H1")


def draw_stem_legs(g: list[list[str]], cx: int, base_y: int, spread: int) -> None:
    rect(g, cx - 2, base_y, 4, 6, "S2")
    rect(g, cx - 3, base_y + 6, 6, 4, "S1")
    put(g, cx - 4 - spread, base_y + 10, "S3")
    put(g, cx - 3 - spread, base_y + 10, "S2")
    put(g, cx + 2 + spread, base_y + 10, "S3")
    put(g, cx + 3 + spread, base_y + 10, "S2")


def draw_snow_spirit(g: list[list[str]], phase: int = 0) -> None:
    cx = 32
    bob = {0: 0, 1: -1, 2: -2, 3: -1}[phase]
    tilt = {0: 0, 1: -1, 2: 0, 3: 1}[phase]
    glow = {0: 0, 1: 1, 2: 2, 3: 1}[phase]
    spread = {0: 0, 1: 0, 2: 1, 3: 0}[phase]

    head_cy = 16 + bob
    draw_white_glow(g, cx + tilt, head_cy + 6, glow)
    draw_kodama_head(g, cx, head_cy, tilt)
    draw_stem_legs(g, cx + tilt, 30 + bob, spread)


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
        "snow-spirit-idle",
        "snow-spirit-pulse-1",
        "snow-spirit-pulse-2",
        "snow-spirit-pulse-3",
    ]
    phases = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_snow_spirit(grid, phase)
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

    png_path = OUT_DIR / "snow-spirit-sprite-sheet-v1.png"
    json_path = OUT_DIR / "snow-spirit-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "snow-spirit-sprite-sheet-v1.png",
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

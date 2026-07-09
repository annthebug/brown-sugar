#!/usr/bin/env python3
"""Generate Time Monster boss sprite assets (256x256 frames, Morandi pastel clock spirit)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi mist-blue + sage, gentle clock spirit (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "F1": (248, 244, 236, 255),
    "F2": (232, 226, 214, 255),
    "F3": (214, 206, 192, 255),
    "B1": (210, 228, 236, 255),
    "B2": (176, 206, 220, 255),
    "B3": (148, 186, 204, 255),
    "B4": (124, 168, 188, 255),
    "S1": (183, 201, 189, 255),
    "S2": (158, 180, 166, 255),
    "H1": (188, 176, 160, 255),
    "H2": (164, 152, 138, 255),
    "G1": (240, 248, 252, 80),
    "G2": (224, 238, 246, 120),
    "G3": (208, 228, 240, 160),
    "E": (88, 98, 102, 255),
    "M": (176, 168, 158, 255),
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


def draw_tick_glow(g: list[list[str]], cx: int, cy: int, strength: int) -> None:
    if strength <= 0:
        return
    layers = [(0, 0, "G1"), (-1, 0, "G1"), (1, 0, "G1"), (0, -1, "G1"), (0, 1, "G1")]
    if strength >= 1:
        layers.extend([(-2, -1, "G2"), (2, -1, "G2"), (-2, 1, "G2"), (2, 1, "G2")])
    if strength >= 2:
        layers.extend([(-3, 0, "G3"), (3, 0, "G3"), (0, -2, "G3"), (0, 2, "G3")])
    for dx, dy, color in layers:
        put(g, cx + dx, cy + dy, color)


def draw_clock_hands(g: list[list[str]], cx: int, cy: int, swing: int) -> None:
    # Soft stubby hands — pendulum sway via offset tips
    put(g, cx, cy, "H1")
    put(g, cx, cy - 1, "H2")
    put(g, cx, cy + 1, "H1")

    if swing == 0:
        put(g, cx, cy - 2, "H2")
        put(g, cx + 1, cy + 2, "H1")
        put(g, cx + 2, cy + 2, "H2")
    elif swing == 1:
        put(g, cx - 1, cy - 2, "H2")
        put(g, cx + 1, cy + 2, "H1")
    elif swing == 2:
        put(g, cx, cy - 3, "H2")
        put(g, cx, cy + 3, "H1")
        put(g, cx + 1, cy + 3, "H2")
    else:
        put(g, cx + 1, cy - 2, "H2")
        put(g, cx - 1, cy + 2, "H1")


def draw_time_monster(g: list[list[str]], phase: int = 0) -> None:
    cx = 32
    sway = {0: 0, 1: -1, 2: 0, 3: 1}[phase]
    glow = {0: 0, 1: 1, 2: 2, 3: 1}[phase]
    bob = -1 if phase in (1, 3) else 0

    draw_tick_glow(g, cx + sway, 18 + bob, glow)

    # floating mist-blue body
    rect(g, cx - 9 + sway, 28 + bob, 18, 14, "B2")
    rect(g, cx - 8 + sway, 30 + bob, 16, 10, "B1")
    rect(g, cx - 7 + sway, 40 + bob, 14, 4, "B3")
    put(g, cx - 10 + sway, 32 + bob, "B4")
    put(g, cx + 9 + sway, 32 + bob, "B4")

    # tiny soft hands
    rect(g, cx - 13 + sway, 32 + bob, 3, 5, "S1")
    rect(g, cx + 10 + sway, 32 + bob, 3, 5, "S1")
    put(g, cx - 13 + sway, 37 + bob, "S2")
    put(g, cx + 12 + sway, 37 + bob, "S2")

    # round clock face
    rect(g, cx - 10 + sway, 10 + bob, 20, 16, "F2")
    rect(g, cx - 9 + sway, 11 + bob, 18, 14, "F1")
    rect(g, cx - 8 + sway, 12 + bob, 16, 12, "F2")

    # calm dot markers (12, 3, 6, 9)
    for mx, my in [(cx + sway, 12 + bob), (cx + 7 + sway, 18 + bob), (cx + sway, 24 + bob), (cx - 7 + sway, 18 + bob)]:
        put(g, mx, my, "B3")

    # small gentle eyes on clock
    put(g, cx - 2 + sway, 17 + bob, "E")
    put(g, cx + 1 + sway, 17 + bob, "E")
    put(g, cx, 19 + bob, "M")

    draw_clock_hands(g, cx + sway, 18 + bob, phase)

    # sage accent band between face and body
    rect(g, cx - 8 + sway, 26 + bob, 16, 2, "S2")


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
        "time-monster-idle",
        "time-monster-pulse-1",
        "time-monster-pulse-2",
        "time-monster-pulse-3",
    ]
    phases = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_time_monster(grid, phase)
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

    png_path = OUT_DIR / "time-monster-sprite-sheet-v1.png"
    json_path = OUT_DIR / "time-monster-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "time-monster-sprite-sheet-v1.png",
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

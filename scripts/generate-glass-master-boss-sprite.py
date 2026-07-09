#!/usr/bin/env python3
"""Generate Glass Master Boss sprite assets (256x256 frames, Morandi pastel + soft furnace glow)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi artisan + soft workshop orange glow (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "H1": (232, 232, 228, 255),
    "H2": (208, 208, 204, 255),
    "H3": (184, 184, 178, 255),
    "A1": (244, 234, 220, 255),
    "A2": (228, 210, 188, 255),
    "A3": (206, 186, 162, 255),
    "D1": (200, 218, 224, 255),
    "D2": (143, 178, 191, 255),
    "G1": (210, 232, 238, 255),
    "G2": (176, 210, 222, 255),
    "G3": (148, 188, 204, 255),
    "G4": (120, 168, 188, 255),
    "L1": (188, 208, 214, 255),
    "L2": (156, 184, 196, 255),
    "O1": (148, 138, 128, 255),
    "O2": (118, 108, 98, 255),
    "W1": (248, 236, 220, 70),
    "W2": (240, 218, 188, 110),
    "W3": (232, 198, 162, 150),
    "E": (76, 58, 44, 255),
    "M": (188, 148, 124, 255),
    "F1": (188, 168, 152, 255),
    "F2": (148, 128, 116, 255),
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


def draw_furnace_glow(g: list[list[str]], cx: int, cy: int, strength: int) -> None:
    if strength <= 0:
        return
    layers = [(0, 0, "W1"), (-1, 0, "W1"), (1, 0, "W1"), (0, -1, "W1"), (0, 1, "W1")]
    if strength >= 1:
        layers.extend([(-2, -1, "W2"), (2, -1, "W2"), (-3, 0, "W2"), (3, 0, "W2"), (-2, 2, "W2"), (2, 2, "W2")])
    if strength >= 2:
        layers.extend(
            [
                (-4, -2, "W3"),
                (4, -2, "W3"),
                (-5, 1, "W3"),
                (5, 1, "W3"),
                (-4, 4, "W3"),
                (4, 4, "W3"),
                (0, -3, "W3"),
                (0, 5, "W3"),
            ]
        )
    for dx, dy, color in layers:
        put(g, cx + dx, cy + dy, color)


def draw_goggles_forehead(g: list[list[str]], x: int, y: int) -> None:
    rect(g, x, y, 10, 2, "O2")
    for i in range(4):
        put(g, x + 1 + i, y + 1, "G2" if i % 2 else "L1")
    put(g, x + 9, y + 1, "O1")


def draw_glass_piece(g: list[list[str]], x: int, y: int) -> None:
    put(g, x, y, "G2")
    put(g, x + 1, y, "G1")
    put(g, x + 2, y, "G2")
    put(g, x, y + 1, "G3")
    put(g, x + 1, y + 1, "G4")
    put(g, x + 2, y + 1, "G3")
    put(g, x + 1, y + 2, "G2")


def draw_glass_master_boss(g: list[list[str]], phase: int = 0) -> None:
    cx = 32
    glow = {0: 0, 1: 1, 2: 2, 3: 1}[phase]
    bob = -1 if phase in (1, 3) else 0

    draw_furnace_glow(g, cx, 24 + bob, glow)

    # silver hair
    rect(g, cx - 10, 8 + bob, 21, 5, "H2")
    rect(g, cx - 11, 11 + bob, 23, 5, "H1")
    draw_goggles_forehead(g, cx - 8, 7 + bob)

    # face front
    rect(g, cx - 8, 16 + bob, 17, 9, "S1")
    put(g, cx - 3, 20 + bob, "E")
    put(g, cx + 2, 20 + bob, "E")
    put(g, cx, 22 + bob, "M")

    # shirt + apron
    rect(g, cx - 10, 25 + bob, 21, 3, "D1")
    rect(g, cx - 12, 28 + bob, 25, 12, "A1")
    rect(g, cx - 10, 27 + bob, 4, 4, "A2")
    rect(g, cx - 8, 32 + bob, 17, 5, "A3")

    # feet
    put(g, cx - 5, 41 + bob, "F1")
    put(g, cx - 4, 41 + bob, "F2")
    put(g, cx + 3, 41 + bob, "F1")
    put(g, cx + 4, 41 + bob, "F2")

    # glass piece held at chest
    piece_y = 30 + bob + (1 if phase == 2 else 0)
    draw_glass_piece(g, cx - 1, piece_y)

    if phase == 2:
        put(g, cx - 9, 26 + bob, "W2")
        put(g, cx + 8, 26 + bob, "W2")


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
        "glass-master-boss-idle",
        "glass-master-boss-pulse-1",
        "glass-master-boss-pulse-2",
        "glass-master-boss-pulse-3",
    ]
    phases = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_glass_master_boss(grid, phase)
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

    png_path = OUT_DIR / "glass-master-boss-sprite-sheet-v1.png"
    json_path = OUT_DIR / "glass-master-boss-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "glass-master-boss-sprite-sheet-v1.png",
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

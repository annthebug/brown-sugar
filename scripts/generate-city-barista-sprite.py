#!/usr/bin/env python3
"""Generate City Barista side-view platformer sprite assets (256x256 frames, Morandi pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi warm pastel palette (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "O": (88, 70, 54, 255),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "S3": (198, 166, 134, 255),
    "H1": (156, 118, 96, 255),
    "H2": (130, 98, 78, 255),
    "D1": (200, 218, 224, 255),
    "D2": (143, 178, 191, 255),
    "D3": (120, 152, 168, 255),
    "A1": (244, 234, 220, 255),
    "A2": (217, 183, 177, 255),
    "A3": (196, 168, 158, 255),
    "G1": (183, 201, 189, 255),
    "G2": (150, 172, 158, 255),
    "P1": (148, 126, 112, 255),
    "P2": (122, 104, 92, 255),
    "U1": (244, 240, 232, 255),
    "U2": (220, 210, 196, 255),
    "E": (76, 58, 44, 255),
    "M": (188, 148, 124, 255),
    "F1": (192, 168, 144, 255),
    "F2": (150, 126, 106, 255),
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


def draw_coffee_cup(g: list[list[str]], x: int, y: int) -> None:
    rect(g, x, y, 4, 3, "U1")
    rect(g, x, y + 3, 4, 4, "U2")
    put(g, x + 4, y + 1, "D2")
    put(g, x + 4, y + 2, "D2")
    put(g, x + 1, y - 1, "D1")
    put(g, x + 2, y - 1, "D1")


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    lean = 1 if phase == 1 else (-1 if phase == 3 else 0)

    # short hair
    rect(g, 28, 8 + bob, 9, 4, "H2")
    rect(g, 27, 10 + bob, 10, 4, "H1")

    # face profile (round, gentle)
    rect(g, 30, 14 + bob, 8, 6, "S1")
    put(g, 36, 16 + bob, "E")
    put(g, 37, 17 + bob, "M")

    # shirt under apron
    rect(g, 24, 20 + bob, 12, 4, "D1")
    rect(g, 23, 24 + bob, 13, 3, "D2")

    # apron front panel + mist-pink tie
    rect(g, 22, 22 + bob, 10, 10, "A1")
    rect(g, 24, 21 + bob, 2, 3, "A2")
    put(g, 23, 24 + bob, "A3")
    put(g, 24, 26 + bob, "A3")

    # pants / apron skirt
    rect(g, 24, 32 + bob, 10, 4, "G1")
    rect(g, 25, 36 + bob, 8, 2, "G2")

    # feet
    base_y = 39 + bob
    if phase == 0:
        put(g, 26, base_y, "F1")
        put(g, 27, base_y, "F2")
        put(g, 31, base_y, "F1")
        put(g, 32, base_y, "F2")
    elif phase == 1:
        put(g, 27 + lean, base_y, "F1")
        put(g, 28 + lean, base_y, "F2")
        put(g, 33 + lean, base_y - 1, "F1")
        put(g, 34 + lean, base_y - 1, "F2")
    elif phase == 2:
        put(g, 26, base_y, "F1")
        put(g, 27, base_y, "F2")
        put(g, 32, base_y, "F1")
        put(g, 33, base_y, "F2")
    else:
        put(g, 24 + lean, base_y - 1, "F1")
        put(g, 25 + lean, base_y - 1, "F2")
        put(g, 29 + lean, base_y, "F1")
        put(g, 30 + lean, base_y, "F2")

    # coffee cup held forward
    draw_coffee_cup(g, 38, 24 + bob)


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


def draw_portrait() -> Image.Image:
    """Front bust portrait — warm, attentive, soft smile with coffee cup."""
    g = blank()
    cx = 32

    rect(g, cx - 8, 10, 17, 5, "H2")
    rect(g, cx - 9, 14, 19, 6, "H1")

    rect(g, cx - 7, 20, 15, 9, "S1")
    put(g, cx - 2, 24, "E")
    put(g, cx + 2, 24, "E")
    put(g, cx - 1, 27, "M")
    put(g, cx, 27, "M")
    put(g, cx + 1, 27, "M")

    rect(g, cx - 8, 29, 17, 3, "D1")
    rect(g, cx - 9, 32, 19, 8, "A1")
    rect(g, cx - 2, 31, 4, 4, "A2")
    rect(g, cx - 10, 40, 21, 4, "A1")
    rect(g, cx - 8, 44, 17, 2, "G1")

    draw_coffee_cup(g, cx + 10, 34)

    return render_pixel_grid(g).resize((64, 64), Image.Resampling.NEAREST)


def build_frames() -> list[tuple[str, list[list[str]]]]:
    return [
        ("city-barista-side-idle", blank()),
        ("city-barista-side-walk-1", blank()),
        ("city-barista-side-walk-2", blank()),
        ("city-barista-side-walk-3", blank()),
    ]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    phases = [0, 1, 2, 3]
    names = [
        "city-barista-side-idle",
        "city-barista-side-walk-1",
        "city-barista-side-walk-2",
        "city-barista-side-walk-3",
    ]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_side_right(grid, phase)
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

    png_path = OUT_DIR / "city-barista-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "city-barista-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "city-barista-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "city-barista-side-sprite-sheet-v1.png",
                    "size": {"w": sheet_w, "h": FRAME},
                    "scale": "1",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    draw_portrait().save(portrait_path)

    print(f"Wrote {png_path}")
    print(f"Wrote {json_path}")
    print(f"Wrote {portrait_path}")


if __name__ == "__main__":
    main()

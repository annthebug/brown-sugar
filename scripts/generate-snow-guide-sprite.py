#!/usr/bin/env python3
"""Generate Snow Guide side-view platformer sprite assets (256x256 frames, Morandi pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "D1": (200, 218, 224, 255),
    "D2": (143, 178, 191, 255),
    "D3": (120, 152, 168, 255),
    "D4": (98, 128, 148, 255),
    "P1": (232, 198, 192, 255),
    "P2": (217, 183, 177, 255),
    "P3": (196, 160, 154, 255),
    "W1": (208, 172, 126, 255),
    "W2": (176, 136, 96, 255),
    "W3": (142, 106, 72, 255),
    "B1": (244, 248, 252, 255),
    "B2": (220, 232, 240, 255),
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


def draw_staff(g: list[list[str]], x: int, y: int, length: int) -> None:
    for i in range(length):
        put(g, x + i, y + i // 2, "W2" if i else "W1")
        put(g, x + i, y + 1 + i // 2, "W3")


def draw_feet(g: list[list[str]], base_y: int, phase: int, lean: int) -> None:
    if phase == 0:
        put(g, 26, base_y, "B2")
        put(g, 27, base_y, "F2")
        put(g, 31, base_y, "B2")
        put(g, 32, base_y, "F2")
    elif phase == 1:
        put(g, 27 + lean, base_y, "B2")
        put(g, 28 + lean, base_y, "F2")
        put(g, 33 + lean, base_y - 1, "B1")
        put(g, 34 + lean, base_y - 1, "F2")
    elif phase == 2:
        put(g, 26, base_y, "B2")
        put(g, 27, base_y, "F2")
        put(g, 32, base_y, "B2")
        put(g, 33, base_y, "F2")
    else:
        put(g, 24 + lean, base_y - 1, "B1")
        put(g, 25 + lean, base_y - 1, "F2")
        put(g, 29 + lean, base_y, "B2")
        put(g, 30 + lean, base_y, "F2")


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    lean = 1 if phase == 1 else (-1 if phase == 3 else 0)

    # hooded cloak (dusty blue)
    rect(g, 24, 6 + bob, 12, 6, "D3")
    rect(g, 22, 10 + bob, 14, 8, "D2")
    rect(g, 21, 18 + bob, 15, 10, "D2")
    rect(g, 22, 28 + bob, 13, 8, "D3")
    rect(g, 23, 36 + bob, 11, 3, "D4")

    # face peek from hood
    rect(g, 30, 14 + bob, 7, 6, "S1")
    put(g, 35, 16 + bob, "E")
    put(g, 36, 17 + bob, "M")

    # mist-pink scarf
    rect(g, 26, 18 + bob, 8, 2, "P1")
    vline_scarf = [(27, 20 + bob), (28, 21 + bob), (27, 22 + bob), (26, 23 + bob)]
    for x, y in vline_scarf:
        put(g, x, y, "P2")
    put(g, 29, 19 + bob, "P3")

    # cloak back bulge
    rect(g, 14, 16 + bob, 6, 14, "D4")
    rect(g, 15, 17 + bob, 4, 12, "D3")

    draw_feet(g, 39 + bob, phase, lean)
    draw_staff(g, 38, 20 + bob, 12)


def draw_portrait() -> Image.Image:
    g = blank()
    cx = 32

    rect(g, cx - 10, 8, 21, 8, "D3")
    rect(g, cx - 11, 14, 23, 10, "D2")
    rect(g, cx - 7, 18, 15, 8, "S1")
    put(g, cx - 1, 22, "E")
    put(g, cx + 2, 22, "E")
    put(g, cx, 24, "M")

    rect(g, cx - 8, 26, 17, 3, "P1")
    rect(g, cx - 6, 29, 13, 2, "P2")

    rect(g, cx - 12, 30, 25, 10, "D2")
    rect(g, cx - 10, 40, 21, 4, "D3")

    draw_staff(g, cx + 12, 32, 8)

    return render_pixel_grid(g).resize((64, 64), Image.Resampling.NEAREST)


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
        "snow-guide-side-idle",
        "snow-guide-side-walk-1",
        "snow-guide-side-walk-2",
        "snow-guide-side-walk-3",
    ]
    phases = [0, 1, 2, 3]

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

    png_path = OUT_DIR / "snow-guide-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "snow-guide-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "snow-guide-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "snow-guide-side-sprite-sheet-v1.png",
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

#!/usr/bin/env python3
"""Generate Glass Master side-view platformer sprite assets (256x256 frames, Morandi pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi warm pastel + soft glass-blue accent (RGBA)
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
    "D3": (120, 152, 168, 255),
    "G1": (210, 232, 238, 255),
    "G2": (176, 210, 222, 255),
    "G3": (148, 188, 204, 255),
    "G4": (120, 168, 188, 255),
    "L1": (188, 208, 214, 255),
    "L2": (156, 184, 196, 255),
    "O1": (148, 138, 128, 255),
    "O2": (118, 108, 98, 255),
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


def draw_goggles_forehead(g: list[list[str]], x: int, y: int) -> None:
    rect(g, x, y, 8, 2, "O2")
    put(g, x + 1, y + 1, "L1")
    put(g, x + 2, y + 1, "G2")
    put(g, x + 3, y + 1, "G3")
    put(g, x + 4, y + 1, "G2")
    put(g, x + 5, y + 1, "L1")
    put(g, x + 7, y + 1, "O1")


def draw_glass_rod(g: list[list[str]], x: int, y: int, tilt: int = 0) -> None:
    for i in range(10):
        px = x + i
        py = y + tilt * i // 3
        put(g, px, py, "G3" if i % 2 else "G2")
        put(g, px, py + 1, "G4" if i % 3 else "G1")
    put(g, x + 9, y + tilt * 3 // 3, "G1")
    put(g, x + 10, y + tilt * 3 // 3 - 1, "G2")


def draw_glass_bubble(g: list[list[str]], x: int, y: int) -> None:
    put(g, x, y, "G2")
    put(g, x + 1, y, "G1")
    put(g, x + 2, y, "G2")
    put(g, x, y + 1, "G3")
    put(g, x + 1, y + 1, "G4")
    put(g, x + 2, y + 1, "G3")
    put(g, x + 1, y + 2, "G2")


def draw_feet(g: list[list[str]], base_y: int, phase: int, lean: int) -> None:
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


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    lean = 1 if phase == 1 else (-1 if phase == 3 else 0)

    # silver-white short hair
    rect(g, 27, 7 + bob, 10, 4, "H2")
    rect(g, 26, 9 + bob, 11, 4, "H1")
    rect(g, 27, 13 + bob, 8, 2, "H3")

    draw_goggles_forehead(g, 27, 6 + bob)

    # face profile (round, gentle, small eyes)
    rect(g, 30, 14 + bob, 8, 6, "S1")
    put(g, 35, 16 + bob, "E")
    put(g, 36, 17 + bob, "M")

    # dusty work shirt under apron
    rect(g, 24, 20 + bob, 12, 4, "D1")
    rect(g, 23, 24 + bob, 13, 3, "D2")

    # warm beige apron
    rect(g, 22, 22 + bob, 11, 11, "A1")
    rect(g, 24, 21 + bob, 2, 3, "A2")
    put(g, 23, 24 + bob, "A3")
    put(g, 24, 26 + bob, "A3")
    rect(g, 24, 33 + bob, 9, 3, "A2")

    # apron pocket hint
    rect(g, 26, 28 + bob, 5, 3, "A3")

    # pants
    rect(g, 25, 36 + bob, 9, 2, "D3")

    draw_feet(g, 39 + bob, phase, lean)

    # glass rod held forward; slight arm motion across walk phases
    rod_y = 22 + bob + (1 if phase == 1 else (-1 if phase == 3 else 0))
    draw_glass_rod(g, 38, rod_y, tilt=1 if phase in (1, 3) else 0)
    draw_glass_bubble(g, 48, rod_y - 2)


def draw_portrait() -> Image.Image:
    g = blank()
    cx = 32

    rect(g, cx - 11, 6, 23, 5, "H2")
    rect(g, cx - 12, 9, 25, 6, "H1")
    draw_goggles_forehead(g, cx - 8, 5)

    rect(g, cx - 8, 16, 17, 9, "S1")
    put(g, cx - 3, 20, "E")
    put(g, cx + 2, 20, "E")
    put(g, cx, 22, "M")

    rect(g, cx - 10, 25, 21, 3, "D1")
    rect(g, cx - 12, 28, 25, 12, "A1")
    rect(g, cx - 10, 27, 4, 4, "A2")
    rect(g, cx - 8, 32, 8, 4, "A3")

    draw_glass_bubble(g, cx + 10, 30)
    draw_glass_rod(g, cx + 6, 34, tilt=0)

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
        "glass-master-side-idle",
        "glass-master-side-walk-1",
        "glass-master-side-walk-2",
        "glass-master-side-walk-3",
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

    png_path = OUT_DIR / "glass-master-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "glass-master-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "glass-master-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "glass-master-side-sprite-sheet-v1.png",
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

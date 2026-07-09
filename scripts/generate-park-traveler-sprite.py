#!/usr/bin/env python3
"""Generate Park Traveler side-view platformer sprite assets (256x256 frames, Morandi pastel)."""

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
    "O": (88, 70, 54, 255),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "H1": (92, 72, 68, 255),
    "H2": (72, 56, 54, 255),
    "R1": (212, 158, 148, 255),
    "R2": (188, 132, 124, 255),
    "R3": (162, 110, 104, 255),
    "K1": (148, 122, 98, 255),
    "K2": (124, 100, 80, 255),
    "K3": (100, 80, 64, 255),
    "M1": (244, 234, 220, 255),
    "M2": (220, 200, 176, 255),
    "M3": (196, 176, 152, 255),
    "G1": (183, 201, 189, 255),
    "G2": (150, 172, 158, 255),
    "E": (76, 58, 44, 255),
    "L": (188, 148, 124, 255),
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


def draw_folded_map(g: list[list[str]], x: int, y: int) -> None:
    rect(g, x, y, 5, 6, "M2")
    rect(g, x + 1, y + 1, 3, 4, "M1")
    put(g, x + 2, y + 2, "M3")
    put(g, x + 3, y + 3, "M3")
    put(g, x + 1, y + 4, "M3")


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    lean = 1 if phase == 1 else (-1 if phase == 3 else 0)

    # dark bob hair
    rect(g, 27, 7 + bob, 11, 5, "H2")
    rect(g, 28, 9 + bob, 9, 5, "H1")

    # round face profile
    rect(g, 30, 14 + bob, 8, 6, "S1")
    put(g, 36, 16 + bob, "E")
    put(g, 37, 17 + bob, "L")

    # dusty rose dress bodice
    rect(g, 24, 20 + bob, 12, 4, "R1")
    rect(g, 23, 24 + bob, 13, 5, "R2")
    rect(g, 24, 29 + bob, 11, 4, "R3")
    rect(g, 25, 33 + bob, 9, 3, "R2")

    # small travel backpack (behind)
    rect(g, 15, 20 + bob, 7, 12, "K3")
    rect(g, 16, 21 + bob, 5, 10, "K2")
    rect(g, 17, 22 + bob, 3, 7, "K1")

    # dress hem / legs
    rect(g, 25, 36 + bob, 8, 2, "G1")

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

    # folded map held forward
    draw_folded_map(g, 37, 23 + bob)


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
    """Front bust — curious gentle traveler with map and backpack."""
    g = blank()
    cx = 32

    rect(g, cx - 9, 10, 19, 6, "H2")
    rect(g, cx - 8, 14, 17, 5, "H1")

    rect(g, cx - 7, 19, 15, 9, "S1")
    put(g, cx - 2, 23, "E")
    put(g, cx + 2, 23, "E")
    put(g, cx - 1, 26, "L")
    put(g, cx, 26, "L")
    put(g, cx + 1, 26, "L")

    rect(g, cx - 8, 28, 17, 4, "R1")
    rect(g, cx - 9, 32, 19, 7, "R2")
    rect(g, cx - 8, 39, 17, 3, "R3")
    rect(g, cx - 7, 42, 15, 2, "G1")

    rect(g, cx - 14, 28, 6, 12, "K3")
    rect(g, cx - 13, 29, 5, 10, "K2")

    draw_folded_map(g, cx + 8, 32)

    return render_pixel_grid(g).resize((64, 64), Image.Resampling.NEAREST)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    names = [
        "park-traveler-side-idle",
        "park-traveler-side-walk-1",
        "park-traveler-side-walk-2",
        "park-traveler-side-walk-3",
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

    png_path = OUT_DIR / "park-traveler-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "park-traveler-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "park-traveler-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "park-traveler-side-sprite-sheet-v1.png",
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

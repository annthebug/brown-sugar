#!/usr/bin/env python3
"""Generate Inner Guide side-view platformer sprite assets (256x256 frames, Morandi pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi + pale sky-blue, soft translucent glow (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "S1": (238, 230, 220, 255),
    "S2": (218, 208, 198, 255),
    "H1": (232, 240, 246, 255),
    "H2": (210, 226, 236, 255),
    "H3": (188, 210, 224, 255),
    "R1": (216, 232, 242, 255),
    "R2": (188, 214, 228, 255),
    "R3": (160, 194, 214, 255),
    "R4": (136, 176, 200, 255),
    "T1": (176, 214, 214, 255),
    "T2": (148, 194, 194, 255),
    "T3": (124, 176, 176, 255),
    "G1": (248, 252, 254, 90),
    "G2": (224, 240, 248, 130),
    "G3": (200, 228, 240, 170),
    "E": (88, 108, 118, 255),
    "M": (176, 168, 162, 255),
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


def draw_glow_aura(g: list[list[str]], cx: int, cy: int, bob: int) -> None:
    for dx, dy, c in [
        (-8, -2 + bob, "G1"),
        (8, -2 + bob, "G1"),
        (-10, 6 + bob, "G2"),
        (10, 6 + bob, "G2"),
        (-6, 14 + bob, "G2"),
        (6, 14 + bob, "G2"),
        (0, -6 + bob, "G1"),
        (0, 18 + bob, "G3"),
    ]:
        put(g, cx + dx, cy + dy, c)


def draw_robe_flow(g: list[list[str]], base_y: int, bob: int, sway: int) -> None:
    rect(g, 20 + sway, 18 + bob, 16, 14, "R2")
    rect(g, 21 + sway, 32 + bob, 14, 8, "R3")
    rect(g, 22 + sway, 40 + bob, 12, 6, "R4")

    for x, y, c in [
        (18 + sway, 44 + bob, "R3"),
        (19 + sway, 45 + bob, "R4"),
        (34 + sway, 44 + bob, "R3"),
        (33 + sway, 45 + bob, "R4"),
        (24 + sway, 46 + bob, "R4"),
        (28 + sway, 46 + bob, "R4"),
    ]:
        put(g, x, y, c)

    # glass-teal highlights
    for x, y in [(24 + sway, 24 + bob), (27 + sway, 28 + bob), (25 + sway, 34 + bob)]:
        put(g, x, y, "T1")
        put(g, x + 1, y, "T2")


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    bob = -1 if phase in (1, 3) else 0
    sway = 1 if phase == 1 else (-1 if phase == 3 else 0)

    draw_glow_aura(g, 28, 22 + bob, bob)

    # soft short hair
    rect(g, 27, 8 + bob, 9, 4, "H2")
    rect(g, 26, 10 + bob, 10, 4, "H1")
    rect(g, 27, 14 + bob, 8, 2, "H3")

    # calm face (small eyes)
    rect(g, 30, 15 + bob, 7, 6, "S1")
    put(g, 35, 17 + bob, "E")
    put(g, 36, 18 + bob, "M")

    # upper robe collar
    rect(g, 24 + sway, 18 + bob, 12, 4, "R1")
    rect(g, 23 + sway, 22 + bob, 14, 3, "R2")

    draw_robe_flow(g, 40, bob, sway)

    # trailing ethereal hem on walk phases
    if phase in (1, 3):
        put(g, 16 + sway, 42 + bob, "G3")
        put(g, 17 + sway, 43 + bob, "R2")
        put(g, 38 + sway, 42 + bob, "G3")
        put(g, 37 + sway, 43 + bob, "R2")


def draw_portrait() -> Image.Image:
    g = blank()
    cx = 32

    draw_glow_aura(g, cx, 24, 0)

    rect(g, cx - 10, 8, 21, 5, "H2")
    rect(g, cx - 11, 11, 23, 5, "H1")

    rect(g, cx - 7, 17, 15, 8, "S1")
    put(g, cx - 2, 20, "E")
    put(g, cx + 2, 20, "E")
    put(g, cx, 22, "M")

    rect(g, cx - 12, 25, 25, 14, "R2")
    rect(g, cx - 10, 39, 21, 8, "R3")
    rect(g, cx - 8, 47, 17, 4, "R4")

    put(g, cx - 4, 30, "T1")
    put(g, cx + 3, 34, "T2")
    put(g, cx, 38, "T1")

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
        "inner-guide-side-idle",
        "inner-guide-side-walk-1",
        "inner-guide-side-walk-2",
        "inner-guide-side-walk-3",
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

    png_path = OUT_DIR / "inner-guide-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "inner-guide-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "inner-guide-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "inner-guide-side-sprite-sheet-v1.png",
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

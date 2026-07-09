#!/usr/bin/env python3
"""Generate Inner Doubt boss sprite assets (256x256 frames, Morandi pastel soot-sprite cluster)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi charcoal soot sprites — cute, not horror (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "N1": (108, 102, 98, 255),
    "N2": (88, 84, 80, 255),
    "N3": (72, 68, 66, 255),
    "H1": (232, 224, 210, 255),
    "H2": (214, 200, 182, 255),
    "E1": (248, 246, 242, 255),
    "E2": (236, 232, 226, 255),
    "L1": (188, 176, 162, 255),
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


def draw_fuzz_ball(
    g: list[list[str]],
    cx: int,
    cy: int,
    radius: int,
    blink: bool,
    highlight_side: int,
) -> None:
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dx * dx + dy * dy <= radius * radius + radius:
                shade = "N1" if dx + dy > 0 else "N2"
                if abs(dx) == radius or abs(dy) == radius:
                    shade = "N3"
                put(g, cx + dx, cy + dy, shade)

    hx = cx + highlight_side
    put(g, hx, cy - 1, "H1")
    put(g, hx + 1, cy, "H2")

    if blink:
        put(g, cx - 1, cy - 1, "N2")
        put(g, cx + 1, cy - 1, "N2")
    else:
        put(g, cx - 2, cy - 1, "E1")
        put(g, cx - 1, cy - 1, "E2")
        put(g, cx + 1, cy - 1, "E1")
        put(g, cx + 2, cy - 1, "E2")

    put(g, cx - 1, cy + radius, "L1")
    put(g, cx + 1, cy + radius, "L1")


def draw_inner_doubt(g: list[list[str]], phase: int = 0) -> None:
    bob = {0: 0, 1: 1, 2: -1, 3: 0}[phase]
    spread = {0: 0, 1: -1, 2: 0, 3: 1}[phase]
    blink_center = phase == 1
    blink_left = phase == 3
    blink_right = phase == 2

    base_y = 28 + bob

    draw_fuzz_ball(g, 32 + spread, base_y - 2, 5, blink_center, 1)
    draw_fuzz_ball(g, 22 + spread, base_y + 4, 4, blink_left, -1)
    draw_fuzz_ball(g, 42 + spread, base_y + 4, 4, blink_right, 1)


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
        "inner-doubt-idle",
        "inner-doubt-pulse-1",
        "inner-doubt-pulse-2",
        "inner-doubt-pulse-3",
    ]
    phases = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_inner_doubt(grid, phase)
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

    png_path = OUT_DIR / "inner-doubt-sprite-sheet-v1.png"
    json_path = OUT_DIR / "inner-doubt-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "inner-doubt-sprite-sheet-v1.png",
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

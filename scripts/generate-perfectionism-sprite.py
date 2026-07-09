#!/usr/bin/env python3
"""Generate Perfectionism boss sprite assets (256x256 frames, Morandi pastel mask + mist)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3

# Morandi pale violet mist + soft white mask (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "M1": (252, 250, 248, 255),
    "M2": (244, 240, 236, 255),
    "M3": (228, 222, 216, 255),
    "V1": (232, 224, 236, 80),
    "V2": (214, 204, 224, 120),
    "V3": (196, 184, 210, 160),
    "P1": (244, 236, 228, 255),
    "P2": (232, 220, 232, 255),
    "P3": (220, 208, 224, 255),
    "E": (120, 112, 118, 255),
    "S1": (208, 200, 210, 255),
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


def draw_mist(g: list[list[str]], cx: int, cy: int, strength: int) -> None:
    if strength <= 0:
        return
    layers = [(0, 0, "V1"), (-1, 0, "V1"), (1, 0, "V1"), (0, -1, "V1"), (0, 1, "V1")]
    if strength >= 1:
        layers.extend([(-2, -1, "V2"), (2, -1, "V2"), (-3, 0, "V2"), (3, 0, "V2"), (-2, 2, "V2"), (2, 2, "V2")])
    if strength >= 2:
        layers.extend(
            [
                (-4, -2, "V3"),
                (4, -2, "V3"),
                (-5, 1, "V3"),
                (5, 1, "V3"),
                (0, -3, "V3"),
                (0, 4, "V3"),
            ]
        )
    for dx, dy, color in layers:
        put(g, cx + dx, cy + dy, color)


def draw_paper_shard(g: list[list[str]], x: int, y: int, drift: int, color: str = "P2") -> None:
    for i in range(3):
        put(g, x + i + drift, y, color)
        put(g, x + i + drift, y + 1, "P1" if color == "P2" else "P3")


def draw_mask_face(g: list[list[str]], cx: int, cy: int, bob: int) -> None:
    y = cy + bob
    rect(g, cx - 8, y - 4, 16, 12, "M2")
    rect(g, cx - 7, y - 3, 14, 10, "M1")
    rect(g, cx - 6, y - 2, 12, 8, "M2")

    # small calm eye slits
    rect(g, cx - 5, y + 1, 3, 1, "E")
    rect(g, cx + 2, y + 1, 3, 1, "E")

    # soft chin curve
    put(g, cx - 2, y + 7, "M3")
    put(g, cx - 1, y + 7, "S1")
    put(g, cx, y + 7, "M3")


def draw_perfectionism(g: list[list[str]], phase: int = 0) -> None:
    cx = 32
    bob = {0: 0, 1: -1, 2: -2, 3: -1}[phase]
    mist = {0: 0, 1: 1, 2: 2, 3: 1}[phase]
    drift = {0: 0, 1: 1, 2: -1, 3: 0}[phase]

    draw_mist(g, cx, 22 + bob, mist)
    draw_mask_face(g, cx, 18, bob)

    draw_paper_shard(g, 18, 14 + bob, drift, "P2")
    draw_paper_shard(g, 40, 16 + bob, -drift, "P3")
    draw_paper_shard(g, 24, 34 + bob, drift // 2, "P2")
    draw_paper_shard(g, 36, 32 + bob, -drift // 2, "P3")

    if phase == 2:
        draw_paper_shard(g, 14, 24 + bob, 1, "P1")
        draw_paper_shard(g, 44, 26 + bob, -1, "P1")


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
        "perfectionism-idle",
        "perfectionism-pulse-1",
        "perfectionism-pulse-2",
        "perfectionism-pulse-3",
    ]
    phases = [0, 1, 2, 3]

    sheet_w = FRAME * len(names)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, phase) in enumerate(zip(names, phases, strict=True)):
        grid = blank()
        draw_perfectionism(grid, phase)
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

    png_path = OUT_DIR / "perfectionism-sprite-sheet-v1.png"
    json_path = OUT_DIR / "perfectionism-sprite-sheet-v1.json"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "perfectionism-sprite-sheet-v1.png",
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

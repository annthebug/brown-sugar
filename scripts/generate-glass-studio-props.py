#!/usr/bin/env python3
"""Generate Glass Studio scene prop atlases (furnace + blow station, Morandi 16bit)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "scenes"

PIXEL_W = 96
PIXEL_H = 72
FRAME_W = 256
FRAME_H = 192
SCALE = 3

# Morandi palette + soft furnace orange + glass blue (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "B1": (143, 178, 191, 255),  # dusty blue brick
    "B2": (118, 154, 168, 255),
    "B3": (96, 132, 146, 255),
    "K1": (232, 220, 200, 255),  # warm beige brick
    "K2": (214, 198, 176, 255),
    "K3": (196, 178, 156, 255),
    "D1": (58, 72, 80, 255),  # door shadow
    "D2": (42, 54, 62, 255),
    "G1": (184, 212, 232, 120),  # glass tube
    "G2": (168, 200, 224, 170),
    "G3": (152, 188, 216, 210),
    "G4": (136, 176, 208, 255),
    "W1": (244, 234, 220, 255),  # bench top
    "W2": (228, 210, 188, 255),
    "W3": (206, 186, 162, 255),
    "P1": (118, 138, 152, 255),  # pipe metal
    "P2": (96, 116, 130, 255),
    "O0": (232, 184, 152, 40),  # glow weakest
    "O1": (232, 184, 152, 90),
    "O2": (232, 184, 152, 150),
    "O3": (240, 196, 168, 200),  # glow peak
    "S1": (216, 232, 240, 80),  # window light spill
    "S2": (200, 224, 236, 50),
}


def blank(w: int = PIXEL_W, h: int = PIXEL_H) -> list[list[str]]:
    return [["." for _ in range(w)] for _ in range(h)]


def put(g: list[list[str]], x: int, y: int, c: str) -> None:
    if 0 <= y < len(g) and 0 <= x < len(g[0]):
        g[y][x] = c


def rect(g: list[list[str]], x: int, y: int, w: int, h: int, c: str) -> None:
    for dy in range(h):
        for dx in range(w):
            put(g, x + dx, y + dy, c)


def draw_brick_rect(g: list[list[str]], x: int, y: int, w: int, h: int, a: str, b: str) -> None:
    for row in range(h):
        for col in range(w):
            put(g, x + col, y + row, a if (row + col) % 2 == 0 else b)


def draw_furnace(g: list[list[str]], glow: int) -> None:
    # pale window spill
    rect(g, 0, 0, 28, 18, "S2")
    rect(g, 0, 0, 18, 12, "S1")

    # chimney
    draw_brick_rect(g, 68, 4, 14, 22, "B1", "B2")
    rect(g, 70, 2, 10, 3, "B3")

    # main body
    draw_brick_rect(g, 18, 24, 58, 34, "K1", "K2")
    draw_brick_rect(g, 22, 28, 50, 26, "B1", "K3")

    # door frame
    rect(g, 34, 34, 26, 20, "D2")
    rect(g, 36, 36, 22, 16, "D1")

    glow_layers = {
        0: [("O0", 38, 40, 18, 10)],
        1: [("O1", 37, 39, 20, 12), ("O0", 40, 42, 14, 8)],
        2: [("O3", 36, 38, 22, 14), ("O2", 38, 40, 18, 10), ("O1", 42, 44, 10, 6)],
        3: [("O2", 37, 39, 20, 12), ("O1", 40, 42, 14, 8)],
    }
    for color, gx, gy, gw, gh in glow_layers.get(glow, glow_layers[0]):
        rect(g, gx, gy, gw, gh, color)

    # hearth base
    rect(g, 16, 56, 62, 8, "K2")
    rect(g, 14, 62, 66, 4, "B2")


def draw_bench_base(g: list[list[str]]) -> None:
    rect(g, 8, 48, 80, 6, "W3")
    rect(g, 6, 42, 84, 8, "W1")
    rect(g, 10, 44, 76, 4, "W2")
    # legs
    rect(g, 14, 54, 6, 10, "W3")
    rect(g, 74, 54, 6, 10, "W3")


def draw_pipe(g: list[list[str]], blob: int) -> None:
    # metal blow pipe
    rect(g, 22, 10, 6, 34, "P2")
    rect(g, 23, 11, 4, 32, "P1")

    blob_specs = {
        0: (52, 18, 8, 6),
        1: (50, 16, 12, 9),
        2: (48, 14, 16, 12),
        3: (46, 12, 20, 15),
        4: (48, 14, 18, 13),  # set - slightly settled
    }
    bx, by, bw, bh = blob_specs.get(blob, blob_specs[0])

    # glass gather on pipe tip
    rect(g, 30, 22, 18, 6, "G1")
    rect(g, 32, 20, 14, 4, "G2")

    # molten blob
    for dy in range(bh):
        for dx in range(bw):
            cx = bx + dx
            cy = by + dy
            dist = abs(dx - bw / 2) + abs(dy - bh / 2) * 1.2
            if dist <= bw * 0.55:
                tone = "G4" if dist < bw * 0.25 else "G3" if dist < bw * 0.4 else "G2"
                put(g, int(cx), int(cy), tone)

    if blob >= 2:
        put(g, bx + 2, by + 1, "G4")
        put(g, bx + bw - 4, by + 2, "G1")

    # secondary cooling tube
    rect(g, 66, 20, 5, 28, "G1")
    rect(g, 67, 22, 3, 24, "G2")


def render_grid(g: list[list[str]]) -> Image.Image:
    h = len(g)
    w = len(g[0]) if h else PIXEL_W
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            px[x, y] = C[ch]
    return img


def to_frame(pixel_art: Image.Image) -> Image.Image:
    scaled = pixel_art.resize((pixel_art.width * SCALE, pixel_art.height * SCALE), Image.Resampling.NEAREST)
    frame = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    x = (FRAME_W - scaled.width) // 2
    y = FRAME_H - scaled.height - 12
    frame.paste(scaled, (x, y))
    return frame


def build_atlas(
    sheet_name: str,
    frame_names: list[str],
    draw_fn,
) -> None:
    sheet_w = FRAME_W * len(frame_names)
    sheet = Image.new("RGBA", (sheet_w, FRAME_H), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, name in enumerate(frame_names):
        grid = blank()
        draw_fn(grid, index)
        frame_img = to_frame(render_grid(grid))
        x = index * FRAME_W
        sheet.paste(frame_img, (x, 0))
        atlas_frames[name] = {
            "frame": {"x": x, "y": 0, "w": FRAME_W, "h": FRAME_H},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME_W, "h": FRAME_H},
            "sourceSize": {"w": FRAME_W, "h": FRAME_H},
        }

    png_path = OUT_DIR / f"{sheet_name}.png"
    json_path = OUT_DIR / f"{sheet_name}.json"
    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": f"{sheet_name}.png",
                    "size": {"w": sheet_w, "h": FRAME_H},
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


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    furnace_names = [
        "glass-furnace-idle",
        "glass-furnace-glow-1",
        "glass-furnace-glow-2",
        "glass-furnace-glow-3",
    ]
    furnace_glow = [0, 1, 2, 3]

    def draw_furnace_frame(grid: list[list[str]], index: int) -> None:
        draw_furnace(grid, furnace_glow[index])

    build_atlas("glass-furnace-sprite-sheet-v1", furnace_names, draw_furnace_frame)

    station_names = [
        "glass-blow-bench-idle",
        "glass-blob-pulse-1",
        "glass-blob-pulse-2",
        "glass-blob-pulse-3",
        "glass-blob-set",
    ]
    blob_phases = [0, 1, 2, 3, 4]

    def draw_station_frame(grid: list[list[str]], index: int) -> None:
        draw_bench_base(grid)
        draw_pipe(grid, blob_phases[index])

    build_atlas("glass-blow-station-sheet-v1", station_names, draw_station_frame)


if __name__ == "__main__":
    main()

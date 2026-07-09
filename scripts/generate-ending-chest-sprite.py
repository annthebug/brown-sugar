#!/usr/bin/env python3
"""Generate Ending Treasure Chest layered UI assets (256x256 per layer, Morandi pastel)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "ui"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 4

# Morandi warm wood + mist pink + soft gold + pale blue inner glow (RGBA)
C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "O1": (138, 116, 104, 255),
    "O2": (156, 132, 118, 255),
    "W1": (250, 244, 236, 255),
    "W2": (244, 234, 220, 255),
    "W3": (232, 214, 198, 255),
    "W4": (214, 192, 178, 255),
    "W5": (196, 172, 158, 255),
    "P1": (225, 195, 189, 255),
    "P2": (210, 178, 172, 255),
    "G1": (232, 216, 176, 255),
    "G2": (212, 192, 152, 255),
    "G3": (188, 168, 128, 255),
    "K1": (120, 100, 84, 255),
    "B1": (216, 237, 244, 70),
    "B2": (196, 228, 240, 110),
    "B3": (176, 214, 232, 150),
    "B4": (152, 198, 218, 190),
    "H1": (218, 182, 178, 255),
}

LayerGrid = dict[str, list[list[str]]]


def blank() -> list[list[str]]:
    return [["." for _ in range(PIXEL)] for _ in range(PIXEL)]


def put(layer: str, grids: LayerGrid, x: int, y: int, c: str) -> None:
    if 0 <= x < PIXEL and 0 <= y < PIXEL:
        grids[layer][y][x] = c


def rect(layer: str, grids: LayerGrid, x: int, y: int, w: int, h: int, c: str) -> None:
    for dy in range(h):
        for dx in range(w):
            put(layer, grids, x + dx, y + dy, c)


def draw_wood_grain(grids: LayerGrid, x: int, y: int, w: int, h: int) -> None:
    rect("body", grids, x, y, w, h, "W2")
    for row in range(h):
        stripe = "P1" if row % 4 == 1 else "W3" if row % 4 == 3 else "W2"
        for col in range(w):
            if col % 7 == 2:
                put("body", grids, x + col, y + row, "P2")
            elif col % 11 == 5:
                put("body", grids, x + col, y + row, "W1")
            else:
                put("body", grids, x + col, y + row, stripe)


def draw_body(grids: LayerGrid) -> None:
    left, right = 16, 47
    top, bottom = 36, 57

    draw_wood_grain(grids, left + 1, top + 1, right - left - 1, bottom - top - 1)

    # rounded corners
    for x, y in [(left, top + 2), (left, top + 3), (right, top + 2), (right, top + 3)]:
        put("body", grids, x, y, "W4")
    for x, y in [(left, bottom - 2), (left, bottom - 3), (right, bottom - 2), (right, bottom - 3)]:
        put("body", grids, x, y, "W5")

    # soft outline
    for x in range(left, right + 1):
        put("body", grids, x, bottom, "O1")
        put("body", grids, x, top, "O2")
    for y in range(top, bottom + 1):
        put("body", grids, left, y, "O1")
        put("body", grids, right, y, "O1")

    # inner rim at opening (pale blue glass hint along top edge)
    for x in range(left + 2, right - 1):
        put("body", grids, x, top, "B4")
        put("body", grids, x, top + 1, "B3")

    # subtle heart notch (Black Sugar keepsake detail)
    for x, y, c in [(31, bottom - 4, "H1"), (32, bottom - 3, "H1"), (33, bottom - 4, "H1"), (32, bottom - 5, "P2")]:
        put("body", grids, x, y, c)

    # front highlight
    rect("body", grids, left + 3, top + 4, 2, bottom - top - 6, "W1")


def draw_lid(grids: LayerGrid) -> None:
    cx = 32
    # curved dome lid — hinge line sits near y=36 (bottom center pivot)
    lid_rows: list[tuple[int, int, str]] = [
        (18, 8, "W1"),
        (19, 10, "W2"),
        (20, 12, "W2"),
        (21, 14, "W3"),
        (22, 16, "W3"),
        (23, 18, "W4"),
        (24, 20, "W4"),
        (25, 22, "W4"),
        (26, 24, "W5"),
        (27, 26, "W5"),
        (28, 28, "W5"),
        (29, 30, "W4"),
        (30, 32, "W4"),
        (31, 34, "W3"),
        (32, 36, "W3"),
    ]

    for half_height, half_width, base in lid_rows:
        y = half_height
        for x in range(cx - half_width, cx + half_width + 1):
            tone = base
            if (x + y) % 5 == 0:
                tone = "P1" if base in {"W2", "W3"} else "W2"
            if x == cx - half_width or x == cx + half_width:
                tone = "O1"
            put("lid", grids, x, y, tone)
            if y > 18:
                put("lid", grids, x, y + 1, tone if tone != "O1" else "O2")

    # lid underside shadow strip (bottom edge / hinge)
    for x in range(18, 47):
        put("lid", grids, x, 36, "W5")
        put("lid", grids, x, 37, "O2")

    # top highlight arc
    for x in range(24, 41):
        put("lid", grids, x, 17, "W1")
        put("lid", grids, x, 18, "W1")


def draw_lock(grids: LayerGrid) -> None:
    cx = 32
    # soft gold lock plate — cute proportion, not pirate
    rect("lock", grids, cx - 4, 33, 9, 7, "G2")
    rect("lock", grids, cx - 3, 34, 7, 5, "G1")
    for x in range(cx - 4, cx + 5):
        put("lock", grids, x, 33, "G3")
        put("lock", grids, x, 39, "G3")
    for y in range(33, 40):
        put("lock", grids, cx - 4, y, "G3")
        put("lock", grids, cx + 4, y, "G3")

    # rounded plate corners
    put("lock", grids, cx - 3, 33, "G1")
    put("lock", grids, cx + 3, 33, "G1")

    # keyhole heart shape (gentle)
    put("lock", grids, cx, 35, "K1")
    put("lock", grids, cx - 1, 36, "K1")
    put("lock", grids, cx + 1, 36, "K1")
    put("lock", grids, cx, 37, "K1")


def draw_glow(grids: LayerGrid) -> None:
    cx = 32
    # inner pale blue glass glow — visible when lid opens
    for radius_y, radius_x, color in [
        (3, 10, "B1"),
        (5, 12, "B2"),
        (7, 14, "B2"),
        (9, 15, "B3"),
        (11, 14, "B3"),
        (13, 12, "B2"),
    ]:
        for dy in range(-radius_y, radius_y + 1):
            for dx in range(-radius_x, radius_x + 1):
                if (dx * dx) / (radius_x * radius_x) + (dy * dy) / (radius_y * radius_y) <= 1:
                    put("glow", grids, cx + dx, 44 + dy, color)

    # rim glow along inner cavity
    for x in range(20, 45):
        put("glow", grids, x, 38, "B4")
        put("glow", grids, x, 39, "B3")


def render_grid(grid: list[list[str]]) -> Image.Image:
    img = Image.new("RGBA", (PIXEL, PIXEL), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(grid):
        for x, ch in enumerate(row):
            px[x, y] = C[ch]
    return img.resize((FRAME, FRAME), Image.NEAREST)


def build_layers() -> LayerGrid:
    grids: LayerGrid = {
        "body": blank(),
        "lid": blank(),
        "lock": blank(),
        "glow": blank(),
    }
    draw_glow(grids)
    draw_body(grids)
    draw_lid(grids)
    draw_lock(grids)
    return grids


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    grids = build_layers()

    outputs = {
        "body": OUT_DIR / "ending-chest-body-v1.png",
        "lid": OUT_DIR / "ending-chest-lid-v1.png",
        "lock": OUT_DIR / "ending-chest-lock-v1.png",
        "glow": OUT_DIR / "ending-chest-glow-v1.png",
    }

    for layer, path in outputs.items():
        render_grid(grids[layer]).save(path)
        print(f"Wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

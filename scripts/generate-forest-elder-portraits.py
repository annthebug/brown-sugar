#!/usr/bin/env python3
"""Generate Forest Elder emotion portrait series (64x64, warm pastel pixel art)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "O": (88, 70, 54, 255),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "B1": (250, 244, 236, 255),
    "B2": (234, 224, 210, 255),
    "B3": (212, 200, 184, 255),
    "R1": (184, 146, 108, 255),
    "R2": (158, 120, 86, 255),
    "R3": (130, 98, 70, 255),
    "K2": (124, 100, 80, 255),
    "K3": (100, 80, 64, 255),
    "T1": (172, 128, 96, 255),
    "L1": (236, 206, 136, 255),
    "L2": (220, 160, 114, 255),
    "L3": (200, 130, 110, 255),
    "E": (76, 58, 44, 255),
    "M": (188, 148, 124, 255),
    "H1": (188, 156, 122, 255),
    "H2": (168, 136, 106, 255),
}

SIZE = 32


def blank() -> list[list[str]]:
    return [["." for _ in range(SIZE)] for _ in range(SIZE)]


def put(g: list[list[str]], x: int, y: int, c: str) -> None:
    if 0 <= x < SIZE and 0 <= y < SIZE:
        g[y][x] = c


def rect(g: list[list[str]], x: int, y: int, w: int, h: int, c: str) -> None:
    for dy in range(h):
        for dx in range(w):
            put(g, x + dx, y + dy, c)


def hline(g: list[list[str]], x: int, y: int, w: int, c: str) -> None:
    for i in range(w):
        put(g, x + i, y, c)


def vline(g: list[list[str]], x: int, y: int, h: int, c: str) -> None:
    for i in range(h):
        put(g, x, y + i, c)


def leaves_on_backpack(g: list[list[str]], x: int, y: int) -> None:
    put(g, x, y, "L2")
    put(g, x + 1, y, "L1")
    put(g, x, y + 1, "L3")
    put(g, x + 2, y + 1, "L2")


def draw_base_bust(g: list[list[str]]) -> None:
    cx = 16
    rect(g, cx - 8, 4, 17, 3, "H2")
    rect(g, cx - 9, 7, 19, 4, "H1")
    rect(g, cx - 7, 11, 15, 8, "S1")
    put(g, cx - 7, 11, "O")
    put(g, cx + 7, 11, "O")
    put(g, cx - 7, 18, "O")
    put(g, cx + 7, 18, "O")

    hline(g, cx - 6, 19, 13, "B2")
    hline(g, cx - 7, 20, 15, "B1")
    hline(g, cx - 8, 21, 17, "B1")
    hline(g, cx - 7, 22, 15, "B1")
    hline(g, cx - 6, 23, 13, "B2")
    hline(g, cx - 4, 24, 9, "B3")

    rect(g, cx - 9, 25, 19, 2, "R1")
    rect(g, cx - 10, 27, 21, 4, "R2")
    rect(g, cx - 9, 31, 19, 1, "R3")

    rect(g, cx - 14, 24, 5, 8, "K3")
    rect(g, cx - 13, 25, 4, 6, "K2")
    leaves_on_backpack(g, cx - 13, 24)
    put(g, cx + 10, 28, "L2")
    vline(g, cx + 8, 26, 4, "T1")


def draw_calm_face(g: list[list[str]]) -> None:
    cx = 16
    put(g, cx - 3, 14, "E")
    put(g, cx - 2, 14, "E")
    put(g, cx + 2, 14, "E")
    put(g, cx + 3, 14, "E")
    put(g, cx - 1, 17, "M")
    put(g, cx, 17, "M")
    put(g, cx + 1, 17, "M")


def draw_thoughtful_face(g: list[list[str]]) -> None:
    cx = 16
    # slight squint — eyes one row lower, single pixel each
    put(g, cx - 2, 15, "E")
    put(g, cx + 2, 15, "E")
    put(g, cx - 3, 14, "E")
    put(g, cx + 3, 14, "E")
    # neutral contemplative mouth
    put(g, cx - 1, 17, "M")
    put(g, cx, 17, "M")


def draw_warm_face(g: list[list[str]]) -> None:
    cx = 16
    # soft happy eyes — small upward arcs
    put(g, cx - 3, 15, "E")
    put(g, cx - 2, 14, "E")
    put(g, cx + 2, 14, "E")
    put(g, cx + 3, 15, "E")
    # wider gentle smile
    put(g, cx - 2, 17, "M")
    put(g, cx - 1, 18, "M")
    put(g, cx, 18, "M")
    put(g, cx + 1, 18, "M")
    put(g, cx + 2, 17, "M")


def render(g: list[list[str]]) -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            px[x, y] = C[ch]
    return img.resize((64, 64), Image.Resampling.NEAREST)


def build_portrait(draw_face) -> Image.Image:
    g = blank()
    draw_base_bust(g)
    draw_face(g)
    return render(g)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    portraits = {
        "forest-elder-portrait-calm-v1.png": draw_calm_face,
        "forest-elder-portrait-thoughtful-v1.png": draw_thoughtful_face,
        "forest-elder-portrait-warm-v1.png": draw_warm_face,
    }
    for filename, draw_face in portraits.items():
        path = OUT_DIR / filename
        build_portrait(draw_face).save(path)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()

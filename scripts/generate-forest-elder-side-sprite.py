#!/usr/bin/env python3
"""Generate Forest Elder side-view platformer sprite assets (256x256 frames, SNES warm pastel)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "characters"

PIXEL = 64
FRAME = 256
FRAME_SCALE = 3  # 64 * 3 = 192 px character height inside 256 frame

C: dict[str, tuple[int, int, int, int]] = {
    ".": (0, 0, 0, 0),
    "O": (88, 70, 54, 255),
    "S1": (238, 214, 186, 255),
    "S2": (218, 188, 156, 255),
    "S3": (198, 166, 134, 255),
    "B1": (250, 244, 236, 255),
    "B2": (234, 224, 210, 255),
    "B3": (212, 200, 184, 255),
    "R1": (184, 146, 108, 255),
    "R2": (158, 120, 86, 255),
    "R3": (130, 98, 70, 255),
    "R4": (104, 78, 56, 255),
    "K1": (152, 126, 102, 255),
    "K2": (124, 100, 80, 255),
    "K3": (100, 80, 64, 255),
    "W1": (208, 172, 126, 255),
    "W2": (176, 136, 96, 255),
    "W3": (142, 106, 72, 255),
    "T1": (172, 128, 96, 255),
    "T2": (142, 104, 76, 255),
    "L1": (236, 206, 136, 255),
    "L2": (220, 160, 114, 255),
    "L3": (200, 130, 110, 255),
    "E": (76, 58, 44, 255),
    "M": (188, 148, 124, 255),
    "F1": (192, 168, 144, 255),
    "F2": (150, 126, 106, 255),
    "H1": (188, 156, 122, 255),
    "H2": (168, 136, 106, 255),
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


def draw_staff_forward(g: list[list[str]], x: int, y: int, length: int) -> None:
    for i in range(length):
        put(g, x + i, y + i // 2, "W2" if i else "W1")
        put(g, x + i, y + 1 + i // 2, "W3")


def draw_side_right(g: list[list[str]], phase: int = 0) -> None:
    """Side profile facing right. Backpack on left, staff forward-right."""
    bob = -1 if phase in (1, 3) else 0
    lean = 1 if phase == 1 else (-1 if phase == 3 else 0)

    # hood / round head (profile bump facing right)
    rect(g, 28, 8 + bob, 8, 3, "H2")
    rect(g, 26, 11 + bob, 10, 6, "H1")
    rect(g, 30, 12 + bob, 8, 5, "S1")
    put(g, 36, 14 + bob, "E")
    put(g, 37, 15 + bob, "S2")

    # white beard (flows down from chin)
    vline(g, 34, 16 + bob, 2, "B2")
    rect(g, 30, 18 + bob, 6, 2, "B1")
    rect(g, 28, 20 + bob, 8, 3, "B1")
    rect(g, 27, 23 + bob, 7, 2, "B2")
    hline(g, 26, 25 + bob, 6, "B3")

    # robe torso
    rect(g, 22, 24 + bob, 14, 3, "R1")
    rect(g, 20, 27 + bob, 16, 4, "R2")
    rect(g, 21, 31 + bob, 14, 4, "R3")
    rect(g, 22, 35 + bob, 12, 2, "R2")
    rect(g, 24, 37 + bob, 10, 1, "R4")

    # large backpack (behind, left side)
    rect(g, 14, 22 + bob, 8, 14, "K3")
    rect(g, 15, 23 + bob, 6, 12, "K2")
    rect(g, 16, 24 + bob, 4, 9, "K1")
    leaves_on_backpack(g, 15, 22 + bob)
    put(g, 17, 28 + bob, "L1")

    # small hip satchel (front)
    rect(g, 32, 30 + bob, 3, 4, "T2")
    put(g, 32, 30 + bob, "T1")
    vline(g, 31, 28 + bob, 3, "T1")

    # feet — facing right walk cycle
    base_y = 39 + bob
    if phase == 0:
        put(g, 24, base_y, "F1")
        put(g, 25, base_y, "F2")
        put(g, 30, base_y, "F1")
        put(g, 31, base_y, "F2")
    elif phase == 1:
        put(g, 26 + lean, base_y, "F1")
        put(g, 27 + lean, base_y, "F2")
        put(g, 32 + lean, base_y - 1, "F1")
        put(g, 33 + lean, base_y - 1, "F2")
    elif phase == 2:
        put(g, 25, base_y, "F1")
        put(g, 26, base_y, "F2")
        put(g, 31, base_y, "F1")
        put(g, 32, base_y, "F2")
    else:
        put(g, 22 + lean, base_y - 1, "F1")
        put(g, 23 + lean, base_y - 1, "F2")
        put(g, 28 + lean, base_y, "F1")
        put(g, 29 + lean, base_y, "F2")

    # wooden staff held forward
    draw_staff_forward(g, 36, 26 + bob, 14)


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


def draw_side_portrait() -> Image.Image:
    """Side bust portrait — calm profile with beard and hood."""
    g = blank()

    rect(g, 30, 8, 10, 4, "H2")
    rect(g, 28, 12, 12, 8, "H1")
    rect(g, 32, 14, 10, 7, "S1")
    put(g, 38, 16, "E")
    put(g, 39, 17, "S2")
    put(g, 38, 18, "M")

    vline(g, 36, 18, 2, "B2")
    rect(g, 30, 20, 8, 3, "B1")
    rect(g, 28, 23, 10, 4, "B1")
    rect(g, 27, 27, 8, 2, "B2")

    rect(g, 24, 29, 14, 3, "R1")
    rect(g, 22, 32, 16, 5, "R2")
    rect(g, 23, 37, 14, 2, "R3")

    rect(g, 16, 28, 6, 10, "K3")
    rect(g, 17, 29, 5, 8, "K2")
    leaves_on_backpack(g, 17, 28)
    put(g, 34, 33, "L2")

    portrait = render_pixel_grid(g).resize((64, 64), Image.Resampling.NEAREST)
    return portrait


def build_frames() -> list[tuple[str, list[list[str]]]]:
    names = [
        ("forest-elder-side-idle", 0),
        ("forest-elder-side-walk-1", 1),
        ("forest-elder-side-walk-2", 2),
        ("forest-elder-side-walk-3", 3),
    ]
    frames: list[tuple[str, list[list[str]]]] = []
    for name, phase in names:
        g = blank()
        draw_side_right(g, phase)
        frames.append((name, g))
    return frames


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = build_frames()

    sheet_w = FRAME * len(frames)
    sheet = Image.new("RGBA", (sheet_w, FRAME), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, (name, grid) in enumerate(frames):
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

    png_path = OUT_DIR / "forest-elder-side-sprite-sheet-v1.png"
    json_path = OUT_DIR / "forest-elder-side-sprite-sheet-v1.json"
    portrait_path = OUT_DIR / "forest-elder-side-portrait-v1.png"

    sheet.save(png_path)
    json_path.write_text(
        json.dumps(
            {
                "frames": atlas_frames,
                "meta": {
                    "app": "quest-for-the-perfect-bowl",
                    "version": "1.0",
                    "image": "forest-elder-side-sprite-sheet-v1.png",
                    "size": {"w": sheet_w, "h": FRAME},
                    "scale": "1",
                },
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    draw_side_portrait().save(portrait_path)

    print(f"Wrote {png_path}")
    print(f"Wrote {json_path}")
    print(f"Wrote {portrait_path}")


if __name__ == "__main__":
    main()

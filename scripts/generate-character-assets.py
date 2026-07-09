#!/usr/bin/env python3
"""Generate Ghibli-inspired Morandi pixel character sprite sheets."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw

from ghibli_character_art import GRID_MAP, draw_character_frame

ROOT = Path(__file__).resolve().parents[1]
CHAR_DIR = ROOT / "assets" / "characters"

CELL_SIZE = 128
PIXEL_SCALE = 2
FOOT_PADDING = 4


def build_sheet(frame_names: list[str], sheet_name: str) -> tuple[Image.Image, dict]:
    cols = 4
    rows = (len(frame_names) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * CELL_SIZE, rows * CELL_SIZE), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, name in enumerate(frame_names):
        col = index % cols
        row = index // cols
        frame_img = Image.new("RGBA", (CELL_SIZE, CELL_SIZE), (0, 0, 0, 0))
        draw = ImageDraw.Draw(frame_img)
        draw_character_frame(
            draw,
            name,
            CELL_SIZE,
            pixel_scale=PIXEL_SCALE,
            foot_y=(CELL_SIZE // PIXEL_SCALE) - FOOT_PADDING,
        )

        x = col * CELL_SIZE
        y = row * CELL_SIZE
        sheet.paste(frame_img, (x, y), frame_img)

        atlas_frames[name] = {
            "frame": {"x": x, "y": y, "w": CELL_SIZE, "h": CELL_SIZE},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": CELL_SIZE, "h": CELL_SIZE},
            "sourceSize": {"w": CELL_SIZE, "h": CELL_SIZE},
        }

    meta = {
        "app": "quest-for-the-perfect-bowl-ghibli-placeholder",
        "version": "2.0",
        "image": sheet_name,
        "size": {"w": cols * CELL_SIZE, "h": rows * CELL_SIZE},
        "scale": "1",
        "style": "Ghibli-inspired 16-bit Morandi pixel art",
    }
    return sheet, {"frames": atlas_frames, "meta": meta}


def rebuild_black_sugar_atlas() -> None:
    png_path = CHAR_DIR / "black-sugar-sprite-sheet-v1.png"
    json_path = CHAR_DIR / "black-sugar-sprite-sheet-v1.json"
    if not png_path.exists() or not json_path.exists():
        print("Skip Black Sugar repack: source atlas missing.")
        return

    image = Image.open(png_path).convert("RGBA")
    original = json.load(json_path.open())

    packed_images: list[tuple[str, Image.Image, int, int]] = []
    atlas_frames: dict[str, dict] = {}
    x_cursor = 0
    y_cursor = 0
    row_height = 0
    sheet_width = 1024

    for name, entry in original["frames"].items():
        cell = entry["frame"]
        crop = image.crop((cell["x"], cell["y"], cell["x"] + cell["w"], cell["y"] + cell["h"]))
        pixels = crop.load()
        min_x, min_y, max_x, max_y = cell["w"], cell["h"], 0, 0
        for py in range(cell["h"]):
            for px in range(cell["w"]):
                if pixels[px, py][3] > 10:
                    min_x = min(min_x, px)
                    min_y = min(min_y, py)
                    max_x = max(max_x, px)
                    max_y = max(max_y, py)

        trimmed = crop.crop((min_x, min_y, max_x + 1, max_y + 1))
        tw, th = trimmed.size

        if x_cursor + tw > sheet_width:
            x_cursor = 0
            y_cursor += row_height + 2
            row_height = 0

        atlas_frames[name] = {
            "frame": {"x": x_cursor, "y": y_cursor, "w": tw, "h": th},
            "rotated": False,
            "trimmed": True,
            "spriteSourceSize": {"x": min_x, "y": min_y, "w": tw, "h": th},
            "sourceSize": {"w": cell["w"], "h": cell["h"]},
        }

        packed_images.append((name, trimmed, x_cursor, y_cursor))
        x_cursor += tw + 2
        row_height = max(row_height, th)

    sheet_height = y_cursor + row_height + 2
    sheet_width = max(256, 1 << (sheet_width - 1).bit_length())
    sheet_height = max(256, 1 << (sheet_height - 1).bit_length())

    sheet = Image.new("RGBA", (sheet_width, sheet_height), (0, 0, 0, 0))
    for _, trimmed, px, py in packed_images:
        sheet.paste(trimmed, (px, py), trimmed)

    sheet.save(png_path)
    output = {
        "frames": atlas_frames,
        "meta": {
            **original["meta"],
            "size": {"w": sheet_width, "h": sheet_height},
        },
    }
    json_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(f"Repacked Black Sugar atlas: {sheet_width}x{sheet_height}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repack-black-sugar", action="store_true")
    args = parser.parse_args()

    CHAR_DIR.mkdir(parents=True, exist_ok=True)

    npc_frames = [
        "forest-elder-idle",
        "coffee-barista-idle",
        "park-traveler-idle",
        "snow-guide-idle",
        "glass-master-idle",
        "inner-voice-idle",
    ]
    boss_frames = [
        "giant-can-idle",
        "time-monster-idle",
        "snow-spirit-idle",
        "glass-master-boss-idle",
        "inner-doubt-idle",
        "perfectionism-idle",
    ]

    npc_sheet_name = "npc-sprite-sheet-v1.png"
    boss_sheet_name = "boss-sprite-sheet-v1.png"

    npc_img, npc_atlas = build_sheet(npc_frames, npc_sheet_name)
    boss_img, boss_atlas = build_sheet(boss_frames, boss_sheet_name)

    npc_img.save(CHAR_DIR / npc_sheet_name)
    (CHAR_DIR / "npc-sprite-sheet-v1.json").write_text(
        json.dumps(npc_atlas, indent=2) + "\n",
        encoding="utf-8",
    )

    boss_img.save(CHAR_DIR / boss_sheet_name)
    (CHAR_DIR / "boss-sprite-sheet-v1.json").write_text(
        json.dumps(boss_atlas, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Generated {npc_sheet_name} ({len(npc_frames)} NPC frames)")
    print(f"Generated {boss_sheet_name} ({len(boss_frames)} boss frames)")

    if args.repack_black_sugar:
        rebuild_black_sugar_atlas()


if __name__ == "__main__":
    main()

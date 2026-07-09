#!/usr/bin/env python3
"""Generate Ghibli-inspired Morandi pixel character sprite sheets."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw

from ghibli_character_art import draw_character_frame
from ghibli_npc_detailed import DETAILED_NPC_PAINTERS

ROOT = Path(__file__).resolve().parents[1]
CHAR_DIR = ROOT / "assets" / "characters"

NPC_CELL = 256
BOSS_CELL = 256
BOSS_SCALE = 1
NPC_FOOT_PADDING = 10


def _frame_to_image(
    frame_name: str,
    cell: int,
    *,
    pixel_scale: int = 1,
) -> Image.Image:
    frame_img = Image.new("RGBA", (cell, cell), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame_img)
    draw_character_frame(
        draw,
        frame_name,
        cell,
        pixel_scale=pixel_scale,
        foot_y=cell - NPC_FOOT_PADDING if frame_name in DETAILED_NPC_PAINTERS else None,
    )
    return frame_img


def _trim_frame(frame_img: Image.Image, source_size: int) -> tuple[Image.Image, dict]:
    pixels = frame_img.load()
    w, h = frame_img.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for py in range(h):
        for px in range(w):
            if pixels[px, py][3] > 10:
                min_x = min(min_x, px)
                min_y = min(min_y, py)
                max_x = max(max_x, px)
                max_y = max(max_y, py)

    if max_x < min_x:
        min_x, min_y, max_x, max_y = 0, 0, w - 1, h - 1

    trimmed = frame_img.crop((min_x, min_y, max_x + 1, max_y + 1))
    tw, th = trimmed.size
    return trimmed, {
        "frame": {"x": 0, "y": 0, "w": tw, "h": th},
        "rotated": False,
        "trimmed": True,
        "spriteSourceSize": {"x": min_x, "y": min_y, "w": tw, "h": th},
        "sourceSize": {"w": source_size, "h": source_size},
    }


def build_sheet(
    frame_names: list[str],
    sheet_name: str,
    *,
    cell: int,
    pixel_scale: int = 1,
    trim: bool = False,
) -> tuple[Image.Image, dict]:
    cols = 4
    rows = (len(frame_names) + cols - 1) // cols

    if trim:
        packed: list[tuple[str, Image.Image, dict]] = []
        for name in frame_names:
            frame_img = _frame_to_image(name, cell, pixel_scale=pixel_scale)
            trimmed, atlas_entry = _trim_frame(frame_img, cell)
            packed.append((name, trimmed, atlas_entry))

        sheet_width = max(256, cols * 180)
        x_cursor = 0
        y_cursor = 0
        row_height = 0
        atlas_frames: dict[str, dict] = {}
        placed: list[tuple[Image.Image, int, int]] = []

        for name, trimmed, entry in packed:
            tw, th = trimmed.size
            if x_cursor + tw > sheet_width:
                x_cursor = 0
                y_cursor += row_height + 2
                row_height = 0

            atlas_frames[name] = {
                **entry,
                "frame": {"x": x_cursor, "y": y_cursor, "w": tw, "h": th},
            }
            placed.append((trimmed, x_cursor, y_cursor))
            x_cursor += tw + 2
            row_height = max(row_height, th)

        sheet_h = y_cursor + row_height + 2
        sheet_w = max(256, 1 << (max(sheet_width, x_cursor) - 1).bit_length())
        sheet_h = max(256, 1 << (sheet_h - 1).bit_length())
        sheet = Image.new("RGBA", (sheet_w, sheet_h), (0, 0, 0, 0))
        for trimmed, px, py in placed:
            sheet.paste(trimmed, (px, py), trimmed)

        meta = {
            "app": "quest-for-the-perfect-bowl-ghibli-placeholder",
            "version": "3.0",
            "image": sheet_name,
            "size": {"w": sheet_w, "h": sheet_h},
            "scale": "1",
            "style": "Ghibli-inspired 16-bit Morandi pixel art (detailed NPC)",
        }
        return sheet, {"frames": atlas_frames, "meta": meta}

    sheet = Image.new("RGBA", (cols * cell, rows * cell), (0, 0, 0, 0))
    atlas_frames: dict[str, dict] = {}

    for index, name in enumerate(frame_names):
        col = index % cols
        row = index // cols
        frame_img = _frame_to_image(name, cell, pixel_scale=pixel_scale)
        x = col * cell
        y = row * cell
        sheet.paste(frame_img, (x, y), frame_img)
        atlas_frames[name] = {
            "frame": {"x": x, "y": y, "w": cell, "h": cell},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": cell, "h": cell},
            "sourceSize": {"w": cell, "h": cell},
        }

    meta = {
        "app": "quest-for-the-perfect-bowl-ghibli-placeholder",
        "version": "3.0",
        "image": sheet_name,
        "size": {"w": cols * cell, "h": rows * cell},
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

    npc_frames = list(DETAILED_NPC_PAINTERS.keys())
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

    npc_img, npc_atlas = build_sheet(
        npc_frames,
        npc_sheet_name,
        cell=NPC_CELL,
        pixel_scale=1,
        trim=True,
    )
    boss_img, boss_atlas = build_sheet(
        boss_frames,
        boss_sheet_name,
        cell=BOSS_CELL,
        pixel_scale=BOSS_SCALE,
        trim=True,
    )

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

    print(f"Generated {npc_sheet_name} ({len(npc_frames)} detailed NPC frames @ {NPC_CELL}px)")
    print(f"Generated {boss_sheet_name} ({len(boss_frames)} boss frames @ {BOSS_CELL}px)")

    if args.repack_black_sugar:
        rebuild_black_sugar_atlas()


if __name__ == "__main__":
    main()

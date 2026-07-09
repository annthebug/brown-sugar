#!/usr/bin/env python3
"""Generate placeholder character sprite sheets and trim Black Sugar atlas."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
CHAR_DIR = ROOT / "assets" / "characters"

# Morandi palette (RGBA)
SKY = (216, 237, 244, 0)
DUSTY_BLUE = (143, 178, 191, 255)
SAGE = (183, 201, 189, 255)
BEIGE = (244, 234, 220, 255)
MIST_PINK = (217, 183, 177, 255)
CLOUD = (248, 251, 249, 255)
SLATE = (56, 88, 103, 255)
SOFT_ORANGE = (232, 196, 168, 255)
GLASS_BLUE = (168, 204, 214, 255)
MIST_VIOLET = (210, 200, 214, 255)
GOLD = (220, 198, 140, 255)
WHITE_CAT = (248, 246, 242, 255)
BLACK_CAT = (58, 58, 64, 255)
BOW_GREEN = (96, 128, 104, 255)


@dataclass(frozen=True)
class FrameSpec:
    name: str
    drawer: str


def _px(draw: ImageDraw.ImageDraw, x: int, y: int, color: tuple[int, int, int, int], size: int = 1) -> None:
    draw.rectangle((x, y, x + size - 1, y + size - 1), fill=color)


def _outline_person(
    draw: ImageDraw.ImageDraw,
    ox: int,
    oy: int,
    *,
    coat: tuple[int, int, int, int],
    accent: tuple[int, int, int, int] | None = None,
    prop: str | None = None,
) -> None:
  """Draw a soft 16-bit NPC silhouette."""
  _px(draw, ox + 24, oy + 8, CLOUD, 16)
  _px(draw, ox + 20, oy + 24, CLOUD, 24)
  _px(draw, ox + 16, oy + 48, coat, 32)
  _px(draw, ox + 20, oy + 80, coat, 24)
  _px(draw, ox + 18, oy + 104, SLATE, 10)
  _px(draw, ox + 36, oy + 104, SLATE, 10)
  if accent:
    _px(draw, ox + 18, oy + 40, accent, 28)
  if prop == "staff":
    _px(draw, ox + 52, oy + 20, BEIGE, 6)
    _px(draw, ox + 54, oy + 12, GOLD, 4)
  elif prop == "cup":
    _px(draw, ox + 50, oy + 52, BEIGE, 12)
    _px(draw, ox + 52, oy + 48, MIST_PINK, 8)
  elif prop == "map":
    _px(draw, ox + 4, oy + 56, BEIGE, 14)
    _px(draw, ox + 6, oy + 58, DUSTY_BLUE, 10)
  elif prop == "goggles":
    _px(draw, ox + 20, oy + 30, GLASS_BLUE, 24)
  elif prop == "scarf":
    _px(draw, ox + 18, oy + 38, MIST_PINK, 28)


def draw_forest_elder(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _outline_person(draw, ox, oy, coat=DUSTY_BLUE, prop="staff")


def draw_coffee_barista(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _outline_person(draw, ox, oy, coat=MIST_PINK, accent=BEIGE, prop="cup")


def draw_park_traveler(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _outline_person(draw, ox, oy, coat=SAGE, accent=MIST_PINK, prop="map")


def draw_snow_guide(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _outline_person(draw, ox, oy, coat=DUSTY_BLUE, accent=MIST_PINK, prop="staff")


def draw_glass_master(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _outline_person(draw, ox, oy, coat=DUSTY_BLUE, prop="goggles")


def draw_inner_voice(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 10, oy + 24, MIST_VIOLET, 52)
  _outline_person(draw, ox, oy, coat=MIST_PINK, accent=BEIGE)
  _px(draw, ox + 28, oy + 2, CLOUD, 8)


def draw_giant_can(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 16, oy + 18, DUSTY_BLUE, 48)
  _px(draw, ox + 12, oy + 10, BEIGE, 56)
  _px(draw, ox + 20, oy + 66, DUSTY_BLUE, 40)
  _px(draw, ox + 24, oy + 106, DUSTY_BLUE, 32)
  _px(draw, ox + 28, oy + 6, GOLD, 16)


def draw_time_monster(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 8, oy + 30, DUSTY_BLUE, 56)
  _px(draw, ox + 20, oy + 18, CLOUD, 32)
  _px(draw, ox + 34, oy + 30, MIST_PINK, 4)
  _px(draw, ox + 36, oy + 22, DUSTY_BLUE, 4)
  _px(draw, ox + 12, oy + 86, DUSTY_BLUE, 48)


def draw_snow_spirit(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 6, oy + 20, CLOUD, 60)
  _px(draw, ox + 18, oy + 34, BEIGE, 36)
  _px(draw, ox + 2, oy + 44, GLASS_BLUE, 16)
  _px(draw, ox + 54, oy + 40, GLASS_BLUE, 16)
  _px(draw, ox + 24, oy + 8, CLOUD, 24)


def draw_glass_master_boss(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 4, oy + 16, SOFT_ORANGE, 64)
  draw_glass_master(draw, ox, oy + 8)
  _px(draw, ox + 48, oy + 72, GLASS_BLUE, 10)


def draw_inner_doubt(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 8, oy + 18, MIST_VIOLET, 56)
  _px(draw, ox + 22, oy + 34, CLOUD, 28)
  _px(draw, ox + 26, oy + 42, DUSTY_BLUE, 20)
  _px(draw, ox + 14, oy + 78, MIST_VIOLET, 44)


def draw_perfectionism(draw: ImageDraw.ImageDraw, ox: int, oy: int) -> None:
  _px(draw, ox + 4, oy + 12, MIST_VIOLET, 64)
  _px(draw, ox + 20, oy + 28, CLOUD, 32)
  _px(draw, ox + 24, oy + 36, DUSTY_BLUE, 24)
  _px(draw, ox + 12, oy + 4, DUSTY_BLUE, 8)
  _px(draw, ox + 44, oy + 6, DUSTY_BLUE, 8)


DRAWERS = {
  "forest-elder-idle": draw_forest_elder,
  "coffee-barista-idle": draw_coffee_barista,
  "park-traveler-idle": draw_park_traveler,
  "snow-guide-idle": draw_snow_guide,
  "glass-master-idle": draw_glass_master,
  "inner-voice-idle": draw_inner_voice,
  "giant-can-idle": draw_giant_can,
  "time-monster-idle": draw_time_monster,
  "snow-spirit-idle": draw_snow_spirit,
  "glass-master-boss-idle": draw_glass_master_boss,
  "inner-doubt-idle": draw_inner_doubt,
  "perfectionism-idle": draw_perfectionism,
}


def build_sheet(frame_names: list[str], sheet_name: str, cell: int = 128) -> tuple[Image.Image, dict]:
  cols = 4
  rows = (len(frame_names) + cols - 1) // cols
  sheet = Image.new("RGBA", (cols * cell, rows * cell), SKY)
  atlas_frames: dict[str, dict] = {}

  for index, name in enumerate(frame_names):
    col = index % cols
    row = index // cols
    frame_img = Image.new("RGBA", (cell, cell), SKY)
    draw = ImageDraw.Draw(frame_img)
    DRAWERS[name](draw, 20, 8)

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
    "app": "quest-for-the-perfect-bowl-placeholder",
    "version": "1.0",
    "image": sheet_name,
    "size": {"w": cols * cell, "h": rows * cell},
    "scale": "1",
  }
  return sheet, {"frames": atlas_frames, "meta": meta}


def trim_frame(image: Image.Image, frame: dict, alpha_threshold: int = 10) -> tuple[Image.Image, dict, dict]:
  x, y, w, h = frame["x"], frame["y"], frame["w"], frame["h"]
  crop = image.crop((x, y, x + w, y + h))
  pixels = crop.load()
  min_x, min_y, max_x, max_y = w, h, 0, 0

  for py in range(h):
    for px in range(w):
      if pixels[px, py][3] > alpha_threshold:
        min_x = min(min_x, px)
        min_y = min(min_y, py)
        max_x = max(max_x, px)
        max_y = max(max_y, py)

  if max_x < min_x or max_y < min_y:
    min_x, min_y, max_x, max_y = 0, 0, w - 1, h - 1

  trimmed = crop.crop((min_x, min_y, max_x + 1, max_y + 1))
  tw, th = trimmed.size
  source_w, source_h = w, h
  offset_x = min_x
  offset_y = min_y

  atlas_entry = {
    "frame": {"x": 0, "y": 0, "w": tw, "h": th},
    "rotated": False,
    "trimmed": True,
    "spriteSourceSize": {"x": offset_x, "y": offset_y, "w": tw, "h": th},
    "sourceSize": {"w": source_w, "h": source_h},
  }
  return trimmed, atlas_entry, {"foot": max_y, "min_y": min_y}


def rebuild_black_sugar_atlas() -> None:
  png_path = CHAR_DIR / "black-sugar-sprite-sheet-v1.png"
  json_path = CHAR_DIR / "black-sugar-sprite-sheet-v1.json"
  image = Image.open(png_path).convert("RGBA")
  original = json.load(json_path.open())

  # Bottom-align all frames to a shared foot line within each source cell.
  frame_data: dict[str, dict] = {}
  trimmed_images: dict[str, Image.Image] = {}
  feet: list[int] = []

  for name, entry in original["frames"].items():
    trimmed, atlas_entry, meta = trim_frame(image, entry["frame"])
    trimmed_images[name] = trimmed
    frame_data[name] = {**atlas_entry, "_foot": meta["foot"], "_min_y": meta["min_y"]}
    feet.append(meta["foot"])

  target_foot = max(feet)
  packed_entries: dict[str, dict] = {}
  x_cursor = 0
  y_cursor = 0
  row_height = 0
  max_width = 0
  sheet_width = 1024

  for name, entry in frame_data.items():
    trimmed = trimmed_images[name]
    tw, th = trimmed.size
    foot = entry["_foot"]
    min_y = entry["_min_y"]

  # Re-trim with consistent vertical placement in sourceSize
  packed_images: list[tuple[str, Image.Image, int, int]] = []
  atlas_frames: dict[str, dict] = {}

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
    max_width = max(max_width, x_cursor)

  sheet_height = y_cursor + row_height + 2
  # Round up to power-of-two friendly size
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

  rebuild_black_sugar_atlas()
  print("Generated npc-sprite-sheet-v1 and boss-sprite-sheet-v1")


if __name__ == "__main__":
  main()

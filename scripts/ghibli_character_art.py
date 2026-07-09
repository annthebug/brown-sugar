"""Ghibli-inspired Morandi pixel art definitions for chapter NPCs and bosses."""

from __future__ import annotations

from typing import Callable

from PIL import ImageDraw

# Palette keys used in ASCII grids ('.' = transparent)
PALETTE: dict[str, tuple[int, int, int, int]] = {
    "W": (248, 251, 249, 255),  # cloud white
    "K": (58, 58, 64, 255),  # soft black
    "S": (244, 220, 198, 255),  # warm skin
    "D": (56, 88, 103, 255),  # slate outline
    "B": (143, 178, 191, 255),  # dusty blue
    "G": (183, 201, 189, 255),  # sage
    "E": (244, 234, 220, 255),  # beige
    "P": (217, 183, 177, 255),  # mist pink
    "R": (196, 142, 122, 255),  # muted rust shirt
    "O": (232, 196, 168, 255),  # soft orange glow
    "L": (168, 204, 214, 255),  # glass blue
    "V": (210, 200, 214, 255),  # mist violet
    "Y": (220, 198, 140, 255),  # soft gold
    "H": (216, 237, 244, 255),  # pale sky highlight
    "C": (120, 104, 96, 255),  # warm wood
    "N": (96, 88, 104, 255),  # soot body
    "I": (248, 246, 242, 255),  # bright white eyes
}


class PixelCanvas:
    def __init__(self, width: int, height: int) -> None:
        self.width = width
        self.height = height
        self.pixels: dict[tuple[int, int], tuple[int, int, int, int]] = {}

    def put(self, x: int, y: int, color: tuple[int, int, int, int]) -> None:
        if 0 <= x < self.width and 0 <= y < self.height:
            self.pixels[(x, y)] = color

    def blit_grid(self, grid: list[str], ox: int, oy: int) -> None:
        for y, row in enumerate(grid):
            for x, ch in enumerate(row):
                if ch == ".":
                    continue
                color = PALETTE.get(ch)
                if color:
                    self.put(ox + x, oy + y, color)

    def fill_rect(self, x: int, y: int, w: int, h: int, color: tuple[int, int, int, int]) -> None:
        for py in range(y, y + h):
            for px in range(x, x + w):
                self.put(px, py, color)

    def render(self, draw: ImageDraw.ImageDraw, offset_x: int, offset_y: int, scale: int = 1) -> None:
        for (x, y), color in self.pixels.items():
            draw.rectangle(
                (
                    offset_x + x * scale,
                    offset_y + y * scale,
                    offset_x + (x + 1) * scale - 1,
                    offset_y + (y + 1) * scale - 1,
                ),
                fill=color,
            )


def _center_blit(canvas: PixelCanvas, grid: list[str], cell: int, foot_y: int, scale: int = 2) -> None:
    height = len(grid)
    width = max(len(row) for row in grid)
    ox = (cell // scale - width) // 2
    oy = foot_y - height
    canvas.blit_grid(grid, ox, oy)


# ── NPC: Forest Elder — boiler-room grandfather (Kamaji-inspired) ─────────────

FOREST_ELDER = [
    "............WWWWWW............",
    "...........WWWWWWWW...........",
    "..........WWWWWWWWWW..........",
    ".........WWSSSSSSSSWW.........",
    "........WSSSSSSSSSSSW........",
    "........WSSGGGGGGGSSW........",
    "........WSSSSSSSSSSSW........",
    ".........WSSSSSSSSW..........",
    "..........WSSSSSSW...........",
    ".......CCCCCCCCCCCCCCC.......",
    "......CCCCRRRRRRRRRCCCC......",
    ".....CCCRRRRRRRRRRRRCCC.....",
    ".....CCRRBBBBBBBBBBRRCC.....",
    ".....CCRRBBBBBBBBBBRRCC.....",
    ".....CCRRRRRRRRRRRRRRCC.....",
    "......CCCCCCCCCCCCCCC......",
    ".......DD...........DD.......",
    "......CCC....LLL....CCC......",
    ".....CCC....LYYY....CCC.....",
]


# ── NPC: Coffee Barista — seaside café attendant (Ponyo-inspired) ─────────────

COFFEE_BARISTA = [
    "...........PPPPPP...........",
    "..........PPWWWWPP..........",
    ".........PWWWWWWWWPP........",
    "........WWSSSSSSSSWW.......",
    ".......WSSSSSSSSSSSW.......",
    ".......WSSSSSSSSSSSW.......",
    "........WSSSSSSSSWW........",
    ".........WWWWWWWW..........",
    "........WWEEEEEEWW.........",
    ".......WWEEEEEEEEWW........",
    "......WWEPPPPPPPEWW.......",
    "......WWEPPPPPPPEWW.......",
    "......WWEEEEEEEEWW........",
    ".......WWEEEEEEWW.........",
    "........WWWWWWWW..........",
    ".........DD..DD...........",
    "........EE....EE..........",
    ".......EE..YYYY..EE.......",
    "......EE..YYYYYY..EE......",
]


# ── NPC: Park Traveler — wandering girl with map (Kiki-inspired) ─────────────

PARK_TRAVELER = [
    "...........KKKKKK...........",
    "..........KKWWWWKK..........",
    ".........KKWWWWWWKK.........",
    "........KKWWSSSSWWKK........",
    ".......KKWWSSSSSSWWKK.......",
    ".......KKWWSSSSSSWWKK.......",
    "........KKWWSSSSWWKK........",
    ".........RRRRRRRR..........",
    "........RRRRRRRRRR.........",
    ".......RRRRRRRRRRRR........",
    "......RRRRRRRRRRRRRR.......",
    "......RRRRRRRRRRRRRR.......",
    "......RRRRRRRRRRRRRR.......",
    ".......RRRRRRRRRRRR........",
    "........RRRRRRRRRR.........",
    ".........RRRRRRRR..........",
    "........DD......DD.........",
    ".......EE........EE........",
    "......EE..BBBBBB..EE.......",
    ".....EE..BBBBBBBB..EE......",
    "....EE..BBBBBBBBBB..EE.....",
]


# ── NPC: Snow Guide — hooded mountain guide (Mononoke / Laputa-inspired) ─────

SNOW_GUIDE = [
    "...........BBBBBB...........",
    "..........BBBBBBBB..........",
    ".........BBBBBBBBBB.........",
    "........BBBBWWWWBBBB........",
    ".......BBBWWSSSSWWBBB.......",
    "......BBBWWSSSSSSWWBBB......",
    "......BBBWWSSSSSSWWBBB......",
    ".......BBBWWSSSSWWBBB.......",
    "........BBBWWWWWWBBB........",
    ".........BBBBBBBBBB.........",
    "........BBBBBBBBBBBB........",
    ".......BBBBPPPPPPBBBB.......",
    "......BBBBBBBBBBBBBBBB......",
    "......BBBBBBBBBBBBBBBB......",
    "......BBBBBBBBBBBBBBBB......",
    ".......BBBBBBBBBBBBBB.......",
    "........BBBBBBBBBBBB........",
    ".........DD......DD.........",
    "........CCC......CCC........",
    ".......CCC..YYYY..CCC.......",
]


# ── NPC: Glass Master — workshop artisan (Arrietty / craft studio-inspired) ──

GLASS_MASTER = [
    "...........WWWWWW...........",
    "..........WWWWWWWW..........",
    ".........WWWWWWWWWW.........",
    "........WWSSSSSSSSWW........",
    ".......WSSLLLLLLLLSSW.......",
    ".......WSSSSSSSSSSSSW.......",
    "........WSSSSSSSSSSW........",
    ".........WSSSSSSSSW.........",
    "........EEEEEEEEEEEE........",
    ".......EEEEEEEEEEEEEE.......",
    "......EEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEE......",
    ".......EEEEEEEEEEEEEE.......",
    "........EEEEEEEEEEEE........",
    ".........DD......DD.........",
    "........CCC......CCC........",
    ".......CCC..LLLL..CCC.......",
    "......CCC..LLLLLL..CCC......",
]


# ── NPC: Inner Voice — gentle river spirit guide (Haku-inspired) ─────────────

INNER_VOICE = [
    "...........HHHHHH...........",
    "..........HHHHHHHH..........",
    ".........HHWWWWWWHH.........",
    "........HHWWSSSSWWHH........",
    ".......HHWWSSSSSSWWHH.......",
    ".......HHWWSSSSSSWWHH.......",
    "........HHWWSSSSWWHH........",
    ".........HHWWWWWWHH.........",
    "........HHLLLLLLLLHH........",
    ".......HHLLLLLLLLLLHH.......",
    "......HHLLLLLLLLLLLLHH......",
    "......HHLLLLLLLLLLLLHH......",
    "......HHLLLLLLLLLLLLHH......",
    ".......HHLLLLLLLLLLHH.......",
    "........HHLLLLLLLLHH........",
    ".........HHLLLLLLHH.........",
    "..........HHLLLLHH..........",
    "...........HHLLHH...........",
    "............HHHH............",
]


# ── Boss: Giant Can — friendly lidded jar spirit (bathhouse pantry jar) ───────

GIANT_CAN = [
    "............YYYYYY............",
    "...........YYYYYYYYY...........",
    "..........EEEEEEEEEEE..........",
    ".........EEEEEEEEEEEEE.........",
    "........EEEEEEEEEEEEEEE........",
    ".......EEEEEEEEEEEEEEEEE.......",
    "......EEEEEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEEEEE......",
    "......EEEESSEESSSEEEEEEEE......",
    "......EEEESKKKSKKSSEEEEEE......",
    "......EEEESSEESSSEEEEEEEE......",
    "......EEEEEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEEEEE......",
    "......EEEEEEEEEEEEEEEEEEE......",
    ".......EEEEEEEEEEEEEEEEE.......",
    "........EEEEEEEEEEEEEEE........",
    ".........EEEEEEEEEEEEE.........",
    "..........EEEEEEEEEEE..........",
    "...........EEEEEEEEE...........",
    "............EEEEEEE............",
]


# ── Boss: Time Monster — floating clock spirit (Howl's castle-inspired) ──────

TIME_MONSTER = [
    "...........HHHHHH...........",
    "..........HHHHHHHH..........",
    ".........HHWWWWWWHH.........",
    "........HHWWWWWWWWHH........",
    ".......HHWWSSSSSSWWHH.......",
    ".......HHWSPKKKSPWWH.......",
    ".......HHWWSSSSSSWWHH.......",
    "........HHWWWWWWWWHH........",
    ".........HHWWWWWWHH.........",
    "..........HHHHHHHH..........",
    "...........BBBBBB...........",
    "..........BBBBBBBB..........",
    ".........BBBBBBBBBB.........",
    "........BBBBBBBBBBBB........",
    ".......BBBBBBBBBBBBBB.......",
    "........BBBBBBBBBBBB........",
    ".........BBBBBBBBBB.........",
    "..........BBBBBBBB..........",
    "...........BBBBBB...........",
]


# ── Boss: Snow Spirit — kodama tree spirit (Princess Mononoke-inspired) ────

SNOW_SPIRIT = [
    "............WWWWWW............",
    "...........WWWWWWWW...........",
    "..........WWWWWWWWWW..........",
    ".........WWWWWWWWWWWW.........",
    "........WWWWWWWWWWWWWW........",
    ".......WWWWWKKKKKKWWWWWW.......",
    "......WWWWWKKKKKKKKWWWWWW......",
    "......WWWWWKKKKKKKKWWWWWW......",
    "......WWWWWWWWWWWWWWWWWW......",
    ".......WWWWWWWWWWWWWWWW.......",
    "........WWWWWWWWWWWWWW........",
    ".........GGGGGGGGGGGG.........",
    "..........GGGGGGGGGG..........",
    "...........GGGGGGGG...........",
    "............GGGGGG............",
    ".............GGGG.............",
    "..............GG..............",
]


# ── Boss: Glass Master Boss — artisan with furnace glow ───────────────────────

GLASS_MASTER_BOSS = [
    "...........OOOOOO...........",
    "..........OOOOOOOO..........",
    ".........OOOOOOOOOO.........",
    "........OO........OO........",
    ".......OO..WWWWWW..OO.......",
    "......OO..WWWWWWWW..OO......",
    "......OO..WWSSSSWW..OO......",
    "......OO..WSSLLSSW..OO......",
    "......OO..WSSSSSSW..OO......",
    "......OO..WWWWWWWW..OO......",
    "......OO..EEEEEEEE..OO......",
    "......OO..EEEEEEEE..OO......",
    "......OO..EEEEEEEE..OO......",
    ".......OO..EEEEEE..OO.......",
    "........OO........OO........",
    ".........OO......OO.........",
    "..........OO....OO..........",
    "...........OO..OO...........",
]


# ── Boss: Inner Doubt — soot sprite cluster (Spirited Away susuwatari) ───────

INNER_DOUBT = [
    "..NNNN..............NNNN..",
    ".NNNNNN............NNNNNN.",
    "NNNIIINN..........NNNIIINN",
    "NNNIIINN..........NNNIIINN",
    ".NNNNNN............NNNNNN.",
    "..NNNN..............NNNN..",
    "...KK................KK...",
    "..NNNN..............NNNN..",
    ".NNNNNN............NNNNNN.",
    "NNNIIINN..........NNNIIINN",
    "NNNIIINN..........NNNIIINN",
    ".NNNNNN............NNNNNN.",
    "..NNNN..............NNNN..",
    "...KK................KK...",
    "..NNNN..............NNNN..",
    ".NNNNNN............NNNNNN.",
    "NNNIIINN..........NNNIIINN",
    "NNNIIINN..........NNNIIINN",
    ".NNNNNN............NNNNNN.",
    "..NNNN..............NNNN..",
]


# ── Boss: Perfectionism — gentle mask in mist (No-Face / paper spirit) ───────

PERFECTIONISM = [
    "............VVVVVV............",
    "...........VVVVVVVV...........",
    "..........VVVVVVVVVV..........",
    ".........VVVWWWWWWVVV.........",
    "........VVVWWSSSSWWVVV........",
    ".......VVVWSSSSSSSWVVV.......",
    ".......VVVWSSSSSSSWVVV.......",
    "........VVVWWSSSSWWVVV........",
    ".........VVVWWWWWWVVV.........",
    "..........VVVVVVVVVV..........",
    "...........VVVVVVVV...........",
    "............VVVVVV............",
    "...........EEEEEE.............",
    "..........EEEEEEEE............",
    ".........EEEEEEEEEE...........",
    "........HHHH....HHHH..........",
    "........HHHH....HHHH..........",
    ".........HH........HH.........",
]


GRID_MAP: dict[str, list[str]] = {
    "forest-elder-idle": FOREST_ELDER,
    "coffee-barista-idle": COFFEE_BARISTA,
    "park-traveler-idle": PARK_TRAVELER,
    "snow-guide-idle": SNOW_GUIDE,
    "glass-master-idle": GLASS_MASTER,
    "inner-voice-idle": INNER_VOICE,
    "giant-can-idle": GIANT_CAN,
    "time-monster-idle": TIME_MONSTER,
    "snow-spirit-idle": SNOW_SPIRIT,
    "glass-master-boss-idle": GLASS_MASTER_BOSS,
    "inner-doubt-idle": INNER_DOUBT,
    "perfectionism-idle": PERFECTIONISM,
}


def draw_character_frame(
    draw: ImageDraw.ImageDraw,
    frame_name: str,
    cell: int,
    *,
    pixel_scale: int = 2,
    foot_y: int | None = None,
) -> None:
    from ghibli_npc_detailed import DETAILED_NPC_PAINTERS, paint_detailed_npc

    if frame_name in DETAILED_NPC_PAINTERS:
        canvas = paint_detailed_npc(frame_name, cell=cell)
        canvas.render(draw, 0, 0, scale=1)
        return

    grid = GRID_MAP[frame_name]
    canvas = PixelCanvas(cell // pixel_scale, cell // pixel_scale)
    foot = foot_y if foot_y is not None else (cell // pixel_scale) - 4
    _center_blit(canvas, grid, cell, foot, scale=pixel_scale)
    canvas.render(draw, 0, 0, scale=pixel_scale)


def get_drawer(frame_name: str) -> Callable[[ImageDraw.ImageDraw, int, int], None]:
    def _draw(draw: ImageDraw.ImageDraw, _ox: int, oy: int) -> None:
        del oy
        draw_character_frame(draw, frame_name, cell=128, pixel_scale=2)

    return _draw

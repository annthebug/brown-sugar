"""High-detail 256px NPC painters — Black Sugar density, Ghibli-inspired silhouettes."""

from __future__ import annotations

from ghibli_character_art import PixelCanvas

# ─── Extended Morandi palette ────────────────────────────────────────────────

W = (248, 251, 249, 255)
W2 = (228, 232, 234, 255)
K = (58, 58, 64, 255)
K2 = (42, 42, 48, 255)
S = (244, 220, 198, 255)
S2 = (220, 188, 168, 255)
S3 = (255, 236, 220, 255)
D = (56, 88, 103, 255)
B = (143, 178, 191, 255)
B2 = (118, 152, 168, 255)
G = (183, 201, 189, 255)
E = (244, 234, 220, 255)
E2 = (220, 204, 184, 255)
P = (217, 183, 177, 255)
P2 = (196, 158, 152, 255)
R = (196, 142, 122, 255)
R2 = (168, 118, 102, 255)
O = (232, 196, 168, 255)
L = (168, 204, 214, 255)
L2 = (140, 178, 198, 255)
V = (210, 200, 214, 255)
Y = (220, 198, 140, 255)
H = (216, 237, 244, 255)
H2 = (190, 220, 232, 255)
C = (120, 104, 96, 255)
C2 = (96, 82, 74, 255)
M = (58, 58, 64, 255)
M2 = (38, 36, 42, 255)


def _ellipse(canvas: PixelCanvas, cx: int, cy: int, rx: int, ry: int, color: tuple[int, int, int, int]) -> None:
    for y in range(cy - ry, cy + ry + 1):
        for x in range(cx - rx, cx + rx + 1):
            nx = (x - cx) / max(rx, 1)
            ny = (y - cy) / max(ry, 1)
            if nx * nx + ny * ny <= 1.05:
                canvas.put(x, y, color)


def _rect(canvas: PixelCanvas, x0: int, y0: int, x1: int, y1: int, color: tuple[int, int, int, int]) -> None:
    for y in range(min(y0, y1), max(y0, y1) + 1):
        for x in range(min(x0, x1), max(x0, x1) + 1):
            canvas.put(x, y, color)


def _line(canvas: PixelCanvas, x0: int, y0: int, x1: int, y1: int, color: tuple[int, int, int, int]) -> None:
    dx = abs(x1 - x0)
    dy = -abs(y1 - y0)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    err = dx + dy
    while True:
        canvas.put(x0, y0, color)
        if x0 == x1 and y0 == y1:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x0 += sx
        if e2 <= dx:
            err += dx
            y0 += sy


def _shade_rect(canvas: PixelCanvas, x0: int, y0: int, x1: int, y1: int, base: tuple, dark: tuple, light: tuple) -> None:
    _rect(canvas, x0, y0, x1, y1, base)
    for x in range(x0, x1 + 1):
        canvas.put(x, y0, light)
    for y in range(y0, y1 + 1):
        canvas.put(x0, y, dark)


def _eyes(canvas: PixelCanvas, cx: int, cy: int, spacing: int = 7) -> None:
    for ex in (cx - spacing, cx + spacing):
        _rect(canvas, ex - 2, cy - 2, ex + 2, cy + 2, K)
        canvas.put(ex - 1, cy - 1, W)
        canvas.put(ex, cy - 1, W)


def _apply_outline(canvas: PixelCanvas, outline: tuple[int, int, int, int] = D) -> None:
    existing = dict(canvas.pixels)
    additions: dict[tuple[int, int], tuple[int, int, int, int]] = {}
    for (x, y), color in existing.items():
        if color[3] < 20:
            continue
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            if (nx, ny) not in existing or existing[(nx, ny)][3] < 20:
                if (nx, ny) not in existing:
                    additions[(nx, ny)] = outline
    canvas.pixels.update(additions)


def _ground_shadow(canvas: PixelCanvas, cx: int, foot: int) -> None:
    shadow = (56, 88, 103, 72)
    _ellipse(canvas, cx, foot - 2, 30, 6, shadow)


def _finalize_sprite(canvas: PixelCanvas, cx: int, foot: int) -> None:
    _ground_shadow(canvas, cx, foot)
    _apply_outline(canvas)


# ─── Forest Elder — Kamaji-inspired boiler grandfather ────────────────────────

def paint_forest_elder(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    # shoes
    _rect(canvas, cx - 22, y - 6, cx - 10, y - 1, C)
    _rect(canvas, cx + 10, y - 6, cx + 22, y - 1, C)
    _rect(canvas, cx - 24, y - 10, cx - 8, y - 6, C2)
    _rect(canvas, cx + 8, y - 10, cx + 24, y - 6, C2)
    # pants
    _shade_rect(canvas, cx - 20, y - 52, cx - 6, y - 10, B2, B, B)
    _shade_rect(canvas, cx + 6, y - 52, cx + 20, y - 10, B2, B, B)
    # apron
    _shade_rect(canvas, cx - 26, y - 98, cx + 26, y - 48, B, B2, L)
    _rect(canvas, cx - 4, y - 118, cx + 4, y - 98, B)
    _rect(canvas, cx - 22, y - 118, cx - 18, y - 100, B)
    _rect(canvas, cx + 18, y - 118, cx + 22, y - 100, B)
    _rect(canvas, cx - 10, y - 82, cx + 10, y - 68, B2)
    # shirt
    _shade_rect(canvas, cx - 30, y - 118, cx + 30, y - 96, R, R2, R)
    _rect(canvas, cx - 8, y - 112, cx + 8, y - 100, R2)
    # arms
    _ellipse(canvas, cx - 38, y - 102, 10, 14, S)
    _ellipse(canvas, cx + 38, y - 102, 10, 14, S)
    # ladle (right hand)
    _line(canvas, cx + 42, y - 108, cx + 58, y - 128, C)
    _ellipse(canvas, cx + 60, y - 132, 8, 5, Y)
    _rect(canvas, cx + 54, y - 134, cx + 66, y - 128, Y)
    # face
    _ellipse(canvas, cx, y - 136, 24, 22, S)
    _ellipse(canvas, cx, y - 138, 22, 20, S3)
    # wrinkles
    canvas.put(cx - 8, y - 132, S2)
    canvas.put(cx + 8, y - 132, S2)
    canvas.put(cx, y - 124, S2)
    # glasses
    _ellipse(canvas, cx - 11, y - 138, 8, 7, L2)
    _ellipse(canvas, cx + 11, y - 138, 8, 7, L2)
    _rect(canvas, cx - 3, y - 139, cx + 3, y - 137, L)
    canvas.put(cx - 11, y - 138, K)
    canvas.put(cx + 11, y - 138, K)
    canvas.put(cx - 10, y - 139, W)
    canvas.put(cx + 12, y - 139, W)
    # brows & mouth
    _rect(canvas, cx - 14, y - 146, cx - 6, y - 144, K)
    _rect(canvas, cx + 6, y - 146, cx + 14, y - 144, K)
    _line(canvas, cx - 5, y - 128, cx + 5, y - 128, S2)
    # mustache tuft
    _ellipse(canvas, cx, y - 126, 10, 4, W)
    _ellipse(canvas, cx, y - 124, 8, 3, W2)
    # wild white hair
    for dx, dy, rx, ry in [
        (-16, -158, 10, 12), (0, -164, 12, 14), (16, -158, 10, 12),
        (-24, -150, 8, 10), (24, -150, 8, 10), (-8, -168, 6, 8), (8, -168, 6, 8),
        (-20, -162, 6, 8), (20, -162, 6, 8),
    ]:
        _ellipse(canvas, cx + dx, y + dy, rx, ry, W)
        _ellipse(canvas, cx + dx, y + dy - 2, max(rx - 2, 3), max(ry - 2, 3), W2)
    # extra arm hints (Kamaji-style)
    _ellipse(canvas, cx - 46, y - 108, 8, 11, S2)
    _ellipse(canvas, cx - 52, y - 120, 7, 9, S2)
    _line(canvas, cx - 54, y - 126, cx - 48, y - 134, C)
    _finalize_sprite(canvas, cx, y)


# ─── Coffee Barista — seaside café attendant ─────────────────────────────────

def paint_coffee_barista(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    _rect(canvas, cx - 14, y - 6, cx - 4, y - 1, D)
    _rect(canvas, cx + 4, y - 6, cx + 14, y - 1, D)
    _shade_rect(canvas, cx - 16, y - 48, cx - 4, y - 6, P, P2, P)
    _shade_rect(canvas, cx + 4, y - 48, cx + 16, y - 6, P, P2, P)
    # apron skirt
    _shade_rect(canvas, cx - 22, y - 96, cx + 22, y - 46, P, P2, P)
    _rect(canvas, cx - 18, y - 72, cx - 8, y - 58, P2)
    _rect(canvas, cx - 2, y - 80, cx + 2, y - 50, P2)
    # blouse
    _shade_rect(canvas, cx - 20, y - 108, cx + 20, y - 94, W, W2, W)
    _rect(canvas, cx - 6, y - 104, cx + 6, y - 96, E)
    # arms
    _ellipse(canvas, cx - 28, y - 100, 8, 12, S)
    _ellipse(canvas, cx + 30, y - 98, 8, 12, S)
    # coffee cup
    _rect(canvas, cx + 34, y - 108, cx + 46, y - 92, E)
    _rect(canvas, cx + 36, y - 110, cx + 44, y - 108, E2)
    _line(canvas, cx + 46, y - 104, cx + 50, y - 100, E2)
    canvas.put(cx + 38, y - 114, H)
    canvas.put(cx + 42, y - 116, H)
    # face
    _ellipse(canvas, cx, y - 124, 20, 19, S)
    _ellipse(canvas, cx, y - 126, 18, 17, S3)
    canvas.put(cx - 7, y - 126, K)
    canvas.put(cx + 7, y - 126, K)
    canvas.put(cx - 6, y - 127, W)
    canvas.put(cx + 8, y - 127, W)
    _ellipse(canvas, cx - 10, y - 118, 3, 2, P2)
    _ellipse(canvas, cx + 10, y - 118, 3, 2, P2)
    _line(canvas, cx - 4, y - 114, cx + 4, y - 114, S2)
    # ponytail
    _ellipse(canvas, cx, y - 142, 22, 20, M)
    _ellipse(canvas, cx, y - 144, 20, 18, M2)
    _ellipse(canvas, cx + 18, y - 132, 10, 22, M)
    _ellipse(canvas, cx + 20, y - 128, 8, 18, M2)
    _rect(canvas, cx - 8, y - 156, cx + 8, y - 150, P)
    _rect(canvas, cx - 6, y - 158, cx + 6, y - 154, P2)
    _finalize_sprite(canvas, cx, y)


# ─── Park Traveler — Kiki-inspired wanderer ───────────────────────────────────

def paint_park_traveler(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    _rect(canvas, cx - 14, y - 5, cx - 5, y - 1, D)
    _rect(canvas, cx + 5, y - 5, cx + 14, y - 1, D)
    _rect(canvas, cx - 12, y - 8, cx - 6, y - 5, W)
    _rect(canvas, cx + 6, y - 8, cx + 12, y - 5, W)
    # dress
    _shade_rect(canvas, cx - 24, y - 88, cx + 24, y - 8, R, R2, R)
    _rect(canvas, cx - 20, y - 84, cx - 12, y - 20, R2)
    _rect(canvas, cx + 12, y - 84, cx + 20, y - 20, R2)
    _rect(canvas, cx - 26, y - 70, cx - 22, y - 40, R2)
    _rect(canvas, cx + 22, y - 70, cx + 26, y - 40, R2)
    # collar
    _rect(canvas, cx - 10, y - 96, cx + 10, y - 88, W)
    # arms & map
    _ellipse(canvas, cx - 32, y - 82, 8, 11, S)
    _ellipse(canvas, cx + 32, y - 84, 8, 11, S)
    _rect(canvas, cx - 48, y - 96, cx - 30, y - 72, E)
    _rect(canvas, cx - 46, y - 94, cx - 32, y - 74, W)
    _line(canvas, cx - 44, y - 90, cx - 34, y - 78, B)
    _line(canvas, cx - 42, y - 86, cx - 36, y - 80, G)
    # bag strap
    _line(canvas, cx - 18, y - 100, cx - 26, y - 78, C)
    _ellipse(canvas, cx - 28, y - 76, 6, 8, C2)
    # face
    _ellipse(canvas, cx, y - 112, 18, 17, S)
    _ellipse(canvas, cx, y - 114, 16, 15, S3)
    canvas.put(cx - 6, y - 114, K)
    canvas.put(cx + 6, y - 114, K)
    canvas.put(cx - 5, y - 115, W)
    canvas.put(cx + 7, y - 115, W)
    _line(canvas, cx - 3, y - 106, cx + 3, y - 106, S2)
    # hair bob
    _ellipse(canvas, cx, y - 128, 24, 20, M)
    _ellipse(canvas, cx, y - 130, 22, 18, M2)
    _ellipse(canvas, cx - 20, y - 120, 8, 12, M)
    _ellipse(canvas, cx + 20, y - 120, 8, 12, M)
    # red bow
    _rect(canvas, cx - 10, y - 138, cx + 10, y - 132, R)
    _ellipse(canvas, cx - 14, y - 136, 6, 5, R2)
    _ellipse(canvas, cx + 14, y - 136, 6, 5, R2)
    _finalize_sprite(canvas, cx, y)


# ─── Snow Guide — hooded mountain explorer ───────────────────────────────────

def paint_snow_guide(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    _rect(canvas, cx - 16, y - 8, cx - 6, y - 1, C)
    _rect(canvas, cx + 6, y - 8, cx + 16, y - 1, C)
    _rect(canvas, cx - 18, y - 14, cx - 4, y - 8, C2)
    _rect(canvas, cx + 4, y - 14, cx + 18, y - 8, C2)
    # cloak body
    _shade_rect(canvas, cx - 32, y - 108, cx + 32, y - 12, B, B2, B)
    _rect(canvas, cx - 28, y - 104, cx - 20, y - 40, B2)
    _rect(canvas, cx + 20, y - 104, cx + 28, y - 40, B2)
    # scarf
    _rect(canvas, cx - 16, y - 100, cx + 16, y - 90, P)
    _rect(canvas, cx + 12, y - 90, cx + 22, y - 72, P)
    _rect(canvas, cx + 20, y - 72, cx + 24, y - 64, P2)
    # staff
    _line(canvas, cx + 36, y - 20, cx + 36, y - 140, C)
    _ellipse(canvas, cx + 36, y - 144, 6, 6, Y)
    # face in hood
    _ellipse(canvas, cx, y - 118, 18, 16, S)
    _ellipse(canvas, cx, y - 120, 16, 14, S3)
    canvas.put(cx - 6, y - 120, K)
    canvas.put(cx + 6, y - 120, K)
    _line(canvas, cx - 4, y - 112, cx + 4, y - 112, S2)
    # hood
    _ellipse(canvas, cx, y - 132, 30, 26, B)
    _ellipse(canvas, cx, y - 136, 28, 24, B2)
    _rect(canvas, cx - 32, y - 148, cx + 32, y - 132, B)
    _rect(canvas, cx - 34, y - 140, cx + 34, y - 134, W)
    # fur trim
    for dx in range(-30, 32, 4):
        canvas.put(cx + dx, y - 134, W)
        canvas.put(cx + dx + 1, y - 135, W2)
    _finalize_sprite(canvas, cx, y)


# ─── Glass Master — workshop artisan ─────────────────────────────────────────

def paint_glass_master(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    _rect(canvas, cx - 16, y - 8, cx - 6, y - 1, C)
    _rect(canvas, cx + 6, y - 8, cx + 16, y - 1, C)
    # apron
    _shade_rect(canvas, cx - 28, y - 100, cx + 28, y - 14, E, E2, E)
    _rect(canvas, cx - 20, y - 76, cx - 8, y - 62, E2)
    _rect(canvas, cx - 4, y - 86, cx + 4, y - 56, E2)
    # shirt sleeves
    _shade_rect(canvas, cx - 34, y - 112, cx - 22, y - 88, B, B2, B)
    _shade_rect(canvas, cx + 22, y - 112, cx + 34, y - 88, B, B2, B)
    _rect(canvas, cx - 24, y - 118, cx + 24, y - 110, B2)
    # arms
    _ellipse(canvas, cx - 38, y - 96, 9, 12, S)
    _ellipse(canvas, cx + 38, y - 94, 9, 12, S)
    # glass pipe
    _line(canvas, cx + 40, y - 100, cx + 56, y - 118, L)
    _ellipse(canvas, cx + 58, y - 122, 7, 5, L2)
    _ellipse(canvas, cx + 58, y - 124, 5, 3, H)
    # face
    _ellipse(canvas, cx, y - 132, 22, 20, S)
    _ellipse(canvas, cx, y - 134, 20, 18, S3)
    canvas.put(cx - 7, y - 134, K)
    canvas.put(cx + 7, y - 134, K)
    _rect(canvas, cx - 8, y - 126, cx + 8, y - 124, S2)
    # goggles on forehead
    _rect(canvas, cx - 18, y - 148, cx - 6, y - 142, L)
    _rect(canvas, cx + 6, y - 148, cx + 18, y - 142, L)
    _rect(canvas, cx - 4, y - 146, cx + 4, y - 144, L2)
    canvas.put(cx - 12, y - 145, H)
    canvas.put(cx + 12, y - 145, H)
    # white hair & beard
    _ellipse(canvas, cx, y - 156, 26, 14, W)
    _ellipse(canvas, cx, y - 160, 24, 10, W2)
    _ellipse(canvas, cx, y - 122, 12, 8, W)
    _ellipse(canvas, cx, y - 118, 10, 6, W2)
    for dx in (-14, -6, 6, 14):
        _ellipse(canvas, cx + dx, y - 164, 5, 6, W)
    _finalize_sprite(canvas, cx, y)


# ─── Inner Voice — river spirit guide (Haku-inspired) ─────────────────────────

def paint_inner_voice(canvas: PixelCanvas, cx: int, foot: int) -> None:
    y = foot
    # ethereal glow base
    _ellipse(canvas, cx, y - 60, 40, 50, H2)
    _ellipse(canvas, cx, y - 62, 36, 46, H)
    # flowing robe
    for layer, alpha_color in [(34, H2), (30, H), (26, L)]:
        _ellipse(canvas, cx, y - 40, layer, 56, alpha_color)
    _shade_rect(canvas, cx - 22, y - 110, cx + 22, y - 50, L, L2, L)
    _rect(canvas, cx - 18, y - 108, cx - 8, y - 70, L2)
    _rect(canvas, cx + 8, y - 108, cx + 18, y - 70, L2)
    # sashes
    _rect(canvas, cx - 20, y - 88, cx + 20, y - 82, W)
    _rect(canvas, cx - 14, y - 72, cx + 14, y - 68, B)
    # face
    _ellipse(canvas, cx, y - 124, 18, 17, S)
    _ellipse(canvas, cx, y - 126, 16, 15, S3)
    _line(canvas, cx - 6, y - 126, cx - 2, y - 126, K)
    _line(canvas, cx + 2, y - 126, cx + 6, y - 126, K)
    _line(canvas, cx - 3, y - 118, cx + 3, y - 118, S2)
    # hair flow
    _ellipse(canvas, cx, y - 140, 22, 16, M)
    _ellipse(canvas, cx - 16, y - 132, 10, 18, M2)
    _ellipse(canvas, cx + 16, y - 132, 10, 18, M2)
    _ellipse(canvas, cx, y - 152, 18, 10, M2)
    # spirit wisps
    for dx, dy in [(-36, -100), (38, -108), (-28, -148), (30, -152)]:
        canvas.put(cx + dx, y + dy, W)
        canvas.put(cx + dx + 1, y + dy - 1, H)
        canvas.put(cx + dx - 1, y + dy + 1, H2)
    _finalize_sprite(canvas, cx, y)


DETAILED_NPC_PAINTERS: dict[str, callable] = {
    "forest-elder-idle": paint_forest_elder,
    "coffee-barista-idle": paint_coffee_barista,
    "park-traveler-idle": paint_park_traveler,
    "snow-guide-idle": paint_snow_guide,
    "glass-master-idle": paint_glass_master,
    "inner-voice-idle": paint_inner_voice,
}


def paint_detailed_npc(frame_name: str, cell: int = 256) -> PixelCanvas:
    canvas = PixelCanvas(cell, cell)
    foot = cell - 10
    painter = DETAILED_NPC_PAINTERS[frame_name]
    painter(canvas, cell // 2, foot)
    return canvas

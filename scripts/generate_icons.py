import os
import math
import zlib
import struct

def clamp(val, min_val=0.0, max_val=1.0):
    return max(min_val, min(max_val, val))

def draw_icon(x, y, w, h, is_maskable=False):
    nx = (x + 0.5) / w
    ny = (y + 0.5) / h
    
    # Distance from center for background rounding if not maskable
    dx_center = nx - 0.5
    dy_center = ny - 0.5
    
    # Maskable uses full square, regular uses squircle
    bg_alpha = 1.0
    if not is_maskable:
        # Rounded corners (squircle / r=0.22)
        corner_r = 0.20
        lx = abs(dx_center) - (0.5 - corner_r)
        ly = abs(dy_center) - (0.5 - corner_r)
        if lx > 0 and ly > 0:
            corner_dist = math.sqrt(lx*lx + ly*ly)
            if corner_dist > corner_r + 0.01:
                return (0, 0, 0, 0)
            elif corner_dist > corner_r - 0.01:
                bg_alpha = clamp((corner_r + 0.01 - corner_dist) / 0.02)
    
    # Base background: Dark navy (#090d16) with subtle radial gradient
    dist_c = math.sqrt(dx_center*dx_center + dy_center*dy_center)
    bg_r = int(9 + (15 - 9) * (1 - dist_c))
    bg_g = int(13 + (25 - 13) * (1 - dist_c))
    bg_b = int(22 + (40 - 22) * (1 - dist_c))
    
    # Gold crescent parameters
    c1_x, c1_y, c1_r = 0.47, 0.52, 0.32
    c2_x, c2_y, c2_r = 0.57, 0.44, 0.26
    
    d1 = math.sqrt((nx - c1_x)**2 + (ny - c1_y)**2)
    d2 = math.sqrt((nx - c2_x)**2 + (ny - c2_y)**2)
    
    # Antialiased crescent check
    edge_width = 0.01
    in_outer = clamp((c1_r + edge_width/2 - d1) / edge_width)
    out_inner = clamp((d2 - (c2_r - edge_width/2)) / edge_width)
    crescent_alpha = in_outer * out_inner
    
    # 4-point Diamond Star parameters at (0.68, 0.31)
    sx, sy = 0.67, 0.30
    star_dx = abs(nx - sx) / 0.095
    star_dy = abs(ny - sy) / 0.095
    star_val = (star_dx**0.65 + star_dy**0.65) if (star_dx >= 0 and star_dy >= 0) else 2.0
    star_alpha = clamp((1.05 - star_val) / 0.1) if star_val <= 1.1 else 0.0
    
    # Small secondary star at (0.33, 0.28)
    s2x, s2y = 0.33, 0.28
    s2_dx = abs(nx - s2x) / 0.045
    s2_dy = abs(ny - s2y) / 0.045
    s2_val = (s2_dx**0.65 + s2_dy**0.65)
    s2_alpha = clamp((1.05 - s2_val) / 0.1) if s2_val <= 1.1 else 0.0
    
    # Gold Gradient interpolation (Top-left gold to Bottom-right light gold)
    grad_t = clamp((nx + ny) / 2.0)
    # Gold colors: #bf9129 -> #d4af37 -> #f3e5ab
    gold_r = int(191 + (243 - 191) * grad_t)
    gold_g = int(145 + (229 - 145) * grad_t)
    gold_b = int(41 + (171 - 41) * grad_t)
    
    # Combine crescent and stars
    gold_alpha = max(crescent_alpha, star_alpha, s2_alpha)
    
    # Composite Gold over Background
    out_r = int(bg_r * (1 - gold_alpha) + gold_r * gold_alpha)
    out_g = int(bg_g * (1 - gold_alpha) + gold_g * gold_alpha)
    out_b = int(bg_b * (1 - gold_alpha) + gold_b * gold_alpha)
    out_a = int(255 * bg_alpha)
    
    return (out_r, out_g, out_b, out_a)

def create_png(width, height, is_maskable, filename):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0
        for x in range(width):
            r, g, b, a = draw_icon(x, y, width, height, is_maskable)
            raw_data.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_data), 9)
    
    def make_chunk(chunk_type, data):
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)

    png_bytes = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes.extend(make_chunk(b'IHDR', ihdr_data))
    png_bytes.extend(make_chunk(b'IDAT', compressed))
    png_bytes.extend(make_chunk(b'IEND', b''))
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png_bytes)
    print(f'Successfully generated {filename} ({width}x{height})')

if __name__ == '__main__':
    base_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
    create_png(192, 192, False, os.path.join(base_dir, 'icon-192.png'))
    create_png(512, 512, False, os.path.join(base_dir, 'icon-512.png'))
    create_png(512, 512, True, os.path.join(base_dir, 'icon-maskable-512.png'))
    create_png(180, 180, False, os.path.join(base_dir, 'apple-touch-icon.png'))

// Color conversion utilities

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(rgb: RGB): string {
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - r - k) / (1 - k)) * 100);
  const m = Math.round(((1 - g - k) / (1 - k)) * 100);
  const y = Math.round(((1 - b - k) / (1 - k)) * 100);

  return { c, m, y, k: Math.round(k * 100) };
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Generate a creative color name based on hue and lightness
 */
export function generateColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  // Check for grayscale
  if (hsl.s < 10) {
    if (hsl.l < 15) return 'Midnight';
    if (hsl.l < 30) return 'Charcoal';
    if (hsl.l < 45) return 'Storm';
    if (hsl.l < 60) return 'Fog';
    if (hsl.l < 75) return 'Mist';
    if (hsl.l < 90) return 'Cloud';
    return 'Frost';
  }

  // Color names by hue range
  const hueNames: Record<string, [number, number][]> = {
    'Ruby': [[0, 15]],
    'Coral': [[15, 30]],
    'Sunset': [[30, 45]],
    'Amber': [[45, 60]],
    'Gold': [[60, 75]],
    'Citrus': [[75, 90]],
    'Lime': [[90, 120]],
    'Emerald': [[120, 150]],
    'Teal': [[150, 180]],
    'Ocean': [[180, 200]],
    'Azure': [[200, 220]],
    'Sapphire': [[220, 250]],
    'Indigo': [[250, 270]],
    'Violet': [[270, 290]],
    'Orchid': [[290, 320]],
    'Rose': [[320, 345]],
    'Crimson': [[345, 360]],
  };

  for (const [name, ranges] of Object.entries(hueNames)) {
    for (const [min, max] of ranges) {
      if (hsl.h >= min && hsl.h < max) {
        // Modify name based on lightness
        if (hsl.l < 30) return `Deep ${name}`;
        if (hsl.l > 70) return `Light ${name}`;
        return name;
      }
    }
  }

  return 'Aurora';
}

/**
 * Find the nearest Pantone color (simplified approximation)
 */
export function findNearestPantone(hex: string): string | undefined {
  // This is a simplified approximation - a real implementation would
  // use a full Pantone color database
  const commonPantones: Record<string, string> = {
    '#ff0000': '185 C',
    '#0000ff': '286 C',
    '#00ff00': '354 C',
    '#ffff00': '102 C',
    '#ff6600': '151 C',
    '#660099': '2685 C',
    '#009999': '320 C',
    '#000000': 'Black C',
    '#ffffff': 'White',
  };

  // Find closest match by color distance
  const targetRgb = hexToRgb(hex);
  let closestPantone: string | undefined;
  let minDistance = Infinity;

  for (const [pantoneHex, pantoneName] of Object.entries(commonPantones)) {
    const pantoneRgb = hexToRgb(pantoneHex);
    const distance = Math.sqrt(
      Math.pow(targetRgb.r - pantoneRgb.r, 2) +
      Math.pow(targetRgb.g - pantoneRgb.g, 2) +
      Math.pow(targetRgb.b - pantoneRgb.b, 2)
    );

    if (distance < minDistance && distance < 100) {
      minDistance = distance;
      closestPantone = pantoneName;
    }
  }

  return closestPantone;
}

/**
 * Calculate color contrast ratio (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (rgb: RGB): number => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(hexToRgb(color1));
  const l2 = getLuminance(hexToRgb(color2));

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color is dark or light
 */
export function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
}

/**
 * Deduplicate similar colors
 */
export function deduplicateColors(colors: string[], threshold = 30): string[] {
  const unique: string[] = [];

  for (const color of colors) {
    const rgb = hexToRgb(color);
    const isDuplicate = unique.some(existingColor => {
      const existingRgb = hexToRgb(existingColor);
      const distance = Math.sqrt(
        Math.pow(rgb.r - existingRgb.r, 2) +
        Math.pow(rgb.g - existingRgb.g, 2) +
        Math.pow(rgb.b - existingRgb.b, 2)
      );
      return distance < threshold;
    });

    if (!isDuplicate) {
      unique.push(color);
    }
  }

  return unique;
}

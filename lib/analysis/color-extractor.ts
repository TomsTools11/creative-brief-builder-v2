// Color extraction from websites
import type { CheerioAPI } from 'cheerio';
import { hexToRgb, rgbToCmyk, generateColorName, deduplicateColors } from '@/lib/utils/color-utils';
import type { ColorData } from '@/types/brand';

interface ExtractedColor {
  hex: string;
  count: number;
  contexts: string[];
}

/**
 * Extract colors from CSS content
 */
function extractColorsFromCSS(css: string): ExtractedColor[] {
  const colors: Map<string, ExtractedColor> = new Map();

  // Hex colors (3, 4, 6, or 8 digits)
  const hexPattern = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  let match;
  while ((match = hexPattern.exec(css)) !== null) {
    const hex = normalizeHex(match[0]);
    if (!isNearWhiteOrBlack(hex)) {
      addColor(colors, hex, 'css');
    }
  }

  // RGB/RGBA colors
  const rgbPattern = /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)/gi;
  while ((match = rgbPattern.exec(css)) !== null) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const hex = rgbToHex(r, g, b);
    if (!isNearWhiteOrBlack(hex)) {
      addColor(colors, hex, 'css');
    }
  }

  // HSL colors
  const hslPattern = /hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%(?:\s*,\s*[\d.]+)?\s*\)/gi;
  while ((match = hslPattern.exec(css)) !== null) {
    const h = parseInt(match[1], 10);
    const s = parseInt(match[2], 10);
    const l = parseInt(match[3], 10);
    const hex = hslToHex(h, s, l);
    if (!isNearWhiteOrBlack(hex)) {
      addColor(colors, hex, 'css');
    }
  }

  return Array.from(colors.values());
}

/**
 * Extract colors from inline styles in HTML
 */
function extractColorsFromHTML($: CheerioAPI): ExtractedColor[] {
  const colors: Map<string, ExtractedColor> = new Map();

  // Check style attributes
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const extracted = extractColorsFromCSS(style);
    extracted.forEach((color) => {
      addColor(colors, color.hex, 'inline-style');
    });
  });

  // Check background colors
  $('[bgcolor]').each((_, el) => {
    const bgcolor = $(el).attr('bgcolor') || '';
    if (bgcolor.startsWith('#')) {
      const hex = normalizeHex(bgcolor);
      if (!isNearWhiteOrBlack(hex)) {
        addColor(colors, hex, 'bgcolor-attr');
      }
    }
  });

  // Check color attributes
  $('[color]').each((_, el) => {
    const color = $(el).attr('color') || '';
    if (color.startsWith('#')) {
      const hex = normalizeHex(color);
      if (!isNearWhiteOrBlack(hex)) {
        addColor(colors, hex, 'color-attr');
      }
    }
  });

  return Array.from(colors.values());
}

/**
 * Extract colors from SVG elements
 */
function extractColorsFromSVGs($: CheerioAPI): ExtractedColor[] {
  const colors: Map<string, ExtractedColor> = new Map();

  $('svg').each((_, svg) => {
    // Check fill and stroke attributes
    $(svg).find('[fill], [stroke]').each((_, el) => {
      const fill = $(el).attr('fill');
      const stroke = $(el).attr('stroke');

      if (fill && fill.startsWith('#') && fill !== '#000' && fill !== '#fff') {
        addColor(colors, normalizeHex(fill), 'svg-fill');
      }
      if (stroke && stroke.startsWith('#') && stroke !== '#000' && stroke !== '#fff') {
        addColor(colors, normalizeHex(stroke), 'svg-stroke');
      }
    });

    // Check style content
    const styleContent = $(svg).find('style').text();
    if (styleContent) {
      const extracted = extractColorsFromCSS(styleContent);
      extracted.forEach((color) => {
        addColor(colors, color.hex, 'svg-style');
      });
    }
  });

  return Array.from(colors.values());
}

/**
 * Main color extraction function
 */
export function extractColors(
  $: CheerioAPI,
  styles: string[]
): ColorData[] {
  // Collect colors from all sources
  const allExtracted: ExtractedColor[] = [];

  // From CSS
  styles.forEach((css) => {
    allExtracted.push(...extractColorsFromCSS(css));
  });

  // From HTML
  allExtracted.push(...extractColorsFromHTML($));

  // From SVGs
  allExtracted.push(...extractColorsFromSVGs($));

  // Aggregate by hex
  const aggregated: Map<string, ExtractedColor> = new Map();
  allExtracted.forEach((color) => {
    const existing = aggregated.get(color.hex);
    if (existing) {
      existing.count += color.count;
      existing.contexts.push(...color.contexts);
    } else {
      aggregated.set(color.hex, { ...color });
    }
  });

  // Sort by frequency and take top colors
  const sorted = Array.from(aggregated.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Deduplicate similar colors
  const uniqueHexes = deduplicateColors(sorted.map((c) => c.hex));

  // Convert to ColorData format
  const colorDataList: ColorData[] = uniqueHexes.slice(0, 8).map((hex, index) => {
    const rgb = hexToRgb(hex);
    const cmyk = rgbToCmyk(rgb);

    // Determine usage based on position and contexts
    let usage: ColorData['usage'];
    if (index === 0) {
      usage = 'primary';
    } else if (index === 1) {
      usage = 'secondary';
    } else if (index < 4) {
      usage = 'accent';
    } else {
      usage = 'background';
    }

    return {
      hex,
      rgb,
      cmyk,
      name: generateColorName(hex),
      usage,
    };
  });

  return colorDataList;
}

// Helper functions

function addColor(
  colors: Map<string, ExtractedColor>,
  hex: string,
  context: string
): void {
  const normalized = hex.toUpperCase();
  const existing = colors.get(normalized);
  if (existing) {
    existing.count++;
    if (!existing.contexts.includes(context)) {
      existing.contexts.push(context);
    }
  } else {
    colors.set(normalized, { hex: normalized, count: 1, contexts: [context] });
  }
}

function normalizeHex(hex: string): string {
  let h = hex.replace('#', '').toUpperCase();

  // Expand 3-digit hex
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  // Handle 4-digit (with alpha)
  if (h.length === 4) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  // Handle 8-digit (strip alpha)
  if (h.length === 8) {
    h = h.slice(0, 6);
  }

  return '#' + h;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

function isNearWhiteOrBlack(hex: string): boolean {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  // Skip very light colors (near white)
  if (brightness > 245) return true;
  // Skip very dark colors (near black)
  if (brightness < 10) return true;

  return false;
}

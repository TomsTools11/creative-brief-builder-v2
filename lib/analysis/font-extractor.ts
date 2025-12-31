// Font extraction from websites
import type { CheerioAPI } from 'cheerio';
import type { FontData } from '@/types/brand';

interface ExtractedFont {
  family: string;
  count: number;
  contexts: string[];
  weights: Set<string>;
  styles: Set<string>;
}

/**
 * Extract font families from CSS content
 */
function extractFontsFromCSS(css: string): ExtractedFont[] {
  const fonts: Map<string, ExtractedFont> = new Map();

  // Match font-family declarations
  const fontFamilyPattern = /font-family\s*:\s*([^;!}]+)/gi;
  let match;
  while ((match = fontFamilyPattern.exec(css)) !== null) {
    const families = parseFontFamilyValue(match[1]);
    families.forEach((family) => {
      if (!isGenericFont(family)) {
        addFont(fonts, family, 'css-font-family');
      }
    });
  }

  // Match shorthand font declarations
  const fontPattern = /\bfont\s*:\s*([^;!}]+)/gi;
  while ((match = fontPattern.exec(css)) !== null) {
    const families = extractFamiliesFromShorthand(match[1]);
    families.forEach((family) => {
      if (!isGenericFont(family)) {
        addFont(fonts, family, 'css-font-shorthand');
      }
    });
  }

  // Match @font-face declarations
  const fontFacePattern = /@font-face\s*\{[^}]*font-family\s*:\s*['"]?([^'";]+)['"]?/gi;
  while ((match = fontFacePattern.exec(css)) !== null) {
    const family = cleanFontName(match[1]);
    if (!isGenericFont(family)) {
      addFont(fonts, family, 'font-face');
    }
  }

  // Extract weights from @font-face
  const fontFaceBlocks = css.match(/@font-face\s*\{[^}]+\}/gi) || [];
  fontFaceBlocks.forEach((block) => {
    const familyMatch = block.match(/font-family\s*:\s*['"]?([^'";]+)['"]?/i);
    const weightMatch = block.match(/font-weight\s*:\s*(\d+|normal|bold)/i);
    const styleMatch = block.match(/font-style\s*:\s*(normal|italic|oblique)/i);

    if (familyMatch) {
      const family = cleanFontName(familyMatch[1]);
      const font = fonts.get(family.toLowerCase());
      if (font) {
        if (weightMatch) font.weights.add(normalizeWeight(weightMatch[1]));
        if (styleMatch) font.styles.add(styleMatch[1]);
      }
    }
  });

  return Array.from(fonts.values());
}

/**
 * Extract Google Fonts from link tags
 */
function extractGoogleFonts($: CheerioAPI): ExtractedFont[] {
  const fonts: Map<string, ExtractedFont> = new Map();

  // Check link tags for Google Fonts
  $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').each((_, el) => {
    const href = $(el).attr('href') || '';

    // Parse family parameter
    const familyMatch = href.match(/family=([^&]+)/);
    if (familyMatch) {
      const familyString = decodeURIComponent(familyMatch[1]);

      // Handle both old format (family=Font+Name:400,700) and new format (family=Font+Name:wght@400;700)
      const families = familyString.split('|');
      families.forEach((f) => {
        const [name, weights] = f.split(':');
        const cleanName = name.replace(/\+/g, ' ').trim();

        if (cleanName && !isGenericFont(cleanName)) {
          const font = addFont(fonts, cleanName, 'google-fonts');

          // Parse weights
          if (weights) {
            const weightValues = weights.match(/\d{3}/g) || [];
            weightValues.forEach((w) => font.weights.add(w));
          }
        }
      });
    }
  });

  return Array.from(fonts.values());
}

/**
 * Extract fonts from inline styles
 */
function extractInlineFonts($: CheerioAPI): ExtractedFont[] {
  const fonts: Map<string, ExtractedFont> = new Map();

  $('[style*="font"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const extracted = extractFontsFromCSS(style);
    extracted.forEach((font) => {
      const existing = fonts.get(font.family.toLowerCase());
      if (existing) {
        existing.count += font.count;
      } else {
        fonts.set(font.family.toLowerCase(), font);
      }
    });
  });

  return Array.from(fonts.values());
}

/**
 * Main font extraction function
 */
export function extractFonts(
  $: CheerioAPI,
  styles: string[]
): FontData[] {
  // Collect fonts from all sources
  const allExtracted: ExtractedFont[] = [];

  // From CSS
  styles.forEach((css) => {
    allExtracted.push(...extractFontsFromCSS(css));
  });

  // From Google Fonts
  allExtracted.push(...extractGoogleFonts($));

  // From inline styles
  allExtracted.push(...extractInlineFonts($));

  // Aggregate by family name
  const aggregated: Map<string, ExtractedFont> = new Map();
  allExtracted.forEach((font) => {
    const key = font.family.toLowerCase();
    const existing = aggregated.get(key);
    if (existing) {
      existing.count += font.count;
      existing.contexts.push(...font.contexts);
      font.weights.forEach((w) => existing.weights.add(w));
      font.styles.forEach((s) => existing.styles.add(s));
    } else {
      aggregated.set(key, { ...font });
    }
  });

  // Sort by frequency and convert to FontData
  const sorted = Array.from(aggregated.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const fontDataList: FontData[] = sorted.map((font, index) => {
    // Determine usage based on position
    let usage: FontData['usage'];
    if (index === 0) {
      usage = 'heading';
    } else if (index === 1) {
      usage = 'body';
    } else {
      usage = 'accent';
    }

    // Determine category
    const category = detectFontCategory(font.family);

    return {
      family: font.family,
      category,
      weights: Array.from(font.weights).sort(),
      styles: Array.from(font.styles),
      usage,
      source: font.contexts.includes('google-fonts') ? 'google' : 'system',
    };
  });

  return fontDataList;
}

// Helper functions

function addFont(
  fonts: Map<string, ExtractedFont>,
  family: string,
  context: string
): ExtractedFont {
  const key = family.toLowerCase();
  const existing = fonts.get(key);
  if (existing) {
    existing.count++;
    if (!existing.contexts.includes(context)) {
      existing.contexts.push(context);
    }
    return existing;
  } else {
    const font: ExtractedFont = {
      family,
      count: 1,
      contexts: [context],
      weights: new Set(),
      styles: new Set(['normal']),
    };
    fonts.set(key, font);
    return font;
  }
}

function parseFontFamilyValue(value: string): string[] {
  // Split by comma and clean each family name
  return value
    .split(',')
    .map((f) => cleanFontName(f.trim()))
    .filter((f) => f.length > 0);
}

function extractFamiliesFromShorthand(value: string): string[] {
  // The font shorthand format is: font-style font-variant font-weight font-size/line-height font-family
  // Font family comes after the size (which contains numbers)
  const parts = value.split(/\s+/);
  let foundSize = false;
  const families: string[] = [];

  for (const part of parts) {
    if (/\d/.test(part)) {
      foundSize = true;
    } else if (foundSize) {
      // Everything after the size is font family
      families.push(...parseFontFamilyValue(parts.slice(parts.indexOf(part)).join(' ')));
      break;
    }
  }

  return families;
}

function cleanFontName(name: string): string {
  return name
    .replace(/^['"]|['"]$/g, '') // Remove quotes
    .replace(/\\['"]/g, '') // Remove escaped quotes
    .trim();
}

function isGenericFont(family: string): boolean {
  const genericFonts = [
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded',
    'inherit',
    'initial',
    'unset',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
  ];
  return genericFonts.some((g) => g.toLowerCase() === family.toLowerCase());
}

function normalizeWeight(weight: string): string {
  const weightMap: Record<string, string> = {
    normal: '400',
    bold: '700',
    lighter: '300',
    bolder: '700',
  };
  return weightMap[weight.toLowerCase()] || weight;
}

function detectFontCategory(family: string): FontData['category'] {
  const lowerFamily = family.toLowerCase();

  // Common serif fonts
  const serifFonts = [
    'times', 'georgia', 'garamond', 'palatino', 'baskerville', 'didot', 'bodoni',
    'playfair', 'merriweather', 'lora', 'noto serif', 'source serif', 'libre baskerville',
    'crimson', 'bitter', 'vollkorn', 'cormorant',
  ];
  if (serifFonts.some((s) => lowerFamily.includes(s))) return 'serif';

  // Common monospace fonts
  const monospaceFonts = [
    'mono', 'code', 'consolas', 'courier', 'menlo', 'monaco', 'fira code',
    'source code', 'jetbrains', 'inconsolata', 'roboto mono',
  ];
  if (monospaceFonts.some((m) => lowerFamily.includes(m))) return 'monospace';

  // Common display fonts
  const displayFonts = [
    'display', 'poster', 'headline', 'impact', 'lobster', 'pacifico', 'bebas',
    'oswald', 'anton', 'abril', 'righteous', 'archivo black',
  ];
  if (displayFonts.some((d) => lowerFamily.includes(d))) return 'display';

  // Default to sans-serif
  return 'sans-serif';
}

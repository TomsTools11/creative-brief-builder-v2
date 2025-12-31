// Logo extraction from websites
import type { CheerioAPI } from 'cheerio';
import type { LogoData } from '@/types/brand';
import { resolveUrl, isImageUrl } from '@/lib/utils/url-utils';

interface ExtractedLogo {
  url: string;
  type: 'image' | 'svg';
  context: string;
  alt?: string;
  width?: number;
  height?: number;
  priority: number;
}

/**
 * Extract potential logos from the page
 */
export function extractLogos(
  $: CheerioAPI,
  baseUrl: string
): LogoData[] {
  const logos: ExtractedLogo[] = [];

  // 1. Look for images with "logo" in class, id, or alt
  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    const alt = $el.attr('alt') || '';
    const className = $el.attr('class') || '';
    const id = $el.attr('id') || '';

    if (!src) return;

    const resolvedUrl = resolveUrl(baseUrl, src);
    const isLogoIndicator =
      className.toLowerCase().includes('logo') ||
      id.toLowerCase().includes('logo') ||
      alt.toLowerCase().includes('logo') ||
      src.toLowerCase().includes('logo');

    if (isLogoIndicator) {
      logos.push({
        url: resolvedUrl,
        type: isImageUrl(src) ? 'image' : 'svg',
        context: 'img-logo-class',
        alt,
        width: parseInt($el.attr('width') || '0', 10) || undefined,
        height: parseInt($el.attr('height') || '0', 10) || undefined,
        priority: 10,
      });
    }
  });

  // 2. Look for logos in header/nav area
  $('header img, nav img, .header img, .nav img, #header img, #nav img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    if (!src) return;

    const resolvedUrl = resolveUrl(baseUrl, src);
    if (!logos.some((l) => l.url === resolvedUrl)) {
      logos.push({
        url: resolvedUrl,
        type: isImageUrl(src) ? 'image' : 'svg',
        context: 'header-img',
        alt: $el.attr('alt'),
        width: parseInt($el.attr('width') || '0', 10) || undefined,
        height: parseInt($el.attr('height') || '0', 10) || undefined,
        priority: 8,
      });
    }
  });

  // 3. Look for SVG elements with logo indicators
  $('svg').each((_, el) => {
    const $el = $(el);
    const className = $el.attr('class') || '';
    const id = $el.attr('id') || '';
    const ariaLabel = $el.attr('aria-label') || '';

    const isLogoIndicator =
      className.toLowerCase().includes('logo') ||
      id.toLowerCase().includes('logo') ||
      ariaLabel.toLowerCase().includes('logo');

    if (isLogoIndicator) {
      // Get the SVG content
      const svgContent = $.html(el);
      logos.push({
        url: `data:image/svg+xml,${encodeURIComponent(svgContent)}`,
        type: 'svg',
        context: 'inline-svg-logo',
        alt: ariaLabel,
        priority: 9,
      });
    }
  });

  // 4. Look for link tags with logo references
  $('link[rel*="icon"], link[rel*="apple-touch-icon"]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href');
    if (!href) return;

    const resolvedUrl = resolveUrl(baseUrl, href);
    const sizes = $el.attr('sizes') || '';
    const isLargeIcon = sizes.includes('192') || sizes.includes('180') || sizes.includes('152');

    logos.push({
      url: resolvedUrl,
      type: 'image',
      context: 'link-icon',
      priority: isLargeIcon ? 6 : 3,
    });
  });

  // 5. Look for Open Graph image
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    const resolvedUrl = resolveUrl(baseUrl, ogImage);
    if (!logos.some((l) => l.url === resolvedUrl)) {
      logos.push({
        url: resolvedUrl,
        type: 'image',
        context: 'og-image',
        priority: 4,
      });
    }
  }

  // 6. Look for structured data (JSON-LD) with logo
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        const data = JSON.parse(content);
        const logoUrl = data.logo?.url || data.logo || data.image?.url || data.image;
        if (typeof logoUrl === 'string' && logoUrl.startsWith('http')) {
          if (!logos.some((l) => l.url === logoUrl)) {
            logos.push({
              url: logoUrl,
              type: isImageUrl(logoUrl) ? 'image' : 'svg',
              context: 'json-ld',
              priority: 7,
            });
          }
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  });

  // Sort by priority and convert to LogoData format
  const sortedLogos = logos
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  const logoDataList: LogoData[] = sortedLogos.map((logo, index) => {
    // Determine variant based on context and position
    let variant: LogoData['variant'];
    if (index === 0) {
      variant = 'primary';
    } else if (logo.context.includes('icon')) {
      variant = 'icon';
    } else if (logo.url.includes('white') || logo.url.includes('light')) {
      variant = 'reversed';
    } else {
      variant = 'stacked';
    }

    return {
      url: logo.url,
      format: logo.type === 'svg' ? 'svg' : detectImageFormat(logo.url),
      variant,
      width: logo.width,
      height: logo.height,
      alt: logo.alt,
    };
  });

  return logoDataList;
}

/**
 * Detect image format from URL
 */
function detectImageFormat(url: string): LogoData['format'] {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('.svg')) return 'svg';
  if (lowerUrl.includes('.png')) return 'png';
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg')) return 'jpg';
  if (lowerUrl.includes('.webp')) return 'webp';
  return 'png'; // Default
}

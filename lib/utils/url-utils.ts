// URL validation and normalization utilities

/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(normalizeUrl(urlString));
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Normalize a URL string
 */
export function normalizeUrl(urlString: string): string {
  let url = urlString.trim();

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  // Remove trailing slash
  url = url.replace(/\/$/, '');

  return url;
}

/**
 * Get the domain from a URL
 */
export function getDomain(urlString: string): string {
  try {
    const url = new URL(normalizeUrl(urlString));
    return url.hostname;
  } catch {
    return urlString;
  }
}

/**
 * Get the brand name from a URL (domain without TLD and www)
 */
export function getBrandNameFromUrl(urlString: string): string {
  const domain = getDomain(urlString);

  // Remove www. prefix
  let brandName = domain.replace(/^www\./, '');

  // Remove TLD
  brandName = brandName.split('.')[0];

  // Capitalize first letter
  brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);

  return brandName;
}

/**
 * Resolve a relative URL to absolute
 */
export function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, normalizeUrl(baseUrl)).href;
  } catch {
    return relativeUrl;
  }
}

/**
 * Check if URL is an image
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.includes(ext));
}

/**
 * Extract favicon URL from HTML
 */
export function extractFaviconUrl(html: string, baseUrl: string): string | null {
  // Look for favicon in link tags
  const faviconPatterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
  ];

  for (const pattern of faviconPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return resolveUrl(baseUrl, match[1]);
    }
  }

  // Default favicon location
  return resolveUrl(baseUrl, '/favicon.ico');
}

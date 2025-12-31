// HTML fetcher for website analysis
import * as cheerio from 'cheerio';

export interface FetchedPage {
  html: string;
  $: cheerio.CheerioAPI;
  url: string;
  title: string;
  metaDescription: string;
  styles: string[];
  scripts: string[];
}

/**
 * Fetch and parse a webpage
 */
export async function fetchPage(url: string): Promise<FetchedPage> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Extract title
  const title = $('title').text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    '';

  // Extract meta description
  const metaDescription = $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Extract inline styles
  const styles: string[] = [];
  $('style').each((_, el) => {
    const content = $(el).html();
    if (content) styles.push(content);
  });

  // Extract external stylesheet URLs
  const stylesheetUrls: string[] = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) stylesheetUrls.push(href);
  });

  // Fetch external stylesheets
  for (const stylesheetUrl of stylesheetUrls.slice(0, 5)) { // Limit to 5 stylesheets
    try {
      const fullUrl = new URL(stylesheetUrl, url).href;
      const cssResponse = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });
      if (cssResponse.ok) {
        const css = await cssResponse.text();
        styles.push(css);
      }
    } catch {
      // Ignore failed stylesheet fetches
    }
  }

  // Extract script content (for potential color/font variables)
  const scripts: string[] = [];
  $('script:not([src])').each((_, el) => {
    const content = $(el).html();
    if (content) scripts.push(content);
  });

  return {
    html,
    $,
    url,
    title,
    metaDescription,
    styles,
    scripts,
  };
}

/**
 * Extract all text content from a page
 */
export function extractTextContent($: cheerio.CheerioAPI): string {
  // Remove script and style elements
  $('script, style, noscript, iframe').remove();

  // Get body text
  const bodyText = $('body').text();

  // Clean up whitespace
  return bodyText
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract structured content sections
 */
export function extractStructuredContent($: cheerio.CheerioAPI): {
  headings: { level: number; text: string }[];
  paragraphs: string[];
  lists: string[][];
  links: { text: string; href: string }[];
} {
  const headings: { level: number; text: string }[] = [];
  const paragraphs: string[] = [];
  const lists: string[][] = [];
  const links: { text: string; href: string }[] = [];

  // Extract headings
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el);
    const level = parseInt(el.tagName.charAt(1), 10);
    const text = $el.text().trim();
    if (text) {
      headings.push({ level, text });
    }
  });

  // Extract paragraphs
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) {
      paragraphs.push(text);
    }
  });

  // Extract lists
  $('ul, ol').each((_, el) => {
    const items: string[] = [];
    $(el).find('li').each((_, li) => {
      const text = $(li).text().trim();
      if (text) items.push(text);
    });
    if (items.length > 0) {
      lists.push(items);
    }
  });

  // Extract links
  $('a[href]').each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    const href = $el.attr('href') || '';
    if (text && href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push({ text, href });
    }
  });

  return { headings, paragraphs, lists, links };
}

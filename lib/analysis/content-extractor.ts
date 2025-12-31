// Content extraction for AI analysis
import type { CheerioAPI } from 'cheerio';
import type { ExtractedContent } from '@/types/analysis';

/**
 * Extract meaningful content from the page for AI analysis
 */
export function extractContent($: CheerioAPI): ExtractedContent {
  // Remove non-content elements
  const $clone = $.root().clone();
  $clone.find('script, style, noscript, iframe, nav, footer, header').remove();

  // Extract title
  const title = $('title').text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('h1').first().text().trim() ||
    '';

  // Extract description/tagline
  const description = $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Extract hero text (usually first prominent heading + paragraph)
  const heroHeading = $('h1').first().text().trim() ||
    $('main h1, .hero h1, [class*="hero"] h1').first().text().trim() ||
    '';

  const heroSubtext = $('h1 + p, .hero p, [class*="hero"] p').first().text().trim() ||
    $('main > p').first().text().trim() ||
    '';

  // Extract all headings
  const headings: string[] = [];
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 200) {
      headings.push(text);
    }
  });

  // Extract key paragraphs (skip very short or very long ones)
  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 50 && text.length < 1000) {
      paragraphs.push(text);
    }
  });

  // Extract value propositions (often in lists or cards)
  const valueProps: string[] = [];
  $('[class*="feature"], [class*="benefit"], [class*="value"], [class*="card"]').each((_, el) => {
    const heading = $(el).find('h2, h3, h4').first().text().trim();
    const desc = $(el).find('p').first().text().trim();
    if (heading && desc) {
      valueProps.push(`${heading}: ${desc}`);
    }
  });

  // Also check list items that might be benefits
  $('ul li, ol li').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20 && text.length < 200 && !valueProps.includes(text)) {
      // Check if it looks like a benefit/feature
      if (/^[A-Z]/.test(text) || $(el).find('strong, b').length > 0) {
        valueProps.push(text);
      }
    }
  });

  // Extract testimonials/quotes
  const testimonials: string[] = [];
  $('blockquote, [class*="testimonial"], [class*="quote"], [class*="review"]').each((_, el) => {
    const text = $(el).find('p').text().trim() || $(el).text().trim();
    if (text.length > 30 && text.length < 500) {
      testimonials.push(text);
    }
  });

  // Extract CTA text
  const ctas: string[] = [];
  $('a.btn, a.button, button, [class*="cta"], [class*="btn"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 2 && text.length < 50) {
      ctas.push(text);
    }
  });

  // Extract industry keywords from meta
  const keywords = $('meta[name="keywords"]').attr('content') || '';

  // Extract social links for context
  const socialLinks: string[] = [];
  $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"], a[href*="youtube"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) socialLinks.push(href);
  });

  // Extract contact info patterns
  const contactInfo = {
    email: extractEmails($),
    phone: extractPhones($),
    address: extractAddress($),
  };

  // Extract company/about text
  const aboutText = $('[class*="about"] p, #about p, .about-us p')
    .map((_, el) => $(el).text().trim())
    .get()
    .join(' ')
    .slice(0, 1000);

  return {
    title,
    description,
    heroHeading,
    heroSubtext,
    headings: [...new Set(headings)].slice(0, 20),
    paragraphs: paragraphs.slice(0, 15),
    valueProps: [...new Set(valueProps)].slice(0, 10),
    testimonials: [...new Set(testimonials)].slice(0, 5),
    ctas: [...new Set(ctas)].slice(0, 10),
    keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
    socialLinks: [...new Set(socialLinks)],
    contactInfo,
    aboutText,
  };
}

/**
 * Extract emails from the page
 */
function extractEmails($: CheerioAPI): string[] {
  const emails: string[] = [];

  // From mailto links
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const email = href.replace('mailto:', '').split('?')[0];
    if (email) emails.push(email);
  });

  // From text content (be careful with this pattern)
  const bodyText = $('body').text();
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const foundEmails = bodyText.match(emailPattern) || [];
  emails.push(...foundEmails);

  return [...new Set(emails)].slice(0, 3);
}

/**
 * Extract phone numbers from the page
 */
function extractPhones($: CheerioAPI): string[] {
  const phones: string[] = [];

  // From tel links
  $('a[href^="tel:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const phone = href.replace('tel:', '');
    if (phone) phones.push(phone);
  });

  return [...new Set(phones)].slice(0, 3);
}

/**
 * Extract address from the page
 */
function extractAddress($: CheerioAPI): string | undefined {
  // Look for address element
  const addressEl = $('address').first().text().trim();
  if (addressEl) return addressEl;

  // Look for schema.org address
  const schemaAddress = $('[itemprop="address"]').first().text().trim();
  if (schemaAddress) return schemaAddress;

  // Look for common address class names
  const addressClass = $('[class*="address"]').first().text().trim();
  if (addressClass && addressClass.length < 200) return addressClass;

  return undefined;
}

/**
 * Generate a summary suitable for AI analysis
 */
export function generateContentSummary(content: ExtractedContent): string {
  const parts: string[] = [];

  if (content.title) {
    parts.push(`Title: ${content.title}`);
  }

  if (content.description) {
    parts.push(`Description: ${content.description}`);
  }

  if (content.heroHeading) {
    parts.push(`Main Heading: ${content.heroHeading}`);
  }

  if (content.heroSubtext) {
    parts.push(`Subheading: ${content.heroSubtext}`);
  }

  if (content.headings.length > 0) {
    parts.push(`Key Sections: ${content.headings.slice(0, 10).join(', ')}`);
  }

  if (content.valueProps.length > 0) {
    parts.push(`Value Propositions:\n${content.valueProps.slice(0, 5).map((v) => `- ${v}`).join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    parts.push(`Key Content:\n${content.paragraphs.slice(0, 5).join('\n\n')}`);
  }

  if (content.aboutText) {
    parts.push(`About: ${content.aboutText}`);
  }

  if (content.ctas.length > 0) {
    parts.push(`Call-to-Actions: ${content.ctas.slice(0, 5).join(', ')}`);
  }

  return parts.join('\n\n');
}

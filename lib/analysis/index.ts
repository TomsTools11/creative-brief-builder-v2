// Main website analyzer
import { nanoid } from 'nanoid';
import { fetchPage, extractStructuredContent } from './html-fetcher';
import { extractColors } from './color-extractor';
import { extractFonts } from './font-extractor';
import { extractLogos } from './logo-extractor';
import { extractContent, generateContentSummary } from './content-extractor';
import { getBrandNameFromUrl } from '@/lib/utils/url-utils';
import type { AnalysisResult } from '@/types/analysis';

export interface AnalysisProgress {
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
}

export type ProgressCallback = (progress: AnalysisProgress) => void;

/**
 * Analyze a website and extract brand information
 */
export async function analyzeWebsite(
  url: string,
  onProgress?: ProgressCallback
): Promise<AnalysisResult> {
  const totalSteps = 6;

  const reportProgress = (step: number, message: string) => {
    if (onProgress) {
      onProgress({
        step,
        totalSteps,
        message,
        percentage: Math.round((step / totalSteps) * 100),
      });
    }
  };

  // Step 1: Fetch the page
  reportProgress(1, 'Fetching website content...');
  const page = await fetchPage(url);

  // Step 2: Extract colors
  reportProgress(2, 'Analyzing color palette...');
  const colors = extractColors(page.$, page.styles);

  // Step 3: Extract fonts
  reportProgress(3, 'Detecting typography...');
  const fonts = extractFonts(page.$, page.styles);

  // Step 4: Extract logos
  reportProgress(4, 'Finding logos and brand assets...');
  const logos = extractLogos(page.$, url);

  // Step 5: Extract content
  reportProgress(5, 'Extracting content and messaging...');
  const content = extractContent(page.$);
  const structuredContent = extractStructuredContent(page.$);

  // Step 6: Compile results
  reportProgress(6, 'Compiling analysis results...');

  // Determine brand name
  const brandName = content.title
    ? content.title.split('|')[0].split('-')[0].split('–')[0].trim()
    : getBrandNameFromUrl(url);

  // Try to detect industry from content
  const industry = detectIndustry(content, structuredContent);

  const result: AnalysisResult = {
    id: nanoid(),
    url,
    brandName,
    tagline: content.heroSubtext || content.description?.slice(0, 100),
    industry,
    colors,
    fonts,
    logos,
    content,
    analyzedAt: new Date(),
  };

  return result;
}

/**
 * Detect likely industry from content
 */
function detectIndustry(
  content: ReturnType<typeof extractContent>,
  structuredContent: ReturnType<typeof extractStructuredContent>
): string | undefined {
  const allText = [
    content.title,
    content.description,
    content.heroHeading,
    content.heroSubtext,
    ...content.headings,
    ...content.paragraphs,
    ...content.valueProps,
    content.aboutText,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Industry keyword mappings
  const industryKeywords: Record<string, string[]> = {
    'Technology / Software': ['software', 'saas', 'platform', 'api', 'developer', 'code', 'tech', 'digital', 'cloud', 'app'],
    'Finance / Fintech': ['finance', 'banking', 'payment', 'credit', 'loan', 'investment', 'money', 'fintech', 'financial'],
    'E-commerce / Retail': ['shop', 'store', 'buy', 'cart', 'product', 'retail', 'commerce', 'marketplace'],
    'Healthcare': ['health', 'medical', 'patient', 'care', 'hospital', 'clinic', 'wellness', 'healthcare'],
    'Education': ['learn', 'education', 'course', 'student', 'training', 'school', 'university', 'teaching'],
    'Real Estate': ['property', 'real estate', 'home', 'house', 'apartment', 'rent', 'mortgage'],
    'Marketing / Advertising': ['marketing', 'advertising', 'brand', 'campaign', 'seo', 'content', 'social media'],
    'Travel / Hospitality': ['travel', 'hotel', 'booking', 'flight', 'vacation', 'tourism', 'hospitality'],
    'Food / Restaurant': ['food', 'restaurant', 'menu', 'dining', 'delivery', 'cuisine', 'chef'],
    'Entertainment / Media': ['entertainment', 'media', 'video', 'music', 'streaming', 'content', 'creative'],
    'Professional Services': ['consulting', 'legal', 'accounting', 'professional', 'service', 'agency'],
    'Manufacturing': ['manufacturing', 'industrial', 'factory', 'production', 'supply chain'],
  };

  // Score each industry
  const scores: Record<string, number> = {};
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    scores[industry] = keywords.reduce((score, keyword) => {
      const matches = (allText.match(new RegExp(keyword, 'gi')) || []).length;
      return score + matches;
    }, 0);
  }

  // Find highest scoring industry
  const sortedIndustries = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedIndustries.length > 0 && sortedIndustries[0][1] >= 3) {
    return sortedIndustries[0][0];
  }

  return undefined;
}

// Re-export utilities
export { generateContentSummary } from './content-extractor';
export { fetchPage } from './html-fetcher';

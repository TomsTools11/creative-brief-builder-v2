// Claude AI client for brand content generation
import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult } from '@/types/analysis';
import type { CompleteBrandData, BrandStrategy, MessagingFrameworks, VerbalExpression, LogoGuidelines, TypographyGuidelines, PatternGuidelines } from '@/types/brand';
import {
  getBrandStrategySystemPrompt,
  getBrandPositioningPrompt,
  getBrandPersonalityPrompt,
  getMessagingFrameworkPrompt,
  getVoiceTonePrompt,
  getTypographyGuidelinesPrompt,
  getColorGuidelinesPrompt,
  getLogoGuidelinesPrompt,
  getAppositivePrompt,
} from './prompts';
import { nanoid } from 'nanoid';

// Initialize Anthropic client
const anthropic = new Anthropic();

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
  section?: string;
}

export type GenerationProgressCallback = (progress: GenerationProgress) => void;

/**
 * Sanitize content by removing control characters and normalizing whitespace
 */
function sanitizeJsonContent(content: string): string {
  return content
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove BOM if present
    .replace(/^\uFEFF/, '')
    .trim();
}

/**
 * Try to repair common JSON issues
 */
function attemptJsonRepair(json: string): string {
  let repaired = json;

  // Remove trailing commas before ] or }
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Replace smart quotes with regular quotes
  repaired = repaired.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
  repaired = repaired.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

  // Replace en-dash and em-dash with regular dash
  repaired = repaired.replace(/[\u2013\u2014]/g, '-');

  // Remove any invisible characters that might be hiding
  repaired = repaired.replace(/[\u200B\u200C\u200D\uFEFF\u00A0]/g, '');

  return repaired;
}

/**
 * Find balanced JSON object or array in content
 */
function findBalancedJson(content: string, startChar: '{' | '['): string | null {
  const endChar = startChar === '{' ? '}' : ']';
  const startIndex = content.indexOf(startChar);
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\' && inString) {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === startChar) {
      depth++;
    } else if (char === endChar) {
      depth--;
      if (depth === 0) {
        return content.substring(startIndex, i + 1);
      }
    }
  }

  return null;
}

/**
 * Parse JSON from Claude's response, handling various formats
 */
function parseJsonResponse<T>(content: string): T {
  // First, sanitize the content
  const sanitized = sanitizeJsonContent(content);

  // Strategy 1: Try to extract JSON from markdown code blocks (```json or ```)
  const codeBlockMatch = sanitized.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // Continue to other strategies
    }
  }

  // Strategy 2: Try to find a balanced JSON object
  const jsonObject = findBalancedJson(sanitized, '{');
  if (jsonObject) {
    // First try direct parse
    try {
      return JSON.parse(jsonObject) as T;
    } catch {
      // Try with repair
      try {
        const repaired = attemptJsonRepair(jsonObject);
        return JSON.parse(repaired) as T;
      } catch (e) {
        console.error('Found JSON object but failed to parse:', (e as Error).message);
        // Continue to other strategies
      }
    }
  }

  // Strategy 3: Try to find a balanced JSON array
  const jsonArray = findBalancedJson(sanitized, '[');
  if (jsonArray) {
    try {
      return JSON.parse(jsonArray) as T;
    } catch {
      // Try with repair
      try {
        const repaired = attemptJsonRepair(jsonArray);
        return JSON.parse(repaired) as T;
      } catch {
        // Continue to next strategy
      }
    }
  }

  // Strategy 4: Try parsing the sanitized content directly
  try {
    return JSON.parse(sanitized) as T;
  } catch {
    // Try with repair
    try {
      const repaired = attemptJsonRepair(sanitized);
      return JSON.parse(repaired) as T;
    } catch (parseError) {
      // Log detailed debugging information
      console.error('=== JSON Parse Failure Debug ===');
      console.error('Original content length:', content.length);
      console.error('Sanitized content length:', sanitized.length);
      console.error('Content preview (first 500 chars):', sanitized.substring(0, 500));
      console.error('Content preview (last 200 chars):', sanitized.substring(Math.max(0, sanitized.length - 200)));
      console.error('Parse error:', (parseError as Error).message);

      // Try to identify the issue
      if (sanitized.startsWith('{') && !sanitized.endsWith('}')) {
        throw new Error(`JSON appears truncated - starts with { but doesn't end with }. Length: ${sanitized.length}`);
      }
      if (sanitized.startsWith('[') && !sanitized.endsWith(']')) {
        throw new Error(`JSON array appears truncated - starts with [ but doesn't end with ]. Length: ${sanitized.length}`);
      }

      throw new Error(`Failed to parse AI response as JSON. Response started with: "${sanitized.substring(0, 100)}..."`);
    }
  }
}

/**
 * Make a Claude API call with retry logic
 */
async function callClaude<T>(
  systemPrompt: string,
  userPrompt: string,
  maxRetries = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const textContent = response.content.find((block) => block.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in response');
      }

      return parseJsonResponse<T>(textContent.text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Failed to generate content');
}

/**
 * Generate complete brand guidelines from analysis data
 */
export async function generateBrandGuidelines(
  analysis: AnalysisResult,
  onProgress?: GenerationProgressCallback
): Promise<CompleteBrandData> {
  const totalSteps = 7;
  const systemPrompt = getBrandStrategySystemPrompt();

  const reportProgress = (step: number, message: string, section?: string) => {
    if (onProgress) {
      onProgress({
        step,
        totalSteps,
        message,
        percentage: Math.round((step / totalSteps) * 100),
        section,
      });
    }
  };

  // Step 1: Generate brand positioning
  reportProgress(1, 'Generating brand positioning...', 'positioning');
  const positioning = await callClaude<{
    positioning: BrandStrategy['positioning'];
    mission: BrandStrategy['mission'];
    vision: BrandStrategy['vision'];
    brandPromise: BrandStrategy['brandPromise'];
    boilerplate: string;
  }>(systemPrompt, getBrandPositioningPrompt(analysis));

  // Step 2: Generate brand personality
  reportProgress(2, 'Defining brand personality...', 'personality');
  const personality = await callClaude<{
    personalityTraits: BrandStrategy['personality'];
    brandArchetype: BrandStrategy['archetype'];
  }>(systemPrompt, getBrandPersonalityPrompt(analysis));

  // Step 3: Generate messaging framework
  reportProgress(3, 'Creating messaging framework...', 'messaging');
  const messaging = await callClaude<{
    brandPillars: MessagingFrameworks['pillars'];
    valuePropositions: MessagingFrameworks['valuePropositions'];
    keyMessages: MessagingFrameworks['keyMessages'];
    elevator: MessagingFrameworks['elevatorPitches'];
  }>(systemPrompt, getMessagingFrameworkPrompt(analysis));

  // Step 4: Generate voice and tone
  reportProgress(4, 'Establishing voice and tone...', 'voice');
  const voiceTone = await callClaude<{
    voiceAttributes: VerbalExpression['voiceTone'];
    toneSpectrum: VerbalExpression['toneSpectrum'];
    writingStyle: VerbalExpression['writingStyle'];
    styleRules: VerbalExpression['styleRules'];
  }>(systemPrompt, getVoiceTonePrompt(analysis));

  // Step 5: Generate typography guidelines
  reportProgress(5, 'Creating typography guidelines...', 'typography');
  const typography = await callClaude<{
    primaryTypeface: TypographyGuidelines['primaryTypeface'];
    secondaryTypeface: TypographyGuidelines['secondaryTypeface'];
    hierarchy: TypographyGuidelines['hierarchy'];
    guidelines: TypographyGuidelines['guidelines'];
  }>(systemPrompt, getTypographyGuidelinesPrompt(analysis));

  // Step 6: Generate logo and color guidelines
  reportProgress(6, 'Defining visual guidelines...', 'visual');
  const [logoGuidelines, colorGuidelines] = await Promise.all([
    callClaude<{
      logoVersions: LogoGuidelines['versions'];
      clearSpace: LogoGuidelines['clearSpace'];
      donts: LogoGuidelines['donts'];
      placement: LogoGuidelines['placement'];
    }>(systemPrompt, getLogoGuidelinesPrompt(analysis)),
    callClaude<{
      colorPrinciples: string[];
      primaryUsage: Record<string, string[]>;
      combinations: Array<{ name: string; background: string; text: string; accent: string; usage: string }>;
      accessibility: { minimumContrast: string; guidelines: string[] };
    }>(systemPrompt, getColorGuidelinesPrompt(analysis)),
  ]);

  // Step 7: Generate appositives
  reportProgress(7, 'Finalizing brand elements...', 'final');
  const appositives = await callClaude<{
    appositives: VerbalExpression['appositives'];
  }>(systemPrompt, getAppositivePrompt(analysis));

  // Compile the complete brand data
  const brandData: CompleteBrandData = {
    id: nanoid(),
    url: analysis.url,
    brandName: analysis.brandName,
    tagline: analysis.tagline,
    industry: analysis.industry,
    year: new Date().getFullYear(),
    colors: analysis.colors,
    fonts: analysis.fonts,
    logos: analysis.logos,
    brandStrategy: {
      positioning: positioning.positioning,
      mission: positioning.mission,
      vision: positioning.vision,
      personality: personality.personalityTraits,
      archetype: personality.brandArchetype,
      brandPromise: positioning.brandPromise,
      boilerplate: positioning.boilerplate,
    },
    messaging: {
      pillars: messaging.brandPillars,
      valuePropositions: messaging.valuePropositions,
      keyMessages: messaging.keyMessages,
      elevatorPitches: messaging.elevator,
    },
    verbalExpression: {
      voiceTone: voiceTone.voiceAttributes,
      toneSpectrum: voiceTone.toneSpectrum,
      writingStyle: voiceTone.writingStyle,
      styleRules: voiceTone.styleRules,
      appositives: appositives.appositives,
    },
    logoGuidelines: {
      versions: logoGuidelines.logoVersions,
      clearSpace: logoGuidelines.clearSpace,
      donts: logoGuidelines.donts,
      placement: logoGuidelines.placement,
    },
    colorGuidelines: {
      principles: colorGuidelines.colorPrinciples,
      usage: colorGuidelines.primaryUsage,
      combinations: colorGuidelines.combinations,
      accessibility: colorGuidelines.accessibility,
    },
    typographyGuidelines: {
      primaryTypeface: typography.primaryTypeface,
      secondaryTypeface: typography.secondaryTypeface,
      hierarchy: typography.hierarchy,
      guidelines: typography.guidelines,
    },
    patternGuidelines: {
      description: 'Patterns can be derived from the brand colors and logo elements to create visual texture and interest.',
      usage: ['Background textures', 'Section dividers', 'Presentation slides', 'Marketing materials'],
      examples: [],
    },
    createdAt: new Date(),
  };

  return brandData;
}

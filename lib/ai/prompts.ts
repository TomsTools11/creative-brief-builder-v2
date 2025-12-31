// AI prompts for brand guidelines generation
import type { AnalysisResult } from '@/types/analysis';
import { generateContentSummary } from '@/lib/analysis';

/**
 * Generate the system prompt for brand strategy generation
 */
export function getBrandStrategySystemPrompt(): string {
  return `You are an expert brand strategist and copywriter with 20+ years of experience creating comprehensive brand guidelines for Fortune 500 companies and innovative startups. Your expertise spans brand positioning, messaging frameworks, verbal identity, and creative direction.

Your task is to generate professional brand strategy content based on website analysis data. The output should be sophisticated, actionable, and reflect deep brand thinking.

Guidelines for your responses:
- Write in a confident, professional tone
- Be specific and avoid generic statements
- Create content that feels authentic to the brand being analyzed
- Use industry-appropriate language and terminology
- Ensure all content is unique and tailored to the specific brand

CRITICAL: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. Do not include markdown code fences. Do not include explanations. Your entire response must be a single valid JSON object that can be parsed directly.`;
}

/**
 * Generate prompt for brand positioning
 */
export function getBrandPositioningPrompt(analysis: AnalysisResult): string {
  const contentSummary = generateContentSummary(analysis.content);

  return `Based on the following website analysis for "${analysis.brandName}", generate comprehensive brand positioning content.

WEBSITE ANALYSIS:
URL: ${analysis.url}
Industry: ${analysis.industry || 'Not determined'}
Tagline: ${analysis.tagline || 'None found'}

EXTRACTED CONTENT:
${contentSummary}

Generate the following brand positioning elements as JSON:

{
  "positioning": {
    "statement": "A 2-3 sentence brand positioning statement that defines the brand's unique place in the market",
    "targetAudience": "Description of the primary target audience (2-3 sentences)",
    "marketCategory": "The market category this brand operates in",
    "competitiveAdvantage": "The primary competitive advantage or differentiator",
    "reasonToBelieve": "Why customers should believe this positioning"
  },
  "mission": {
    "statement": "A concise, inspiring mission statement (1-2 sentences)",
    "explanation": "Brief explanation of the mission's meaning and importance"
  },
  "vision": {
    "statement": "An aspirational vision statement describing the future state",
    "timeframe": "Implied timeframe for this vision"
  },
  "brandPromise": {
    "promise": "The core promise the brand makes to customers",
    "delivery": "How the brand delivers on this promise"
  },
  "boilerplate": "A 3-4 sentence company description suitable for press releases and formal communications"
}

Ensure all content is:
1. Specific to ${analysis.brandName} and their apparent focus
2. Professional and sophisticated in tone
3. Actionable and meaningful (not generic platitudes)
4. Consistent with the messaging found on their website`;
}

/**
 * Generate prompt for brand personality
 */
export function getBrandPersonalityPrompt(analysis: AnalysisResult): string {
  const contentSummary = generateContentSummary(analysis.content);

  return `Based on the website analysis for "${analysis.brandName}", generate brand personality attributes.

WEBSITE ANALYSIS:
Brand: ${analysis.brandName}
Industry: ${analysis.industry || 'Not determined'}
Tagline: ${analysis.tagline || 'None found'}

CONTENT SUMMARY:
${contentSummary}

Generate brand personality as JSON:

{
  "personalityTraits": [
    {
      "trait": "Primary personality trait (one word)",
      "description": "What this means for the brand (1-2 sentences)",
      "behaviors": ["How this manifests in brand behavior", "Another behavioral example", "Third example"]
    },
    // Include exactly 5 personality traits
  ],
  "brandArchetype": {
    "primary": "The primary brand archetype (e.g., Hero, Creator, Sage, Explorer, etc.)",
    "secondary": "A secondary archetype that influences the brand",
    "description": "How these archetypes manifest in the brand's personality"
  }
}

The personality traits should:
1. Be derived from the tone and content of the website
2. Feel authentic to what ${analysis.brandName} represents
3. Be distinct and not overlap significantly
4. Include both emotional and functional attributes`;
}

/**
 * Generate prompt for messaging framework
 */
export function getMessagingFrameworkPrompt(analysis: AnalysisResult): string {
  const contentSummary = generateContentSummary(analysis.content);

  return `Based on the website analysis for "${analysis.brandName}", create a comprehensive messaging framework.

WEBSITE ANALYSIS:
Brand: ${analysis.brandName}
Industry: ${analysis.industry || 'Not determined'}
Tagline: ${analysis.tagline || 'None found'}

CONTENT SUMMARY:
${contentSummary}

VALUE PROPOSITIONS FOUND:
${analysis.content.valueProps.slice(0, 5).map((v, i) => `${i + 1}. ${v}`).join('\n') || 'None extracted'}

CALLS TO ACTION FOUND:
${analysis.content.ctas.slice(0, 5).join(', ') || 'None extracted'}

Generate the messaging framework as JSON:

{
  "brandPillars": [
    {
      "name": "Short pillar name (2-4 words)",
      "description": "What this pillar represents (2-3 sentences)",
      "proofPoints": ["Specific evidence/capability", "Another proof point", "Third proof point"]
    }
    // Include exactly 3 brand pillars
  ],
  "valuePropositions": [
    {
      "headline": "Compelling value proposition headline",
      "subheadline": "Supporting statement that elaborates on the value",
      "audience": "Which audience segment this resonates with most"
    }
    // Include 3-4 value propositions
  ],
  "keyMessages": [
    {
      "message": "A key message statement",
      "context": "When/where to use this message",
      "audience": "Target audience for this message"
    }
    // Include 5-6 key messages
  ],
  "elevator": {
    "15second": "A 15-second elevator pitch (2-3 sentences)",
    "30second": "A 30-second elevator pitch (4-5 sentences)",
    "60second": "A 60-second pitch with more detail"
  }
}

Ensure messaging:
1. Is rooted in the actual content found on ${analysis.brandName}'s website
2. Addresses clear customer pain points or needs
3. Differentiates from generic industry messaging
4. Uses language consistent with the brand's apparent voice`;
}

/**
 * Generate prompt for voice and tone guidelines
 */
export function getVoiceTonePrompt(analysis: AnalysisResult): string {
  const sampleContent = [
    analysis.content.heroHeading,
    analysis.content.heroSubtext,
    ...analysis.content.paragraphs.slice(0, 3),
  ].filter(Boolean).join('\n\n');

  return `Based on the website content for "${analysis.brandName}", define voice and tone guidelines.

SAMPLE CONTENT FROM WEBSITE:
${sampleContent || 'Limited content available'}

CTAs AND HEADINGS:
${analysis.content.headings.slice(0, 10).join('\n')}
${analysis.content.ctas.slice(0, 5).join(', ')}

Generate voice and tone guidelines as JSON:

{
  "voiceAttributes": [
    {
      "attribute": "Voice attribute (e.g., Confident, Approachable)",
      "description": "What this means for the brand voice",
      "doExample": "Example of content that embodies this",
      "dontExample": "Example of what to avoid"
    }
    // Include 4-5 voice attributes
  ],
  "toneSpectrum": [
    {
      "dimension": "Dimension name (e.g., Formal vs. Casual)",
      "position": 65,
      "description": "Where the brand sits on this spectrum and why"
    }
    // Include 4 tone spectrum dimensions: Formal/Casual, Serious/Playful, Technical/Simple, Reserved/Enthusiastic
  ],
  "writingStyle": {
    "sentenceLength": "Guidance on sentence length",
    "vocabulary": "Guidance on vocabulary choices",
    "punctuation": "Notes on punctuation style",
    "formatting": "Preferences for formatting content"
  },
  "styleRules": [
    {
      "category": "Category (e.g., Grammar, Capitalization, Numbers)",
      "rule": "The specific rule",
      "example": "Example of correct usage"
    }
    // Include 6-8 style rules
  ]
}

The voice and tone should:
1. Be derived from actual writing patterns on the website
2. Feel achievable and maintainable for content creators
3. Distinguish ${analysis.brandName} from competitors
4. Be specific enough to guide real writing decisions`;
}

/**
 * Generate prompt for typography guidelines
 */
export function getTypographyGuidelinesPrompt(analysis: AnalysisResult): string {
  const fontInfo = analysis.fonts.map((f) =>
    `${f.family} (${f.category}, used for ${f.usage}, weights: ${f.weights.join(', ') || 'default'})`
  ).join('\n');

  return `Based on the typography detected on "${analysis.brandName}"'s website, create typography guidelines.

DETECTED FONTS:
${fontInfo || 'No specific fonts detected'}

Generate typography guidelines as JSON:

{
  "primaryTypeface": {
    "name": "${analysis.fonts[0]?.family || 'Inter'}",
    "usage": "Primary usage description",
    "weights": ${JSON.stringify(analysis.fonts[0]?.weights || ['400', '500', '600', '700'])},
    "characteristics": "What makes this typeface appropriate for the brand"
  },
  "secondaryTypeface": {
    "name": "${analysis.fonts[1]?.family || analysis.fonts[0]?.family || 'Inter'}",
    "usage": "Secondary usage description",
    "weights": ${JSON.stringify(analysis.fonts[1]?.weights || ['400', '600'])},
    "characteristics": "How this complements the primary typeface"
  },
  "hierarchy": {
    "h1": { "size": "48-64px", "weight": "700", "lineHeight": "1.1", "usage": "Page titles and hero headings" },
    "h2": { "size": "36-40px", "weight": "600", "lineHeight": "1.2", "usage": "Section headings" },
    "h3": { "size": "24-28px", "weight": "600", "lineHeight": "1.3", "usage": "Subsection headings" },
    "h4": { "size": "18-20px", "weight": "600", "lineHeight": "1.4", "usage": "Card titles and labels" },
    "body": { "size": "16px", "weight": "400", "lineHeight": "1.6", "usage": "Paragraph text and general content" },
    "small": { "size": "14px", "weight": "400", "lineHeight": "1.5", "usage": "Captions, labels, and secondary text" }
  },
  "guidelines": [
    "Specific typography guideline",
    "Another guideline",
    // Include 4-6 guidelines
  ]
}`;
}

/**
 * Generate prompt for color guidelines
 */
export function getColorGuidelinesPrompt(analysis: AnalysisResult): string {
  const colorInfo = analysis.colors.map((c) =>
    `${c.name} (${c.hex}) - ${c.usage}`
  ).join('\n');

  return `Based on the colors detected on "${analysis.brandName}"'s website, create color usage guidelines.

DETECTED COLORS:
${colorInfo || 'Limited colors detected'}

Generate color guidelines as JSON:

{
  "colorPrinciples": [
    "Guiding principle for color usage",
    "Another principle",
    // Include 3-4 principles
  ],
  "primaryUsage": {
    "backgrounds": ["When to use which colors for backgrounds"],
    "text": ["Text color guidelines"],
    "accents": ["How to use accent colors"],
    "interactive": ["Colors for buttons, links, and interactive elements"]
  },
  "combinations": [
    {
      "name": "Combination name (e.g., Primary Light)",
      "background": "${analysis.colors[0]?.hex || '#FFFFFF'}",
      "text": "${analysis.colors.find(c => c.usage === 'text')?.hex || '#070D59'}",
      "accent": "${analysis.colors.find(c => c.usage === 'accent')?.hex || '#0066FF'}",
      "usage": "When to use this combination"
    }
    // Include 3-4 color combinations
  ],
  "accessibility": {
    "minimumContrast": "4.5:1 for normal text, 3:1 for large text",
    "guidelines": ["Accessibility guideline", "Another guideline"]
  }
}`;
}

/**
 * Generate prompt for logo guidelines
 */
export function getLogoGuidelinesPrompt(analysis: AnalysisResult): string {
  return `Based on the brand analysis for "${analysis.brandName}", create logo usage guidelines.

BRAND CONTEXT:
Name: ${analysis.brandName}
Industry: ${analysis.industry || 'Not specified'}

Generate logo guidelines as JSON:

{
  "logoVersions": [
    { "name": "Primary Logo", "usage": "Main logo for most applications", "background": "Light backgrounds" },
    { "name": "Reversed Logo", "usage": "For dark backgrounds", "background": "Dark backgrounds" },
    { "name": "Icon/Mark", "usage": "Favicon, app icon, small spaces", "background": "Any" },
    { "name": "Horizontal Lockup", "usage": "Wide format applications", "background": "Light backgrounds" }
  ],
  "clearSpace": {
    "rule": "Maintain clear space equal to the height of the logomark on all sides",
    "minimumSize": "The logo should never appear smaller than 24px in height for digital or 0.5 inches for print"
  },
  "donts": [
    "Don't stretch or distort the logo",
    "Don't change the logo colors outside of approved versions",
    "Don't add effects like shadows or gradients",
    "Don't place the logo on busy backgrounds",
    "Don't rotate the logo",
    "Don't rearrange logo elements"
  ],
  "placement": {
    "preferred": ["Top left of documents", "Center of presentations", "Above the fold on websites"],
    "cobranding": "When appearing with partner logos, maintain equal visual weight and clear separation"
  }
}`;
}

/**
 * Combine all content into final brand data prompt
 */
export function getAppositivePrompt(analysis: AnalysisResult): string {
  return `Generate a list of descriptive appositives (descriptive phrases) for "${analysis.brandName}" that can be used in various communications.

BRAND CONTEXT:
Name: ${analysis.brandName}
Industry: ${analysis.industry || 'Not specified'}
Tagline: ${analysis.tagline || 'None'}

Generate appositives as JSON:

{
  "appositives": [
    {
      "phrase": "a leading [industry] company",
      "usage": "Formal communications and press releases",
      "tone": "Professional"
    },
    // Include 6-8 appositives with varying tones (professional, conversational, bold, etc.)
  ]
}

The appositives should:
1. Be versatile for different communication contexts
2. Highlight different aspects of the brand
3. Range from formal to conversational
4. Be authentic to what ${analysis.brandName} actually does`;
}

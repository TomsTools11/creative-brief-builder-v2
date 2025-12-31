import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';
import { baseStyles, colors } from './styles';
import type { CompleteBrandData } from '@/types/brand';

interface BrandGuidelinesPDFProps {
  brandData: CompleteBrandData;
}

// Helper to get brand colors
function getBrandColors(brandData: CompleteBrandData) {
  const primaryColor = brandData.colors.find((c) => c.usage === 'primary')?.hex || colors.primary;
  const secondaryColor = brandData.colors.find((c) => c.usage === 'secondary')?.hex || colors.secondary;
  return { primaryColor, secondaryColor };
}

// Helper to check if an image URL is valid for PDF rendering
// @react-pdf/renderer only supports PNG, JPG, and base64 (not SVG)
function isValidPdfImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  // Reject SVG images (including data URIs)
  if (url.includes('image/svg+xml') || url.endsWith('.svg')) return false;
  // Accept base64 PNG/JPG, or HTTP URLs ending in supported formats
  if (url.startsWith('data:image/png') || url.startsWith('data:image/jpeg')) return true;
  if (url.startsWith('http') && (url.match(/\.(png|jpg|jpeg)(\?|$)/i))) return true;
  // For other http URLs, assume they might be valid
  if (url.startsWith('http')) return true;
  return false;
}

// Get a valid logo URL or null
function getValidLogoUrl(logos: { url: string }[], index: number): string | null {
  const logo = logos[index];
  return logo && isValidPdfImageUrl(logo.url) ? logo.url : null;
}

// Cover Page Component
function CoverPage({ brandData }: { brandData: CompleteBrandData }) {
  const { primaryColor, secondaryColor } = getBrandColors(brandData);
  const brandNameParts = brandData.brandName.split(' ');
  const firstWord = brandNameParts[0];
  const restWords = brandNameParts.slice(1).join(' ');
  const logoUrl = getValidLogoUrl(brandData.logos, 0);

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.coverPage, { backgroundColor: secondaryColor }]}>
        {logoUrl && (
          <Image
            src={logoUrl}
            style={{ width: 150, height: 75, marginBottom: 40 }}
          />
        )}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: colors.white }}>
            {firstWord}{' '}
          </Text>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: primaryColor }}>
            {restWords || 'Brand'}
          </Text>
        </View>
        {brandData.tagline && (
          <Text style={[baseStyles.coverSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>
            {brandData.tagline}
          </Text>
        )}
        <Text style={[baseStyles.coverYear, { color: 'rgba(255,255,255,0.5)' }]}>
          Brand Guidelines {brandData.year}
        </Text>
      </View>
      <View style={baseStyles.footer}>
        <Text style={[baseStyles.pageNumber, { color: 'rgba(255,255,255,0.5)' }]}>{brandData.brandName}</Text>
        <Text style={[baseStyles.pageNumber, { color: 'rgba(255,255,255,0.5)' }]}>1</Text>
      </View>
    </Page>
  );
}

// Brand Strategy Page
function BrandStrategyPage({ brandData }: { brandData: CompleteBrandData }) {
  const { brandStrategy } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const positioning = brandStrategy?.positioning ?? { statement: '', targetAudience: '', marketCategory: '' };
  const mission = brandStrategy?.mission ?? { statement: '', explanation: '' };
  const vision = brandStrategy?.vision ?? { statement: '', timeframe: '' };

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.sectionHeader, { backgroundColor: secondaryColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={baseStyles.sectionHeaderText}>Brand </Text>
          <Text style={[baseStyles.sectionHeaderAccent, { color: primaryColor }]}>Strategy</Text>
        </View>
        <Text style={baseStyles.sectionHeaderSubtext}>
          The foundation of how {brandData.brandName} connects with the world.
        </Text>
      </View>

      {/* Positioning */}
      <View style={baseStyles.section}>
        <Text style={baseStyles.labelUppercase}>Brand Positioning</Text>
        {positioning.statement ? (
          <View style={[baseStyles.quote, { borderLeftColor: primaryColor }]}>
            <Text style={baseStyles.quoteText}>
              "{positioning.statement}"
            </Text>
          </View>
        ) : (
          <Text style={baseStyles.body}>Brand positioning statement not available.</Text>
        )}
        <View style={baseStyles.row}>
          <View style={[baseStyles.col2, baseStyles.cardBordered]}>
            <Text style={baseStyles.labelUppercase}>Target Audience</Text>
            <Text style={baseStyles.body}>{positioning.targetAudience || 'Not specified'}</Text>
          </View>
          <View style={[baseStyles.col2, baseStyles.cardBordered]}>
            <Text style={baseStyles.labelUppercase}>Market Category</Text>
            <Text style={baseStyles.body}>{positioning.marketCategory || 'Not specified'}</Text>
          </View>
        </View>
      </View>

      {/* Mission & Vision */}
      <View style={baseStyles.row}>
        <View style={[baseStyles.col2, baseStyles.card]}>
          <Text style={baseStyles.labelUppercase}>Mission</Text>
          <Text style={[baseStyles.body, { fontWeight: 'bold', marginBottom: 8 }]}>
            {mission.statement || 'Mission statement not available'}
          </Text>
          <Text style={baseStyles.small}>{mission.explanation || ''}</Text>
        </View>
        <View style={[baseStyles.col2, baseStyles.card]}>
          <Text style={baseStyles.labelUppercase}>Vision</Text>
          <Text style={[baseStyles.body, { fontWeight: 'bold', marginBottom: 8 }]}>
            {vision.statement || 'Vision statement not available'}
          </Text>
          <Text style={baseStyles.small}>{vision.timeframe ? `Timeframe: ${vision.timeframe}` : ''}</Text>
        </View>
      </View>

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>2</Text>
      </View>
    </Page>
  );
}

// Personality Page
function PersonalityPage({ brandData }: { brandData: CompleteBrandData }) {
  const { brandStrategy } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const archetype = brandStrategy?.archetype ?? { primary: '', secondary: '', description: '' };
  const personality = brandStrategy?.personality ?? [];

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={baseStyles.twoToneTitle}>
        <Text style={[baseStyles.twoToneTitlePrimary, { color: secondaryColor }]}>Brand </Text>
        <Text style={[baseStyles.twoToneTitleAccent, { color: primaryColor }]}>Personality</Text>
      </View>

      {/* Archetype */}
      <View style={[baseStyles.card, { marginBottom: 20 }]}>
        <View style={baseStyles.row}>
          <View style={[baseStyles.badgePrimary, { backgroundColor: primaryColor }]}>
            <Text style={baseStyles.badgePrimaryText}>Primary: {archetype.primary || 'Not specified'}</Text>
          </View>
          <View style={[baseStyles.badge, { marginLeft: 8 }]}>
            <Text style={baseStyles.badgeText}>Secondary: {archetype.secondary || 'Not specified'}</Text>
          </View>
        </View>
        <Text style={[baseStyles.body, { marginTop: 12 }]}>
          {archetype.description || 'Brand archetype description not available.'}
        </Text>
      </View>

      {/* Personality Traits */}
      <Text style={baseStyles.labelUppercase}>Personality Traits</Text>
      {personality.length > 0 ? (
        personality.slice(0, 4).map((trait, index) => (
          <View key={index} style={baseStyles.cardBordered}>
            <Text style={[baseStyles.h4, { color: primaryColor }]}>{trait.trait}</Text>
            <Text style={baseStyles.body}>{trait.description}</Text>
            <View style={[baseStyles.row, { marginTop: 8 }]}>
              {(trait.behaviors || []).slice(0, 3).map((behavior, i) => (
                <View key={i} style={[baseStyles.badge, { marginRight: 4 }]}>
                  <Text style={baseStyles.badgeText}>{behavior}</Text>
                </View>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={baseStyles.cardBordered}>
          <Text style={baseStyles.body}>Personality traits not yet defined.</Text>
        </View>
      )}

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>3</Text>
      </View>
    </Page>
  );
}

// Messaging Page
function MessagingPage({ brandData }: { brandData: CompleteBrandData }) {
  const { messaging } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const pillars = messaging?.pillars ?? [];
  const valuePropositions = messaging?.valuePropositions ?? [];

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.sectionHeader, { backgroundColor: secondaryColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={baseStyles.sectionHeaderText}>Brand </Text>
          <Text style={[baseStyles.sectionHeaderAccent, { color: primaryColor }]}>Messaging</Text>
        </View>
        <Text style={baseStyles.sectionHeaderSubtext}>
          The core messages and frameworks that drive our communication.
        </Text>
      </View>

      {/* Brand Pillars */}
      <Text style={baseStyles.labelUppercase}>Brand Pillars</Text>
      {pillars.length > 0 ? (
        <View style={[baseStyles.row, { marginBottom: 20 }]}>
          {pillars.slice(0, 3).map((pillar, index) => (
            <View key={index} style={[baseStyles.col3, baseStyles.cardBordered]}>
              <View style={[baseStyles.badgePrimary, { backgroundColor: primaryColor, marginBottom: 12 }]}>
                <Text style={baseStyles.badgePrimaryText}>{index + 1}</Text>
              </View>
              <Text style={baseStyles.h4}>{pillar.name}</Text>
              <Text style={[baseStyles.small, { marginBottom: 8 }]}>{pillar.description}</Text>
              {(pillar.proofPoints || []).slice(0, 2).map((point, i) => (
                <View key={i} style={baseStyles.listItem}>
                  <View style={[baseStyles.bullet, { backgroundColor: primaryColor }]} />
                  <Text style={baseStyles.small}>{point}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <View style={[baseStyles.cardBordered, { marginBottom: 20 }]}>
          <Text style={baseStyles.body}>Brand pillars not yet defined.</Text>
        </View>
      )}

      {/* Value Propositions */}
      <Text style={baseStyles.labelUppercase}>Value Propositions</Text>
      {valuePropositions.length > 0 ? (
        valuePropositions.slice(0, 2).map((vp, index) => (
          <View key={index} style={baseStyles.cardBordered}>
            <View style={baseStyles.badge}>
              <Text style={[baseStyles.badgeText, { color: primaryColor }]}>{vp.audience}</Text>
            </View>
            <Text style={[baseStyles.h4, { marginTop: 8, color: secondaryColor }]}>{vp.headline}</Text>
            <Text style={baseStyles.body}>{vp.subheadline}</Text>
          </View>
        ))
      ) : (
        <View style={baseStyles.cardBordered}>
          <Text style={baseStyles.body}>Value propositions not yet defined.</Text>
        </View>
      )}

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>4</Text>
      </View>
    </Page>
  );
}

// Voice & Tone Page
function VoiceTonePage({ brandData }: { brandData: CompleteBrandData }) {
  const { verbalExpression } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const voiceTone = verbalExpression?.voiceTone ?? [];

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.sectionHeader, { backgroundColor: secondaryColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={baseStyles.sectionHeaderText}>Voice & </Text>
          <Text style={[baseStyles.sectionHeaderAccent, { color: primaryColor }]}>Tone</Text>
        </View>
        <Text style={baseStyles.sectionHeaderSubtext}>
          How we communicate and express our brand personality.
        </Text>
      </View>

      {/* We Are / We Are Not */}
      {voiceTone.length > 0 && (
      <View style={baseStyles.row}>
        <View style={[baseStyles.col2, baseStyles.weAreSection]}>
          <Text style={baseStyles.weAreTitle}>✓ We Are</Text>
          {voiceTone.slice(0, 3).map((item, index) => (
            <View key={index} style={baseStyles.weAreItem}>
              <Text style={[baseStyles.small, { fontWeight: 'bold', color: colors.secondary }]}>
                {item.attribute}
              </Text>
              <Text style={[baseStyles.small, { color: colors.greenText }]}>{item.doExample}</Text>
            </View>
          ))}
        </View>
        <View style={[baseStyles.col2, baseStyles.weAreNotSection]}>
          <Text style={baseStyles.weAreNotTitle}>✕ We Are Not</Text>
          {voiceTone.slice(0, 3).map((item, index) => (
            <View key={index} style={baseStyles.weAreItem}>
              <Text style={[baseStyles.small, { fontWeight: 'bold', color: colors.secondary }]}>
                {item.attribute}
              </Text>
              <Text style={[baseStyles.small, { color: colors.redText }]}>{item.dontExample}</Text>
            </View>
          ))}
        </View>
      </View>
      )}

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>5</Text>
      </View>
    </Page>
  );
}

// Color Palette Page
function ColorPalettePage({ brandData }: { brandData: CompleteBrandData }) {
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const brandColors = brandData.colors ?? [];
  const colorPrinciples = brandData.colorGuidelines?.principles ?? [];

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.sectionHeader, { backgroundColor: secondaryColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={baseStyles.sectionHeaderText}>Color </Text>
          <Text style={[baseStyles.sectionHeaderAccent, { color: primaryColor }]}>Palette</Text>
        </View>
        <Text style={baseStyles.sectionHeaderSubtext}>
          Our colors communicate our brand personality and create visual consistency.
        </Text>
      </View>

      {brandColors.length > 0 ? (
        <View style={baseStyles.row}>
          {brandColors.slice(0, 6).map((color, index) => (
            <View key={index} style={{ width: '33.33%', marginBottom: 24, paddingRight: 12 }}>
              <View style={[baseStyles.colorSwatch, { backgroundColor: color.hex }]} />
              <View style={baseStyles.colorInfo}>
                <Text style={baseStyles.colorName}>{color.name}</Text>
                <Text style={baseStyles.colorValue}>{color.hex.toUpperCase()}</Text>
                <Text style={baseStyles.colorValue}>
                  RGB: {color.rgb?.r ?? 0}, {color.rgb?.g ?? 0}, {color.rgb?.b ?? 0}
                </Text>
                <Text style={baseStyles.colorValue}>
                  CMYK: {color.cmyk?.c ?? 0}, {color.cmyk?.m ?? 0}, {color.cmyk?.y ?? 0}, {color.cmyk?.k ?? 0}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={[baseStyles.cardBordered, { alignItems: 'center', padding: 40 }]}>
          <Text style={baseStyles.body}>Brand colors not yet defined.</Text>
        </View>
      )}

      {/* Color Guidelines */}
      {colorPrinciples.length > 0 && (
        <View style={[baseStyles.cardBordered, { marginTop: 16 }]}>
          <Text style={baseStyles.labelUppercase}>Color Principles</Text>
          {colorPrinciples.slice(0, 4).map((principle, index) => (
            <View key={index} style={baseStyles.listItem}>
              <View style={[baseStyles.bullet, { backgroundColor: primaryColor }]} />
              <Text style={baseStyles.body}>{principle}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>6</Text>
      </View>
    </Page>
  );
}

// Typography Page
function TypographyPage({ brandData }: { brandData: CompleteBrandData }) {
  const { typographyGuidelines } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  // Defensive defaults
  const primaryTypeface = typographyGuidelines?.primaryTypeface ?? { name: 'Not specified', characteristics: '', weights: [] };
  const secondaryTypeface = typographyGuidelines?.secondaryTypeface ?? { name: 'Not specified', characteristics: '', weights: [] };

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={baseStyles.twoToneTitle}>
        <Text style={[baseStyles.twoToneTitlePrimary, { color: secondaryColor }]}>Typo</Text>
        <Text style={[baseStyles.twoToneTitleAccent, { color: primaryColor }]}>graphy</Text>
      </View>

      {/* Primary Typeface */}
      <View style={[baseStyles.card, { backgroundColor: secondaryColor, marginBottom: 20 }]}>
        <Text style={[baseStyles.h1, { color: colors.white, marginBottom: 8 }]}>
          {primaryTypeface.name}
        </Text>
        <Text style={[baseStyles.labelUppercase, { color: 'rgba(255,255,255,0.6)' }]}>Primary Typeface</Text>
        <Text style={[baseStyles.body, { color: 'rgba(255,255,255,0.8)' }]}>
          {primaryTypeface.characteristics || 'Typeface characteristics not specified.'}
        </Text>
        {(primaryTypeface.weights || []).length > 0 && (
          <View style={[baseStyles.row, { marginTop: 12 }]}>
            {primaryTypeface.weights.map((weight, i) => (
              <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 4 }}>
                <Text style={{ fontSize: 9, color: colors.white }}>{weight}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Secondary Typeface */}
      <View style={[baseStyles.cardBordered, { marginBottom: 20 }]}>
        <Text style={[baseStyles.h2, { marginBottom: 8 }]}>
          {secondaryTypeface.name}
        </Text>
        <Text style={baseStyles.labelUppercase}>Secondary Typeface</Text>
        <Text style={baseStyles.body}>{secondaryTypeface.characteristics || 'Typeface characteristics not specified.'}</Text>
      </View>

      {/* Type Scale Preview */}
      <Text style={baseStyles.labelUppercase}>Type Scale</Text>
      <View style={baseStyles.cardBordered}>
        <Text style={[{ fontSize: 36, fontWeight: 'bold', color: secondaryColor, marginBottom: 4 }]}>Heading 1</Text>
        <Text style={[{ fontSize: 24, fontWeight: 'bold', color: secondaryColor, marginBottom: 4 }]}>Heading 2</Text>
        <Text style={[{ fontSize: 18, fontWeight: 'bold', color: secondaryColor, marginBottom: 4 }]}>Heading 3</Text>
        <Text style={[{ fontSize: 11, color: colors.textLight, marginBottom: 4 }]}>Body text for paragraphs and content.</Text>
        <Text style={[{ fontSize: 9, color: colors.textMuted }]}>Small text for captions.</Text>
      </View>

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>7</Text>
      </View>
    </Page>
  );
}

// Button Styles Page
function ButtonStylesPage({ brandData }: { brandData: CompleteBrandData }) {
  const { primaryColor, secondaryColor } = getBrandColors(brandData);

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={baseStyles.twoToneTitle}>
        <Text style={[baseStyles.twoToneTitlePrimary, { color: secondaryColor }]}>Button </Text>
        <Text style={[baseStyles.twoToneTitleAccent, { color: primaryColor }]}>Styles</Text>
      </View>
      <Text style={[baseStyles.body, { marginBottom: 24 }]}>
        Consistent button styling ensures a cohesive user experience across all touchpoints.
      </Text>

      <View style={baseStyles.row}>
        {/* Primary Button */}
        <View style={[baseStyles.col3, baseStyles.cardBordered]}>
          <Text style={baseStyles.labelUppercase}>Primary</Text>
          <View style={[baseStyles.buttonPrimary, { backgroundColor: primaryColor }]}>
            <Text style={baseStyles.buttonPrimaryText}>Get Started →</Text>
          </View>
          <View style={[baseStyles.buttonPrimary, { backgroundColor: primaryColor }]}>
            <Text style={baseStyles.buttonPrimaryText}>Learn More →</Text>
          </View>
          <Text style={[baseStyles.small, { marginTop: 8 }]}>
            Use for primary calls-to-action. Solid fill with brand accent color.
          </Text>
        </View>

        {/* Secondary Button */}
        <View style={[baseStyles.col3, baseStyles.cardBordered]}>
          <Text style={baseStyles.labelUppercase}>Secondary</Text>
          <View style={[baseStyles.buttonSecondary, { borderColor: primaryColor }]}>
            <Text style={[baseStyles.buttonSecondaryText, { color: primaryColor }]}>View Details →</Text>
          </View>
          <View style={[baseStyles.buttonSecondary, { borderColor: secondaryColor }]}>
            <Text style={[baseStyles.buttonSecondaryText, { color: secondaryColor }]}>Contact Us →</Text>
          </View>
          <Text style={[baseStyles.small, { marginTop: 8 }]}>
            Use for secondary actions. Outline style with brand colors.
          </Text>
        </View>

        {/* Tertiary Button */}
        <View style={[baseStyles.col3, baseStyles.cardBordered]}>
          <Text style={baseStyles.labelUppercase}>Tertiary</Text>
          <View style={baseStyles.buttonTertiary}>
            <Text style={[baseStyles.buttonTertiaryText, { color: primaryColor }]}>Read Article →</Text>
          </View>
          <View style={baseStyles.buttonTertiary}>
            <Text style={[baseStyles.buttonTertiaryText, { color: secondaryColor }]}>See All →</Text>
          </View>
          <Text style={[baseStyles.small, { marginTop: 8 }]}>
            Use for tertiary actions. Text only with arrow indicator.
          </Text>
        </View>
      </View>

      {/* Button Specifications */}
      <View style={[baseStyles.cardBordered, { marginTop: 24 }]}>
        <Text style={baseStyles.labelUppercase}>Specifications</Text>
        <View style={baseStyles.row}>
          <View style={baseStyles.col4}>
            <Text style={[baseStyles.small, { fontWeight: 'bold' }]}>Border Radius</Text>
            <Text style={baseStyles.small}>Full (pill shape)</Text>
          </View>
          <View style={baseStyles.col4}>
            <Text style={[baseStyles.small, { fontWeight: 'bold' }]}>Padding</Text>
            <Text style={baseStyles.small}>12px 24px</Text>
          </View>
          <View style={baseStyles.col4}>
            <Text style={[baseStyles.small, { fontWeight: 'bold' }]}>Font Weight</Text>
            <Text style={baseStyles.small}>Semibold (600)</Text>
          </View>
          <View style={baseStyles.col4}>
            <Text style={[baseStyles.small, { fontWeight: 'bold' }]}>Icon Size</Text>
            <Text style={baseStyles.small}>16px with 8px gap</Text>
          </View>
        </View>
      </View>

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>8</Text>
      </View>
    </Page>
  );
}

// Logo Guidelines Page
function LogoGuidelinesPage({ brandData }: { brandData: CompleteBrandData }) {
  const { logoGuidelines, logos } = brandData;
  const { primaryColor, secondaryColor } = getBrandColors(brandData);
  const primaryLogoUrl = getValidLogoUrl(logos, 0);
  const secondaryLogoUrl = getValidLogoUrl(logos, 1) || primaryLogoUrl;

  // Defensive defaults
  const donts = logoGuidelines?.donts ?? [];
  const clearSpace = logoGuidelines?.clearSpace ?? { rule: 'Maintain clear space around the logo', minimumSize: '40px minimum height' };

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.sectionHeader, { backgroundColor: secondaryColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={baseStyles.sectionHeaderText}>Logo </Text>
          <Text style={[baseStyles.sectionHeaderAccent, { color: primaryColor }]}>Guidelines</Text>
        </View>
        <Text style={baseStyles.sectionHeaderSubtext}>
          Proper usage and application of our brand mark.
        </Text>
      </View>

      {/* Logo Display */}
      {primaryLogoUrl ? (
        <View style={baseStyles.row}>
          <View style={[baseStyles.col2, baseStyles.cardBordered, { alignItems: 'center' }]}>
            <Image src={primaryLogoUrl} style={{ width: 160, height: 70 }} />
            <Text style={[baseStyles.small, { marginTop: 8 }]}>Primary Logo</Text>
          </View>
          <View style={[baseStyles.col2, baseStyles.card, { alignItems: 'center', backgroundColor: secondaryColor }]}>
            {secondaryLogoUrl && (
              <Image src={secondaryLogoUrl} style={{ width: 160, height: 70 }} />
            )}
            <Text style={[baseStyles.small, { marginTop: 8, color: 'rgba(255,255,255,0.7)' }]}>Reversed Logo</Text>
          </View>
        </View>
      ) : (
        <View style={[baseStyles.cardBordered, { alignItems: 'center', padding: 40 }]}>
          <Text style={baseStyles.body}>Logo files not available in compatible format.</Text>
          <Text style={baseStyles.small}>Upload PNG or JPG logo files for best results.</Text>
        </View>
      )}

      {/* Clear Space */}
      <View style={[baseStyles.section, { marginTop: 20 }]}>
        <Text style={baseStyles.labelUppercase}>Clear Space & Minimum Size</Text>
        <View style={baseStyles.cardBordered}>
          <Text style={baseStyles.body}>{clearSpace.rule}</Text>
          <Text style={[baseStyles.small, { marginTop: 8 }]}>
            Minimum size: {clearSpace.minimumSize}
          </Text>
        </View>
      </View>

      {/* Logo Don'ts */}
      {donts.length > 0 && (
      <View style={baseStyles.section}>
        <Text style={[baseStyles.labelUppercase, { color: colors.redText }]}>✕ Logo Don'ts</Text>
        <View style={baseStyles.row}>
          {donts.slice(0, 6).map((dont, index) => (
            <View key={index} style={[baseStyles.col2, { marginBottom: 8 }]}>
              <View style={{ backgroundColor: colors.redBg, padding: 10, borderRadius: 8 }}>
                <Text style={[baseStyles.small, { color: colors.redText }]}>✕ {dont}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      )}

      <View style={baseStyles.footer}>
        <Text style={baseStyles.pageNumber}>{brandData.brandName} Brand Guidelines</Text>
        <Text style={baseStyles.pageNumber}>9</Text>
      </View>
    </Page>
  );
}

// Main PDF Document
export function BrandGuidelinesPDF({ brandData }: BrandGuidelinesPDFProps) {
  return (
    <Document
      title={`${brandData.brandName} Brand Guidelines`}
      author="Creative Brief Builder"
      subject="Brand Guidelines"
      keywords={`${brandData.brandName}, brand guidelines, brand strategy`}
    >
      <CoverPage brandData={brandData} />
      <BrandStrategyPage brandData={brandData} />
      <PersonalityPage brandData={brandData} />
      <MessagingPage brandData={brandData} />
      <VoiceTonePage brandData={brandData} />
      <ColorPalettePage brandData={brandData} />
      <TypographyPage brandData={brandData} />
      <ButtonStylesPage brandData={brandData} />
      <LogoGuidelinesPage brandData={brandData} />
    </Document>
  );
}

export default BrandGuidelinesPDF;

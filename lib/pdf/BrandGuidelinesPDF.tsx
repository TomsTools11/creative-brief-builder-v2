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

// Cover Page Component
function CoverPage({ brandData }: { brandData: CompleteBrandData }) {
  const { primaryColor, secondaryColor } = getBrandColors(brandData);
  const brandNameParts = brandData.brandName.split(' ');
  const firstWord = brandNameParts[0];
  const restWords = brandNameParts.slice(1).join(' ');

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={[baseStyles.coverPage, { backgroundColor: secondaryColor }]}>
        {brandData.logos[0] && (
          <Image
            src={brandData.logos[0].url}
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
        <View style={[baseStyles.quote, { borderLeftColor: primaryColor }]}>
          <Text style={baseStyles.quoteText}>
            "{brandStrategy.positioning.statement}"
          </Text>
        </View>
        <View style={baseStyles.row}>
          <View style={[baseStyles.col2, baseStyles.cardBordered]}>
            <Text style={baseStyles.labelUppercase}>Target Audience</Text>
            <Text style={baseStyles.body}>{brandStrategy.positioning.targetAudience}</Text>
          </View>
          <View style={[baseStyles.col2, baseStyles.cardBordered]}>
            <Text style={baseStyles.labelUppercase}>Market Category</Text>
            <Text style={baseStyles.body}>{brandStrategy.positioning.marketCategory}</Text>
          </View>
        </View>
      </View>

      {/* Mission & Vision */}
      <View style={baseStyles.row}>
        <View style={[baseStyles.col2, baseStyles.card]}>
          <Text style={baseStyles.labelUppercase}>Mission</Text>
          <Text style={[baseStyles.body, { fontWeight: 'bold', marginBottom: 8 }]}>
            {brandStrategy.mission.statement}
          </Text>
          <Text style={baseStyles.small}>{brandStrategy.mission.explanation}</Text>
        </View>
        <View style={[baseStyles.col2, baseStyles.card]}>
          <Text style={baseStyles.labelUppercase}>Vision</Text>
          <Text style={[baseStyles.body, { fontWeight: 'bold', marginBottom: 8 }]}>
            {brandStrategy.vision.statement}
          </Text>
          <Text style={baseStyles.small}>Timeframe: {brandStrategy.vision.timeframe}</Text>
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
            <Text style={baseStyles.badgePrimaryText}>Primary: {brandStrategy.archetype.primary}</Text>
          </View>
          <View style={[baseStyles.badge, { marginLeft: 8 }]}>
            <Text style={baseStyles.badgeText}>Secondary: {brandStrategy.archetype.secondary}</Text>
          </View>
        </View>
        <Text style={[baseStyles.body, { marginTop: 12 }]}>
          {brandStrategy.archetype.description}
        </Text>
      </View>

      {/* Personality Traits */}
      <Text style={baseStyles.labelUppercase}>Personality Traits</Text>
      {brandStrategy.personality.slice(0, 4).map((trait, index) => (
        <View key={index} style={baseStyles.cardBordered}>
          <Text style={[baseStyles.h4, { color: primaryColor }]}>{trait.trait}</Text>
          <Text style={baseStyles.body}>{trait.description}</Text>
          <View style={[baseStyles.row, { marginTop: 8 }]}>
            {trait.behaviors.slice(0, 3).map((behavior, i) => (
              <View key={i} style={[baseStyles.badge, { marginRight: 4 }]}>
                <Text style={baseStyles.badgeText}>{behavior}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

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
      <View style={[baseStyles.row, { marginBottom: 20 }]}>
        {messaging.pillars.slice(0, 3).map((pillar, index) => (
          <View key={index} style={[baseStyles.col3, baseStyles.cardBordered]}>
            <View style={[baseStyles.badgePrimary, { backgroundColor: primaryColor, marginBottom: 12 }]}>
              <Text style={baseStyles.badgePrimaryText}>{index + 1}</Text>
            </View>
            <Text style={baseStyles.h4}>{pillar.name}</Text>
            <Text style={[baseStyles.small, { marginBottom: 8 }]}>{pillar.description}</Text>
            {pillar.proofPoints.slice(0, 2).map((point, i) => (
              <View key={i} style={baseStyles.listItem}>
                <View style={[baseStyles.bullet, { backgroundColor: primaryColor }]} />
                <Text style={baseStyles.small}>{point}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Value Propositions */}
      <Text style={baseStyles.labelUppercase}>Value Propositions</Text>
      {messaging.valuePropositions.slice(0, 2).map((vp, index) => (
        <View key={index} style={baseStyles.cardBordered}>
          <View style={baseStyles.badge}>
            <Text style={[baseStyles.badgeText, { color: primaryColor }]}>{vp.audience}</Text>
          </View>
          <Text style={[baseStyles.h4, { marginTop: 8, color: secondaryColor }]}>{vp.headline}</Text>
          <Text style={baseStyles.body}>{vp.subheadline}</Text>
        </View>
      ))}

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
      <View style={baseStyles.row}>
        <View style={[baseStyles.col2, baseStyles.weAreSection]}>
          <Text style={baseStyles.weAreTitle}>✓ We Are</Text>
          {verbalExpression.voiceTone.slice(0, 3).map((item, index) => (
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
          {verbalExpression.voiceTone.slice(0, 3).map((item, index) => (
            <View key={index} style={baseStyles.weAreItem}>
              <Text style={[baseStyles.small, { fontWeight: 'bold', color: colors.secondary }]}>
                {item.attribute}
              </Text>
              <Text style={[baseStyles.small, { color: colors.redText }]}>{item.dontExample}</Text>
            </View>
          ))}
        </View>
      </View>

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

      <View style={baseStyles.row}>
        {brandData.colors.slice(0, 6).map((color, index) => (
          <View key={index} style={{ width: '33.33%', marginBottom: 24, paddingRight: 12 }}>
            <View style={[baseStyles.colorSwatch, { backgroundColor: color.hex }]} />
            <View style={baseStyles.colorInfo}>
              <Text style={baseStyles.colorName}>{color.name}</Text>
              <Text style={baseStyles.colorValue}>{color.hex.toUpperCase()}</Text>
              <Text style={baseStyles.colorValue}>
                RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </Text>
              <Text style={baseStyles.colorValue}>
                CMYK: {color.cmyk.c}, {color.cmyk.m}, {color.cmyk.y}, {color.cmyk.k}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Color Guidelines */}
      {brandData.colorGuidelines.principles.length > 0 && (
        <View style={[baseStyles.cardBordered, { marginTop: 16 }]}>
          <Text style={baseStyles.labelUppercase}>Color Principles</Text>
          {brandData.colorGuidelines.principles.slice(0, 4).map((principle, index) => (
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

  return (
    <Page size="A4" orientation="landscape" style={baseStyles.page}>
      <View style={baseStyles.twoToneTitle}>
        <Text style={[baseStyles.twoToneTitlePrimary, { color: secondaryColor }]}>Typo</Text>
        <Text style={[baseStyles.twoToneTitleAccent, { color: primaryColor }]}>graphy</Text>
      </View>

      {/* Primary Typeface */}
      <View style={[baseStyles.card, { backgroundColor: secondaryColor, marginBottom: 20 }]}>
        <Text style={[baseStyles.h1, { color: colors.white, marginBottom: 8 }]}>
          {typographyGuidelines.primaryTypeface.name}
        </Text>
        <Text style={[baseStyles.labelUppercase, { color: 'rgba(255,255,255,0.6)' }]}>Primary Typeface</Text>
        <Text style={[baseStyles.body, { color: 'rgba(255,255,255,0.8)' }]}>
          {typographyGuidelines.primaryTypeface.characteristics}
        </Text>
        <View style={[baseStyles.row, { marginTop: 12 }]}>
          {typographyGuidelines.primaryTypeface.weights.map((weight, i) => (
            <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 4 }}>
              <Text style={{ fontSize: 9, color: colors.white }}>{weight}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Secondary Typeface */}
      <View style={[baseStyles.cardBordered, { marginBottom: 20 }]}>
        <Text style={[baseStyles.h2, { marginBottom: 8 }]}>
          {typographyGuidelines.secondaryTypeface.name}
        </Text>
        <Text style={baseStyles.labelUppercase}>Secondary Typeface</Text>
        <Text style={baseStyles.body}>{typographyGuidelines.secondaryTypeface.characteristics}</Text>
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
      {logos[0] && (
        <View style={baseStyles.row}>
          <View style={[baseStyles.col2, baseStyles.cardBordered, { alignItems: 'center' }]}>
            <Image src={logos[0].url} style={{ width: 160, height: 70 }} />
            <Text style={[baseStyles.small, { marginTop: 8 }]}>Primary Logo</Text>
          </View>
          <View style={[baseStyles.col2, baseStyles.card, { alignItems: 'center', backgroundColor: secondaryColor }]}>
            {logos[1] ? (
              <Image src={logos[1].url} style={{ width: 160, height: 70 }} />
            ) : (
              <Image src={logos[0].url} style={{ width: 160, height: 70 }} />
            )}
            <Text style={[baseStyles.small, { marginTop: 8, color: 'rgba(255,255,255,0.7)' }]}>Reversed Logo</Text>
          </View>
        </View>
      )}

      {/* Clear Space */}
      <View style={[baseStyles.section, { marginTop: 20 }]}>
        <Text style={baseStyles.labelUppercase}>Clear Space & Minimum Size</Text>
        <View style={baseStyles.cardBordered}>
          <Text style={baseStyles.body}>{logoGuidelines.clearSpace.rule}</Text>
          <Text style={[baseStyles.small, { marginTop: 8 }]}>
            Minimum size: {logoGuidelines.clearSpace.minimumSize}
          </Text>
        </View>
      </View>

      {/* Logo Don'ts */}
      <View style={baseStyles.section}>
        <Text style={[baseStyles.labelUppercase, { color: colors.redText }]}>✕ Logo Don'ts</Text>
        <View style={baseStyles.row}>
          {logoGuidelines.donts.slice(0, 6).map((dont, index) => (
            <View key={index} style={[baseStyles.col2, { marginBottom: 8 }]}>
              <View style={{ backgroundColor: colors.redBg, padding: 10, borderRadius: 8 }}>
                <Text style={[baseStyles.small, { color: colors.redText }]}>✕ {dont}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

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

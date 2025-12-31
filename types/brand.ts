// Brand data types for the Creative Brief Builder

export interface ColorData {
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  pantone?: string;
  name: string;
  usage: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
}

export interface FontData {
  family: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
  usage: 'heading' | 'body' | 'accent';
  weights: string[];
  styles: string[];
  source: 'google' | 'system' | 'custom';
}

export interface LogoData {
  url: string;
  format: 'svg' | 'png' | 'jpg' | 'webp';
  variant: 'primary' | 'reversed' | 'icon' | 'stacked' | 'horizontal';
  width?: number;
  height?: number;
  alt?: string;
}

export interface PersonalityTrait {
  trait: string;
  description: string;
  behaviors: string[];
}

export interface BrandArchetype {
  primary: string;
  secondary: string;
  description: string;
}

export interface BrandPillar {
  name: string;
  description: string;
  proofPoints: string[];
}

export interface ValueProposition {
  headline: string;
  subheadline: string;
  audience: string;
}

export interface KeyMessage {
  message: string;
  context: string;
  audience: string;
}

export interface ElevatorPitches {
  '15second': string;
  '30second': string;
  '60second': string;
}

export interface VoiceToneItem {
  attribute: string;
  description: string;
  doExample: string;
  dontExample: string;
}

export interface ToneSpectrum {
  dimension: string;
  position: number;
  description: string;
}

export interface WritingStyle {
  sentenceLength: string;
  vocabulary: string;
  punctuation: string;
  formatting: string;
}

export interface StyleRule {
  category: string;
  rule: string;
  example: string;
}

export interface Appositive {
  phrase: string;
  usage: string;
  tone: string;
}

export interface BrandPositioning {
  statement: string;
  targetAudience: string;
  marketCategory: string;
  competitiveAdvantage: string;
  reasonToBelieve: string;
}

export interface BrandMission {
  statement: string;
  explanation: string;
}

export interface BrandVision {
  statement: string;
  timeframe: string;
}

export interface BrandPromise {
  promise: string;
  delivery: string;
}

export interface BrandStrategy {
  positioning: BrandPositioning;
  mission: BrandMission;
  vision: BrandVision;
  personality: PersonalityTrait[];
  archetype: BrandArchetype;
  brandPromise: BrandPromise;
  boilerplate: string;
}

export interface MessagingFrameworks {
  pillars: BrandPillar[];
  valuePropositions: ValueProposition[];
  keyMessages: KeyMessage[];
  elevatorPitches: ElevatorPitches;
}

export interface VerbalExpression {
  voiceTone: VoiceToneItem[];
  toneSpectrum: ToneSpectrum[];
  writingStyle: WritingStyle;
  styleRules: StyleRule[];
  appositives: Appositive[];
}

export interface LogoVersion {
  name: string;
  usage: string;
  background: string;
}

export interface LogoClearSpace {
  rule: string;
  minimumSize: string;
}

export interface LogoPlacement {
  preferred: string[];
  cobranding: string;
}

export interface LogoGuidelines {
  versions: LogoVersion[];
  clearSpace: LogoClearSpace;
  donts: string[];
  placement: LogoPlacement;
}

export interface TypefaceSpec {
  name: string;
  usage: string;
  weights: string[];
  characteristics: string;
}

export interface TypeHierarchyLevel {
  size: string;
  weight: string;
  lineHeight: string;
  usage: string;
}

export interface TypeHierarchy {
  h1: TypeHierarchyLevel;
  h2: TypeHierarchyLevel;
  h3: TypeHierarchyLevel;
  h4: TypeHierarchyLevel;
  body: TypeHierarchyLevel;
  small: TypeHierarchyLevel;
}

export interface TypographyGuidelines {
  primaryTypeface: TypefaceSpec;
  secondaryTypeface: TypefaceSpec;
  hierarchy: TypeHierarchy;
  guidelines: string[];
}

export interface ColorCombination {
  name: string;
  background: string;
  text: string;
  accent: string;
  usage: string;
}

export interface ColorAccessibility {
  minimumContrast: string;
  guidelines: string[];
}

export interface ColorGuidelines {
  principles: string[];
  usage: Record<string, string[]>;
  combinations: ColorCombination[];
  accessibility: ColorAccessibility;
}

export interface PatternGuidelines {
  description: string;
  usage: string[];
  examples: string[];
}

export interface CompleteBrandData {
  id: string;
  url: string;
  brandName: string;
  tagline?: string;
  industry?: string;
  year: number;
  colors: ColorData[];
  fonts: FontData[];
  logos: LogoData[];
  brandStrategy: BrandStrategy;
  messaging: MessagingFrameworks;
  verbalExpression: VerbalExpression;
  logoGuidelines: LogoGuidelines;
  colorGuidelines: ColorGuidelines;
  typographyGuidelines: TypographyGuidelines;
  patternGuidelines: PatternGuidelines;
  createdAt: Date;
}

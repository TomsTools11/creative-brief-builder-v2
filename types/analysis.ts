// Analysis result types for website scraping

import type { ColorData, FontData, LogoData } from './brand';

export interface ContactInfo {
  email: string[];
  phone: string[];
  address?: string;
}

export interface ExtractedContent {
  title: string;
  description: string;
  heroHeading: string;
  heroSubtext: string;
  headings: string[];
  paragraphs: string[];
  valueProps: string[];
  testimonials: string[];
  ctas: string[];
  keywords: string[];
  socialLinks: string[];
  contactInfo: ContactInfo;
  aboutText: string;
}

export interface AnalysisResult {
  id: string;
  url: string;
  brandName: string;
  tagline?: string;
  industry?: string;
  colors: ColorData[];
  fonts: FontData[];
  logos: LogoData[];
  content: ExtractedContent;
  screenshots?: string[];
  analyzedAt: Date;
}

export interface AnalysisProgress {
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
}

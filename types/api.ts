// API request and response types

import type { AnalysisResult, AnalysisProgress } from './analysis';
import type { CompleteBrandData } from './brand';

// Analyze endpoint
export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

// Generate endpoint
export interface GenerateRequest {
  briefId: string;
  analysisData: AnalysisResult;
  section?: 'strategy' | 'messaging' | 'verbal' | 'logo' | 'color' | 'typography' | 'patterns' | 'all';
}

export interface GenerateProgress {
  step: 'strategy' | 'messaging' | 'verbal' | 'visual' | 'complete';
  percentage: number;
  message: string;
  partialData?: Partial<CompleteBrandData>;
}

export interface GenerateResponse {
  success: boolean;
  data?: CompleteBrandData;
  error?: string;
}

// PDF generation endpoint
export interface GeneratePdfRequest {
  briefId: string;
  brandData: CompleteBrandData;
}

export interface GeneratePdfResponse {
  success: boolean;
  pdfUrl?: string;
  pdfBase64?: string;
  error?: string;
}

// Streaming event types
export type StreamEvent =
  | { type: 'progress'; data: AnalysisProgress | GenerateProgress }
  | { type: 'partial'; data: Partial<CompleteBrandData> }
  | { type: 'complete'; data: CompleteBrandData }
  | { type: 'error'; error: string };

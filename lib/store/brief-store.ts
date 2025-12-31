import { create } from 'zustand';
import type { AnalysisResult } from '@/types/analysis';
import type { CompleteBrandData } from '@/types/brand';

export type AppStep = 'input' | 'analyzing' | 'generating' | 'preview' | 'complete';

export interface Progress {
  step: number;
  totalSteps: number;
  message: string;
  percentage: number;
}

interface BriefStore {
  // State
  currentStep: AppStep;
  progress: Progress;
  analysisData: AnalysisResult | null;
  brandData: CompleteBrandData | null;
  errors: string[];
  isLoading: boolean;
  url: string;

  // Actions
  setUrl: (url: string) => void;
  setStep: (step: AppStep) => void;
  updateProgress: (progress: Partial<Progress>) => void;
  setAnalysisData: (data: AnalysisResult) => void;
  setBrandData: (data: CompleteBrandData) => void;
  updateBrandData: (data: Partial<CompleteBrandData>) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialProgress: Progress = {
  step: 0,
  totalSteps: 6,
  message: '',
  percentage: 0,
};

export const useBriefStore = create<BriefStore>((set) => ({
  // Initial state
  currentStep: 'input',
  progress: initialProgress,
  analysisData: null,
  brandData: null,
  errors: [],
  isLoading: false,
  url: '',

  // Actions
  setUrl: (url) => set({ url }),

  setStep: (step) => set({ currentStep: step }),

  updateProgress: (progress) =>
    set((state) => ({
      progress: { ...state.progress, ...progress },
    })),

  setAnalysisData: (data) => set({ analysisData: data }),

  setBrandData: (data) => set({ brandData: data }),

  updateBrandData: (data) =>
    set((state) => ({
      brandData: state.brandData
        ? { ...state.brandData, ...data }
        : null,
    })),

  addError: (error) =>
    set((state) => ({
      errors: [...state.errors, error],
    })),

  clearErrors: () => set({ errors: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  reset: () =>
    set({
      currentStep: 'input',
      progress: initialProgress,
      analysisData: null,
      brandData: null,
      errors: [],
      isLoading: false,
      url: '',
    }),
}));

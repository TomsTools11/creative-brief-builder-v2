import { NextRequest, NextResponse } from 'next/server';
import { generateBrandGuidelines } from '@/lib/ai';
import type { AnalysisResult } from '@/types/analysis';

export const maxDuration = 300; // Allow up to 5 minutes for generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisData } = body as { analysisData: AnalysisResult };

    if (!analysisData || !analysisData.id) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      );
    }

    // Generate brand guidelines using Claude
    const brandData = await generateBrandGuidelines(analysisData);

    return NextResponse.json({
      success: true,
      data: brandData,
    });
  } catch (error) {
    console.error('Generation error:', error);

    const message = error instanceof Error ? error.message : 'Failed to generate brand guidelines';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

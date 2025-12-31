import { NextRequest, NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/analysis';
import { isValidUrl, normalizeUrl } from '@/lib/utils/url-utils';

export const maxDuration = 60; // Allow up to 60 seconds for analysis

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(url);

    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Perform the analysis
    const result = await analyzeWebsite(normalizedUrl);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Analysis error:', error);

    const message = error instanceof Error ? error.message : 'Failed to analyze website';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

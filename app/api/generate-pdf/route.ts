import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { BrandGuidelinesPDF } from '@/lib/pdf';
import type { CompleteBrandData } from '@/types/brand';
import React from 'react';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandData } = body as { brandData: CompleteBrandData };

    if (!brandData || !brandData.id) {
      return NextResponse.json(
        { error: 'Brand data is required' },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      React.createElement(BrandGuidelinesPDF, { brandData }) as any
    );

    // Return the PDF as a downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${brandData.brandName.replace(/[^a-z0-9]/gi, '-')}-brand-guidelines.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);

    const message = error instanceof Error ? error.message : 'Failed to generate PDF';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

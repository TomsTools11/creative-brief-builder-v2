import { NextRequest } from 'next/server';
import { generateBrandGuidelines } from '@/lib/ai';
import type { AnalysisResult } from '@/types/analysis';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { analysisData } = body as { analysisData: AnalysisResult };

  if (!analysisData || !analysisData.id) {
    return new Response(
      JSON.stringify({ error: 'Analysis data is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create a streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      try {
        // Generate brand guidelines with progress callback
        const result = await generateBrandGuidelines(analysisData, (progress) => {
          sendEvent('progress', progress);
        });

        sendEvent('complete', result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Generation failed';
        sendEvent('error', { error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

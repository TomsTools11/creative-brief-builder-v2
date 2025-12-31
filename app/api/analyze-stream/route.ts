import { NextRequest } from 'next/server';
import { analyzeWebsite } from '@/lib/analysis';
import { isValidUrl, normalizeUrl } from '@/lib/utils/url-utils';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body;

  if (!url || typeof url !== 'string') {
    return new Response(
      JSON.stringify({ error: 'URL is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const normalizedUrl = normalizeUrl(url);

  if (!isValidUrl(normalizedUrl)) {
    return new Response(
      JSON.stringify({ error: 'Invalid URL provided' }),
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
        // Perform analysis with progress callback
        const result = await analyzeWebsite(normalizedUrl, (progress) => {
          sendEvent('progress', progress);
        });

        sendEvent('complete', result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Analysis failed';
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

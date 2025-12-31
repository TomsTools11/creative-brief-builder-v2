'use client';

import { useState } from 'react';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { isValidUrl } from '@/lib/utils/url-utils';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // Add protocol if missing for validation
    let urlToValidate = url.trim();
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
      urlToValidate = 'https://' + urlToValidate;
    }

    if (!isValidUrl(urlToValidate)) {
      setError('Please enter a valid website URL');
      return;
    }

    onSubmit(urlToValidate);
  };

  return (
    <Card variant="elevated" padding="lg" className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#0066ff]/10 p-3">
            <Sparkles className="h-6 w-6 text-[#0066ff]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[#070d59]">
            Generate Brand Guidelines
          </h2>
          <p className="text-[#070d59]/60">
            Enter your website URL and we'll create a comprehensive brand guidelines document
          </p>
        </div>

        <div className="mb-4">
          <Input
            label="Website URL"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={error}
            leftIcon={<Globe className="h-5 w-5" />}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          rightIcon={<ArrowRight className="h-5 w-5" />}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Generate Brand Guidelines'}
        </Button>

        <p className="mt-4 text-center text-xs text-[#070d59]/50">
          We'll analyze your website's colors, fonts, content, and more to create
          a customized brand guidelines document.
        </p>
      </form>
    </Card>
  );
}

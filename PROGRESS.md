# Creative Brief Builder - Progress Update

**Date:** December 31, 2024
**Status:** MVP Complete, Deployed to Railway

---

## Project Overview

A web application that analyzes any website URL and generates comprehensive brand guidelines using AI. The output includes a web preview and downloadable PDF in a professional presentation format.

### Live Demo
Deployed on Railway (add your URL here after deployment)

---

## Features Implemented

### Core Functionality
- URL input and website analysis
- AI-powered brand content generation using Claude API
- Real-time progress streaming (SSE)
- Interactive web preview of brand guidelines
- PDF export in landscape presentation format

### Brand Guidelines Sections
1. **Brand Strategy** - Positioning, mission, vision, brand promise
2. **Brand Personality** - Traits, archetypes, behavioral attributes
3. **Messaging Framework** - Pillars, value propositions, key messages, elevator pitches
4. **Voice & Tone** - "We Are / We Are Not" comparison, tone spectrum, writing style
5. **Color Palette** - Extracted colors with hex/RGB/CMYK values, usage guidelines
6. **Typography** - Primary/secondary typefaces, type scale hierarchy
7. **Button Styles** - Primary/Secondary/Tertiary button examples with specs
8. **Logo Guidelines** - Usage rules, clear space, logo don'ts
9. **Work Samples** - Website mockups (desktop, tablet, mobile)

### Visual Design Features
- Two-tone headers (white + accent color)
- Hexagon pattern backgrounds
- Full-width dark section dividers
- Dynamic brand color application throughout
- Landscape PDF format (presentation style)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Claude API (claude-sonnet-4-20250514) |
| PDF | @react-pdf/renderer |
| State | React useState/useCallback |
| Deployment | Railway |

---

## Project Structure

```
creative-brief-builder-v2/
├── app/
│   ├── api/
│   │   ├── analyze-stream/    # Website analysis endpoint (SSE)
│   │   ├── generate-stream/   # AI content generation (SSE)
│   │   └── generate-pdf/      # PDF generation endpoint
│   ├── layout.tsx
│   └── page.tsx               # Main application page
├── components/
│   ├── forms/                 # UrlInputForm, ProgressDisplay
│   ├── preview/               # All brand section preview components
│   │   ├── HexagonPattern.tsx
│   │   ├── ButtonStyles.tsx
│   │   ├── WorkSamples.tsx
│   │   ├── ColorPalette.tsx
│   │   ├── BrandStrategy.tsx
│   │   ├── Typography.tsx
│   │   ├── VoiceTone.tsx
│   │   ├── Messaging.tsx
│   │   ├── LogoGuidelines.tsx
│   │   └── PreviewContainer.tsx
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── ai/
│   │   ├── claude-client.ts   # Claude API integration
│   │   ├── prompts.ts         # AI prompt templates
│   │   └── index.ts
│   ├── analysis/              # Website scraping & analysis
│   └── pdf/
│       ├── BrandGuidelinesPDF.tsx  # PDF document structure
│       └── styles.ts               # PDF styling (landscape)
├── types/
│   ├── analysis.ts            # Analysis result types
│   └── brand.ts               # Brand data types
├── railway.json               # Railway deployment config
└── .env.local                 # ANTHROPIC_API_KEY (not committed)
```

---

## Key Implementation Details

### AI Content Generation
- Uses 7 sequential Claude API calls for different content sections
- JSON-only responses with robust parsing (4 fallback strategies)
- Retry logic with exponential backoff
- Progress streaming via Server-Sent Events

### PDF Generation
- Landscape A4 orientation
- Custom styles optimized for presentation format
- Dynamic brand colors applied throughout
- 9 pages: Cover, Strategy, Personality, Messaging, Voice, Colors, Typography, Buttons, Logo

### Website Analysis
- Extracts colors, fonts, logos from target URL
- Identifies brand name, tagline, industry
- Captures headings, paragraphs, CTAs, value props

---

## Session Changes (Dec 31, 2024)

1. **Fixed JSON parsing error** - Added multiple parsing strategies for AI responses
2. **Updated system prompt** - Explicit JSON-only output instruction
3. **Converted PDF to landscape** - Changed from portrait to presentation format
4. **Adjusted PDF styles** - Updated padding, margins, font sizes for landscape
5. **Created Railway config** - Added railway.json for deployment
6. **Deployed to Railway** - Successfully deployed

---

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Required - Claude API key
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY

# Run development server
npm run dev

# Build for production
npm run build
npm run start
```

---

## Known Issues / Future Improvements

### Current Warnings
- "Invalid base64 image" errors for SVG placeholder logos (cosmetic, doesn't affect functionality)
- Next.js lockfile warning (can be ignored or fixed by removing parent lockfile)

### Potential Enhancements
- [ ] Add website screenshot capture during analysis
- [ ] Support for custom brand color input
- [ ] Multiple PDF template styles
- [ ] Save/load previous brand analyses
- [ ] User authentication for saved projects
- [ ] Batch URL processing
- [ ] Export to other formats (PPTX, Google Slides)

---

## Deployment

### Railway (Current)
```bash
railway login
railway init
railway variables set ANTHROPIC_API_KEY=your_key
railway up
```

Or connect GitHub repo at railway.app for auto-deploy.

### Alternative: Vercel (requires Pro for 2min+ timeouts)
```bash
vercel
# Set ANTHROPIC_API_KEY in dashboard
```

---

## Reference Files

- Example PDF format: `creative-brief-example-pdf.pdf` (Credit Key Brand Guidelines)
- Brand types: `types/brand.ts`
- AI prompts: `lib/ai/prompts.ts`

---

## Contact / Notes

_Add any additional notes or contact info here_

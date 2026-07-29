# Blinkit Discovery Engine — D2

AI-powered research pipeline that ingests app reviews and community posts, classifies every item against a 10-theme taxonomy using Claude, and surfaces the insights a growth team needs to drive category expansion.

Built for the NextLeap PM Fellowship graduation project.

## Deploy

1. Push to GitHub
2. Connect repo to Vercel
3. Add `ANTHROPIC_API_KEY` in Vercel environment variables (Settings > Environment Variables)
4. Deploy

## Local dev

```bash
npm install
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local
npm run dev
```

## Stack

- Next.js 14 (static site generation for data, API route for live classification)
- Anthropic Claude (claude-haiku-4-5 for live classification)
- No external chart libraries — custom bar chart built with CSS

## Data

All pipeline output is pre-built and bundled as static JSON:
- `public/data/tagged_reviews.json` — 1,718 classified reviews
- `public/data/theme_summary.json` — theme counts and discovery breakdown
- `public/data/insight_report.md` — synthesized insight report

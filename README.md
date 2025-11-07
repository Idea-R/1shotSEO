# 1shotSEO - AI-First Website Intelligence Platform

Unified SEO, content, analytics, and reporting platform that replaces expensive multi-tool subscriptions.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env` and fill in your credentials:
- Supabase URL and keys
- OpenAI API key (for AI features)
- Optional: Google API credentials (GA4, GSC, Ads)

3. **Set up database:**
```bash
# Apply Postgres schema
psql -U postgres -d your_database -f db/schema.sql

# Apply ClickHouse schema (if using ClickHouse)
clickhouse-client < clickhouse/ddl.sql

# Seed demo data
npm run db:seed
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open browser:**
Navigate to `http://localhost:3000`

## Demo Mode

Set `DEMO_MODE=true` in your `.env` file to enable demo mode with sample data. All connectors will return realistic mock data, and you can explore all features without connecting real accounts.

## Features

### Pages
- **Dashboard** (`/`) - KPI overview, insights, trends
- **Sites & Content** (`/sites`) - Site management, content explorer, AI authoring
- **Visibility** (`/visibility`) - Keywords, backlinks, competitors
- **Acquisition & Ads** (`/acquisition`) - Channel mix, Google Ads performance
- **Tasks & Alerts** (`/tasks`) - Task management, calendar, alerts
- **Settings** (`/settings`) - Connections, sites, users, reporting config

### AI Assistant
- Embedded on every page (bottom-right)
- Context-aware responses
- One-click task creation
- Content suggestions

### Reporting
- Monthly site reports
- Portfolio rollups
- Campaign/Ads reports
- Technical health reports
- Executive summaries
- PDF export
- Email/Slack/Notion delivery

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript
- `npm run db:seed` - Seed demo data
- `npm run demo:reset` - Reset demo data
- `npm run report:render` - Render a report
- `npm run report:send` - Send a report

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State:** TanStack Query
- **Tables:** TanStack Table
- **Forms:** react-hook-form + zod
- **Charts:** Recharts
- **Database:** Supabase (Postgres 16) + ClickHouse
- **AI:** OpenAI GPT-4o-mini
- **Icons:** Lucide React

## Project Structure

```
├── app/              # Next.js app directory
│   ├── page.tsx      # Dashboard
│   ├── sites/        # Sites & Content page
│   ├── visibility/   # Visibility (SEO) page
│   ├── acquisition/  # Acquisition & Ads page
│   ├── tasks/        # Tasks & Alerts page
│   └── settings/     # Settings page
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   ├── main-nav.tsx  # Main navigation
│   ├── ai-assistant.tsx
│   └── global-search.tsx
├── lib/              # Utilities
│   ├── supabase.ts   # Supabase client
│   ├── ai.ts         # AI functions
│   ├── connectors.ts # Data connectors
│   └── reporting.ts  # Report generation
├── db/               # Database schemas
│   ├── schema.sql    # Postgres schema
│   └── seed.ts       # Seed script
└── clickhouse/       # ClickHouse DDL
    └── ddl.sql
```

## Connectors

All connectors support mock/demo mode:
- **GA4** - Google Analytics 4
- **GSC** - Google Search Console
- **Google Ads** - Campaign performance
- **Lighthouse** - Core Web Vitals
- **Crawler** - Site crawling

## License

MIT

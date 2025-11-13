# 1shotSEO - Project Index

## Overview
AI-first Website Intelligence Platform replacing expensive multi-tool stacks (SEMrush/Ahrefs/Similarweb + GA4/GSC/Google Ads) with unified reporting.

## Architecture

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack Query
- **Forms:** react-hook-form + zod
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (Postgres 16) with RLS
- **Timeseries:** ClickHouse (optional)
- **AI:** OpenAI GPT-4o-mini
- **Jobs:** Vercel Cron/Queue

### Data Connectors
- GA4 (Google Analytics 4)
- GSC (Google Search Console)
- Google Ads
- Lighthouse (CWV)
- Crawler
- All support mock/demo mode

## File Structure

```
├── app/
│   ├── page.tsx              # Dashboard (/)
│   ├── sites/page.tsx        # Sites & Content (/sites)
│   ├── visibility/page.tsx   # Visibility/SEO (/visibility)
│   ├── acquisition/page.tsx  # Acquisition & Ads (/acquisition)
│   ├── tasks/page.tsx        # Tasks & Alerts (/tasks)
│   ├── settings/page.tsx     # Settings (/settings)
│   ├── actions/
│   │   └── reporting.ts      # Server actions for reports
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   └── tabs.tsx
│   ├── ai-assistant.tsx       # AI chat assistant
│   ├── app-layout.tsx         # Main app layout wrapper
│   ├── global-search.tsx      # Cmd+K search
│   ├── main-nav.tsx           # Navigation
│   ├── providers.tsx          # React Query + Theme providers
│   └── theme-provider.tsx     # Dark mode support
│
├── lib/
│   ├── ai.ts                  # OpenAI integration
│   ├── clickhouse.ts          # ClickHouse client
│   ├── connectors.ts          # Data connectors (GA4, GSC, Ads, etc.)
│   ├── reporting.ts           # Report generation & PDF
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Utility functions
│
├── db/
│   ├── schema.sql             # Postgres schema
│   └── seed.ts                # Demo data seeding
│
├── clickhouse/
│   └── ddl.sql                # ClickHouse DDL
│
└── scripts/
    ├── demo-reset.ts          # Reset demo data
    └── render-report.ts       # CLI report rendering
```

## Key Features

### 1. Dashboard (`/`)
- KPI cards (Sessions, Users, Conversions, Revenue)
- Channel mix chart
- Top pages list
- AI insights stream
- Click-through to detail pages

### 2. Sites & Content (`/sites`)
- Multi-domain site management
- Content explorer with filters
- Page performance metrics
- AI content authoring tools
- Create briefs/tasks from pages

### 3. Visibility/SEO (`/visibility`)
- Keyword tracking (winners/losers)
- Backlink monitoring (new/lost)
- Competitor analysis (SOV, overlap)
- SERP features tracking
- CSV exports

### 4. Acquisition & Ads (`/acquisition`)
- Channel breakdown (organic/paid/social/referral)
- Google Ads drilldown (campaign → ad group → keyword)
- Attribution analysis
- ROAS tracking
- AI suggestions for negative keywords

### 5. Tasks & Alerts (`/tasks`)
- Task management (table/calendar views)
- Alert system (rank drops, CWV regressions, spend anomalies)
- Bulk actions
- CSV export

### 6. Settings (`/settings`)
- Connection management (GA4, GSC, Ads, Lighthouse)
- Site configuration
- User/role management (RBAC)
- Reporting templates & schedules
- Branding customization

### 7. AI Assistant
- Embedded on every page (bottom-right)
- Context-aware responses
- One-click task creation
- Content suggestions
- Uses GPT-4o-mini

### 8. Reporting System
- Monthly site reports
- Portfolio rollups
- Campaign/Ads reports
- Technical health reports
- Executive summaries
- PDF export
- Email/Slack/Notion delivery
- Scheduled reports

## Database Schema

### Core Tables
- `orgs` - Organizations
- `users` - Users with RBAC (viewer/editor/admin)
- `sites` - Domains/properties
- `pages` - URL inventory with CWV metrics
- `keywords` - Tracked keywords
- `ranks` - Daily ranking data
- `backlinks` - Backlink tracking
- `traffic_daily` - Daily traffic rollups
- `ads_stats` - Google Ads performance
- `competitors` - Competitor domains
- `tasks` - Task management
- `annotations` - Site annotations
- `reports` - Generated reports
- `report_templates` - Report templates
- `schedules` - Report schedules
- `deliveries` - Report delivery records

### Row Level Security (RLS)
All tables have RLS enabled. Users can only access data from their organization (`org_id`).

## Demo Mode

Set `DEMO_MODE=true` in `.env` to enable:
- Mock data for all connectors
- Pre-seeded demo sites, pages, keywords
- Sample traffic and ranking data
- All features functional without real API connections

## API Routes & Server Actions

- `app/actions/reporting.ts` - Report rendering and sending
- All data fetching uses TanStack Query with server components where possible

## Environment Variables

See `.env.example` for required variables:
- Supabase (URL, anon key, service role key)
- OpenAI API key
- Optional: Google API credentials
- ClickHouse (if using)
- SMTP (for email delivery)

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:seed` - Seed demo data
- `npm run demo:reset` - Reset demo data
- `npm run report:render` - Render report via CLI
- `npm run report:send` - Send report via CLI

## Performance Targets

- Lighthouse ≥ 90 (Performance/Best Practices/Accessibility)
- INP < 200ms
- TTFB < 200ms
- FCP < 1.5s
- Zero layout shift (CLS)

## Accessibility

- Keyboard navigation
- ARIA labels
- Focus rings
- Screen reader support
- WCAG 2.1 AA compliance target

## Testing

- ESLint for code quality
- TypeScript for type safety
- Unit tests (Vitest) - to be added
- E2E tests (Playwright) - to be added

## Deployment

Ready for Vercel deployment:
1. Connect GitHub repo
2. Set environment variables
3. Deploy

For other platforms:
- Build: `npm run build`
- Start: `npm run start`

## Next Steps (Future Enhancements)

- [ ] Add real API integrations for GA4/GSC/Ads
- [ ] Implement PDF generation with puppeteer
- [ ] Add email/Slack/Notion delivery integrations
- [ ] Add unit and E2E tests
- [ ] Implement MCP tool adapters
- [ ] Add more chart types
- [ ] Implement calendar view for tasks
- [ ] Add bulk operations
- [ ] Add more AI features


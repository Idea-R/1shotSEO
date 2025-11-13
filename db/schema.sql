-- Supabase Postgres Schema for 1shotSEO

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (with RLS)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, org_id)
);

-- Sites
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  gsc_property TEXT,
  ga4_property TEXT,
  ads_customer_id TEXT,
  tech_stack TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  group TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  cwv_lcp_ms INTEGER,
  cwv_inp_ms INTEGER,
  cwv_cls DECIMAL(5,4),
  index_state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(site_id, url)
);

-- Keywords
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  intent TEXT,
  locale TEXT NOT NULL DEFAULT 'en-US',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, phrase, locale)
);

-- Rankings
CREATE TABLE ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  keyword_id UUID NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  position INTEGER,
  url TEXT,
  serp_features TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(site_id, keyword_id, date)
);

-- Backlinks
CREATE TABLE backlinks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  domain TEXT NOT NULL,
  first_seen DATE NOT NULL,
  last_seen DATE NOT NULL,
  authority INTEGER,
  anchor TEXT,
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'lost', 'disavowed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Traffic (daily rollups)
CREATE TABLE traffic_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sessions INTEGER NOT NULL DEFAULT 0,
  users INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  channel_group TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(site_id, date, channel_group)
);

-- Ads Stats
CREATE TABLE ads_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  campaign_id TEXT,
  ad_group_id TEXT,
  keyword_id TEXT,
  clicks INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Competitors
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  overlap_score DECIMAL(5,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(site_id, domain)
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  keyword_id UUID REFERENCES keywords(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  due_at TIMESTAMPTZ,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Annotations
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Threads
CREATE TABLE ai_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  context_ref TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ETL Jobs
CREATE TABLE etl_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  stats JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  site_scope JSONB,
  template_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rendering', 'completed', 'failed')),
  url TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Report Templates
CREATE TABLE report_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  layout JSONB,
  sections JSONB,
  branding JSONB,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schedules
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  scope JSONB NOT NULL,
  cadence TEXT NOT NULL,
  next_run_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  recipients JSONB NOT NULL,
  channel TEXT NOT NULL,
  template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deliveries
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  recipients JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  metadata JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_sites_org_id ON sites(org_id);
CREATE INDEX idx_pages_site_id ON pages(site_id);
CREATE INDEX idx_keywords_org_id ON keywords(org_id);
CREATE INDEX idx_ranks_site_keyword_date ON ranks(site_id, keyword_id, date);
CREATE INDEX idx_backlinks_site_id ON backlinks(site_id);
CREATE INDEX idx_traffic_daily_site_date ON traffic_daily(site_id, date);
CREATE INDEX idx_ads_stats_site_date ON ads_stats(site_id, date);
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_annotations_site_date ON annotations(site_id, date);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their org's data)
CREATE POLICY "Users can view own org data" ON users FOR SELECT USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org sites" ON sites FOR SELECT USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org pages" ON pages FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org keywords" ON keywords FOR SELECT USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org ranks" ON ranks FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org backlinks" ON backlinks FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org traffic" ON traffic_daily FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org ads" ON ads_stats FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org competitors" ON competitors FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can manage own org tasks" ON tasks FOR ALL USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org annotations" ON annotations FOR SELECT USING (site_id IN (SELECT id FROM sites WHERE org_id = current_setting('app.org_id', true)::uuid));
CREATE POLICY "Users can view own org ai_threads" ON ai_threads FOR SELECT USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org reports" ON reports FOR SELECT USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can manage own org templates" ON report_templates FOR ALL USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can manage own org schedules" ON schedules FOR ALL USING (org_id = current_setting('app.org_id', true)::uuid);
CREATE POLICY "Users can view own org deliveries" ON deliveries FOR SELECT USING (report_id IN (SELECT id FROM reports WHERE org_id = current_setting('app.org_id', true)::uuid));


-- ClickHouse DDL for timeseries data

CREATE DATABASE IF NOT EXISTS seo_analytics;

CREATE TABLE IF NOT EXISTS seo_analytics.web_events
(
    site_id UUID,
    ts DateTime64(3),
    session_id String,
    user_id Nullable(UUID),
    path String,
    ref String,
    utm_source Nullable(String),
    utm_medium Nullable(String),
    utm_campaign Nullable(String),
    event_name String,
    event_params String, -- JSON string
    user_agent String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(ts)
ORDER BY (site_id, ts, session_id)
TTL ts + INTERVAL 90 DAY;

CREATE TABLE IF NOT EXISTS seo_analytics.ad_spend_rollups
(
    site_id UUID,
    ts_day Date,
    campaign_id String,
    clicks UInt32,
    cost Decimal64(2),
    conv UInt32
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(ts_day)
ORDER BY (site_id, ts_day, campaign_id)
TTL ts_day + INTERVAL 365 DAY;


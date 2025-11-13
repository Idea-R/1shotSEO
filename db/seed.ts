import { supabase } from "@/lib/supabase"

// Demo mode seed data
export async function seedDemoData() {
  const isDemo = process.env.DEMO_MODE === "true"
  if (!isDemo) {
    console.log("Demo mode not enabled. Set DEMO_MODE=true to seed demo data.")
    return
  }

  // Create demo org
  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .insert({
      id: "demo-org-id",
      name: "Demo Organization",
      plan: "pro",
    })
    .select()
    .single()

  if (orgError && !orgError.message.includes("duplicate")) {
    console.error("Failed to create org:", orgError)
    return
  }

  // Create demo user
  await supabase.from("users").upsert({
    id: "demo-user-id",
    org_id: "demo-org-id",
    email: "demo@1shotseo.com",
    role: "admin",
    name: "Demo User",
  })

  // Create demo sites
  const sites = [
    { domain: "example.com", id: "site-1" },
    { domain: "blog.example.com", id: "site-2" },
    { domain: "shop.example.com", id: "site-3" },
  ]

  for (const site of sites) {
    await supabase.from("sites").upsert({
      id: site.id,
      org_id: "demo-org-id",
      domain: site.domain,
      status: "active",
    })
  }

  // Create demo pages
  const pages = [
    { site_id: "site-1", url: "/", cwv_lcp_ms: 1200, cwv_inp_ms: 150, cwv_cls: 0.05 },
    { site_id: "site-1", url: "/blog/seo-guide", cwv_lcp_ms: 1800, cwv_inp_ms: 200, cwv_cls: 0.08 },
    { site_id: "site-1", url: "/products", cwv_lcp_ms: 2100, cwv_inp_ms: 180, cwv_cls: 0.12 },
  ]

  for (const page of pages) {
    await supabase.from("pages").upsert({
      ...page,
      status: "active",
    })
  }

  // Create demo keywords
  const keywords = [
    { phrase: "SEO tools", intent: "Commercial" },
    { phrase: "content marketing", intent: "Informational" },
    { phrase: "keyword research", intent: "Informational" },
  ]

  for (const kw of keywords) {
    const { data: keyword } = await supabase
      .from("keywords")
      .insert({
        org_id: "demo-org-id",
        phrase: kw.phrase,
        intent: kw.intent,
        locale: "en-US",
      })
      .select()
      .single()

    if (keyword) {
      // Create demo rankings
      await supabase.from("ranks").insert({
        site_id: "site-1",
        keyword_id: keyword.id,
        date: new Date().toISOString().split("T")[0],
        position: Math.floor(Math.random() * 10) + 1,
        url: "/blog/seo-guide",
        serp_features: [],
      })
    }
  }

  // Create demo traffic data
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    await supabase.from("traffic_daily").upsert({
      site_id: "site-1",
      date: dateStr,
      sessions: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 800) + 400,
      conversions: Math.floor(Math.random() * 50) + 10,
      revenue: Math.random() * 5000 + 1000,
      channel_group: ["Organic", "Paid", "Social", "Direct"][Math.floor(Math.random() * 4)],
    })
  }

  // Create demo backlinks
  await supabase.from("backlinks").insert({
    site_id: "site-1",
    source_url: "https://example-backlink.com/article",
    target_url: "https://example.com/blog/seo-guide",
    domain: "example-backlink.com",
    first_seen: new Date().toISOString().split("T")[0],
    last_seen: new Date().toISOString().split("T")[0],
    authority: Math.floor(Math.random() * 50) + 20,
    anchor: "SEO tools",
    state: "active",
  })

  // Create demo tasks
  await supabase.from("tasks").insert({
    org_id: "demo-org-id",
    site_id: "site-1",
    type: "Technical",
    priority: "High",
    status: "todo",
    title: "Fix CWV on /products",
    description: "LCP increased by 200ms",
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })

  console.log("Demo data seeded successfully!")
}


import { seedDemoData } from "@/db/seed"
import { supabase } from "@/lib/supabase"

async function resetDemo() {
  console.log("Resetting demo data...")

  // Clear existing data (in production, be more careful)
  const tables = [
    "deliveries",
    "schedules",
    "report_templates",
    "reports",
    "ai_threads",
    "annotations",
    "tasks",
    "competitors",
    "ads_stats",
    "traffic_daily",
    "backlinks",
    "ranks",
    "keywords",
    "pages",
    "sites",
    "users",
    "orgs",
  ]

  for (const table of tables) {
    await supabase.from(table).delete().neq("id", "never-match")
  }

  // Seed fresh data
  await seedDemoData()

  console.log("Demo data reset complete!")
}

resetDemo().catch(console.error)


import { createClient } from "@clickhouse/client"

let clickhouseClient: ReturnType<typeof createClient> | null = null

export function getClickHouseClient() {
  if (!clickhouseClient) {
    clickhouseClient = createClient({
      url: process.env.CLICKHOUSE_URL || "http://localhost:8123",
      username: process.env.CLICKHOUSE_USER || "default",
      password: process.env.CLICKHOUSE_PASSWORD || "",
    })
  }
  return clickhouseClient
}


import pg from "pg";

const { Pool } = pg;

function normalizeDatabaseUrl(value: string | null) {
  if (!value || process.env.NODE_ENV !== "production") return value;
  try {
    const url = new URL(value);
    const mode = url.searchParams.get("sslmode");
    if (!mode || ["prefer","require","verify-ca"].includes(mode)) {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return value;
  }
}

export const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL || null);

export const dbPool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;


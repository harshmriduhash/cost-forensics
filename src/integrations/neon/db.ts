import postgres from "postgres";

let sql: ReturnType<typeof postgres> | undefined;

export function getNeonSql() {
  if (sql) return sql;

  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing NEON_DATABASE_URL environment variable");
  }

  sql = postgres(connectionString, {
    ssl: "require",
    max: 10,
  });
  return sql;
}

export async function closeNeonSql() {
  if (sql) {
    await sql.end();
    sql = undefined;
  }
}

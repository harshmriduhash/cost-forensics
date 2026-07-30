import { getNeonSql } from "./db";

export async function getNeonUserIdFromToken(token: string) {
  const sql = getNeonSql();

  // Placeholder implementation for Neon migration.
  // Replace this with your auth integration once you move off Supabase auth.
  const [row] = await sql`SELECT ${token}::text as placeholder_user_id`;
  return row?.placeholder_user_id ?? null;
}

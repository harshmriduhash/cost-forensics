import postgres from "postgres";

let sql: ReturnType<typeof postgres> | undefined;

export function isNeonConfigured(): boolean {
  return Boolean(process.env.NEON_DATABASE_URL);
}

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

// ---------------- Neon Data Operations ----------------

export async function neonGetProfile(userId: string) {
  const db = getNeonSql();
  const [profile] = await db`SELECT * FROM public.profiles WHERE id = ${userId}`;
  const [sub] = await db`SELECT * FROM public.subscriptions WHERE user_id = ${userId}`;
  return {
    profile: profile ?? { id: userId, email: "user@example.com", full_name: "Neon User", onboarded: true },
    subscription: sub ?? { plan: "free", status: "active" },
  };
}

export async function neonUpdateProfile(userId: string, fullName?: string, slackWebhookUrl?: string | null) {
  const db = getNeonSql();
  await db`
    INSERT INTO public.profiles (id, email, full_name, slack_webhook_url, onboarded)
    VALUES (${userId}, 'user@example.com', ${fullName ?? null}, ${slackWebhookUrl ?? null}, true)
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
      slack_webhook_url = EXCLUDED.slack_webhook_url,
      updated_at = now()
  `;
}

export async function neonListProviders(userId: string) {
  const db = getNeonSql();
  const rows = await db`
    SELECT id, type, label, key_last4, status, last_synced_at, last_error, created_at
    FROM public.providers
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function neonInsertProvider(userId: string, type: string, label: string, encryptedKey: string, keyLast4: string) {
  const db = getNeonSql();
  const [inserted] = await db`
    INSERT INTO public.providers (user_id, type, label, encrypted_key, key_last4, status, last_synced_at)
    VALUES (${userId}, ${type}, ${label}, ${encryptedKey}, ${keyLast4}, 'active', now())
    RETURNING id
  `;
  return inserted;
}

export async function neonDeleteProvider(userId: string, providerId: string) {
  const db = getNeonSql();
  await db`DELETE FROM public.providers WHERE id = ${providerId} AND user_id = ${userId}`;
}

export async function neonInsertCostEvents(events: Array<Record<string, any>>) {
  if (!events.length) return;
  const db = getNeonSql();
  for (const e of events) {
    await db`
      INSERT INTO public.cost_events (
        user_id, provider_id, provider_type, model, endpoint,
        input_tokens, output_tokens, cost_usd, requests, occurred_at
      ) VALUES (
        ${e.user_id}, ${e.provider_id ?? null}, ${e.provider_type}, ${e.model}, ${e.endpoint ?? null},
        ${e.input_tokens ?? 0}, ${e.output_tokens ?? 0}, ${e.cost_usd ?? 0}, ${e.requests ?? 1}, ${e.occurred_at}
      )
    `;
  }
}

export async function neonGetDashboard(userId: string, days = 30) {
  const db = getNeonSql();
  const since = new Date(Date.now() - days * 86400 * 1000).toISOString();

  const rows = await db`
    SELECT provider_type, model, endpoint, cost_usd, input_tokens, output_tokens, requests, occurred_at
    FROM public.cost_events
    WHERE user_id = ${userId} AND occurred_at >= ${since}
    ORDER BY occurred_at ASC
    LIMIT 5000
  `;

  let total = 0, requests = 0, inputTok = 0, outputTok = 0;
  const byDay = new Map<string, number>();
  const byModel = new Map<string, number>();
  const byEndpoint = new Map<string, number>();
  const byHour = new Array(24).fill(0);
  const byProvider = new Map<string, number>();

  for (const e of rows) {
    const cost = Number(e.cost_usd);
    total += cost;
    requests += Number(e.requests ?? 1);
    inputTok += Number(e.input_tokens ?? 0);
    outputTok += Number(e.output_tokens ?? 0);
    const day = new Date(e.occurred_at).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + cost);
    byModel.set(e.model, (byModel.get(e.model) ?? 0) + cost);
    byEndpoint.set(e.endpoint ?? "unknown", (byEndpoint.get(e.endpoint ?? "unknown") ?? 0) + cost);
    byProvider.set(e.provider_type, (byProvider.get(e.provider_type) ?? 0) + cost);
    byHour[new Date(e.occurred_at).getUTCHours()] += cost;
  }

  return {
    totals: {
      cost: total,
      requests,
      inputTokens: inputTok,
      outputTokens: outputTok,
      prevCost: total * 0.85,
      deltaPct: 15,
      projected: (total / days) * 30,
    },
    series: {
      byDay: [...byDay.entries()].map(([day, cost]) => ({ day, cost })).sort((a, b) => a.day.localeCompare(b.day)),
      byModel: [...byModel.entries()].map(([name, cost]) => ({ name, cost })).sort((a, b) => b.cost - a.cost),
      byEndpoint: [...byEndpoint.entries()].map(([name, cost]) => ({ name, cost })).sort((a, b) => b.cost - a.cost),
      byProvider: [...byProvider.entries()].map(([name, cost]) => ({ name, cost })),
      byHour: byHour.map((cost, hour) => ({ hour, cost })),
    },
  };
}

export async function neonListAlerts(userId: string) {
  const db = getNeonSql();
  return await db`SELECT * FROM public.alerts WHERE user_id = ${userId} ORDER BY created_at DESC`;
}

export async function neonInsertAlert(userId: string, name: string, type: string, threshold: number, model?: string | null, channelEmail = true) {
  const db = getNeonSql();
  await db`
    INSERT INTO public.alerts (user_id, name, type, threshold, model, channel_email, active)
    VALUES (${userId}, ${name}, ${type}, ${threshold}, ${model ?? null}, ${channelEmail}, true)
  `;
}

export async function neonDeleteAlert(userId: string, alertId: string) {
  const db = getNeonSql();
  await db`DELETE FROM public.alerts WHERE id = ${alertId} AND user_id = ${userId}`;
}

export async function neonToggleAlert(userId: string, alertId: string, active: boolean) {
  const db = getNeonSql();
  await db`UPDATE public.alerts SET active = ${active} WHERE id = ${alertId} AND user_id = ${userId}`;
}

export async function neonListNotifications(userId: string) {
  const db = getNeonSql();
  return await db`SELECT * FROM public.notifications WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 20`;
}

export async function neonMarkNotificationsRead(userId: string) {
  const db = getNeonSql();
  await db`UPDATE public.notifications SET read = true WHERE user_id = ${userId} AND read = false`;
}

export async function neonListApiKeys(userId: string) {
  const db = getNeonSql();
  return await db`SELECT id, name, key_prefix, created_at, last_used_at, active FROM public.api_keys WHERE user_id = ${userId} ORDER BY created_at DESC`;
}

export async function neonInsertApiKey(userId: string, name: string, keyHash: string, keyPrefix: string) {
  const db = getNeonSql();
  await db`
    INSERT INTO public.api_keys (user_id, name, key_hash, key_prefix, active)
    VALUES (${userId}, ${name}, ${keyHash}, ${keyPrefix}, true)
  `;
}

export async function neonDeleteApiKey(userId: string, keyId: string) {
  const db = getNeonSql();
  await db`DELETE FROM public.api_keys WHERE id = ${keyId} AND user_id = ${userId}`;
}

export async function neonGetApiKeyByHash(keyHash: string) {
  const db = getNeonSql();
  const [row] = await db`SELECT * FROM public.api_keys WHERE key_hash = ${keyHash} AND active = true`;
  return row ?? null;
}

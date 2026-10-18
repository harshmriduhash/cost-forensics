// Organization usage reports only. No synthetic usage is generated or persisted.
export type NormalizedCostEvent = {
  provider_type: 'openai' | 'anthropic'; model: string; endpoint: string | null;
  input_tokens: number; output_tokens: number; cost_usd: number; requests: number; occurred_at: string;
};

type Bucket = { start_time?: number; starting_at?: string; results?: Record<string, any>[] };
async function pages(url: URL, headers: Record<string, string>): Promise<Bucket[]> {
  const buckets: Bucket[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Usage access denied (${response.status}). Use an organization admin key with usage and billing read permissions.`);
    const body = await response.json() as { data?: Bucket[]; has_more?: boolean; next_page?: string };
    if (!Array.isArray(body.data)) throw new Error('Provider returned an invalid usage report.');
    buckets.push(...body.data);
    if (!body.has_more) return buckets;
    if (!body.next_page || seen.has(body.next_page)) throw new Error('Provider returned an invalid pagination cursor.');
    seen.add(body.next_page);
    url.searchParams.set('page', body.next_page);
  }
  throw new Error('Usage report is too large. Please contact support.');
}

export async function fetchUsage(provider: string, apiKey: string, days = 30): Promise<NormalizedCostEvent[]> {
  if (provider !== 'openai' && provider !== 'anthropic') throw new Error('This provider is not supported in the MVP.');
  const end = new Date();
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - days); start.setUTCHours(0, 0, 0, 0);
  const headers = provider === 'openai' ? { Authorization: `Bearer ${apiKey}` } : { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
  const usageUrl = new URL(provider === 'openai' ? 'https://api.openai.com/v1/organization/usage/completions' : 'https://api.anthropic.com/v1/organizations/usage_report/messages');
  const costUrl = new URL(provider === 'openai' ? 'https://api.openai.com/v1/organization/costs' : 'https://api.anthropic.com/v1/organizations/cost_report');
  for (const url of [usageUrl, costUrl]) {
    url.searchParams.set(provider === 'openai' ? 'start_time' : 'starting_at', provider === 'openai' ? String(Math.floor(start.getTime()/1000)) : start.toISOString());
    url.searchParams.set(provider === 'openai' ? 'end_time' : 'ending_at', provider === 'openai' ? String(Math.floor(end.getTime()/1000)) : end.toISOString());
    url.searchParams.set('bucket_width', '1d');
  }
  usageUrl.searchParams.append(provider === 'openai' ? 'group_by' : 'group_by[]', 'model');
  if (provider === 'anthropic') costUrl.searchParams.append('group_by[]', 'description');
  const [usage, costs] = await Promise.all([pages(usageUrl, headers), pages(costUrl, headers)]);
  const out: NormalizedCostEvent[] = [];
  const iso = (b: Bucket) => b.starting_at ?? new Date(Number(b.start_time) * 1000).toISOString();
  // Token and billing rows are deliberately separate: provider billing does not always attribute cost to a model.
  for (const b of usage) for (const r of b.results ?? []) {
    const cache = r.cache_creation ?? {};
    out.push({ provider_type: provider, model: r.model ?? 'Unknown model', endpoint: null,
      input_tokens: Number(r.input_tokens ?? r.uncached_input_tokens ?? 0) + (provider === 'anthropic' ? Number(r.cache_read_input_tokens ?? 0) + Number(cache.ephemeral_1h_input_tokens ?? 0) + Number(cache.ephemeral_5m_input_tokens ?? 0) : 0),
      output_tokens: Number(r.output_tokens ?? 0), requests: Number(r.num_model_requests ?? 0), cost_usd: 0, occurred_at: iso(b) });
  }
  for (const b of costs) for (const r of b.results ?? []) {
    const amount = provider === 'openai' ? Number(r.amount?.value ?? 0) : Number(r.amount ?? 0)/100;
    if (provider === 'openai' && r.amount?.currency && r.amount.currency !== 'usd') throw new Error('Only USD billing reports are supported.');
    if (!Number.isFinite(amount) || amount < 0) throw new Error('Provider returned an invalid billing amount.');
    out.push({ provider_type: provider, model: r.model ?? r.description ?? r.line_item ?? 'Unattributed billing', endpoint: null,
      input_tokens: 0, output_tokens: 0, requests: 0, cost_usd: amount, occurred_at: iso(b) });
  }
  return out;
}

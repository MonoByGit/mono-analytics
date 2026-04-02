import { UmamiPageviews, UmamiStats } from './types';

// Umami Cloud uses /v1/ — self-hosted Umami uses /api/
const BASE_URL = 'https://api.umami.is/v1';

function getHeaders() {
  return {
    'x-umami-api-key': process.env.UMAMI_API_KEY ?? '',
    'Content-Type': 'application/json',
  };
}

export async function getWebsiteStats(startAt: number, endAt: number): Promise<UmamiStats> {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const params = new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
    timezone: 'Europe/Amsterdam',
  });
  const url = `${BASE_URL}/websites/${websiteId}/stats?${params}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    cache: 'no-store', // always fresh — no stale 0s from cache
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Umami stats error: ${res.status} — ${body}`);
  }
  const raw = await res.json();
  // Umami Cloud v1 returns flat numbers + comparison object — transform to {value, change}
  return {
    pageviews: { value: raw.pageviews ?? 0, change: raw.comparison?.pageviews ?? 0 },
    visitors: { value: raw.visitors ?? 0, change: raw.comparison?.visitors ?? 0 },
    visits: { value: raw.visits ?? 0, change: raw.comparison?.visits ?? 0 },
    bounces: { value: raw.bounces ?? 0, change: raw.comparison?.bounces ?? 0 },
    totaltime: { value: raw.totaltime ?? 0, change: raw.comparison?.totaltime ?? 0 },
  };
}

export async function getPageviews(startAt: number, endAt: number, unit = 'day'): Promise<UmamiPageviews> {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const params = new URLSearchParams({
    startAt: String(startAt),
    endAt: String(endAt),
    unit,
    timezone: 'Europe/Amsterdam',
  });
  const url = `${BASE_URL}/websites/${websiteId}/pageviews?${params}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Umami pageviews error: ${res.status} — ${body}`);
  }
  return res.json();
}

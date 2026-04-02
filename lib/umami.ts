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
  const url = `${BASE_URL}/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Umami stats error: ${res.status} — ${body}`);
  }
  return res.json();
}

export async function getPageviews(startAt: number, endAt: number, unit = 'day'): Promise<UmamiPageviews> {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const url = `${BASE_URL}/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Umami pageviews error: ${res.status} — ${body}`);
  }
  return res.json();
}

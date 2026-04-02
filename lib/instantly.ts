import { CampaignAnalytics, CampaignAnalyticsOverview, DailyAnalytics, InstantlyCampaign } from './types';

const BASE_URL = 'https://api.instantly.ai/api/v2';

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.INSTANTLY_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function getCampaigns(): Promise<InstantlyCampaign[]> {
  const res = await fetch(`${BASE_URL}/campaigns?limit=100`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Instantly campaigns error: ${res.status}`);
  const data = await res.json();
  return data.items ?? data ?? [];
}

export async function getCampaignAnalytics(): Promise<CampaignAnalytics[]> {
  const res = await fetch(`${BASE_URL}/campaigns/analytics?limit=100`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Instantly analytics error: ${res.status}`);
  const data = await res.json();
  return data.items ?? data ?? [];
}

export async function getCampaignAnalyticsOverview(): Promise<CampaignAnalyticsOverview> {
  const res = await fetch(`${BASE_URL}/campaigns/analytics/overview`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Instantly overview error: ${res.status}`);
  return res.json();
}

export async function getDailyAnalytics(
  campaignId: string,
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> {
  const url = `${BASE_URL}/campaigns/analytics/daily?campaign_id=${campaignId}&start_date=${startDate}&end_date=${endDate}`;
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Instantly daily analytics error: ${res.status}`);
  const data = await res.json();
  return data.items ?? data ?? [];
}

// Aggregate daily analytics across all campaigns for a date range
export async function getAggregatedDailyAnalytics(
  campaigns: InstantlyCampaign[],
  startDate: string,
  endDate: string
): Promise<{ date: string; opens: number; sent: number }[]> {
  const activeCampaigns = campaigns.filter(c => c.status === 'active').slice(0, 5);

  const allDailyData = await Promise.allSettled(
    activeCampaigns.map(c => getDailyAnalytics(c.id, startDate, endDate))
  );

  const aggregated: Record<string, { opens: number; sent: number }> = {};

  allDailyData.forEach(result => {
    if (result.status === 'fulfilled') {
      result.value.forEach(day => {
        if (!aggregated[day.date]) {
          aggregated[day.date] = { opens: 0, sent: 0 };
        }
        aggregated[day.date].opens += day.opened ?? 0;
        aggregated[day.date].sent += day.sent ?? 0;
      });
    }
  });

  return Object.entries(aggregated)
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

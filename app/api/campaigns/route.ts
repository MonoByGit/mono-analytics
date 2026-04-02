import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getCampaignAnalytics } from '@/lib/instantly';

// Instantly v2 API returns numeric status codes
const STATUS_MAP: Record<number, string> = {
  1: 'active',
  2: 'paused',
  3: 'completed',
  0: 'draft',
  4: 'draft',
  5: 'stopped',
};

function normalizeStatus(status: any): string {
  if (typeof status === 'number') return STATUS_MAP[status] ?? 'unknown';
  if (typeof status === 'string') return status.toLowerCase();
  return 'unknown';
}

export async function GET(_req: NextRequest) {
  const [campaignsResult, analyticsResult] = await Promise.allSettled([
    getCampaigns(),
    getCampaignAnalytics(),
  ]);

  const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value : [];
  const analytics = analyticsResult.status === 'fulfilled' ? analyticsResult.value : [];

  const analyticsMap = new Map(analytics.map(a => [a.campaign_id, a]));

  const enriched = campaigns.map(c => ({
    ...c,
    status: normalizeStatus(c.status),
    analytics: analyticsMap.get(c.id) ?? null,
  }));

  return NextResponse.json({
    campaigns: enriched,
    error: campaignsResult.status === 'rejected' ? campaignsResult.reason?.message : null,
  });
}

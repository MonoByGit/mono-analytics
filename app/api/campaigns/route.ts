import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getCampaignAnalytics } from '@/lib/instantly';

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
    analytics: analyticsMap.get(c.id) ?? null,
  }));

  return NextResponse.json({
    campaigns: enriched,
    error: campaignsResult.status === 'rejected' ? campaignsResult.reason?.message : null,
  });
}

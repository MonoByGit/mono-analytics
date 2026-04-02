import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getCampaignAnalytics, getDailyAnalytics } from '@/lib/instantly';
import { getTimeRange } from '@/lib/dateRange';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const mode = (req.nextUrl.searchParams.get('mode') ?? 'week') as 'day' | 'week' | 'month';
  const range = getTimeRange(mode);

  const [campaignsResult, analyticsResult, dailyResult] = await Promise.allSettled([
    getCampaigns(),
    getCampaignAnalytics(),
    getDailyAnalytics(params.id, range.startDate, range.endDate),
  ]);

  const campaign = campaignsResult.status === 'fulfilled'
    ? campaignsResult.value.find(c => c.id === params.id)
    : null;

  const analytics = analyticsResult.status === 'fulfilled'
    ? analyticsResult.value.find(a => a.campaign_id === params.id)
    : null;

  const daily = dailyResult.status === 'fulfilled' ? dailyResult.value : [];

  return NextResponse.json({
    campaign,
    analytics,
    daily,
    error: dailyResult.status === 'rejected' ? dailyResult.reason?.message : null,
  });
}

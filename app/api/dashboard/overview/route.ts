import { NextRequest, NextResponse } from 'next/server';
import { getCampaignAnalyticsOverview } from '@/lib/instantly';
import { getWebsiteStats } from '@/lib/umami';
import { getTimeRange } from '@/lib/dateRange';

export async function GET(req: NextRequest) {
  const mode = (req.nextUrl.searchParams.get('mode') ?? 'week') as 'day' | 'week' | 'month';
  const range = getTimeRange(mode);

  const [instantlyResult, umamiResult] = await Promise.allSettled([
    getCampaignAnalyticsOverview(),
    getWebsiteStats(range.startAt, range.endAt),
  ]);

  return NextResponse.json({
    instantly: instantlyResult.status === 'fulfilled' ? instantlyResult.value : null,
    umamiError: umamiResult.status === 'rejected' ? umamiResult.reason?.message : null,
    umami: umamiResult.status === 'fulfilled' ? umamiResult.value : null,
    instantlyError: instantlyResult.status === 'rejected' ? instantlyResult.reason?.message : null,
  });
}

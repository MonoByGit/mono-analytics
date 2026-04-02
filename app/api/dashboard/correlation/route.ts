import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getAggregatedDailyAnalytics } from '@/lib/instantly';
import { getPageviews } from '@/lib/umami';
import { getTimeRange } from '@/lib/dateRange';
import { CorrelationDataPoint } from '@/lib/types';

export async function GET(req: NextRequest) {
  const mode = (req.nextUrl.searchParams.get('mode') ?? 'week') as 'day' | 'week' | 'month';
  const range = getTimeRange(mode);

  const [campaignsResult, pageviewsResult] = await Promise.allSettled([
    getCampaigns().then(campaigns =>
      getAggregatedDailyAnalytics(campaigns, range.startDate, range.endDate)
    ),
    getPageviews(range.startAt, range.endAt),
  ]);

  const instantlyDaily = campaignsResult.status === 'fulfilled' ? campaignsResult.value : [];
  const umamiDaily = pageviewsResult.status === 'fulfilled' ? pageviewsResult.value.pageviews : [];

  // Build a unified date map
  const dateMap: Record<string, CorrelationDataPoint> = {};

  instantlyDaily.forEach(d => {
    dateMap[d.date] = { date: d.date, opens: d.opens, pageviews: 0 };
  });

  umamiDaily.forEach(d => {
    const date = d.date.split('T')[0];
    if (dateMap[date]) {
      dateMap[date].pageviews = d.value;
    } else {
      dateMap[date] = { date, opens: 0, pageviews: d.value };
    }
  });

  const result = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    data: result,
    instantlyError: campaignsResult.status === 'rejected' ? campaignsResult.reason?.message : null,
    umamiError: pageviewsResult.status === 'rejected' ? pageviewsResult.reason?.message : null,
  });
}

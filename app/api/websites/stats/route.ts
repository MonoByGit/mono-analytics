import { NextRequest, NextResponse } from 'next/server';
import { getWebsiteStats, getPageviews } from '@/lib/umami';
import { getTimeRange } from '@/lib/dateRange';

export async function GET(req: NextRequest) {
  const mode = (req.nextUrl.searchParams.get('mode') ?? 'week') as 'day' | 'week' | 'month';
  const range = getTimeRange(mode);

  const [statsResult, pageviewsResult] = await Promise.allSettled([
    getWebsiteStats(range.startAt, range.endAt),
    getPageviews(range.startAt, range.endAt),
  ]);

  return NextResponse.json({
    stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
    pageviews: pageviewsResult.status === 'fulfilled' ? pageviewsResult.value : null,
    statsError: statsResult.status === 'rejected' ? statsResult.reason?.message : null,
    pageviewsError: pageviewsResult.status === 'rejected' ? pageviewsResult.reason?.message : null,
  });
}

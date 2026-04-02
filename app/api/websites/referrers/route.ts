import { NextRequest, NextResponse } from 'next/server';
import { getTimeRange } from '@/lib/dateRange';

export async function GET(req: NextRequest) {
  const mode = (req.nextUrl.searchParams.get('mode') ?? 'week') as 'day' | 'week' | 'month';
  const range = getTimeRange(mode);
  const websiteId = process.env.UMAMI_WEBSITE_ID;

  const url = `https://api.umami.is/v1/websites/${websiteId}/metrics?type=referrer&startAt=${range.startAt}&endAt=${range.endAt}&limit=10`;

  try {
    const res = await fetch(url, {
      headers: { 'x-umami-api-key': process.env.UMAMI_API_KEY ?? '' },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return NextResponse.json({ data: [], error: `${res.status}: ${body}` });
    }
    const data = await res.json();
    return NextResponse.json({ data: Array.isArray(data) ? data : data.data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ data: [], error: e.message });
  }
}

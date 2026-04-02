import { NextResponse } from 'next/server';
import { getTimeRange } from '@/lib/dateRange';

export async function GET() {
  const range = getTimeRange('day');
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY ?? '';

  const statsUrl = `https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${range.startAt}&endAt=${range.endAt}`;
  const metricsUrl = `https://api.umami.is/v1/websites/${websiteId}/metrics?type=url&startAt=${range.startAt}&endAt=${range.endAt}&limit=5`;

  const [statsRes, metricsRes] = await Promise.all([
    fetch(statsUrl, { headers: { 'x-umami-api-key': apiKey } }),
    fetch(metricsUrl, { headers: { 'x-umami-api-key': apiKey } }),
  ]);

  const statsBody = await statsRes.text();
  const metricsBody = await metricsRes.text();

  return NextResponse.json({
    range: { startAt: range.startAt, endAt: range.endAt, startDate: range.startDate, endDate: range.endDate },
    stats: { status: statsRes.status, body: JSON.parse(statsBody) },
    metrics: { status: metricsRes.status, body: JSON.parse(metricsBody) },
  });
}

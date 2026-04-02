import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getDailyAnalytics } from '@/lib/instantly';
import { getTimeRange } from '@/lib/dateRange';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function GET(req: NextRequest) {
  const range = getTimeRange('month'); // always use 30 days for meaningful sample

  try {
    const campaigns = await getCampaigns();
    const active = campaigns.filter(c => c.status === 'active').slice(0, 5);

    const allDaily = await Promise.allSettled(
      active.map(c => getDailyAnalytics(c.id, range.startDate, range.endDate))
    );

    const byDow: Record<number, { sent: number; opened: number }> = {};
    for (let i = 0; i < 7; i++) byDow[i] = { sent: 0, opened: 0 };

    allDaily.forEach(result => {
      if (result.status !== 'fulfilled') return;
      result.value.forEach((day: any) => {
        const date = new Date(day.date ?? day.day ?? '');
        if (isNaN(date.getTime())) return;
        const dow = date.getDay();
        byDow[dow].sent += day.sent ?? 0;
        byDow[dow].opened += day.opened ?? day.open_count ?? 0;
      });
    });

    const data = DAYS.map((day, i) => ({
      day,
      sent: byDow[i].sent,
      openRate: byDow[i].sent > 0 ? (byDow[i].opened / byDow[i].sent) * 100 : 0,
    }));

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ data: [], error: e.message });
  }
}

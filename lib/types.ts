// Instantly types
export interface InstantlyCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  timestamp_created: string;
}

export interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  total_leads: number;
  contacted_count: number;
  emails_sent_count: number;
  open_count: number;
  reply_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  opportunities_count: number;
  new_leads_contacted_count: number;
}

export interface CampaignAnalyticsOverview {
  total_leads: number;
  contacted_count: number;
  emails_sent_count: number;
  open_count: number;
  reply_count: number;
  bounced_count: number;
  opportunities_count: number;
}

export interface DailyAnalytics {
  date: string;
  sent: number;
  opened: number;
  replied: number;
  new_leads: number;
}

// Umami types
export interface UmamiStats {
  pageviews: { value: number; change: number };
  visitors: { value: number; change: number };
  visits: { value: number; change: number };
  bounces: { value: number; change: number };
  totaltime: { value: number; change: number };
}

export interface UmamiPageviewData {
  date: string;
  value: number;
}

export interface UmamiPageviews {
  pageviews: UmamiPageviewData[];
  sessions: UmamiPageviewData[];
}

// Dashboard combined types
export interface DashboardOverview {
  instantly: CampaignAnalyticsOverview;
  umami: UmamiStats;
}

export interface CorrelationDataPoint {
  date: string;
  opens: number;
  pageviews: number;
}

export interface TimeRange {
  mode: 'day' | 'week' | 'month';
  startAt: number;
  endAt: number;
  startDate: string;
  endDate: string;
}

export interface CampaignDetail {
  campaign: InstantlyCampaign;
  analytics: CampaignAnalytics;
  daily: DailyAnalytics[];
}

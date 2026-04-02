# Mono Analytics Dashboard

Personal ops dashboard combining Instantly.ai cold email analytics with Umami website traffic in one place.

## Features
- Email campaign KPIs: sent, open rate, reply rate, opportunities
- Website metrics: pageviews, visitors, sessions, duration
- Email × Web correlation chart — see how outreach drives traffic
- Campaign drill-down with funnel visualization + daily trend
- Day / Week / Month time range switcher
- PWA — installable on iPhone and desktop
- Dark mode, Apple-style design

## Setup

### 1. Clone & install
```bash
cd mono-analytics
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
INSTANTLY_API_KEY=your_key_here
UMAMI_API_KEY=your_key_here
UMAMI_WEBSITE_ID=your_website_id_here
```

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Railway
1. Push to GitHub
2. Connect repo in Railway
3. Add env vars in Railway dashboard
4. Deploy — Railway uses `railway.json` automatically

## PWA Install
- **iPhone**: Open in Safari → Share → Add to Home Screen
- **Desktop**: Click install icon in address bar (Chrome/Edge)

## API Routes
| Route | Description |
|-------|-------------|
| `GET /api/dashboard/overview?mode=week` | Combined KPIs |
| `GET /api/dashboard/correlation?mode=week` | Opens + pageviews by day |
| `GET /api/campaigns` | All campaigns with analytics |
| `GET /api/campaigns/[id]/detail?mode=week` | Campaign drill-down |
| `GET /api/websites/stats?mode=week` | Umami website stats |

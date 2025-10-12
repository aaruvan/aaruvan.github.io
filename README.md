# Daily Market Brief

> **Live Demo:** [aaruvan.github.io](https://aaruvan.github.io)

A modern, automated daily market insights platform that synthesizes financial social media content into structured, actionable market briefs.

## 🚀 Features

### Frontend
- **React 18 + TypeScript** - Type-safe component architecture
- **Tailwind CSS** - Modern, responsive utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive data visualizations (conviction distribution charts)
- **Dark Mode** - System preference detection with manual toggle
- **Search & Filter** - Real-time filtering by ticker or keyword
- **Responsive Design** - Mobile-first approach

### Backend Automation
- **Google Apps Script** - Scrapes financial social media via Jina.ai/Nitter proxy
- **n8n Workflow** - Orchestrates daily automation pipeline
- **OpenAI GPT-4** - Generates structured JSON with insights, watchlist, and sources
- **GitHub API** - Automatically updates data file with new briefs

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  Apps Script    │────▶│     n8n      │────▶│  OpenAI     │
│  (Data Scraper) │     │  (Workflow)  │     │  (Analysis) │
└─────────────────┘     └──────────────┘     └─────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │  GitHub API  │
                        │ (Update JSON)│
                        └──────────────┘
                                │
                                ▼
                        ┌──────────────┐
                        │ React App    │
                        │(Static Site) │
                        └──────────────┘
```

### Data Flow
1. **Apps Script** (Cron: Daily) → Scrapes tweets via Jina.ai proxy → Cleans & deduplicates → Writes to Google Sheets
2. **n8n** (Cron: Daily) → Reads from Sheets → Sends to OpenAI for analysis
3. **OpenAI** → Returns structured JSON (summary, insights, watchlist, sources)
4. **n8n** → Formats HTML email + Updates `briefs.json` via GitHub API
5. **React App** → Fetches `briefs.json` at runtime → Renders interactive UI

## 📊 Data Structure

```typescript
interface Brief {
  id: string;              // YYYY-MM-DD
  date: string;            // ISO date
  subject: string;         // "Market Brief — October 12, 2025"
  json: {
    summary: string;
    insights: Array<{
      ticker: string;
      bullet: string;
      horizon: 'short-term' | 'long-term' | 'uncertain';
      conviction: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    watchlist: Array<{
      ticker: string;
      why: string;
      horizon: string;
      recommendation: string;
    }>;
    sources: Array<{
      url: string;
      note: string;
    }>;
  };
}
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| **Build** | Vite |
| **Hosting** | GitHub Pages |
| **Automation** | n8n, Google Apps Script |
| **AI** | OpenAI GPT-4 |
| **Data** | Google Sheets, JSON |

## 📦 Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

The app auto-deploys to GitHub Pages:

```bash
# Build
npm run build

# Deploy (copy dist to root)
cp -r dist/* .

# Commit and push
git add -A
git commit -m "Deploy"
git push origin main
```

## 🔄 n8n Integration

The React app is designed to work seamlessly with n8n automation:

1. **n8n outputs** structured JSON matching the `Brief` interface
2. **GitHub API node** appends new entries to `public/briefs.json`
3. **React app** fetches updated data at runtime (no rebuild needed)

### n8n Workflow Overview
- **Trigger:** Cron (daily)
- **Nodes:** Google Sheets → Code (parse) → OpenAI → Code (format) → GitHub API
- **Output:** Updates `briefs.json` with new daily brief

## 📈 Key Highlights for Resume

- **Full-stack automation** from data scraping to deployment
- **Type-safe React architecture** with TypeScript
- **Modern UI/UX** with animations and dark mode
- **Data visualization** with interactive charts
- **RESTful integration** with GitHub API
- **CI/CD workflow** with automated deployments
- **Real-time search** and filtering
- **Responsive design** for mobile/desktop

## 📝 Future Enhancements

- [ ] Export briefs as PDF
- [ ] Ticker performance tracking over time
- [ ] Email subscription for new briefs
- [ ] Multi-language support
- [ ] Advanced filtering (by conviction, horizon, sector)
- [ ] Historical trend visualization

## 👨‍💻 Author

**Aarush Agrawal**  
Built with React, TypeScript, and automation

---

*This project demonstrates proficiency in modern frontend development, workflow automation, and AI integration.*


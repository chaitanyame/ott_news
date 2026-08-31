# OTT Weekly Releases

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://chaitanyame.github.io/ott_news/)
[![Update & Deploy](https://github.com/chaitanyame/ott_news/actions/workflows/update-deploy.yml/badge.svg)](https://github.com/chaitanyame/ott_news/actions/workflows/update-deploy.yml)

A lightweight static web application that displays weekly OTT streaming platform releases in a blog post format, with automated daily updates and multi-region support for the **United States** and **India**.

🔗 **[Live Demo](https://chaitanyame.github.io/ott_news/)**

## Features

- 📺 **29 streaming platforms** across two regions — US and India
- 🌍 **Auto-detect your country** from browser timezone (overridable via toggle)
- 🔄 **Automated daily updates** via GitHub Actions (9 AM UTC) using Perplexity AI
- 📦 **Zero dependencies** — vanilla HTML, CSS, JavaScript (no frameworks, no build step)
- 🌙 **Dark/Light theme toggle** with persistent `localStorage` preference
- ⚡ **Fast loading** with inlined critical CSS
- 📱 **Responsive design** for mobile, tablet, and desktop
- ♿ **Accessible** with ARIA attributes and skip navigation
- 🗂️ **Archive navigation** with hash-based routing
- 🔗 **Shareable URLs** for specific weeks
- 🖼️ **Platform logos** — SVG icons for every supported streaming service

## Multi-Region Support

The app tailors content based on your location, showing relevant streaming platforms for each market.

### 🇺🇸 United States Platforms
| Platform | Logo |
|----------|------|
| Netflix, Prime Video, Disney+, Hulu, Apple TV+ | Major US streamers |
| Max, HBO, Paramount+, Peacock | Premium & cable networks |
| Discovery+, Starz, Mubi, Tubi, Pluto TV | Niche & free streaming |
| Criterion Channel, Crunchyroll | Curated & anime |

### 🇮🇳 India Platforms
| Platform | Logo |
|----------|------|
| Netflix, Prime Video, Disney+ Hotstar | Global leaders (India catalog) |
| JioCinema, Zee5, SonyLIV | Homegrown streamers |
| Hoichoi, Aha, SunNXT, Chaupal | Regional language platforms |
| ManoramaMax, ETV Win, Planet Marathi | State-specific content |
| Discovery+ | Documentaries |

## Getting Started

### Prerequisites

- Node.js 18+
- A Perplexity API key

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/chaitanyame/ott_news.git
   cd ott_news
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your PERPLEXITY_API_KEY
   ```

4. Start a local server:
   ```bash
   npx http-server . -p 3000
   ```

5. Open http://localhost:3000 in your browser.

### Running Tests

```bash
# Run all Playwright tests
npx playwright test

# Run tests for a specific browser
npx playwright test --project=chromium

# Run tests with UI mode
npx playwright test --ui
```

### npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start a local dev server at `http://localhost:3000` |
| `npm test` | Run all Playwright E2E tests |
| `npm run test:unit` | Run Jest unit tests (`tests/build/`) |
| `npm run test:e2e` | Run Playwright E2E tests (`tests/features/`) |
| `npm run test:all` | Run unit **and** E2E tests |
| `npm run test:ui` / `test:headed` | Run Playwright in UI or headed mode |
| `npm run test:report` | Open the Playwright HTML test report |
| `npm run fetch-releases` | Fetch the latest releases from the Perplexity API |
| `npm run validate-json` | Validate `data/current-week.json` syntax |

> 💡 `npm start` uses `http-server` with `-c-1` (cache disabled) so you never see stale data while developing.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | API key for Perplexity AI | Yes |
| `FORCE_UPDATE` | Set to `true` to bypass the cache and refresh data regardless | No |

> `FORCE_UPDATE` is a local/script convenience flag — when deploying via the CI workflow you can pass `force_update` from the **Run workflow** dialog instead.

### GitHub Secrets

For automated updates, add the following secret to your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `PERPLEXITY_API_KEY`
4. Value: Your Perplexity API key

## Deployment

### GitHub Pages

1. Go to **Settings** → **Pages**
2. Source: Deploy from a branch
3. Branch: `main` (or your default branch)
4. Folder: `/ (root)`
5. Click **Save**

The site will be available at `https://{username}.github.io/ott_news/`

## Automation Workflows

The repository ships three GitHub Actions workflows (in `.github/workflows/`):

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **Update & Deploy** | `update-deploy.yml` | Daily 09:00 UTC + push to `dev`/`main` + manual | Fetches the latest releases via Perplexity, commits data changes, then deploys to Pages. Creates an auto-failure issue if the API call fails. |
| **Deploy to GitHub Pages** | `deploy-pages.yml` | Push to `dev`/`main` or manual | Builds the site with the Jekyll passthrough and publishes to Pages. |
| **Fetch Custom Date Range** | `fetch-custom-dates.yml` | Manual (`workflow_dispatch`) | Backfills releases for a past or future week via `scripts/fetch-releases-custom.js` — run it with a start/end date, target country, and optional "save as current" flag. |

### Generating data for a custom week

1. Go to **Actions** → **Fetch Custom Date Range** → **Run workflow**.
2. Set `Start date` / `End date` (e.g. `2025-11-25` … `2025-12-01`).
3. Pick a `Country` (`us`, `india`, or `both`) and toggle `Save as current` to overwrite the live current-week data.
4. Run — the workflow validates the dates, fetches, commits the data files, and triggers a Pages deploy.

> Because `fetch-data` runs on a **self-hosted** runner while the deploy job uses `ubuntu-latest`, the API-fetch and publishing steps are cleanly separated.

## Project Structure

```
ott_news/
├── index.html              # Main HTML file
├── assets/
│   ├── css/main.css       # Styles with CSS variables
│   ├── js/app.js          # Main application logic
│   └── images/logos/      # Platform logos
├── data/
│   ├── current-week.json  # Current week's releases
│   ├── archive/           # Archived weekly data
│   └── archive-index.json # Archive navigation index
├── scripts/
│   ├── fetch-releases.js  # API data fetcher
│   └── utils/             # Utility modules
├── tests/
│   ├── features/          # E2E Playwright tests
│   └── build/             # Unit tests
└── .github/
    └── workflows/
        ├── update-deploy.yml        # Daily data fetch + Pages deploy
        ├── deploy-pages.yml         # Static Pages build & publish
        └── fetch-custom-dates.yml   # Manual backfill for custom weeks
```

## API Usage

This project uses the Perplexity API with the `sonar` model for fetching release data. The API is called once daily by the GitHub Actions workflow, keeping costs minimal.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Development Methodology

This project follows **Test-Driven Development (TDD)** principles with the [Agent Harness Framework](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

### TDD Compliance Summary

| Category | Count | Description |
|----------|-------|-------------|
| ✅ TDD Compliant | 15 | Test written first → failed → implementation → passed |
| 📦 Infrastructure | 15 | Setup/config features (no tests needed) |
| ⚠️ Partial TDD | 5 | Tests exist but written after implementation |

### TDD Enforcement Gates

Every feature with tests must pass through:

1. **Gate 1 (RED)**: Write test, run it, verify it **fails**
2. **Gate 2 (GREEN)**: Implement code, run test, verify it **passes**
3. **Gate 3 (REFACTOR)**: Clean up code while keeping tests green

### Features with Full TDD

- HTML Structure, CSS Styling, JavaScript Rendering
- Date/Week Utilities, API Client, Prompt Template
- JSON Parser, Caching, Error Handling, Week Transition
- Archive Generator, Archive Navigation, Archive Loading
- URL Routing, Back to Current Button

### Features with Partial TDD

These features have passing tests but were implemented before writing tests (during batch implementation session):

- F23: Optimize Assets
- F26: Lighthouse Audits
- F27: Accessibility Audit
- F32: Cross-Browser Testing
- F33: Mobile Device Testing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Anthropic's Agent Harness Framework](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- Data powered by [Perplexity AI](https://www.perplexity.ai/)

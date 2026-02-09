# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```




AI-Powered Website Analyzer: System Design and Features
Overview: The system ingests a website (URL or uploaded HTML), then runs parallel analyses of SEO, User Experience (UX), Performance, and Content. A React frontend provides input and visualized results, while a backend (Node.js/Python) handles scraping, data extraction, AI/ML analysis, and reporting. We suggest a modular microservices or service-oriented architecture: separate services for crawling/rendering, SEO audit, UX evaluation, performance testing, and content/NLP analysis. The frontend can use React with charting libraries (e.g. Chart.js or D3) and a UI toolkit (Material-UI, Ant Design, etc.), communicating via REST/WebSocket to backend APIs. Storage (MongoDB/PostgreSQL) may hold historical reports, benchmarks or user accounts. Cloud functions (e.g. AWS Lambda) or containerized services can scale scraping and AI tasks. Tech Stack Highlights:
Frontend: React (possibly TypeScript), UI libraries (Material-UI or Chakra), visualization (Chart.js/Echarts) for scores, tables, charts.
Backend: Node.js/Express or Python (FastAPI/Flask). Node.js can orchestrate modules; Python excels at ML/NLP tasks. Use headless browsers (Puppeteer or Playwright) for real-time crawling; fallback to simple HTTP fetch + Cheerio for static HTML.
Data Sources/APIs: Google PageSpeed/Lighthouse (via API or Node CLI) for performance/SEO audits; Google Mobile-Friendly and Chrome User Experience (CrUX) report for real-world metrics; Optional: Moz/Ahrefs APIs for domain authority and backlinks; Bing/Microsoft Clarity APIs for heatmaps; OpenAI or other LLM APIs for content analysis/suggestions.
AI/ML Components: NLP libraries (spaCy, HuggingFace Transformers, textstat for readability), grammar/spell-check (LanguageTool or AWS Comprehend), language models (GPT-4 via API or open-source alternatives) for generating insights. For advanced UX: computer vision (CV) models or saliency prediction networks to simulate attention (e.g. using a model akin to the “AGD” webpage saliency model
), and anomaly detection (e.g. unsupervised clustering of site metrics vs benchmarks).
A high-level architecture might look like:
[User Input (URL/HTML)] 
      | 
[Crawling/Rendering Service]   →  Stores raw HTML/screenshot
      | 
├─[SEO Analysis Module]      (Zillow’s SEOLint rules, meta/heading audits, robots/sitemap checks):contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
├─[Performance Module]       (Puppeteer metrics + Lighthouse audits:contentReference[oaicite:4]{index=4}; PageSpeed Insights API)
├─[UX Analysis Module]       (Accessibility via axe-core; mobile/responsive check; layout analysis; predictive heatmaps:contentReference[oaicite:5]{index=5}; heuristics scoring)
└─[Content/NLP Module]       (Text extraction, readability scores:contentReference[oaicite:6]{index=6}, keyword analysis, semantic NER, LLM-based content evaluation:contentReference[oaicite:7]{index=7})
      |
[Aggregator/AI Engine]        (Combines metrics, uses LLM to summarize insights and recommendations)
      |
[Results/Recommendations]     (Returned to React frontend; visuals + narrative advice)
Each analysis module produces metrics and raw findings, which are fed into an AI summarizer or rule-based engine to generate user-friendly recommendations. For example, missing SEO elements or slow resources become bullet-point fixes, and the LLM can craft prose explanations.
Features & Workflows by Module
1. SEO Module
Features:
On-Page Audit: Check HTML for SEO best practices. For instance, enforce exactly one <h1> tag, a <title> (≤60 chars), and a <meta description> (50–300 chars)
. Verify all images have alt text (empty if purely decorative)
. Detect missing or duplicate meta titles/descriptions. Ensure canonical tags and valid hreflang links.
Technical SEO: Fetch robots.txt, sitemap.xml, check for blocked resources. Verify no HTTP→HTTPS redirect chains or mixed content. Check URL structure consistency (e.g. trailing slashes)
. Optionally use Google’s Mobile-Friendly Test API and check SSL, security headers.
Content Signals: Analyze keyword usage (TF-IDF or frequency of target keywords) and semantic relevance. Use an LLM or NLP to estimate content-topic alignment (e.g. compare page content vs. Google’s top SERP snippets for target keywords). Check structured data (JSON-LD) presence.
Scoring & Recommendations: Aggregate into an SEO score and actionable tips: e.g. “Add a unique H1”, “Shorten title to <60 chars”, “Compress alt text missing”, etc. Optionally benchmark versus competitor domains (via APIs like Moz or a simple site comparison) to contextualize performance.
Workflow: Crawl the page (with JS-rendering if needed), parse HTML (via Cheerio). Run SEOLint-like rules
 and Lighthouse SEO audits. Query Google Search Console or APIs for index status if available. Collect data on meta, headings, links, load statuses, then generate a report. Possible AI: Use GPT/Claude to rewrite weak titles or descriptions, or to summarize SEO gaps in natural language. For example, feed the extracted HTML to an LLM prompt that highlights missing elements (like in the n8n workflow
).
2. Performance Module
Features:
Load Metrics: Automate Google Lighthouse or PageSpeed Insights to measure Core Web Vitals: LCP (Largest Contentful Paint), FID/INP (Input latency), CLS (Cumulative Layout Shift), TTFB, etc. Lighthouse (CLI or Node module
) gives a complete audit including performance and accessibility.
Resource Analysis: Using Puppeteer or WebPageTest, record network waterfall: count/size of images, JS, CSS, fonts. Identify largest resources and suggest optimization (e.g. “Enable compression for images >100KB”, “Defer non-critical JS”). Use Puppeteer’s page.metrics() or Chrome DevTools Protocol for timings.
Best Practices: Check caching headers, GZIP/Brotli usage, HTTP/2 or QUIC usage, minimize DOM size, font-swap issues, etc.
Mobile Performance: Test on emulated slow network (3G/4G) and small viewport. Use Lighthouse’s mobile mode.
Scoring & Recommendations: Present a performance score and list issues (e.g. “Reduce server response time”, “Eliminate render-blocking JS”). Emphasize fixes like image compression, lazy-loading, code splitting, CDN.
Workflow: For each URL: run Lighthouse (Node CLI or Chrome DevTools API) on desktop and mobile. Parse the JSON output for scores and audits. Optionally, run specialized tests (e.g. image format analyzer, single-page app metrics). Tools: Google Lighthouse (open-source) provides automated audits
. Alternatively use Google PageSpeed Insights API for similar metrics. For specific metrics, libraries like Puppeteer can measure TTFB or parse performance.timing.
3. User Experience (UX) Module
(Focus Area)
Features:
Accessibility Checks: Integrate axe-core (Deque) to automatically detect WCAG violations (color-contrast, missing alt text, form labels, ARIA attributes). This ensures the site is usable by all users.
Layout & Design Heuristics: Evaluate the page structure: count interactive elements (links/buttons), form fields, and their sizes (to avoid tiny touch targets). Check if main CTA/button is visible “above the fold” (e.g. using Puppeteer to get screenshot and analyzing bounding boxes of high-impact elements). Ensure font sizes are legible, headings are hierarchical, and content is chunked (paragraphs, lists).
Mobile/Responsive: Confirm <meta name="viewport"> and responsive CSS. Detect fixed or overflowing elements on mobile. Possibly use Google’s Mobile-Friendly Test API.
Engagement & Flow: Estimate how easily a user can complete key tasks (e.g. finding contact info or CTA). As a hackathon proxy, use simple heuristics: “number of clicks to reach [Contact] page” (if links exist), or “forms that are missing feedback for errors”. Highlight any suspicious pop-ups or autoplay media that frustrate UX.
Predictive Attention (Advanced): Employ AI for heatmap simulation. Microsoft Clarity’s new “Predictive Heatmaps” shows how AI can forecast click/scroll hotspots
. Similarly, we can run a CV/saliency model on the page screenshot to predict user gaze. Recent research (“AGD”) uses deep nets to predict saliency on web layouts
. Even a heuristic: assume faces and headlines are most engaging. This heatmap helps suggest moving key content into hot zones.
Conversion Heuristics: Using known UX principles (like Nielsen’s usability heuristics), score issues like “consistency & standards” or “error prevention”. For example, ensure navigation is consistent, CTAs have clear labels. If desired, train a simple model on features (load time, bounce rates from CrUX, number of errors) vs. known conversion rates to predict a “UX conversion score”.
Workflow: After rendering the page (with JS), run axe-core and other accessibility audits. Analyze the DOM: find layout patterns (e.g. large hero banners vs. empty whitespace). Optionally use a headless browser to simulate clicking or scanning the page (e.g. checking for forms or search bars). For heatmaps, feed the screenshot to an attention model or use an API. Combine metrics into an overall UX score (e.g. 0–100). AI Components:
Attention Prediction: Use a pre-trained visual saliency model (like the AGD model
) to generate a heatmap of likely fixations.
LLM-based Heuristics: Prompt an LLM to “critique this webpage layout” given textual features (“There is a banner but no CTA visible” or extracted text of hero section), producing UX advice.
Predictive UX Score: Optionally, gather Chrome UX Report (CrUX) metrics for Core Web Vitals and use a regression model to predict expected bounce rates or satisfaction.
Recommendations: Suggest removing UX friction: e.g. “Add descriptive labels on buttons for clarity”, “Ensure content isn’t hidden behind a non-cancelable modal”, “Improve color contrast to at least 4.5:1”. Use natural language from the AI summarizer to explain impact of each issue.
4. Content Module
Features:
Text Extraction: Pull all visible text (HTML body content, excluding nav/footer boilerplate). Detect language automatically.
Readability & Grammar: Compute readability metrics (Flesch Reading Ease, Flesch-Kincaid grade level, Gunning Fog, etc.) using a library like [textstat]
. Check grammar/spelling with LanguageTool or a similar API. Generate a “readability score” (e.g. 0–100) and highlight overly complex sentences or jargon.
Keyword & Topic Analysis: Use NLP to extract key terms, entities (brands, locations), and measure keyword density. Compare the text against SEO keyword recommendations (via an API or search query analysis).
Sentiment & Tone: (Optional) Gauge sentiment or formality to ensure brand consistency. Use a sentiment model or an LLM prompt.
Content Uniqueness: (Optional/Risks) Check for duplicate content (simple N-gram check against a search API or Known dataset) to avoid penalties.
NLP Summary: Provide a brief summary of the page’s content and audience clarity (via GPT or extractive summarization). This helps the user quickly understand content health.
Scoring & Suggestions: Assign a content score based on factors like word count, readability, grammar. Offer suggestions such as “shorten sentences”, “use active voice”, or “add subheadings for structure”. If keyword analysis finds gaps, advise including relevant terms naturally.
Workflow: After text extraction, run readability library (textstat
) and grammar checks. Use spaCy or HuggingFace NER to list prominent entities. If an LLM is available, feed the text and ask for “3 improvements to make this content more engaging/clear”. AI Components:
LLM Critique: Use GPT-style API to “evaluate writing quality” and propose rewrite of headings or introduction for impact.
Embedding Models: Cluster page text vs. successful competitor pages (if available) to suggest topical extensions.
Plagiarism Detector: (If legal & resources allow) check content uniqueness using an AI model like GPT to flag non-original text.
Citations: The n8n example workflow extracts features (headings, meta, etc.) and then runs an LLM to produce an “AI readability score and actionable recommendations”
. We would do similarly for our content analysis.
Advanced Concepts & Enhancements
Predictive UX/Attention Modeling: As noted, leverage ML to forecast user attention. Clarity’s predictive heatmaps
 are a cutting-edge example: they use historical data to show future click hotspots. In our context, a pre-trained model (based on eye-tracking data
) could simulate where a new page will draw attention. This is an advanced, optional feature to differentiate the hackathon project.
Dynamic AI Scoring: Instead of static thresholds, train models on labeled datasets. For instance, use Chrome UX Report (CrUX) dataset to map Core Web Vitals to percentile benchmarks. Or collect sample sites with known conversion rates to train a regression (features: load time, image count, headings count, accessibility errors → target: conversion rate or satisfaction score
). Even a simple linear model can yield a “UX prediction score”.
Heatmap & Scroll Prediction: Besides heatmaps, simulate scroll depth or click streams using ML. One could parse a site’s navigation structure and estimate the “user path efficiency” (e.g., number of clicks to key content), perhaps using Markov chains on inferred link graphs.
NLP Readability Enhancements: Use modern NLP for readability beyond formulas. For example, compute text perplexity or use GPT to paraphrase complex sentences in simpler terms. Tools like OpenAI’s guidelines or Coh-Metrix metrics could also be cited.
Visual Aesthetics: Optionally analyze color schemes (using UI/UX design rules: harmonic palettes vs. clashing colors), or count UI elements per view to gauge clutter. These are advanced but could impress judges.
Dataset & Tools:
Chrome UX Report (CrUX): Public dataset of real-user web performance metrics (Core Web Vitals for millions of domains). Can benchmark the user’s site against industry norms.
Common Crawl / BigQuery: For large-scale content analysis or plag detection (if needed).
Axe-core (Deque) for accessibility (open source).
Google’s Open Source Web Vitals Library for measuring metrics in browser or Puppeteer.
NPM packages: seolint
 (Zillow SEO lint) can be integrated or used as inspiration. lighthouse for Node is available via npm
. textstat for Python readability (or its Node equivalents). axios/node-fetch for HTTP, cheerio for HTML parsing.
LLM APIs: OpenAI, Anthropic, or HuggingFace inference API for NLP analysis and natural-language recommendations.
Vis.js / Mermaid: If including diagrams in the frontend or documentation.
Risks & Mitigations
Scraping Difficulties: Some sites block bots or use heavy JS. Mitigation: Use headless Chrome (Puppeteer) with realistic user-agent, limit concurrency to avoid rate-limits, and handle CAPTCHAs (prompt user for manual fetch if needed). Provide an option to upload static HTML as a fallback.
Performance Bottlenecks: Real-time analysis (especially Lighthouse or LLM calls) can be slow. Mitigation: Run heavy tasks asynchronously (e.g. background jobs). Cache results for repeated scans. Show progress indicators in UI. Optionally sample only key pages of a site (e.g. homepage plus 2 subpages).
API Limits: Reliance on third-party APIs (OpenAI, Google) risks quota limits. Mitigation: Allow configuration of API keys; degrade gracefully (e.g. skip LLM suggestions if no key). Provide local alternatives (like spaCy or a small LLM) for offline mode.
Accuracy/False Positives: Automated audits can misinterpret complex layouts. Mitigation: Flag each finding with a confidence or give concrete examples. Encourage user review: e.g. “Check this manually: item X may or may not be an issue.” Provide references or links (like how Lighthouse explains each audit
).
Legal/IP Concerns: Analyzing content (especially images or text) may raise copyright issues. Mitigation: Warn users not to upload copyrighted content without permission. For scraping, respect robots.txt and fair use guidelines.
Security: Scanning user-provided URLs could expose the system to XSS or malware. Mitigation: Sanitize all inputs, run scrapers in a secure sandbox or container. Use antivirus scanning on downloaded files.
User Data Privacy: If storing any site or user info, comply with privacy norms. Mitigation: Only store what’s necessary (e.g. anonymous report data), and secure credentials.
Biases in AI: LLM suggestions may be biased or irrelevant. Mitigation: Always present raw metrics alongside AI commentary. Use domain-specific prompts to ground the AI. Allow users to provide feedback or ignore AI tips.
Competition with Existing Tools: Many audit tools exist (Lighthouse, SEMrush, Moz). Our edge must be deeper UX analysis and genuinely integrated AI insights. Emphasize unique features (predictive heatmaps, AI-generated advice) and ensure all four categories are robust.
Sources: We draw on best practices and research for each domain. For example, standard SEO rule-checks (e.g. one H1 per page) come from tools like Zillow’s SEOLint
. Lighthouse documentation confirms it audits performance, SEO, accessibility, etc.
. The importance of readability and content quality is supported by recent AI content research
. Emerging UX techniques like predictive heatmaps (e.g. Microsoft Clarity) show how AI can forecast user interactions
, and academic models (the “AGD” saliency model) demonstrate attention prediction on webpage layouts
. These inform our advanced features for competitive advantage.
Citations

Predicting visual attention in graphic design documents

Implementation Plan - AI-Powered Website Analyzer
Goal
Build a full-stack tool that analyzes websites for SEO, Performance, UX, and Content using AI/ML and standard metrics, within a 20-hour hackathon timeframe.

User Review Required
IMPORTANT

API Key Strategy: Since this is a hackathon, we will prioritize FREE tiers and Open Source libraries to avoid costs.

LLM: Groq (Llama3 70b is fast/free for limited use) or HuggingFace Inference API.
Performance/SEO: Google PageSpeed Insights API (Free quota) or local Lighthouse.
NLP: textstat, natural (Node libraries) + Local heuristics to save API calls.
Tech Stack
Frontend: React + Vite + Tailwind CSS + Recharts (for viz).
Backend: Node.js + Express.
Scraping: Puppeteer (Core for rendering), Cheerio (Fast static analysis).
Analysis Tools:
lighthouse (npm)
axe-core (Accessibility)
natural / textstat (Content analysis)
Proposed Architecture
⚠️ Failed to render Mermaid diagram: Parse error on line 2
graph TD
    User[User (Browser)] -->|Input URL| Front[React Frontend]
    Front -->|POST /analyze| API[Express Backend]
    
    subgraph Backend Services
        API -->|Launch| Puppeteer[Puppeteer/Chrome]
        Puppeteer -->|HTML/Screenshots| Extractor[Data Extractor]
        
        Extractor -->|HTML| SEO[SEO Module (Cheerio)]
        Extractor -->|Runtime Metrics| Perf[Performance (Lighthouse)]
        Extractor -->|DOM Tree| UX[UX Module (Axe + Heuristics)]
        Extractor -->|Text Content| Content[Content Module (NLP + LLM)]
        
        Content -->|Prompt| LLM[Groq/OpenAI API]
    end
    
    SEO --> Result Aggregator
    Perf --> Result Aggregator
    UX --> Result Aggregator
    LLM --> Result Aggregator
    
    Result Aggregator -->|JSON| Front
Free APIs & Resources List
Google PageSpeed Insights API:
Usage: Performance & Core Web Vitals.
Cost: Free (generous quota).
Groq API (Llama 3):
Usage: Fast AI summaries, Content suggestions.
Cost: Free beta access (very fast).
Fallback: HuggingFace Inference API (free tier).
HuggingFace Inference API:
Usage: Sentiment analysis, Topic classification (if needed).
Cost: Free tier.
LanguageTool API (Public):
Usage: Grammar checking.
Cost: Free (rate limited).




Task Checklist: AI-Powered Website Analyzer
Phase 1: Project Setup & Architecture (Hour 0-1)
 Initialize project root and folder structure (frontend/backend)
 Initialize Git repository
 Set up Backend (Node.js/Express) skeleton
 Set up Frontend (React/Vite) skeleton
 Create API research document (Free APIs)
Phase 2: Core Backend Services (Hour 1-4)
 Implement Scraper Service (Puppeteer/Cheerio)
 Implement API Routes Structure (SEO, UX, Performance, Content)
 Set up MongoDB connection (if needed for history, else memory)
Phase 3: Modules Implementation (Hour 4-12)
SEO Module
 Basic HTML parsing (Meta tags, H1, Alt text)
 API Logic: Google PageSpeed Insights (SEO score)
 AI Logic: Mock/Implement simple rule-based checks
Performance Module
 Integrate Google Lighthouse (Node CLI or API)
 Extract Core Web Vitals
Content/NLP Module
 Text extraction from HTML
 Readability analysis (node-textstat or similar)
 AI Integrations: Groq/HuggingFace Free Inference basics
UX Module
 Integration of axe-core for accessibility
 Basic heuristics (link counts, responsiveness checks)
Phase 4: Frontend Development (Hour 12-16)
 Landing Page (URL Input)
 Dashboard/Results Page layout
 Visualizations (Charts for scores)
 Detailed Report Components (SEO, UX, Perf, Content)
Phase 5: Integration & Polish (Hour 16-20)
 Connect Frontend to Backend APIs
 Error handling & Loading states
 Final UI aesthetics (Tailwind/MUI)
 Testing & Bug fixing

 
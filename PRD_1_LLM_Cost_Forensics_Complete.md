# PRODUCT 1: LLM COST FORENSICS
## Complete Product Requirements Document

**Version:** 1.0  
**Status:** Ready for Development  
**Last Updated:** July 24, 2026  
**Owner:** Harsh (Founder/CTO)  
**Target Launch:** 6 weeks  

---

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Market Research & Analysis](#market-research--analysis)
3. [Product Vision & Strategy](#product-vision--strategy)
4. [User Personas & Journey Maps](#user-personas--journey-maps)
5. [Problem Statement & Solution](#problem-statement--solution)
6. [Feature Specifications](#feature-specifications)
7. [User Experience & Flows](#user-experience--flows)
8. [Information Architecture](#information-architecture)
9. [Frontend Specifications](#frontend-specifications)
10. [Backend Architecture](#backend-architecture)
11. [API Specifications](#api-specifications)
12. [Database Schema](#database-schema)
13. [AI Integration & Optimization Engine](#ai-integration--optimization-engine)
14. [Infrastructure & Deployment](#infrastructure--deployment)
15. [Security & Compliance](#security--compliance)
16. [Launch Readiness Checklist](#launch-readiness-checklist)

---

## EXECUTIVE SUMMARY

### What is LLM Cost Forensics?

**LLM Cost Forensics** is a SaaS platform that helps AI-powered startups and enterprises understand, optimize, and reduce their Large Language Model (LLM) spending.

**The Problem:**
- AI startups spend $5K-$500K/month on LLM APIs (OpenAI, Claude, Cohere, etc.)
- <60% can explain where their costs come from
- Most discover overspending only after invoice arrives
- No clear optimization path without hiring a DevOps engineer

**The Solution:**
Connect your LLM provider → Get instant cost breakdown → Receive AI-powered optimization recommendations → Implement fixes → Save 30-60% monthly costs

### Core Value Proposition

> **"Find every dollar your LLM is wasting. Optimize without sacrificing quality."**

### Key Metrics (Year 1 Target)

| Metric | Target |
|--------|--------|
| **Customers (EOY)** | 40-50 paying |
| **MRR (End of Year)** | $14K-18K |
| **ARR (End of Year)** | $168K-216K |
| **Customer Acquisition Cost** | <$500 |
| **LTV:CAC Ratio** | >3:1 |
| **Churn Rate** | <5% monthly |

### Business Model

**Freemium SaaS:**
- **Free Tier:** Basic cost dashboard (no recommendations)
- **Pro Tier:** $299/month → Detailed analysis + optimization recommendations
- **Enterprise Tier:** Custom pricing ($1,200-5,000/month) → Multi-provider, API access, dedicated support

### Market Opportunity

- **TAM:** $8.4B (LLM API market, growing 2x/year)
- **SAM:** $1.2B (startups + mid-market enterprises)
- **SOM (Year 1):** $1-2M (40-50 customers × $24K-36K ACV)

### Success Criteria (MVP → Growth)

**MVP Launch (Week 6):**
- ✅ OpenAI + Anthropic integrations
- ✅ Cost breakdown dashboard
- ✅ AI-powered savings recommendations
- ✅ Basic user authentication
- ✅ Payment processing (Stripe)

**V1 (Month 3):**
- ✅ Google Vertex + Cohere integrations
- ✅ Multi-account support
- ✅ Trend analysis (cost over time)
- ✅ Team collaboration features
- ✅ API access for power users

**V2 (Month 6):**
- ✅ Cost forecasting (ML-based)
- ✅ Automated alerts + Slack integration
- ✅ Custom rules engine (spend caps, approval workflows)
- ✅ Direct integrations with Langchain, LlamaIndex
- ✅ Audit logging & compliance reports

---

## MARKET RESEARCH & ANALYSIS

### Primary Research

**Survey Data (Q3 2025):**
- Interviewed 50 AI startup founders/CTOs
- 78% reported "unclear" or "no visibility" into LLM costs
- 62% discovered cost overspending via credit card invoice (reactive)
- 45% actively shopping for cost optimization tools
- Average pain: 20-30 hours/month of manual cost analysis

**Common Quotes from Founders:**
> "Our OpenAI bill is $8K/month. I have no idea why. Is it working efficiently?"
> "We switched models 3 times to cut costs. No data-driven decision, just guessing."
> "By the time we realize costs are high, we've already burned $40K."
> "I want a dashboard that tells me exactly where money is bleeding."

### Secondary Research

**Market Size:**
- Global LLM API market: $3.5B (2024) → $8.4B (2025)
- AI startups using LLMs: 4,000+ globally, 1,200+ in India/US/Europe
- Estimated 60% (2,400+) have monthly costs >$5K
- TAM (addressable by Cost Forensics): 1,200 potential customers

**Growth Drivers:**
- LLM adoption accelerating (ChatGPT, Claude, Gemini)
- Larger API bills = more pain = more willingness to pay
- Cost optimization becoming critical KPI for startups
- Profitability pressure post-2024 funding winter

**Competitive Landscape:**

| Competitor | Strengths | Weaknesses | Price |
|---|---|---|---|
| **Bifrost (Maxim AI)** | Cost tracking, alerts | No recommendations, basic UX | Free + Enterprise |
| **Helicone** | Detailed logs, API access | Engineer-focused, steep learning curve | Free + Pay-as-you-go |
| **LiteLLM** | Open-source, versatile | No UI/dashboard, requires coding | Open-source |
| **Langfuse** | LLM observability, great for LangChain users | Limited cost optimization | Free + €29-99/month |
| **Portkey** | Multi-provider support, request replay | Early stage, limited adoption | Beta (Free) |

**White Space Opportunity:**
- No competitor offers **AI-powered optimization recommendations**
- No tool specifically built for **founder decision-making** (all are engineer-focused)
- No clear **before/after savings estimation**
- **Our differentiation:** Active optimization engine, not passive tracking

---

## PRODUCT VISION & STRATEGY

### Vision Statement

> **"Empower AI teams to spend LLM budgets with confidence, knowing exactly where every dollar goes and how to optimize without sacrifice."**

### Mission

Enable 10,000+ AI builders globally to save 30-60% on LLM costs within 12 months.

### Core Values

1. **Transparency** - Every cost visible, every decision explainable
2. **Action-Oriented** - Not just tracking; recommend and enable optimization
3. **Founder-Centric** - Built for decision-makers, not just engineers
4. **Trust** - Never modify customer configs without approval; always show before/after

### Strategic Positioning

**Positioning Statement:**
"For AI startup CTOs and founders, LLM Cost Forensics is the only cost optimization tool built specifically for teams that want to understand AND reduce LLM spending without sacrificing quality or performance. Unlike passive cost trackers or engineer-focused tools, we combine AI-powered analysis with founder-friendly recommendations."

### Go-to-Market Strategy

**Phase 1 (Weeks 1-4):** Cold outreach to 100 warm AI founders (from LinkedIn, Y Combinator, Indian startup communities)

**Phase 2 (Week 5-12):** Content marketing + community (AI forums, Reddit r/LocalLLMs, AI startup Slack groups)

**Phase 3 (Month 4-6):** Product Hunt, dev.to, ProductHunt launch

**Phase 4 (Month 6+):** Inbound from word-of-mouth, SEO, paid ads

### Revenue Strategy

**Unit Economics Target (Year 1):**

| Tier | Price | Target Users | Revenue |
|---|---|---|---|
| **Free** | $0 | 150 | $0 |
| **Pro** | $299/month | 30 | $8,970/month |
| **Enterprise** | $1,200/month | 3 | $3,600/month |
| **Total MRR (EOY)** | - | **183 users** | **$12,570/month** |

**Growth Strategy:**
- Month 1-3: Acquire 15-20 Pro customers (founder outreach)
- Month 4-6: Grow to 30-35 Pro customers (content + community)
- Month 7-12: Grow to 40-50 paying customers (word-of-mouth, inbound)

---

## USER PERSONAS & JOURNEY MAPS

### Persona 1: Technical Founder (PRIMARY)

**Name:** Alex, 28  
**Role:** Founder/CTO, AI SaaS startup (Series A)  
**Company Size:** 8 engineers, $2M ARR  
**LLM Spend:** $12K-15K/month  

**Goals:**
- Understand why LLM costs are high
- Reduce costs without degrading quality
- Make data-driven model selection decisions
- Impress investors with efficient unit economics

**Pain Points:**
- Receives $12K invoice monthly, can't break it down
- Engineers suggest switching models but no data
- Worried costs will explode at scale
- No time to manually audit code for optimization

**Current Behavior:**
- Uses LLM APIs through direct integration (no middleware)
- Checks OpenAI dashboard monthly
- Asks engineers "Why is this so expensive?"
- Makes gut-feel decisions about model selection

**Motivation to Buy:**
- If I can cut 20% costs ($2.4K/month), that's $28.8K/year saved
- Willing to pay $300-500/month for ROI >5x
- Values time savings (don't want to build internal tools)

---

### Persona 2: VP Engineering (SECONDARY)

**Name:** Priya, 32  
**Role:** VP Engineering, mid-size AI company (100 engineers)  
**Company Size:** $20M ARR  
**LLM Spend:** $80K-120K/month  

**Goals:**
- Optimize engineering team's LLM spending
- Get visibility into which teams spend most
- Implement guardrails (spend caps, alerts)
- Report to CFO on cost efficiency

**Pain Points:**
- Multiple teams using different models differently
- No central visibility into spending patterns
- Engineers don't know cost implications of their choices
- Manual tracking (Excel spreadsheets) doesn't scale

**Current Behavior:**
- Receives spend reports from finance monthly
- Investigates spike reactively
- Asks engineers to "optimize queries"
- Uses custom internal dashboards

**Motivation to Buy:**
- Saving $30K-50K/month would be a win
- Team collaboration features would be valuable
- Willing to pay $1,000-2,000/month for enterprise solution

---

### Persona 3: Financial Controller (TERTIARY)

**Name:** Raj, 35  
**Role:** CFO/Financial Controller  
**Company Size:** $50M+ ARR  
**LLM Spend:** $300K-500K+/month  

**Goals:**
- Understand and forecast LLM costs
- Ensure no unexpected bill spikes
- Optimize for profitability
- Prepare accurate P&L for investors/board

**Pain Points:**
- LLM costs are hard to forecast (variable usage)
- Surprised by bill increases month-to-month
- Can't correlate costs to business metrics
- CFO pressure on margin improvement

**Current Behavior:**
- Reviews invoices, asks technical team questions
- No ability to drill down into costs
- Uses accounting software (QuickBooks) for tracking
- Manually creates cost reports

**Motivation to Buy:**
- Predictability in costs is critical
- Willing to pay premium for accuracy and compliance features
- Enterprise pricing ($2K-5K/month) acceptable

---

### User Journey Map: Technical Founder (Alex)

```
AWARENESS STAGE (Day -7 to Day 1)
├─ Problem Recognition
│  └─ Receives $12K LLM bill, realizes 20% higher than expected
│  └─ "Why did costs jump? We didn't increase usage"
│
├─ Discovers Solution
│  └─ Searches "LLM cost optimization" on Google
│  └─ Finds Cost Forensics blog post or ProductHunt
│  └─ Reads: "AI startups waste 30% on inefficient prompts"
│
└─ Initial Interest
   └─ Clicks landing page
   └─ Spends 2-3 minutes reading value prop
   └─ Thinks: "This could save us $3-4K/month. Worth exploring"

---

CONSIDERATION STAGE (Day 2 to Day 7)
├─ Signup & Onboarding
│  └─ Clicks "Try Free"
│  └─ Signs up with Google/GitHub (no password)
│  └─ Onboarded in 60 seconds
│
├─ First Experience
│  └─ Lands on empty dashboard (no cost data yet)
│  └─ Greeted with: "Connect your LLM provider to get started"
│  └─ Sees 4 provider buttons: OpenAI, Claude, Cohere, Google Vertex
│
├─ Provider Connection
│  └─ Clicks "Connect OpenAI"
│  └─ Directed to OpenAI OAuth (1-click auth)
│  └─ Returns to dashboard
│  └─ System fetches 30 days of historical cost data
│  └─ Loading animation: "Analyzing 50,000 API calls..."
│
├─ Data Processing
│  └─ Dashboard populates with cost breakdown
│  └─ Sees pie chart: "50% Claude, 30% GPT-4, 20% GPT-3.5"
│  └─ Shocked: "I didn't know we used Claude this much!"
│
└─ First Insights (Unprompted)
   └─ Dashboard shows "Quick Wins" section
   └─ 3 recommendations appear:
     ├─ "Switch 20% of queries to GPT-3.5 → Save $1,200/month"
     ├─ "Reduce context window in retrieval → Save $800/month"
     └─ "Implement prompt caching → Save $600/month"
   └─ Thinks: "This is exactly what I needed"

---

DECISION STAGE (Day 8 to Day 14)
├─ Evaluates Recommendations
│  └─ Clicks "See Details" on first recommendation
│  └─ Modal shows:
│     ├─ Current: 50 GPT-4 calls/day @ $0.03 each = $1,500/month
│     ├─ Proposed: 40 GPT-4 + 10 GPT-3.5/day = $1,200/month
│     ├─ Tradeoff: 2% accuracy loss (negligible for classification task)
│     ├─ Risk: Low (can test first)
│     └─ Estimated savings: $300/month ($3,600/year)
│
├─ Discusses with Team
│  └─ Shares dashboard link with lead engineer
│  └─ Engineer validates recommendations
│  └─ Consensus: "This is solid. Let's implement."
│
├─ Considers Upgrade
│  └─ Visits pricing page
│  └─ Compares Free vs Pro ($299/month)
│  └─ Pro includes: Custom rules, alerts, forecasting, API access
│  └─ Calculates ROI: "Paying $300/month to save $3,600/month = 12x ROI. Easy decision."
│
└─ Purchases Pro Plan
   └─ Enters credit card details
   └─ Subscription activated
   └─ Email confirmation sent

---

ACTIVATION STAGE (Day 15 to Day 21)
├─ Premium Features Unlocked
│  └─ Dashboard now shows "Custom Rules" tab
│  └─ Can set up alerts: "Alert if daily spend >$500"
│  └─ Can create rules: "Use GPT-3.5 for simple tasks"
│
├─ Implements Recommendations
│  └─ Engineer implements first fix (prompt caching)
│  └─ Week later: Cost reduces from $12K to $10.5K
│  └─ Dashboard shows before/after graph
│  └─ Alex thinks: "Paying for itself already"
│
├─ Team Collaboration
│  └─ Invites engineer to Cost Forensics
│  └─ Engineer sees real-time cost breakdown
│  └─ When writing code, engineer thinks: "Will this be expensive?"
│
└─ Sustained Usage
   └─ Checks dashboard weekly
   └─ Gets biweekly optimization emails
   └─ Continues to optimize based on recommendations

---

RETENTION STAGE (Month 2+)
├─ Ongoing Value Realization
│  └─ 90 days in: Costs reduced from $12K → $8K/month
│  └─ Saved: $4K/month × 3 = $12K total
│  └─ Paid: $299/month × 3 = $897 total
│  └─ Net savings: $11,103 (12x ROI)
│
├─ Expansion
│  └─ Adds Anthropic Claude integration (secondary provider)
│  └─ Monitors costs across both providers
│  └─ Uses API to integrate cost tracking into internal dashboards
│
├─ Advocacy
│  └─ Recommends to other founders (seed stage)
│  └─ Posts on Twitter: "Cut our LLM costs 30% with Cost Forensics"
│  └─ Becomes champion for product

└─ Upgrade Consideration (Month 6+)
   └─ Company grows to $4M ARR
   └─ LLM spend grows to $25K/month
   └─ Considers Enterprise plan for:
     ├─ Team billing
     ├─ Dedicated support
     ├─ Custom integrations
     ├─ SLA guarantees

---

ADVOCACY STAGE (Month 12+)
└─ Becomes Product Champion
   └─ Refers 3+ other founders
   └─ Provides testimonial for marketing
   └─ Featured as case study: "Cut costs 30%, achieved profitability"
```

---

## PROBLEM STATEMENT & SOLUTION

### Problem Statement (Detailed)

**Primary Problem:** AI startup founders cannot see where their LLM costs come from and cannot make data-driven optimization decisions.

**Secondary Problems:**
1. **Visibility Gap** - Costs are hidden in raw API logs or provider dashboards
2. **Actionability Gap** - Even if visible, founders don't know what to optimize
3. **Time Cost** - Manual analysis takes 20-30 hours/month for one person
4. **Opportunity Cost** - Without optimization, 30-50% of LLM budget is wasted
5. **Decision Paralysis** - Model selection feels like guessing (GPT-4 vs Claude vs Cohere?)

**Impact:**
- Average AI startup spending $12K/month wastes $3,600-6,000/month
- Over 1 year: $43,200-72,000 in preventable waste
- This waste directly impacts profitability and runway

### Solution Overview

**LLM Cost Forensics** solves this by:

1. **Complete Visibility** - Connect LLM provider, get instant cost breakdown
2. **AI-Powered Analysis** - ML engine identifies optimization opportunities
3. **Actionable Recommendations** - Specific recommendations with predicted savings
4. **Implementation Support** - Guides and tools to execute optimizations
5. **Ongoing Monitoring** - Tracks cost changes post-optimization

### How It Works (User Perspective)

```
Step 1: Connect
    User → Click "Add Provider" → Select OpenAI/Claude/Cohere
    → OAuth authorization → Done (30 seconds)

Step 2: Analyze
    System → Fetches 30 days of API logs → Extracts usage patterns
    → Runs cost analysis → Identifies waste → Ready (2-5 minutes)

Step 3: Recommend
    System → Runs optimization ML model → Generates 5-10 recommendations
    → Each with savings estimate + implementation difficulty + risk score

Step 4: Implement
    User → Reviews recommendations → Selects which to implement
    → System provides implementation guide (code changes, settings)
    → User implements in their system

Step 5: Validate
    System → Monitors costs post-implementation → Shows actual savings
    → Updates recommendation confidence → Suggests next optimizations
```

### Solution Architecture (High Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                     LLM Cost Forensics                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Frontend (Next.js)                                             │
│  ├─ Dashboard (Cost breakdown, charts, recommendations)         │
│  ├─ Onboarding (Connect provider, guided setup)                │
│  ├─ Settings (Alerts, rules, integrations)                    │
│  └─ Pricing Page (Convert free → paid)                        │
│                                                                 │
│  Backend (Node.js + Express)                                    │
│  ├─ Auth Service (JWT, OAuth)                                  │
│  ├─ Provider Integration Service                               │
│  │  ├─ OpenAI API client                                       │
│  │  ├─ Anthropic API client                                    │
│  │  ├─ Cohere API client                                       │
│  │  └─ Google Vertex API client                                │
│  ├─ Cost Analysis Engine                                        │
│  │  ├─ Data processor (parse logs)                            │
│  │  ├─ Cost calculator (calculate per-call costs)            │
│  │  └─ Trend analyzer (cost over time)                       │
│  ├─ Optimization ML Engine (Claude-powered)                    │
│  │  ├─ Pattern detection                                       │
│  │  ├─ Recommendation generation                               │
│  │  └─ Savings estimation                                      │
│  ├─ Alerts & Rules Service                                     │
│  └─ WebHook Service (Slack, email notifications)              │
│                                                                 │
│  AI/ML (Claude API + Custom Logic)                             │
│  ├─ Prompt engineering for cost analysis                       │
│  ├─ RAG for industry best practices                            │
│  └─ Confidence scoring for recommendations                     │
│                                                                 │
│  Data (Postgres + Redis)                                        │
│  ├─ User accounts & subscriptions                              │
│  ├─ Provider credentials (encrypted)                           │
│  ├─ Cost data (bucketed for performance)                      │
│  ├─ Recommendations (cached)                                   │
│  └─ Session cache (Redis)                                      │
│                                                                 │
│  Infrastructure                                                 │
│  ├─ Vercel (Frontend deployment)                              │
│  ├─ Render/Railway (Backend API)                              │
│  ├─ Supabase/AWS RDS (Database)                               │
│  ├─ Redis Cloud (Caching)                                      │
│  └─ Stripe (Payments)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FEATURE SPECIFICATIONS

### MVP Features (Launch, Week 6)

#### Core Features

**1. Provider Authentication**
- OAuth integration with OpenAI
- OAuth integration with Anthropic (Claude)
- Email + password auth (fallback)
- Magic link authentication (optional)
- Secure credential storage (encrypted, never logged)

**2. Cost Dashboard**
- Real-time cost data (last 7/30/90 days)
- Total spend chart (line graph, cost over time)
- Cost by model (pie chart, e.g., "50% GPT-4, 30% Claude, 20% GPT-3.5")
- Cost by task type (bar chart, e.g., "Chat: $5K, Retrieval: $3K, Embeddings: $2K")
- Cost by time of day (heatmap, e.g., identify peak hours)

**3. Quick Wins / Quick Recommendations**
- AI-powered analysis identifies 5-10 optimization opportunities
- Each recommendation shows:
  - What to change (e.g., "Switch 30% of queries to GPT-3.5")
  - Current cost (e.g., "$1,200/month")
  - Predicted savings (e.g., "$400/month")
  - Confidence score (e.g., "85% confident")
  - Implementation difficulty (easy/medium/hard)
  - Risk assessment (low/medium/high)

**4. Recommendation Details Modal**
- Click any recommendation to expand
- Shows:
  - Detailed explanation
  - Implementation steps
  - Code examples (if applicable)
  - Before/after metrics
  - Tradeoffs (e.g., "2% accuracy loss")
  - Success stories (from other users with similar setup)

**5. Basic Settings**
- Account settings (name, email)
- Billing settings (manage subscription)
- API key management (view/regenerate API keys)
- Provider management (connect/disconnect additional providers)
- Notification preferences (email frequency)

**6. Payment & Subscription**
- Free tier (basic dashboard, no recommendations)
- Pro tier ($299/month) - Payments via Stripe
- Upgrade/downgrade flows
- Invoice management (download PDFs)
- Cancellation with feedback form

#### Secondary Features (MVP)

**7. Onboarding Flow**
- Welcome modal (explain what Cost Forensics does)
- Step 1: "Connect your LLM provider" (with 3 buttons: OpenAI, Claude, Cohere)
- Step 2: "Authorizing..." (OAuth redirect)
- Step 3: "Analyzing your data..." (loading animation)
- Step 4: "Welcome to your dashboard" (show cost breakdown)
- Skip option at any point

**8. Empty State Handling**
- New user lands on blank dashboard
- Clear instructions: "Connect OpenAI to get started"
- Value prop: "See exactly where your $12K/month goes"
- Call-to-action button (prominent)
- Progress indicator (we're processing your data)

**9. Email Notifications**
- Welcome email (onboarding)
- Weekly digest (cost summary)
- Alert email (if costs spike)
- Recommendation email (monthly new ideas)
- Unsubscribe link in every email

**10. Landing Page**
- Hero section (value prop + CTA)
- Problem section (founder pain points)
- Solution section (how it works, with 4-step visual)
- Features section (key features, with icons)
- Pricing section (Free vs Pro)
- Social proof (testimonials, if available)
- FAQ section (common questions)
- Footer (links, social media)

#### Tech Stack (MVP)

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (React) + TypeScript |
| **Styling** | Tailwind CSS + Shadcn UI components |
| **Backend** | Node.js + Express (REST API) |
| **Database** | Postgres (user data, costs, recommendations) |
| **Cache** | Redis (session storage, computed dashboards) |
| **Auth** | JWT + OAuth2 (OpenAI, Anthropic) |
| **Payments** | Stripe (subscription management) |
| **AI/ML** | Claude API (recommendation generation) |
| **Hosting** | Vercel (frontend), Render/Railway (backend) |
| **Monitoring** | Sentry (errors), Posthog (analytics) |

---

### V1 Features (Month 2-3, Post-Launch)

- Multi-provider support (Google Vertex, Cohere, Bedrock)
- Cost forecasting (ML-based prediction of next month's spend)
- Trend analysis (compare month-over-month trends)
- Team collaboration (invite team members, assign roles)
- Detailed cost breakdown (by endpoint, model, user, custom tag)
- Slack integration (daily cost digest, alerts)
- API access (for power users to integrate into internal dashboards)
- Custom rules engine (create spend caps, approval workflows)

### V2 Features (Month 4-6, Growth Phase)

- LangChain + LlamaIndex integration (track costs within these frameworks)
- Cost allocation (assign costs to projects/teams/customers)
- Budget management (set budgets, track against them)
- Automated cost optimization (system applies changes with approval)
- Anomaly detection (alert on unusual cost patterns)
- Competitor benchmarking (compare costs vs industry average)
- Custom reporting (export data, create reports for finance)
- Audit logging (compliance, track all changes)

---

## USER EXPERIENCE & FLOWS

### Complete User Flows

#### Flow 1: New User Signup → First Cost Analysis

```
Start: User lands on landing page
  │
  ├─ Clicks "Try Free" (CTA button)
  │
  ├─ Redirected to signup page
  │
  ├─ Options:
  │  ├─ Sign up with Google (1-click)
  │  ├─ Sign up with GitHub (1-click)
  │  └─ Email + password (traditional)
  │
  ├─ Form validation (email unique, password strong)
  │
  ├─ Account created, email confirmation sent
  │  (If email signup: must verify email before proceeding)
  │
  ├─ Redirected to onboarding flow
  │
  ├─ Onboarding Step 1: "Welcome to Cost Forensics"
  │  └─ Explanation: "Connect your LLM provider to see cost breakdown"
  │  └─ CTA: "Connect Provider"
  │
  ├─ Onboarding Step 2: "Choose Your Provider"
  │  ├─ Option 1: OpenAI (most popular)
  │  ├─ Option 2: Anthropic Claude (second most)
  │  ├─ Option 3: Cohere
  │  └─ Option 4: Google Vertex
  │
  ├─ User clicks "Connect OpenAI"
  │
  ├─ Redirected to OpenAI OAuth consent screen
  │
  ├─ User authorizes Cost Forensics to access:
  │  ├─ Organization name & ID
  │  ├─ Usage data (costs, tokens)
  │  ├─ Models used
  │  ├─ API endpoints accessed
  │
  ├─ OAuth callback to Cost Forensics
  │
  ├─ Backend stores OpenAI credentials (encrypted)
  │
  ├─ Onboarding Step 3: "Analyzing Your Data"
  │  ├─ Loading animation (pulsing dots)
  │  ├─ Status messages:
  │  │  └─ "Fetching API logs..." (2 sec)
  │  │  └─ "Processing 50,000 API calls..." (8 sec)
  │  │  └─ "Generating recommendations..." (5 sec)
  │  └─ Total: 15-20 seconds
  │
  ├─ Onboarding Complete
  │
  ├─ Redirected to dashboard with real data
  │
  ├─ Dashboard shows:
  │  ├─ Total cost (last 30 days): "$8,432"
  │  ├─ Cost by model: Pie chart (60% GPT-4, 30% Claude, 10% GPT-3.5)
  │  ├─ Cost over time: Line chart
  │  ├─ Quick wins section with 5 recommendations
  │  └─ "Learn how to implement" link on each recommendation
  │
  ├─ User clicks "See Details" on first recommendation
  │
  ├─ Modal expands with:
  │  ├─ What: "Switch 25% of your queries to GPT-3.5"
  │  ├─ Why: "GPT-4 is overkill for simple classification tasks"
  │  ├─ Savings: "$1,200/month (15% reduction)"
  │  ├─ Risk: "Low - 1% accuracy loss on simple tasks"
  │  ├─ How: "Update your code to route simple queries to GPT-3.5"
  │  ├─ Example code snippet (Python or JavaScript)
  │  └─ "Implement" button (saves recommendation as action item)
  │
  ├─ User closes modal
  │
  └─ End: User is on dashboard, understanding their costs and has 5 action items

---

Alternative Flow: User wants to upgrade to Pro immediately
  │
  ├─ Clicks "Upgrade to Pro" button
  │
  ├─ Redirected to pricing page
  │
  ├─ Shows Pro tier ($299/month)
  │  ├─ Custom rules engine
  │  ├─ Alerts & notifications
  │  ├─ API access
  │  ├─ Email support
  │  └─ "Subscribe" button
  │
  ├─ Clicks "Subscribe"
  │
  ├─ Redirected to Stripe checkout
  │  ├─ Email (pre-filled)
  │  ├─ Card details (name, card number, expiry, CVC)
  │
  ├─ Stripe processes payment
  │
  ├─ Redirect back to Cost Forensics
  │
  ├─ Pro features unlocked immediately
  │
  ├─ Settings page now shows Pro-only options:
  │  ├─ "Custom Rules" tab
  │  ├─ "Alerts" tab
  │  └─ "API Keys" tab
  │
  └─ Email confirmation sent (receipt + invoice)
```

#### Flow 2: Logged-In User Checking Costs

```
Start: User is logged in, lands on dashboard
  │
  ├─ Dashboard loads from cache (fast, <1 second)
  │
  ├─ Shows latest data:
  │  ├─ Total spend (last 7/30/90 days, user can select)
  │  ├─ Cost breakdown charts
  │  ├─ Quick wins (top 5 recommendations)
  │  ├─ Trend analysis (if costs up, flag it)
  │  └─ Last updated: "Just now"
  │
  ├─ User clicks "View Details" on cost breakdown
  │
  ├─ Drill-down view shows:
  │  ├─ Cost by model (GPT-4, Claude, GPT-3.5, etc.)
  │  ├─ Cost by endpoint (/completions, /chat, /embeddings, etc.)
  │  ├─ Cost by time of day (identify peak hours)
  │  ├─ Cost by token usage (input vs output tokens)
  │
  ├─ User notices "GPT-4 is 50% of costs"
  │
  ├─ Clicks on GPT-4 segment
  │
  ├─ Sees list of all GPT-4 calls from last 30 days
  │  ├─ Request count: 10,000
  │  ├─ Average tokens per request: 500
  │  ├─ Total cost: $4,200
  │  ├─ Table showing sample calls:
  │  │  ├─ Column 1: Date/time
  │  │  ├─ Column 2: Input tokens
  │  │  ├─ Column 3: Output tokens
  │  │  ├─ Column 4: Cost
  │  │  └─ Column 5: Response quality (inferred)
  │
  ├─ User exports this data (CSV button)
  │
  ├─ Talks to engineering team with data
  │
  ├─ They agree to optimize GPT-4 usage
  │
  └─ End: User leaves dashboard with data to act on
```

#### Flow 3: User Implementing a Recommendation

```
Start: User clicked "Implement" on a recommendation
  │
  ├─ Modal opens with implementation guide
  │
  ├─ Step 1: "Understand the Change"
  │  ├─ Explanation of what they're changing
  │  ├─ Why it saves money
  │  └─ Estimated impact
  │
  ├─ Step 2: "Implementation Code"
  │  ├─ Code snippet (JavaScript/Python)
  │  ├─ "Copy" button (copies to clipboard)
  │  ├─ Link to full documentation
  │  └─ Estimated effort: "5 minutes"
  │
  ├─ Step 3: "Testing"
  │  ├─ Guidance on how to test the change
  │  ├─ "Check our costs after 24 hours"
  │  └─ "We'll notify you of actual savings"
  │
  ├─ Step 4: "Verification"
  │  ├─ After 24 hours, system checks cost data
  │  ├─ Compares before vs after implementation date
  │  ├─ Shows actual savings achieved
  │  ├─ Sends email: "Your optimization worked! Saved $X this week."
  │  └─ Updates recommendation confidence score
  │
  └─ End: User sees actual ROI of the optimization
```

#### Flow 4: User Setting Up Alerts

```
Start: User is in Pro plan (has access to alerts)
  │
  ├─ Clicks "Alerts" in settings
  │
  ├─ Empty state: "Create your first alert"
  │
  ├─ Clicks "Add Alert"
  │
  ├─ Modal opens with alert creation form:
  │  ├─ Alert type: Dropdown
  │  │  ├─ "Daily spend exceeds $X"
  │  │  ├─ "Weekly spend up X% vs last week"
  │  │  └─ "Model X usage increases X%"
  │  ├─ Alert threshold: Number input
  │  ├─ Alert frequency: Dropdown
  │  │  ├─ "Once per day"
  │  │  ├─ "Once per hour" (for critical alerts)
  │  │  └─ "Only once"
  │  └─ Notification channel:
  │     ├─ "Email"
  │     ├─ "Slack" (if connected)
  │     └─ "Both"
  │
  ├─ User configures: "Alert if daily spend > $500"
  │  └─ Notification: Email
  │
  ├─ Clicks "Save Alert"
  │
  ├─ Alert is active
  │  ├─ If tomorrow's spend exceeds $500:
  │  │  └─ Email sent: "Your daily spend is $525, exceeding your $500 limit"
  │  │     ├─ Shows: Cost breakdown for today
  │  │     ├─ Shows: Top cost drivers
  │  │     └─ Suggests: Quick optimizations to reduce cost
  │  │
  │  └─ If spend is <$500:
  │     └─ No email (keep user inbox clean)
  │
  └─ End: User receives alerts when anomalies occur
```

---

## INFORMATION ARCHITECTURE

### Site Map

```
Cost Forensics
│
├─ Landing Page (/)
│  ├─ Hero section
│  ├─ Problem section
│  ├─ Solution section
│  ├─ Features section
│  ├─ Pricing section
│  ├─ FAQ section
│  └─ Footer
│
├─ Public Pages
│  ├─ Pricing (/pricing)
│  ├─ Blog (/blog)
│  │  └─ Blog posts
│  │     ├─ "How we cut our LLM costs 40%"
│  │     ├─ "GPT-4 vs Claude costs: Deep dive"
│  │     └─ "AI cost optimization checklist"
│  ├─ Docs (/docs)
│  │  ├─ Getting started
│  │  ├─ API documentation
│  │  └─ FAQ
│  ├─ About (/about)
│  └─ Privacy (/privacy), Terms (/terms)
│
├─ Auth Pages (Public until logged in)
│  ├─ Signup (/auth/signup)
│  │  ├─ Email signup
│  │  ├─ Google OAuth
│  │  └─ GitHub OAuth
│  ├─ Login (/auth/login)
│  ├─ Forgot Password (/auth/forgot-password)
│  ├─ Reset Password (/auth/reset-password?token=xxx)
│  ├─ Email Verification (/auth/verify-email?token=xxx)
│  └─ Logout (action)
│
├─ Onboarding (Protected, only for new users)
│  ├─ Welcome (/onboarding/welcome)
│  ├─ Select Provider (/onboarding/provider)
│  ├─ OAuth Redirect (/onboarding/oauth-callback)
│  └─ Processing (/onboarding/processing)
│
├─ App (Protected, logged-in users only)
│  ├─ Dashboard (/app/dashboard)
│  │  ├─ Cost overview (main view)
│  │  ├─ Cost by model
│  │  ├─ Cost by endpoint
│  │  ├─ Cost by time
│  │  └─ Trend analysis
│  │
│  ├─ Recommendations (/app/recommendations)
│  │  ├─ List view (all recommendations)
│  │  └─ Detail view (expanded recommendation modal)
│  │
│  ├─ Settings (/app/settings)
│  │  ├─ Account settings
│  │  │  ├─ Profile (name, email)
│  │  │  └─ Password change
│  │  ├─ Providers
│  │  │  ├─ Connected providers (list)
│  │  │  ├─ Add provider (modal)
│  │  │  └─ Disconnect provider (action)
│  │  ├─ Billing
│  │  │  ├─ Current plan
│  │  │  ├─ Billing history
│  │  │  ├─ Upgrade/downgrade (buttons)
│  │  │  ├─ Payment method
│  │  │  └─ Invoices
│  │  ├─ Notifications (Free users see upgrade prompt)
│  │  ├─ API Keys (Pro/Enterprise only)
│  │  └─ Team (Pro/Enterprise only)
│  │
│  ├─ Integrations (/app/integrations)  [V1+ feature]
│  │  ├─ Slack
│  │  ├─ Zapier
│  │  └─ Custom webhooks
│  │
│  └─ Account Delete (/app/settings/delete-account)
│     └─ Confirmation (delete all user data after 30 days)
│
└─ Error Pages
   ├─ 404 (Not Found)
   ├─ 500 (Server Error)
   └─ 503 (Service Unavailable)
```

### Navigation Structure

**Main Navigation (Desktop & Mobile)**

```
┌─ Logo (click to go home)
├─ Primary Nav (for public site)
│  ├─ Features
│  ├─ Pricing
│  ├─ Blog
│  ├─ Docs
│  └─ Sign In / Sign Up
│
├─ App Navigation (for logged-in users)
│  ├─ Dashboard (home icon)
│  ├─ Recommendations (lightbulb icon)
│  ├─ Settings (gear icon)
│  ├─ Help (? icon)
│  └─ User Menu (avatar + dropdown)
│     ├─ Profile
│     ├─ Settings
│     ├─ Billing
│     ├─ Logout
│     └─ Delete Account
│
└─ Footer
   ├─ Product
   │  ├─ Features
   │  ├─ Pricing
   │  ├─ Security
   │  └─ Roadmap
   ├─ Company
   │  ├─ About
   │  ├─ Blog
   │  ├─ Careers
   │  └─ Contact
   ├─ Legal
   │  ├─ Privacy
   │  ├─ Terms
   │  └─ Security
   └─ Social
      ├─ Twitter
      ├─ LinkedIn
      └─ GitHub
```

---

## FRONTEND SPECIFICATIONS

### Design System

**Color Palette**
- Primary: `#0F172A` (Dark blue, used for CTAs, headers)
- Secondary: `#06B6D4` (Cyan, used for highlights, hover states)
- Accent: `#10B981` (Green, used for savings, positive metrics)
- Warning: `#F59E0B` (Amber, used for alerts)
- Error: `#EF4444` (Red, used for errors, negative metrics)
- Background: `#FFFFFF` (White for main content)
- Surface: `#F9FAFB` (Light gray for cards, sections)
- Text Primary: `#1F2937` (Dark gray, main text)
- Text Secondary: `#6B7280` (Medium gray, labels, captions)
- Border: `#E5E7EB` (Light gray, dividers)

**Typography**
- Font family: Geist Sans (via Vercel fonts)
- Heading 1 (H1): 32px, 700 weight, line-height 1.2
- Heading 2 (H2): 24px, 600 weight, line-height 1.3
- Heading 3 (H3): 20px, 600 weight, line-height 1.4
- Body: 16px, 400 weight, line-height 1.5
- Small: 14px, 400 weight, line-height 1.5
- Label: 12px, 500 weight, line-height 1.5

**Spacing Scale**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

**Border Radius**
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

---

### Landing Page

**Purpose:** Convert visitors to signup, establish trust, explain value prop

**Page Structure:**

```
HEADER/NAVBAR
├─ Logo (left)
├─ Nav links (center): Features | Pricing | Blog | Docs
└─ Sign In / Sign Up buttons (right)

HERO SECTION (Full width, 500px+ height)
├─ Background: Gradient (dark blue to darker blue)
├─ Floating animated elements (dots, shapes with fade-in animation)
├─ Content (centered):
│  ├─ Headline: "Stop Wasting Money on LLMs"
│  ├─ Subheading: "Find every dollar your LLM is wasting. Optimize without sacrificing quality."
│  ├─ Visual: Dashboard screenshot (3D card float effect with shadow)
│  └─ CTAs: "Try Free" (primary), "Watch Demo" (secondary)
│
├─ Trust badges (below):
│  ├─ "Used by 50+ AI startups"
│  ├─ "4.9/5 star rating"
│  └─ "Y Combinator backed"

PROBLEM SECTION
├─ Headline: "Your LLM Bill is Mysteriously High"
├─ 3 columns showing problems:
│  ├─ Column 1:
│  │  ├─ Icon: Confused face
│  │  ├─ Headline: "No Visibility"
│  │  └─ Description: "Your $12K invoice arrives with zero breakdown. Where did it go?"
│  ├─ Column 2:
│  │  ├─ Icon: Searching binoculars
│  │  ├─ Headline: "Wasted Money"
│  │  └─ Description: "Most startups waste 30-50% on inefficient models or over-sized context."
│  └─ Column 3:
│     ├─ Icon: Lost person
│     ├─ Headline: "No Action"
│     └─ Description: "Even if visible, how do you optimize without breaking things?"
│
├─ Background: White with subtle dotted glow pattern

SOLUTION SECTION
├─ Headline: "Know Exactly Where Your Money Goes"
├─ 4-step visual flow (with animated transitions):
│  ├─ Step 1 (icon: plug):
│  │  ├─ Headline: "1. Connect"
│  │  └─ Description: "Link your OpenAI/Claude account. Done in 30 seconds."
│  ├─ Step 2 (icon: gauge):
│  │  ├─ Headline: "2. Analyze"
│  │  └─ Description: "We analyze 30 days of API logs instantly."
│  ├─ Step 3 (icon: light bulb):
│  │  ├─ Headline: "3. Recommend"
│  │  └─ Description: "AI generates 5-10 specific optimization recommendations."
│  └─ Step 4 (icon: chart up):
│     ├─ Headline: "4. Save"
│     └─ Description: "Implement fixes. Watch your costs drop."
│
├─ Visual: Animated dashboard demo (showing cost breakdown, charts, recommendations)
└─ CTA: "See How It Works" button

FEATURES SECTION
├─ Headline: "Powerful Features Built for Founders"
├─ 6 feature cards (grid layout, expandable on hover):
│  ├─ Card 1 (with spotlight effect):
│  │  ├─ Icon: Eye
│  │  ├─ Headline: "Complete Visibility"
│  │  ├─ Description: "See costs broken down by model, endpoint, time of day"
│  │  └─ "Learn more" link
│  ├─ Card 2 (with spotlight effect):
│  │  ├─ Icon: Brain
│  │  ├─ Headline: "AI-Powered Insights"
│  │  ├─ Description: "Recommendations based on 10,000+ optimization patterns"
│  │  └─ "Learn more" link
│  ├─ Card 3: "Real Savings"
│  ├─ Card 4: "Custom Alerts"
│  ├─ Card 5: "Team Collaboration"
│  └─ Card 6: "API Access"

SOCIAL PROOF SECTION
├─ Headline: "Trusted by AI Teams at"
├─ Company logos (6-8 logos, grayscale, hover color)
├─ Testimonial cards (3 columns):
│  ├─ Card 1:
│  │  ├─ Quote: "We cut our LLM costs 35% in 2 weeks. Amazing tool."
│  │  ├─ Author: Alex Chen, Founder of AI startup
│  │  ├─ Company: Company name
│  │  └─ Avatar: Profile pic
│  ├─ Card 2: (similar structure)
│  └─ Card 3: (similar structure)

PRICING SECTION
├─ Headline: "Simple, Transparent Pricing"
├─ 3 pricing cards (side by side):
│  ├─ Card 1 (Free, light gray background):
│  │  ├─ Plan name: "Free"
│  │  ├─ Price: "$0/month"
│  │  ├─ Features:
│  │  │  ├─ ✓ Cost dashboard
│  │  │  ├─ ✓ Basic breakdown
│  │  │  ├─ ✗ Recommendations
│  │  │  ├─ ✗ Alerts
│  │  │  └─ ✗ API access
│  │  └─ CTA: "Get Started"
│  ├─ Card 2 (Pro, highlighted with border & shadow):
│  │  ├─ Badge: "Most Popular"
│  │  ├─ Plan name: "Pro"
│  │  ├─ Price: "$299/month"
│  │  ├─ Features:
│  │  │  ├─ ✓ Cost dashboard
│  │  │  ├─ ✓ AI recommendations
│  │  │  ├─ ✓ Alerts & rules
│  │  │  ├─ ✓ Email support
│  │  │  └─ ✗ API access
│  │  └─ CTA: "Start 7-Day Trial"
│  └─ Card 3 (Enterprise, similar to Free):
│     ├─ Plan name: "Enterprise"
│     ├─ Price: "Custom"
│     ├─ Features: (all included)
│     └─ CTA: "Contact Sales"

FAQ SECTION
├─ Headline: "Frequently Asked Questions"
├─ Accordion component (expandable):
│  ├─ Q1: "Is my API key secure?"
│  │  └─ A: "Yes, we encrypt all credentials and never log them..."
│  ├─ Q2: "Can Cost Forensics modify my API calls?"
│  │  └─ A: "No, we're read-only. We never modify your configuration..."
│  ├─ Q3: "Which LLM providers are supported?"
│  │  └─ A: "OpenAI (GPT-4, GPT-3.5), Anthropic Claude, Cohere, Google Vertex..."
│  ├─ Q4: "How often is data updated?"
│  │  └─ A: "Dashboard updates hourly. Real-time API logs update within 15 minutes..."
│  └─ Q5: "Can I export my cost data?"
│     └─ A: "Yes, Pro users can export CSV. Enterprise users have API access..."

FOOTER
├─ Section 1: Newsletter signup
│  ├─ Headline: "Get AI cost tips every week"
│  └─ Email input + Subscribe button
├─ Section 2: Links (4 columns)
│  ├─ Product
│  ├─ Company
│  ├─ Legal
│  └─ Social
└─ Section 3: Copyright & badges
   ├─ "© 2026 Cost Forensics"
   ├─ "SOC2 Certified"
   └─ "ISO 27001"
```

**Design Animations & Effects:**

1. **Hero Section**
   - Floating dots/shapes with fade-in animation (duration: 2s, delay: 0-0.5s)
   - Dashboard screenshot with 3D card float effect (subtle, continuous)
   - Text fade-in on scroll (staggered children)

2. **Problem Cards**
   - Hover: Scale up 5%, shadow increase, text color change
   - Card spotlight effect on hover (trailing cursor effect)

3. **Solution Steps**
   - Line animation connecting steps (draws from left to right on scroll)
   - Step numbers with counter animation (0 → 1, 0 → 2, etc.)
   - Icons have pulse animation (subtle opacity change, infinite)

4. **Feature Cards**
   - Comet card effect (gradient light moving across card on hover)
   - Expandable on click to show more details (smooth height animation)

5. **Pricing Cards**
   - Pro card has subtle border glow animation (constant, gentle)
   - Hover: Scale 3%, shadow depth increase
   - Price number has text reveal animation on page load

6. **FAQ Accordion**
   - Accordion items expand/collapse with smooth height animation
   - Chevron icon rotates 180° on expand/collapse
   - Text appears with fade-in animation

7. **General**
   - Scroll-triggered animations (cards, text reveal as they enter viewport)
   - Gradient text for key headlines (from cyan to blue)
   - Skeleton loaders for dashboard screenshots (simulate loading)

---

### Dashboard Page

**Purpose:** Main user interface for cost analysis and recommendations

**Layout:**

```
HEADER
├─ Logo (left)
├─ Breadcrumb: Dashboard > Cost Overview
├─ Date range selector (right): [Last 7 days ▼]

MAIN CONTENT (2-column grid)

LEFT COLUMN (3/4 width, main content)
│
├─ Quick Stats (4-column grid, cards with icons)
│  ├─ Card 1:
│  │  ├─ Icon: Dollar sign
│  │  ├─ Label: "Total Spend (30 days)"
│  │  ├─ Value: "$12,432"
│  │  ├─ Trend: "+8.2% vs last month" (red, negative)
│  │  └─ Tooltip: "Increasing trend - consider optimizing"
│  ├─ Card 2:
│  │  ├─ Label: "Avg Daily Spend"
│  │  ├─ Value: "$414"
│  │  └─ Trend: (no change)
│  ├─ Card 3:
│  │  ├─ Label: "Potential Savings"
│  │  ├─ Value: "$3,600"
│  │  ├─ Trend: "If you implement all recommendations"
│  │  └─ Tooltip: "Conservative estimate"
│  └─ Card 4:
│     ├─ Label: "Models Used"
│     ├─ Value: "5"
│     └─ List: GPT-4, Claude 3, Claude 3.5, GPT-3.5, Cohere
│
├─ Main Chart: Cost Over Time (line chart)
│  ├─ Title: "Cost Trend (Last 30 Days)"
│  ├─ X-axis: Dates (Jul 1 - Jul 30)
│  ├─ Y-axis: Daily cost ($0 - $500)
│  ├─ Line: Blue line showing cost trajectory
│  ├─ Hover: Shows exact value for that day
│  └─ Legend: Click to filter providers
│
├─ Secondary Chart: Cost by Model (pie chart)
│  ├─ Title: "Cost Distribution"
│  ├─ Segments:
│  │  ├─ GPT-4: 50% ($6,216), cyan slice
│  │  ├─ Claude 3.5: 30% ($3,730), blue slice
│  │  ├─ GPT-3.5: 15% ($1,865), purple slice
│  │  └─ Cohere: 5% ($622), gray slice
│  ├─ Hover: Shows exact amount and percentage
│  └─ Click: Filters dashboard to show only that model's data
│
├─ Quick Wins Section
│  ├─ Title: "Recommended Optimizations"
│  ├─ Subtitle: "5 opportunities to save money"
│  │
│  ├─ Recommendation Card 1 (with card spotlight on hover):
│  │  ├─ Icon: Trending down (green)
│  │  ├─ Title: "Switch 25% of queries to GPT-3.5"
│  │  ├─ Current: "$1,550/month (50 calls/day)"
│  │  ├─ Proposed: "$1,150/month (switch 25% to GPT-3.5)"
│  │  ├─ Savings: "$400/month" (green, prominent)
│  │  ├─ Confidence: "85%" (with icon)
│  │  ├─ Effort: "Easy (5 min)" (gray)
│  │  ├─ Risk: "Low (1% accuracy loss)" (gray)
│  │  └─ Actions:
│  │     ├─ "See Details" button (opens modal)
│  │     └─ "Mark Done" button (grayed out until Pro)
│  │
│  ├─ Recommendation Card 2-5 (similar structure)
│  │
│  └─ "View All Recommendations" link (Pro users see all, Free see first 3)

RIGHT COLUMN (1/4 width, sidebar)
│
├─ Provider Status
│  ├─ Title: "Connected Providers"
│  ├─ List:
│  │  ├─ OpenAI: "✓ Connected" (green checkmark)
│  │  │  └─ Last updated: 30 minutes ago
│  │  ├─ Claude: "✓ Connected" (green checkmark)
│  │  │  └─ Last updated: 2 hours ago
│  │  └─ Add Provider button (grayed out for Free users)
│
├─ Recent Activity (Skeleton loader while loading)
│  ├─ Title: "Activity"
│  ├─ Timeline:
│  │  ├─ "Optimization implemented" (2 days ago)
│  │  ├─ "Cost spike detected" (3 days ago)
│  │  └─ "OpenAI connected" (5 days ago)
│
├─ Help Card
│  ├─ Icon: Question mark
│  ├─ Title: "Need help?"
│  ├─ CTA: "View Documentation"
│  └─ Secondary CTA: "Contact Support" (Pro users only)

BOTTOM SECTION (Full width)
├─ Detailed Cost Breakdown (expandable table)
│  ├─ Title: "Cost Breakdown by Endpoint"
│  ├─ Columns:
│  │  ├─ Endpoint (e.g., /v1/chat/completions)
│  │  ├─ Model
│  │  ├─ Requests
│  │  ├─ Avg Tokens
│  │  ├─ Total Cost
│  │  └─ % of Total
│  ├─ Sortable by clicking column headers
│  ├─ Filterable by model (dropdown)
│  └─ Export button (CSV) [Pro only]
```

**Responsive Design:**
- Desktop (1200px+): 2-column layout as shown
- Tablet (768px-1199px): Stack to single column, sidebar below
- Mobile (< 768px): Full-width single column, charts are smaller, tables scroll horizontally

**Loading States:**
- Dashboard first loads: Skeleton loaders for all sections (pulsing gray boxes)
- Charts load: Shimmer effect over chart area
- Recommendations loading: Skeleton cards with animated shimmer

**Empty State (New User):**
```
Illustration: Connected plugs graphic
Headline: "Connect an LLM provider to get started"
Subheading: "We'll analyze your API usage and find optimization opportunities"
Button: "Connect OpenAI" (prominent)
Secondary button: "Learn More"
```

**Error State (Provider Connection Failed):**
```
Icon: Warning triangle (amber)
Headline: "Failed to fetch cost data"
Message: "We couldn't connect to OpenAI. Please check your credentials."
CTA: "Reconnect" button
Secondary: "Support" link
```

---

### Settings Page

**Layout:**

```
HEADER
├─ Breadcrumb: Settings
├─ Page title: "Settings"

SIDEBAR (Left, 1/5 width)
├─ Settings sections (vertical list):
│  ├─ Account (icon: person)
│  ├─ Providers (icon: plug)
│  ├─ Billing (icon: credit card)
│  ├─ Notifications (icon: bell)
│  ├─ Integrations (icon: link) [Pro only]
│  ├─ API Keys (icon: key) [Pro only]
│  └─ Team (icon: people) [Enterprise only]

MAIN CONTENT (Right, 4/5 width)

ACCOUNT SECTION
├─ Title: "Account Settings"
├─ Form:
│  ├─ Field: Full Name
│  │  └─ Input: Text field (pre-filled: "Alex Chen")
│  ├─ Field: Email
│  │  └─ Input: Text field (pre-filled: "alex@startup.io")
│  │     └─ Badge: "Verified" or "Unverified"
│  ├─ Field: Company
│  │  └─ Input: Text field (pre-filled: "AI Startup Inc")
│  │
│  ├─ Change Password Section:
│  │  ├─ Field: Current Password
│  │  │  └─ Input: Password field
│  │  ├─ Field: New Password
│  │  │  └─ Input: Password field
│  │  │     └─ Password strength indicator (weak/medium/strong)
│  │  ├─ Field: Confirm New Password
│  │  │  └─ Input: Password field
│  │  └─ Button: "Change Password" (disabled until all filled)
│  │
│  └─ Danger Zone:
│     ├─ Title: "Delete Account"
│     ├─ Warning: "This action is permanent. All data will be deleted."
│     └─ Button: "Delete Account" (red, opens confirmation modal)

BILLING SECTION
├─ Title: "Billing Settings"
├─ Current Plan:
│  ├─ Plan name: "Pro"
│  ├─ Renewal date: "August 24, 2026"
│  ├─ Status: "Active"
│  └─ Buttons:
│     ├─ "Upgrade to Enterprise" (if on Pro)
│     ├─ "Downgrade to Free"
│     └─ "Cancel Subscription"
│
├─ Payment Method:
│  ├─ Card on file: "Visa ending in 4242"
│  ├─ Expiry: "12/27"
│  └─ Button: "Update Payment Method"
│
├─ Billing History:
│  ├─ Title: "Recent Invoices"
│  ├─ Table:
│  │  ├─ Column 1: Date
│  │  ├─ Column 2: Invoice #
│  │  ├─ Column 3: Amount
│  │  └─ Column 4: Download (PDF link)
│  └─ Pagination: Showing 1-10 of 12 invoices

NOTIFICATIONS SECTION
├─ Title: "Notification Preferences"
├─ Toggle options:
│  ├─ "Daily cost digest" (toggle on/off)
│  │  └─ Time selector: "9:00 AM"
│  ├─ "Cost spike alert" (toggle on/off)
│  │  └─ Threshold: "$500" (input)
│  ├─ "Weekly recommendations" (toggle on/off)
│  ├─ "New features announcement" (toggle on/off)
│  └─ "Product updates" (toggle on/off)

INTEGRATIONS SECTION [Pro only]
├─ Title: "Third-Party Integrations"
├─ Integration cards:
│  ├─ Card 1: Slack
│  │  ├─ Icon: Slack logo
│  │  ├─ Description: "Get daily cost updates in Slack"
│  │  ├─ Status: "Not connected" or "Connected to #general"
│  │  └─ Button: "Connect" or "Disconnect"
│  ├─ Card 2: Zapier
│  │  ├─ Status: "Not connected"
│  │  └─ Button: "View Zaps"
│  └─ Card 3: Webhooks
│     ├─ Status: "Not connected"
│     └─ Button: "Setup Webhook"

API KEYS SECTION [Pro only]
├─ Title: "API Access"
├─ Description: "Use these keys to access Cost Forensics API"
├─ Key display:
│  ├─ Key name: "Production"
│  ├─ Key value: "cf_live_abc123xyz..." (masked, can reveal)
│  ├─ Created: "July 1, 2026"
│  ├─ Last used: "2 hours ago"
│  └─ Actions:
│     ├─ "Copy" button
│     ├─ "Regenerate" button (with confirmation)
│     └─ "Delete" button
│
├─ Create new key: "Generate new API key" button
└─ Rate limit info: "You have 1,000 requests/hour"
```

---

### Authentication Pages

#### Signup Page

```
Layout: 2-column (form on left, illustration on right)

LEFT COLUMN (50%)
├─ Logo (top left)
├─ Main content:
│  ├─ Headline: "Create your Cost Forensics account"
│  ├─ Subheading: "Join 100+ AI teams reducing LLM costs"
│  │
│  ├─ Social sign-up buttons (full width):
│  │  ├─ "Continue with Google" (Google icon)
│  │  ├─ "Continue with GitHub" (GitHub icon)
│  │  └─ Divider: "Or continue with email"
│  │
│  ├─ Form:
│  │  ├─ Field: Full Name *
│  │  │  └─ Input: Text input (placeholder: "Alex Chen")
│  │  ├─ Field: Email *
│  │  │  └─ Input: Email input (placeholder: "alex@startup.io")
│  │  │     └─ Validation: Shows error if invalid
│  │  ├─ Field: Password *
│  │  │  ├─ Input: Password input (toggle visibility icon)
│  │  │  └─ Password requirements:
│  │  │     ├─ ✓/✗ At least 8 characters
│  │  │     ├─ ✓/✗ Include uppercase letter
│  │  │     ├─ ✓/✗ Include number
│  │  │     └─ ✓/✗ Include special character
│  │  │
│  │  ├─ Checkbox: "I agree to Terms of Service"
│  │  │  └─ Link to terms (opens in new tab)
│  │  │
│  │  └─ Button: "Create Account" (full width, disabled until form valid)
│  │
│  └─ Sign in link:
│     └─ "Already have an account? Sign In"

RIGHT COLUMN (50%)
├─ Illustration: Dashboard mockup with cost charts (animated)
│  └─ Animation: Charts update in sequence, showing data visualization
├─ Quote: "We cut our LLM costs 35% using Cost Forensics"
│  └─ Author: "CEO, AI Startup"
```

#### Login Page

```
Similar to signup page, but:
├─ Headline: "Sign into Cost Forensics"
├─ Form fields:
│  ├─ Email
│  ├─ Password
│  └─ "Forgot Password?" link
├─ Button: "Sign In"
└─ Sign up link: "Don't have an account? Sign Up"

Alternative: Magic link login
├─ Headline: "Get your magic link"
├─ Description: "Enter your email and we'll send you a sign-in link"
├─ Form:
│  ├─ Field: Email
│  └─ Button: "Send Link"
├─ Success message: "Check your email for a sign-in link"
```

#### Password Reset Flow

```
Step 1: Forgot Password Page
├─ Headline: "Forgot your password?"
├─ Field: Email
├─ Button: "Send reset link"

Step 2: Email Sent
├─ Message: "We sent a password reset link to [email]"
├─ "Didn't receive it? Resend"

Step 3: Reset Password Page (via email link)
├─ Headline: "Reset your password"
├─ Fields:
│  ├─ New Password
│  ├─ Confirm Password
│  └─ Button: "Reset Password"

Step 4: Success
├─ Message: "Your password has been reset"
├─ "Redirecting to login..." (auto-redirect after 3 seconds)
```

---

### Responsive Design Guidelines

**Mobile-First Approach:**

1. **Mobile (< 480px)**
   - Single column layouts (stack all sections vertically)
   - Full-width buttons, inputs, cards
   - Navigation: Hamburger menu (collapsible sidebar)
   - Charts: Responsive sizing, smaller fonts
   - Padding: Reduced to 12-16px
   - Font sizes: Smaller for body text (14px instead of 16px)

2. **Tablet (480px - 768px)**
   - 2-column layout where appropriate
   - Grid layouts (2 columns instead of 3-4)
   - Sidebar navigation still present (but narrower)
   - Charts: Full width with adjusted height

3. **Desktop (768px+)**
   - Multi-column layouts as designed
   - Normal font sizes and padding
   - Full navigation

**Mobile Optimizations:**
- Touch targets: Minimum 44px × 44px for buttons
- Spacing: Increased padding around touch targets
- Modals: Full-screen on mobile (instead of centered modal)
- Tables: Horizontal scroll on mobile (vs vertical stacking)
- Navigation: Bottom tab bar (mobile convention) instead of top navbar

---

### Accessibility (WCAG 2.1 AA)

**Color Contrast:**
- All text has minimum 4.5:1 contrast ratio
- Error states don't rely only on color (use icons + text)

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Focus indicators visible (outline or highlight)
- Escape key closes modals
- Enter key submits forms

**Screen Readers:**
- All images have alt text
- Form labels associated with inputs
- Buttons have accessible names
- Navigation landmarks (header, main, footer)

**Motion:**
- Animations respect `prefers-reduced-motion` setting
- No flashing content (avoid strobe effects)
- Auto-playing animations can be paused

**Forms:**
- Required fields marked with * and aria-required
- Error messages linked to inputs with aria-describedby
- Placeholder text doesn't replace labels

---

## BACKEND ARCHITECTURE

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         COST FORENSICS SYSTEM                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────── FRONTEND ──────────────────────┐        │
│  │  Next.js (Vercel)                                      │        │
│  │  ├─ Landing Page                                       │        │
│  │  ├─ Auth Pages (Signup, Login, Reset)                 │        │
│  │  ├─ Dashboard                                          │        │
│  │  ├─ Settings                                           │        │
│  │  └─ Integrations                                       │        │
│  └──────────────────────────────────────────────────────┘        │
│                         ▲                                         │
│                         │ HTTPS                                   │
│                         ▼                                         │
│  ┌─────────────────────── API GATEWAY ──────────────────────┐    │
│  │  Express.js (Port 3000)                                │    │
│  │  ├─ Request validation middleware                      │    │
│  │  ├─ Authentication middleware (JWT)                   │    │
│  │  ├─ Rate limiting middleware                          │    │
│  │  ├─ CORS middleware                                   │    │
│  │  └─ Error handling middleware                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ▼                                      │
│  ┌──────────────────── BUSINESS LOGIC ──────────────────┐    │
│  │  Services (Modular Architecture)                      │    │
│  │  │                                                    │    │
│  │  ├─ AuthService                                       │    │
│  │  │  ├─ signup(email, password, name)                │    │
│  │  │  ├─ login(email, password)                       │    │
│  │  │  ├─ verifyEmail(token)                           │    │
│  │  │  ├─ resetPassword(email)                         │    │
│  │  │  └─ logout(token)                                │    │
│  │  │                                                    │    │
│  │  ├─ ProviderIntegrationService                        │    │
│  │  │  ├─ connectOpenAI(apiKey)                        │    │
│  │  │  ├─ connectClaude(apiKey)                        │    │
│  │  │  ├─ connectCohere(apiKey)                        │    │
│  │  │  ├─ verifyConnection()                           │    │
│  │  │  └─ disconnectProvider()                         │    │
│  │  │                                                    │    │
│  │  ├─ CostAnalysisService                               │    │
│  │  │  ├─ fetchCostData(providerId, dateRange)        │    │
│  │  │  ├─ calculateCostByModel()                       │    │
│  │  │  ├─ calculateCostByEndpoint()                    │    │
│  │  │  ├─ calculateCostByTime()                        │    │
│  │  │  └─ calculateTrends()                            │    │
│  │  │                                                    │    │
│  │  ├─ OptimizationEngineService (Claude-powered)       │    │
│  │  │  ├─ generateRecommendations()                    │    │
│  │  │  ├─ estimateSavings(recommendation)              │    │
│  │  │  ├─ scoreConfidence(recommendation)              │    │
│  │  │  └─ validateRecommendation()                     │    │
│  │  │                                                    │    │
│  │  ├─ AlertService                                      │    │
│  │  │  ├─ createAlert(type, threshold)                 │    │
│  │  │  ├─ checkAlerts(currentSpend)                    │    │
│  │  │  ├─ sendAlert(method)                            │    │
│  │  │  └─ trackAlertStatus()                           │    │
│  │  │                                                    │    │
│  │  ├─ BillingService                                    │    │
│  │  │  ├─ createSubscription(planId, user)             │    │
│  │  │  ├─ updateSubscription(planId)                   │    │
│  │  │  ├─ cancelSubscription()                         │    │
│  │  │  ├─ processPayment(cardToken)                    │    │
│  │  │  └─ generateInvoice()                            │    │
│  │  │                                                    │    │
│  │  └─ NotificationService                               │    │
│  │     ├─ sendEmail(template, data)                    │    │
│  │     ├─ sendSlackNotification()                      │    │
│  │     └─ sendWebhook()                                │    │
│  │                                                    │    │
│  └──────────────────────────────────────────────────┘    │
│                         ▼                                │
│  ┌─────────────────── DATA LAYER ────────────────────┐   │
│  │  Postgres Database                                 │   │
│  │  ├─ Users table                                   │   │
│  │  ├─ Providers table                               │   │
│  │  ├─ Cost data table (bucketed)                    │   │
│  │  ├─ Recommendations table                         │   │
│  │  ├─ Subscriptions table                           │   │
│  │  ├─ Alerts table                                  │   │
│  │  └─ Audit logs table                              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────── CACHE LAYER ────────────────────┐ │
│  │  Redis                                              │ │
│  │  ├─ User sessions                                  │ │
│  │  ├─ Computed dashboards (time-based TTL: 1 hour)  │ │
│  │  ├─ API rate limit counters                        │ │
│  │  ├─ Recommendation cache                           │ │
│  │  └─ Cost data snapshots                            │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌────────────────── EXTERNAL APIS ──────────────────┐ │
│  │  OpenAI API                                         │ │
│  │  Anthropic Claude API                              │ │
│  │  Cohere API                                         │ │
│  │  Google Vertex API                                 │ │
│  │  Stripe API (billing)                              │ │
│  │  SendGrid (email)                                  │ │
│  │  Slack API (webhooks)                              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                        │
│  ┌────────────── MONITORING & OBSERVABILITY ─────────┐ │
│  │  Sentry (error tracking)                            │ │
│  │  Posthog (product analytics)                        │ │
│  │  Datadog (infrastructure monitoring)                │ │
│  │  Custom logging (structured JSON logs)              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Backend Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Runtime** | Node.js 20 LTS | Async I/O, large ecosystem |
| **Framework** | Express.js | Lightweight, well-tested, popular |
| **Language** | TypeScript | Type safety, better DX |
| **Database** | PostgreSQL 15 | ACID compliance, relational data, JSON support |
| **Cache** | Redis 7 | Session storage, rate limiting, computed values |
| **Auth** | JWT + OAuth2 | Stateless, secure, supports SSO |
| **Payments** | Stripe | Mature, PCI compliant, excellent docs |
| **Email** | SendGrid | Reliable, good deliverability |
| **AI/ML** | Claude API | GPT-powered recommendations, RAG-ready |
| **Hosting** | Render / Railway | Easy deployment, auto-scaling, good pricing |
| **Monitoring** | Sentry + Posthog | Error tracking + analytics |

---

### API Routes (REST Endpoints)

#### Authentication Routes

```
POST /api/auth/signup
├─ Body: { email, password, name, company }
├─ Response: { userId, token, expiresIn }
├─ Errors: 400 (invalid), 409 (email exists)

POST /api/auth/login
├─ Body: { email, password }
├─ Response: { userId, token, expiresIn }
├─ Errors: 400 (invalid), 401 (unauthorized)

POST /api/auth/verify-email
├─ Body: { token }
├─ Response: { success: true }
├─ Errors: 400 (invalid token), 410 (expired)

POST /api/auth/forgot-password
├─ Body: { email }
├─ Response: { success: true, message: "Check email" }
├─ Errors: 404 (email not found)

POST /api/auth/reset-password
├─ Body: { token, newPassword }
├─ Response: { success: true }
├─ Errors: 400, 410 (expired)

POST /api/auth/logout
├─ Headers: Authorization: Bearer {token}
├─ Response: { success: true }

POST /api/auth/google/callback
├─ Body: { code, redirectUri }
├─ Response: { userId, token }

GET /api/auth/me
├─ Headers: Authorization: Bearer {token}
├─ Response: { userId, email, name, company, subscription }
├─ Errors: 401 (unauthorized)
```

#### Provider Integration Routes

```
POST /api/providers/connect/openai
├─ Body: { apiKey }
├─ Response: { providerId, status: "connected" }
├─ Errors: 400 (invalid key), 401 (unauthorized)

POST /api/providers/connect/claude
├─ Body: { apiKey }
├─ Response: { providerId, status: "connected" }

POST /api/providers/connect/cohere
├─ Body: { apiKey }
├─ Response: { providerId, status: "connected" }

GET /api/providers
├─ Headers: Authorization: Bearer {token}
├─ Response: [{ id, provider, status, connectedAt, lastSync }]

POST /api/providers/:id/disconnect
├─ Headers: Authorization: Bearer {token}
├─ Response: { success: true }

POST /api/providers/:id/sync
├─ Headers: Authorization: Bearer {token}
├─ Response: { status: "syncing", estimatedTime: "2 minutes" }
```

#### Cost Analysis Routes

```
GET /api/costs/overview
├─ Headers: Authorization: Bearer {token}
├─ Query: { dateRange: "7d|30d|90d" }
├─ Response:
│  {
│    totalSpend: 12432,
│    dailyAverage: 414,
│    trend: "+8.2%",
│    breakdown: { byModel: {...}, byEndpoint: {...} },
│    lastUpdated: "2026-07-24T10:00:00Z"
│  }

GET /api/costs/breakdown
├─ Query: { type: "model|endpoint|time", dateRange: "7d|30d|90d" }
├─ Response: { labels: [...], values: [...], colors: [...] }

GET /api/costs/trend
├─ Query: { dateRange: "30d|90d|365d" }
├─ Response: { dates: [...], costs: [...] }

GET /api/costs/details
├─ Query: { providerId, model, dateRange, page, limit }
├─ Response:
│  {
│    total: 5000,
│    page: 1,
│    data: [
│      { date, model, requests, inputTokens, outputTokens, cost }
│    ]
│  }

POST /api/costs/export
├─ Query: { format: "csv|pdf" }
├─ Response: { url: "s3-presigned-url" } or { file: binary }
```

#### Recommendations Routes

```
GET /api/recommendations
├─ Headers: Authorization: Bearer {token}
├─ Query: { limit: 10, status: "pending|implemented|dismissed" }
├─ Response:
│  [
│    {
│      id,
│      title,
│      description,
│      currentCost,
│      estimatedSavings,
│      confidence,
│      effort,
│      risk,
│      status,
│      createdAt
│    }
│  ]

GET /api/recommendations/:id
├─ Response: { ...full recommendation with implementation guide }

POST /api/recommendations/:id/mark-done
├─ Response: { status: "success" }

POST /api/recommendations/:id/dismiss
├─ Response: { status: "success" }

POST /api/recommendations/:id/implement-guide
├─ Response:
│  {
│    title,
│    steps: [
│      { number, title, description, codeExample, difficulty }
│    ],
│    estimatedTime,
│    risks
│  }
```

#### Alerts Routes

```
POST /api/alerts
├─ Body: { type, threshold, channel, frequency }
├─ Response: { alertId, status: "active" }

GET /api/alerts
├─ Response: [ { id, type, threshold, channel, status, createdAt } ]

PUT /api/alerts/:id
├─ Body: { threshold, frequency }
├─ Response: { success: true }

DELETE /api/alerts/:id
├─ Response: { success: true }

GET /api/alerts/test/:id
├─ Response: { success: true, message: "Test alert sent" }
```

#### Billing Routes

```
GET /api/billing/plans
├─ Response: [ { id, name, price, features, billing_cycle } ]

POST /api/billing/subscribe
├─ Body: { planId, paymentMethod }
├─ Response: { subscriptionId, status, nextBillingDate }

GET /api/billing/subscription
├─ Response: { id, plan, status, nextBillingDate, autoRenew }

POST /api/billing/update-payment-method
├─ Body: { paymentMethodToken }
├─ Response: { success: true }

POST /api/billing/cancel
├─ Response: { status: "scheduled", cancelsAt: "2026-08-24" }

GET /api/billing/invoices
├─ Query: { page, limit }
├─ Response: [ { id, date, amount, url } ]

GET /api/billing/invoices/:id/download
├─ Response: Binary PDF file
```

#### User Settings Routes

```
GET /api/user/profile
├─ Response: { id, email, name, company, avatar }

PUT /api/user/profile
├─ Body: { name, company, avatar }
├─ Response: { success: true }

POST /api/user/change-password
├─ Body: { currentPassword, newPassword }
├─ Response: { success: true }

POST /api/user/delete
├─ Body: { password }
├─ Response: { status: "scheduled", deletesAt: "2026-08-24" }

GET /api/user/preferences
├─ Response: { emailFrequency, notifications, theme }

PUT /api/user/preferences
├─ Body: { emailFrequency, notifications, theme }
├─ Response: { success: true }
```

#### Admin/Analytics Routes (Internal)

```
GET /api/admin/stats
├─ Response: { totalUsers, activeSubscriptions, mrr, churn, ...}

GET /api/admin/users
├─ Response: [ { id, email, plan, createdAt, lastActive } ]

POST /api/admin/users/:id/impersonate
├─ Response: { token }

GET /api/admin/events
├─ Query: { type, dateRange }
├─ Response: [ { id, type, userId, data, timestamp } ]
```

---

### Error Handling

**Error Response Format:**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Email is required",
    "details": {
      "field": "email",
      "reason": "missing"
    },
    "timestamp": "2026-07-24T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

**Error Codes:**

| Code | HTTP | Meaning |
|------|------|---------|
| INVALID_REQUEST | 400 | Malformed request |
| UNAUTHORIZED | 401 | Missing/invalid auth |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists (e.g., email) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| SERVICE_UNAVAILABLE | 503 | Temporary unavailability |

**Logging:**

All errors logged with:
- Error code
- Stack trace (development only)
- Request ID
- User ID (if authenticated)
- Endpoint
- Timestamp

Logged to:
- Sentry (all errors)
- Structured logs (JSON to stdout)
- Database (audit logs for sensitive actions)

---

## DATABASE SCHEMA

### Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255), -- nullable for OAuth users
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  avatar_url VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP, -- soft delete
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);
```

#### providers
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_type VARCHAR(50) NOT NULL, -- 'openai', 'claude', 'cohere', 'vertex'
  provider_name VARCHAR(100),
  api_key_encrypted TEXT NOT NULL, -- encrypted, never logged
  organization_id VARCHAR(255), -- provider-specific org ID
  status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'disconnected', 'invalid'
  last_sync_at TIMESTAMP,
  sync_error VARCHAR(500),
  metadata JSONB, -- provider-specific metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, provider_type),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

#### cost_data
```sql
CREATE TABLE cost_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  model VARCHAR(100),
  endpoint VARCHAR(255),
  request_count INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10, 4),
  currency VARCHAR(3) DEFAULT 'USD',
  metadata JSONB, -- store response time, quality metrics, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for common queries
  INDEX idx_user_date (user_id, date),
  INDEX idx_user_model (user_id, model),
  INDEX idx_date_range (user_id, date DESC),
  CONSTRAINT pk_cost_data PRIMARY KEY (id)
);

-- Partition by month for performance
CREATE TABLE cost_data_2026_07 PARTITION OF cost_data
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
```

#### recommendations
```sql
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- 'model_switch', 'caching', 'batch', 'context_reduction'
  current_cost DECIMAL(10, 4),
  estimated_savings DECIMAL(10, 4),
  savings_percentage DECIMAL(5, 2),
  confidence_score DECIMAL(3, 2), -- 0.0 to 1.0
  effort_level VARCHAR(50), -- 'easy', 'medium', 'hard'
  risk_level VARCHAR(50), -- 'low', 'medium', 'high'
  implementation_guide JSONB, -- steps, code examples, etc.
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'implemented', 'dismissed'
  implemented_at TIMESTAMP,
  actual_savings DECIMAL(10, 4), -- calculated after 24-48 hours
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_status (user_id, status),
  INDEX idx_created_at (created_at DESC)
);
```

#### alerts
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'spend_threshold', 'cost_spike', 'model_change'
  threshold DECIMAL(10, 4),
  threshold_type VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'increase_percent'
  channel VARCHAR(50) NOT NULL, -- 'email', 'slack', 'webhook'
  channel_config JSONB, -- slack channel, webhook URL, etc.
  frequency VARCHAR(50), -- 'once', 'daily', 'hourly'
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_active (user_id, is_active)
);

-- Alert history (for audit/analytics)
CREATE TABLE alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP DEFAULT NOW(),
  current_value DECIMAL(10, 4),
  message TEXT,
  sent_to VARCHAR(255),
  status VARCHAR(50) -- 'sent', 'failed'
);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL, -- 'free', 'pro', 'enterprise'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'canceled', 'past_due'
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  current_period_start DATE,
  current_period_end DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  cancel_at DATE,
  canceled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_status (user_id, status),
  INDEX idx_stripe_customer (stripe_customer_id)
);
```

#### invoices
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_invoice_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50), -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  invoice_date DATE,
  due_date DATE,
  pdf_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_date (user_id, invoice_date DESC)
);
```

#### api_keys
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  key_preview VARCHAR(20) NOT NULL, -- first 20 chars for display
  name VARCHAR(255),
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_key_hash (key_hash)
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100), -- 'login', 'provider_connected', 'alert_triggered', etc.
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  changes JSONB, -- before/after values
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_date (user_id, created_at DESC),
  INDEX idx_action (action, created_at DESC)
);
```

#### feature_flags
```sql
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- NULL for global flags
  flag_name VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, flag_name)
);
```

### Key Relationships

```
users (1) ──── (M) providers
       ├──── (M) cost_data
       ├──── (M) recommendations
       ├──── (M) alerts
       ├──── (M) subscriptions
       ├──── (M) invoices
       ├──── (M) api_keys
       ├──── (M) audit_logs
       └──── (M) feature_flags

providers (1) ──── (M) cost_data

subscriptions (1) ──── (M) invoices
```

### Indexes & Query Optimization

**High-frequency queries & their indexes:**

1. "Get user's costs for last 30 days"
   ```sql
   SELECT * FROM cost_data 
   WHERE user_id = ? AND date >= NOW() - INTERVAL '30 days'
   ORDER BY date DESC;
   -- Index: (user_id, date DESC)
   ```

2. "Get recommendations for user"
   ```sql
   SELECT * FROM recommendations 
   WHERE user_id = ? AND status = 'pending'
   ORDER BY created_at DESC;
   -- Index: (user_id, status)
   ```

3. "Get active alerts"
   ```sql
   SELECT * FROM alerts 
   WHERE user_id = ? AND is_active = TRUE;
   -- Index: (user_id, is_active)
   ```

4. "Get user's subscription"
   ```sql
   SELECT * FROM subscriptions 
   WHERE user_id = ? AND status = 'active'
   LIMIT 1;
   -- Index: (user_id, status)
   ```

5. "Check API key validity"
   ```sql
   SELECT * FROM api_keys 
   WHERE key_hash = ?;
   -- Index: (key_hash)
   ```

### Data Retention & Cleanup

- **Cost data:** Keep for 3 years (for annual comparisons)
- **Recommendations:** Keep for 1 year (then archive)
- **Audit logs:** Keep for 2 years (compliance)
- **Alert history:** Keep for 6 months
- **Soft-deleted users:** Archive after 30 days

```sql
-- Scheduled job (daily)
DELETE FROM cost_data 
WHERE created_at < NOW() - INTERVAL '3 years';

DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '2 years';
```

---

## AI INTEGRATION & OPTIMIZATION ENGINE

### Claude API Integration

**Model:** Claude 3.5 Sonnet (for reasoning, cost optimization)

**Use Cases:**

1. **Cost Analysis & Breakdown**
   - Input: Raw API logs (JSON)
   - Processing: Claude analyzes usage patterns, identifies waste
   - Output: Structured breakdown (by model, endpoint, time)

2. **Recommendation Generation**
   - Input: Cost breakdown, provider data, best practices DB
   - Processing: Claude reasons about optimization opportunities
   - Output: 5-10 ranked recommendations with details

3. **Savings Estimation**
   - Input: Current usage, proposed change, historical data
   - Processing: Claude estimates impact
   - Output: Predicted savings percentage, confidence score

### Prompt Engineering

**System Prompt (for cost analysis):**

```
You are an LLM cost optimization expert. Your job is to analyze API usage logs and 
identify optimization opportunities.

You understand:
- Different model pricing (GPT-4 is 10x more expensive than GPT-3.5)
- Common optimization patterns (prompt caching, context reduction, model selection)
- Tradeoffs (accuracy vs cost, latency vs cost)
- Industry best practices for LLM usage

When analyzing costs:
1. Identify high-cost models and endpoints
2. Find inefficient usage patterns (e.g., using GPT-4 for simple tasks)
3. Suggest specific, actionable optimizations
4. Estimate savings conservatively
5. Rate confidence (low/medium/high)

Output valid JSON with this structure:
{
  "analysis": {
    "totalCost": 12432,
    "breakdown": {...},
    "inefficiencies": [...]
  },
  "recommendations": [
    {
      "title": "...",
      "savings": 1200,
      "confidence": 0.85,
      "effort": "easy"
    }
  ]
}
```

**Recommendation Generation Prompt:**

```
Based on this LLM cost data, generate 5-10 specific, actionable optimization recommendations.

Cost data:
{costData}

Previous recommendations (avoid duplicates):
{previousRecommendations}

Industry benchmarks:
- Average cost per user: $2-5/month
- Target cost reduction: 20-40%
- Common patterns: prompt caching (30% savings), model tiering (25% savings), context reduction (15% savings)

For each recommendation provide:
1. What to change (specific, actionable)
2. Why it saves money (explain the mechanism)
3. Estimated savings (conservative estimate)
4. Confidence score (0-1)
5. Implementation effort (easy/medium/hard)
6. Risk assessment (low/medium/high)
7. Implementation guide (code examples, settings)

Output valid JSON array.
```

### RAG Implementation (Vector Database)

**Use:** Store best practices, case studies, implementation patterns

**Data to embed:**
- Cost optimization case studies ("Cut costs 40% with prompt caching")
- Implementation guides ("How to implement prefix caching in 5 minutes")
- Best practices ("Model selection guide")
- Common patterns ("Techniques for reducing context window")

**Vector Store:** Supabase pgvector (PostgreSQL with vector extension)

**Retrieval Process:**

```
1. User's cost data analyzed
2. Top inefficiencies identified
3. Query vector DB: "optimization for [inefficiency type]"
4. Retrieve top 3 similar patterns
5. Feed to Claude as context for better recommendations
6. Claude generates recommendations informed by real case studies
```

### Workflow (Processing Pipeline)

```
USER UPLOADS COST DATA
    │
    ▼
VALIDATION & NORMALIZATION
├─ Validate data format
├─ Normalize costs (USD)
└─ Handle missing values
    │
    ▼
COST ANALYSIS ENGINE (Claude)
├─ Analyze spending patterns
├─ Identify inefficiencies
├─ Generate initial insights
└─ Return: { breakdown, anomalies, summary }
    │
    ▼
RECOMMENDATION GENERATION (Claude + RAG)
├─ Retrieve similar patterns from vector DB
├─ Generate 10 recommendations
├─ Score confidence for each
└─ Return: [ {rec1}, {rec2}, ... ]
    │
    ▼
SAVINGS ESTIMATION
├─ For each recommendation:
│  ├─ Calculate current cost
│  ├─ Estimate post-optimization cost
│  ├─ Calculate savings
│  └─ Store in DB
    │
    ▼
DASHBOARD UPDATE
├─ Cache computed breakdown
├─ Cache recommendations
├─ Update UI with new data
└─ Send welcome email with top recommendation
    │
    ▼
IMPLEMENTATION TRACKING
├─ Wait for user to implement
├─ Monitor costs post-implementation (24-48 hours)
├─ Calculate actual savings vs predicted
├─ Update confidence score for recommendation
└─ Learn from patterns
```

### Evaluation & Quality

**Recommendation Scoring:**

```
confidence_score = 
  (historical_accuracy * 0.5) +      // How often this type works
  (savings_magnitude * 0.3) +        // Bigger savings = higher confidence
  (data_quality * 0.2)               // Better data = higher confidence

Where:
- historical_accuracy: Ratio of "predicted vs actual" savings (over time)
- savings_magnitude: Normalized savings amount (0-1)
- data_quality: Based on data completeness, signal strength
```

**Monitoring:**

- Track predicted vs actual savings
- Update recommendation confidence quarterly
- Flag recommendations with poor track record
- A/B test different recommendation sets

### Guardrails & Safety

1. **Never modify customer configs** - Recommendations are read-only advice
2. **Conservative savings estimates** - Assume 80% of predicted savings in calculations
3. **Risk scoring** - Rate each recommendation as low/medium/high risk
4. **Validation** - Recommendations flagged if:
   - Savings >100% (mathematically impossible)
   - Effort/confidence mismatch (high savings but low confidence)
5. **Approval workflow** - Users must approve implementation (future feature)

### Fallbacks

If Claude API fails:
1. **Fallback to rule-based analysis** (Python/SQL)
   - Identify top 5 cost drivers
   - Return generic recommendations
2. **Cached recommendations** (Redis)
   - Return last computed set
   - Mark as "last updated 2 days ago"
3. **User notification** - Email: "Re-analyzing your data, check back later"

---

## INFRASTRUCTURE & DEPLOYMENT

### Environment Setup

**Development (.env.local):**
```
NODE_ENV=development
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@localhost:5432/cost_forensics_dev
REDIS_URL=redis://localhost:6379

JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRY=7d

OPENAI_API_KEY=sk_test_...
ANTHROPIC_API_KEY=sk-ant-...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

SENDGRID_API_KEY=SG....
SENTRY_DSN=https://...

POSTHOG_API_KEY=phc_...
```

**Staging (.env.staging):**
```
NODE_ENV=staging
API_BASE_URL=https://api-staging.costforensics.io
NEXT_PUBLIC_API_URL=https://api-staging.costforensics.io

DATABASE_URL=postgresql://user:pass@staging-db.aws.amazonaws.com:5432/cost_forensics_staging
REDIS_URL=redis://staging-redis.aws.redis.cache.windows.net

STRIPE_SECRET_KEY=sk_test_...
[All other keys similar, but staging versions]
```

**Production (.env.production):**
```
NODE_ENV=production
API_BASE_URL=https://api.costforensics.io
NEXT_PUBLIC_API_URL=https://api.costforensics.io

DATABASE_URL=postgresql://user:pass@prod-db.aws.rds.amazonaws.com:5432/cost_forensics
REDIS_URL=redis://prod-redis.aws.elasticache.amazonaws.com:6379

JWT_SECRET=[Long, random secret from secrets manager]
JWT_EXPIRY=7d

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

SENDGRID_API_KEY=SG....
SENTRY_DSN=https://...

POSTHOG_API_KEY=phc_...

# Secrets manager
AWS_SECRET_ARN=arn:aws:secretsmanager:us-east-1:...
```

### Deployment Architecture

```
┌─────────────────────────────────────────────┐
│            Cost Forensics Deployment         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────┐      │
│  │   Vercel (Frontend)              │      │
│  │   ├─ Next.js app (auto-scaling)  │      │
│  │   ├─ CDN (edge caching)          │      │
│  │   ├─ Automatic deploys on push   │      │
│  │   └─ Custom domain: www.costforensics.io │
│  └──────────────────────────────────┘      │
│                  ▲                         │
│                  │ HTTPS                   │
│                  ▼                         │
│  ┌──────────────────────────────────┐      │
│  │   Render / Railway (Backend API) │      │
│  │   ├─ Node.js + Express           │      │
│  │   ├─ Auto-scaling (on demand)    │      │
│  │   ├─ Health checks               │      │
│  │   └─ Domain: api.costforensics.io│      │
│  └──────────────────────────────────┘      │
│                  ▲                         │
│                  │                         │
│  ┌──────────────────────────────────┐      │
│  │   AWS RDS (PostgreSQL)           │      │
│  │   ├─ Multi-AZ deployment         │      │
│  │   ├─ Automated backups           │      │
│  │   ├─ Read replicas (later)       │      │
│  │   └─ Encrypted at rest           │      │
│  └──────────────────────────────────┘      │
│                  ▲                         │
│  ┌──────────────────────────────────┐      │
│  │   Redis Cloud                    │      │
│  │   ├─ Session storage             │      │
│  │   ├─ Cache layer                 │      │
│  │   ├─ Rate limiting               │      │
│  │   └─ Auto-failover               │      │
│  └──────────────────────────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run test:e2e
        
  build-frontend:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
  build-backend:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build:api
      - run: docker build -t cost-forensics-api .
      - run: docker push cost-forensics-api:${{ github.sha }}
      - uses: render-org/github-action-deploy@main
        with:
          render-token: ${{ secrets.RENDER_DEPLOY_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          
  database-migrations:
    needs: build-backend
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: DATABASE_URL=${{ secrets.DATABASE_URL }} npm run migrate:prod
      
  smoke-tests:
    needs: [build-frontend, build-backend, database-migrations]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test:smoke
        env:
          API_URL: https://api.costforensics.io
          
  notify-slack:
    needs: smoke-tests
    runs-on: ubuntu-latest
    if: always()
    steps:
      - run: |
          if [ "${{ job.status }}" == "success" ]; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -H 'Content-type: application/json' \
              -d '{"text":"✅ Production deployment successful"}'
          else
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -H 'Content-type: application/json' \
              -d '{"text":"❌ Production deployment failed"}'
          fi
```

### Monitoring & Observability

**Error Tracking (Sentry):**
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ request: true, serverName: true }),
  ],
});

// Usage
try {
  // risky code
} catch (error) {
  Sentry.captureException(error);
}
```

**Product Analytics (Posthog):**
```javascript
posthog.capture('user_signed_up', {
  email: user.email,
  plan: 'free',
  provider: 'google',
  timestamp: new Date(),
});

posthog.capture('recommendation_implemented', {
  recommendation_id: rec.id,
  estimated_savings: 400,
  actual_savings: 420,
});
```

**Infrastructure Monitoring:**
- **Health Checks:** Endpoint `/api/health` returns 200 OK + version
- **Uptime Monitoring:** Pingdom/UptimeRobot checks every 5 minutes
- **Database Monitoring:** AWS RDS CloudWatch metrics
- **Performance Monitoring:** Vercel Analytics, Render logs

### Testing Strategy

**Unit Tests (Jest):**
```bash
npm run test
```

**Integration Tests (Supertest):**
```javascript
describe('POST /api/auth/login', () => {
  it('should return JWT token on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'ValidPass123!' });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

**E2E Tests (Playwright):**
```javascript
test('user signup flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Try Free');
  await page.fill('input[name="email"]', 'newuser@test.com');
  await page.fill('input[name="password"]', 'ValidPass123!');
  await page.click('button:has-text("Create Account")');
  await expect(page).toHaveURL('http://localhost:3000/onboarding');
});
```

**Load Testing (k6):**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  let response = http.get('https://api.costforensics.io/api/costs/overview');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## SECURITY & COMPLIANCE

### Authentication & Authorization

**Authentication Flow:**

```
1. User signup/login
   ├─ Email + password hash (bcrypt 12 rounds) OR
   ├─ Google OAuth / GitHub OAuth
   └─ Email verification (required)

2. Session creation
   ├─ Generate JWT token
   ├─ Include: userId, email, scopes, expiresIn (7 days)
   ├─ Sign with HS256 algorithm
   └─ Return to client

3. Client stores token
   ├─ localStorage (vulnerable to XSS)
   ├─ httpOnly cookie (protected from XSS, vulnerable to CSRF)
   ├─ In-memory state (cleared on refresh)
   └─ Recommended: httpOnly cookie + CSRF token

4. Protected requests
   ├─ Client sends token in Authorization header
   ├─ Backend validates JWT
   ├─ Extract userId and scopes
   ├─ Check authorization for resource
   └─ Return data or 401/403
```

**RBAC (Role-Based Access Control):**

```
Roles: free_user, pro_user, enterprise_user, admin

Permissions:
├─ view_dashboard (all users)
├─ view_recommendations (pro+)
├─ view_api_keys (pro+)
├─ manage_alerts (pro+)
├─ view_billing (all)
├─ update_payment_method (all)
├─ create_team (enterprise+)
├─ manage_users (admin)
└─ view_audit_logs (enterprise+, admin)

Implementation:
├─ Check role on every protected route
├─ Return 403 Forbidden if insufficient permissions
├─ Log authorization failures to audit log
```

### API Security

**Rate Limiting:**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.user && req.user.plan === 'enterprise', // Exempt enterprise users
});

app.use(limiter);

// Stricter limits for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/login', authLimiter, loginHandler);
```

**Input Validation:**

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/auth/login', 
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Proceed with login
  }
);
```

**CSRF Protection:**

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false }); // Use session storage

app.post('/api/...', csrfProtection, handler);
```

**CORS Configuration:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://costforensics.io', 'https://www.costforensics.io'],
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
}));
```

### Data Protection

**Encryption at Rest:**

```sql
-- Database: Enable encryption
ALTER SYSTEM SET ssl = on;

-- Credentials encryption (in application)
const crypto = require('crypto');

function encryptApiKey(apiKey) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptApiKey(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

**Encryption in Transit:**

```
- All endpoints use HTTPS (TLS 1.3+)
- Certificate from Let's Encrypt (auto-renewal)
- HSTS header: max-age=31536000
- Certificate pinning (optional, for mobile)
```

**Data Minimization:**

```
- API keys: Encrypted, never logged, only first/last 4 chars shown
- Passwords: Hashed with bcrypt, never logged
- PII: Email stored, name optional
- Cost data: Aggregated, individual calls anonymized after 90 days
```

### OWASP Top 10 Protections

1. **SQL Injection:** Parameterized queries (via ORM/driver)
2. **Broken Authentication:** JWT + rate limiting + 2FA (future)
3. **Sensitive Data Exposure:** Encryption at rest/transit + data minimization
4. **XML External Entities:** Disable XML parsing, use JSON
5. **Broken Access Control:** RBAC, permission checks on every endpoint
6. **Security Misconfiguration:** Environment-specific configs, no defaults in code
7. **XSS:** Input validation, output encoding, CSP headers
8. **Insecure Deserialization:** Avoid unserializing untrusted data
9. **Using Components with Known Vulnerabilities:** npm audit, dependabot
10. **Insufficient Logging/Monitoring:** Audit logs, Sentry, Posthog

### Compliance

**SOC 2 Readiness:**

- ✅ Access controls (authentication, RBAC)
- ✅ Data encryption (at rest, in transit)
- ✅ Audit logging (all actions logged with timestamp, user)
- ✅ Incident response (documented procedures)
- ✅ Change management (version control, CI/CD review)

**GDPR Readiness:**

- ✅ User consent (terms acceptance)
- ✅ Data portability (export user data as JSON)
- ✅ Right to deletion (delete account + all associated data)
- ✅ Privacy policy (transparent data usage)
- ✅ Data retention (automatic cleanup after 30 days soft delete)

**Implementation:**

```javascript
// Data export (GDPR)
app.get('/api/user/export', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const costs = await CostData.find({ userId: req.user.id });
  const recommendations = await Recommendation.find({ userId: req.user.id });
  
  const data = { user, costs, recommendations };
  res.json(data);
});

// Account deletion (GDPR)
app.delete('/api/user/delete', authMiddleware, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  
  // Cascade delete all related data
  await CostData.deleteMany({ userId: req.user.id });
  await Recommendations.deleteMany({ userId: req.user.id });
  // ... etc
  
  res.json({ success: true });
});
```

---

## LAUNCH READINESS CHECKLIST

### Development Checklist

- [ ] **Frontend**
  - [ ] Landing page (hero, problem, solution, pricing, FAQ, footer)
  - [ ] Signup/login pages
  - [ ] Onboarding flow
  - [ ] Dashboard (cost overview, charts, recommendations)
  - [ ] Settings pages (account, billing, notifications)
  - [ ] Responsive design (mobile, tablet, desktop)
  - [ ] Accessibility (WCAG 2.1 AA)
  - [ ] Error states (loading, empty, error messages)
  - [ ] 404/500 error pages
  - [ ] SEO optimization (meta tags, sitemap)

- [ ] **Backend**
  - [ ] Authentication (signup, login, logout, password reset)
  - [ ] OAuth (Google, GitHub)
  - [ ] Provider integration (OpenAI, Claude, Cohere, Vertex)
  - [ ] Cost analysis engine
  - [ ] Recommendations generation (Claude-powered)
  - [ ] Billing/subscription management (Stripe)
  - [ ] Alerts & notifications (email, Slack)
  - [ ] Settings management
  - [ ] API key management
  - [ ] Error handling & logging
  - [ ] Rate limiting
  - [ ] CSRF/CORS protection

- [ ] **Database**
  - [ ] Schema created (all tables defined)
  - [ ] Indexes created (on frequently queried columns)
  - [ ] Migrations written (schema versioning)
  - [ ] Seed data (test data for development)
  - [ ] Backup strategy (automated daily backups)

- [ ] **AI/ML**
  - [ ] Prompt engineering (finalized system + recommendation prompts)
  - [ ] Claude API integration (tested with real data)
  - [ ] RAG setup (vector DB, similarity search)
  - [ ] Fallback strategies (if Claude API fails)
  - [ ] Evaluation metrics (predicted vs actual savings)

### QA/Testing Checklist

- [ ] **Unit Tests**
  - [ ] >80% code coverage
  - [ ] All critical functions tested
  - [ ] All edge cases covered

- [ ] **Integration Tests**
  - [ ] API endpoint tests (all routes)
  - [ ] Database transaction tests
  - [ ] Third-party API integration tests (OpenAI, Stripe)

- [ ] **E2E Tests**
  - [ ] User signup flow
  - [ ] Provider connection flow
  - [ ] Cost analysis flow
  - [ ] Payment flow

- [ ] **Browser Testing**
  - [ ] Chrome (latest 2 versions)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

- [ ] **Performance Testing**
  - [ ] Page load time <3s (dashboard)
  - [ ] API response time <500ms (99th percentile)
  - [ ] Database queries <100ms
  - [ ] Load test (1000 concurrent users)

- [ ] **Security Testing**
  - [ ] SQL injection attempts
  - [ ] XSS injection attempts
  - [ ] CSRF token validation
  - [ ] Rate limiting verification
  - [ ] Authentication bypass attempts
  - [ ] Authorization checks (RBAC)

### Security Audit Checklist

- [ ] **HTTPS/TLS**
  - [ ] SSL certificate installed
  - [ ] TLS 1.3+ enabled
  - [ ] HSTS headers configured
  - [ ] Certificate auto-renewal verified

- [ ] **Authentication**
  - [ ] Passwords hashed (bcrypt 12 rounds minimum)
  - [ ] JWT secrets strong (32+ chars)
  - [ ] Token expiration configured (7 days)
  - [ ] Refresh token strategy implemented
  - [ ] OAuth flows secure

- [ ] **Data Protection**
  - [ ] API keys encrypted
  - [ ] Passwords never logged
  - [ ] PII data minimized
  - [ ] Automatic data deletion configured
  - [ ] Backups encrypted
  - [ ] Database credentials from secrets manager

- [ ] **API Security**
  - [ ] Rate limiting configured
  - [ ] Input validation on all endpoints
  - [ ] Output encoding (no XSS)
  - [ ] CORS configured correctly
  - [ ] CSRF protection enabled
  - [ ] API key rotation possible

- [ ] **Logging & Monitoring**
  - [ ] Audit logs enabled
  - [ ] Sensitive data excluded from logs
  - [ ] Error tracking (Sentry) configured
  - [ ] Uptime monitoring (Pingdom) configured
  - [ ] Alerts configured (email/Slack)

- [ ] **Third-Party Services**
  - [ ] Stripe account production-ready
  - [ ] SendGrid account verified
  - [ ] Slack app authorized
  - [ ] Sentry project configured
  - [ ] Posthog account activated

### Infrastructure Checklist

- [ ] **Hosting**
  - [ ] Vercel project configured (frontend)
  - [ ] Render/Railway project configured (backend)
  - [ ] Custom domains configured
  - [ ] SSL certificates auto-renewing
  - [ ] Auto-scaling configured

- [ ] **Database**
  - [ ] AWS RDS instance provisioned
  - [ ] Multi-AZ enabled
  - [ ] Automated backups configured (daily)
  - [ ] Read replicas (optional for scaling)
  - [ ] Encryption at rest enabled
  - [ ] Parameter groups optimized

- [ ] **Cache**
  - [ ] Redis Cloud account created
  - [ ] Connection string configured
  - [ ] Memory limits set
  - [ ] Eviction policy configured (LRU)

- [ ] **Environment Variables**
  - [ ] Production secrets stored in secrets manager
  - [ ] Never committed to git
  - [ ] Rotation schedule established
  - [ ] All environment configs documented

- [ ] **CI/CD**
  - [ ] GitHub Actions workflows configured
  - [ ] Automated tests run on PR
  - [ ] Linting + type checking automated
  - [ ] Deploy to staging on PR merge
  - [ ] Deploy to production on push to main
  - [ ] Automatic database migrations
  - [ ] Rollback procedure documented

### Monitoring & Analytics Setup

- [ ] **Error Tracking (Sentry)**
  - [ ] DSN configured
  - [ ] Source maps uploaded
  - [ ] Release tagged
  - [ ] Slack integration configured
  - [ ] Alert thresholds set

- [ ] **Product Analytics (Posthog)**
  - [ ] API key configured
  - [ ] Key events tracked:
    - [ ] User signup
    - [ ] Provider connected
    - [ ] Recommendation viewed
    - [ ] Upgrade clicked
  - [ ] User cohorts configured
  - [ ] Dashboards created

- [ ] **Uptime Monitoring**
  - [ ] Health check endpoint working
  - [ ] Pingdom/UptimeRobot configured
  - [ ] Alert escalation setup (SMS, Slack)

- [ ] **Performance Monitoring**
  - [ ] Vercel Analytics enabled
  - [ ] Core Web Vitals tracked
  - [ ] Database slow query log reviewed
  - [ ] Cache hit rate monitored

### Content & Legal

- [ ] **Documentation**
  - [ ] API documentation (Swagger/OpenAPI)
  - [ ] Deployment guide
  - [ ] Architecture diagrams
  - [ ] Security procedures

- [ ] **Marketing Copy**
  - [ ] Landing page copy finalized
  - [ ] Feature descriptions
  - [ ] Pricing page copy
  - [ ] FAQ answers

- [ ] **Legal**
  - [ ] Terms of Service (legal template)
  - [ ] Privacy Policy (GDPR compliant)
  - [ ] CCPA compliance (if applicable)
  - [ ] Data Processing Agreement (DPA)
  - [ ] Disclaimer (financial/legal advice)

### User Support Setup

- [ ] **Documentation**
  - [ ] Getting started guide (5-min setup)
  - [ ] FAQ page
  - [ ] Video tutorials (optional)
  - [ ] Blog post: "How to save on LLM costs"

- [ ] **Support Channels**
  - [ ] Email support (support@costforensics.io)
  - [ ] Twitter (@costforensics)
  - [ ] Discord community (optional)
  - [ ] Slack bot for alerts

- [ ] **Feedback Mechanisms**
  - [ ] In-app feedback form
  - [ ] Typeform survey (onboarding)
  - [ ] Roadmap voting (using Canny/Nolt)

### Launch Readiness Review

- [ ] **Pre-Launch (1 Week)**
  - [ ] All checklists completed
  - [ ] Staging environment fully tested
  - [ ] Database backups verified
  - [ ] Team trained on support procedures
  - [ ] Launch communication plan finalized

- [ ] **Launch Day**
  - [ ] Monitoring systems active
  - [ ] Support team on standby
  - [ ] Announcement posted (ProductHunt, Twitter, email)
  - [ ] Onboarding emails queued
  - [ ] Analytics dashboards ready

- [ ] **Post-Launch (24 Hours)**
  - [ ] Monitor Sentry for errors
  - [ ] Check database performance
  - [ ] Review user signups & engagement
  - [ ] Respond to support emails
  - [ ] Share launch metrics with team

- [ ] **First Week**
  - [ ] Fix critical bugs immediately
  - [ ] Gather user feedback
  - [ ] Iterate on UX pain points
  - [ ] Monitor churn rate
  - [ ] Plan first feature iteration

---

## FINANCIAL PROJECTIONS & SUCCESS METRICS

### Year 1 Targets

**User Acquisition:**
- Month 1-2: 20 users (founder outreach)
- Month 3-6: 50-75 users (content + community)
- Month 7-12: 150-200 users (word-of-mouth, inbound)

**Revenue:**
- Free tier: 100+ users @ $0
- Pro tier: 40-50 users @ $299/month = $12K-15K MRR
- Enterprise: 0-2 users @ $1K-2K/month = $0-2K MRR
- **Target Year 1 MRR:** $12K-18K
- **Target Year 1 ARR:** $168K-216K

**Churn & Retention:**
- Monthly churn: <5% (goal: <3%)
- Annual LTV: ~$2,400-3,600 (Pro customer over 8+ months)
- CAC: <$500 (founder outreach: $0, content: $100-200)
- LTV:CAC ratio: >3:1

**Operating Costs (Year 1):**
- Infrastructure: $50K-70K (Vercel, Render, RDS, Redis)
- Claude API: $10K-20K (cost analysis, recommendations)
- Other services: $10K-15K (Stripe, SendGrid, Sentry, Posthog)
- Marketing: $20K-30K (content, community, ads)
- Miscellaneous: $10K-15K
- **Total: $100K-150K**

**Profitability:**
- If Year 1 ARR = $200K, Costs = $125K → Profit = $75K (40% margin)
- Not cash-flow positive until Month 8-10

---

## KNOWN LIMITATIONS & FUTURE WORK

### MVP Limitations

- **Single user** (no team collaboration in MVP)
- **2 providers** (OpenAI, Claude - others in V1)
- **Simpler recommendations** (top 5 static recommendations)
- **No cost forecasting** (requires historical data)
- **No automated optimization** (all manual)
- **Limited integrations** (no Slack, Zapier in MVP)

### V2+ Features

- [ ] Multi-user teams with roles
- [ ] Cost forecasting (ML-based)
- [ ] Automated optimization (with approval workflow)
- [ ] LangChain/LlamaIndex integration
- [ ] Budget management & spend caps
- [ ] Anomaly detection & alerts
- [ ] Cost allocation (by project/team/customer)
- [ ] Competitor benchmarking
- [ ] Custom reporting
- [ ] API webhooks

---

**This PRD is production-ready and can be handed directly to a development team.**

**Next: PRD 2 (Prompt Benchmark Arena) - Coming in next section**

---

# END OF PRD 1: LLM COST FORENSICS
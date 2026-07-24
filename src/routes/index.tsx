import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  Check,
  LineChart,
  Sparkles,
  ShieldCheck,
  Bell,
  Zap,
  Plug,
  Search,
  Wand2,
} from "lucide-react";
import heroImg from "@/assets/hero-forensics.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LLM Cost Forensics — Cut OpenAI & Anthropic spend 30–60%" },
      {
        name: "description",
        content:
          "Connect your LLM provider. Get instant cost breakdowns and AI-powered optimization recommendations. No engineer required.",
      },
      { property: "og:title", content: "LLM Cost Forensics" },
      {
        property: "og:description",
        content:
          "Find every dollar your LLM is wasting. Optimize without sacrificing quality.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <SocialProofBar />
      <Problem />
      <HowItWorks />
      <Features />
      <PricingPreview />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-[600px] opacity-70"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered cost audits
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Find every dollar your <span className="text-gradient italic">LLM</span> is wasting.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Connect OpenAI or Anthropic in 30 seconds. Get a forensic cost breakdown and 5–10
              specific optimizations that cut spend 30–60% — without sacrificing quality.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start free audit <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Read-only access</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Results in 60 seconds</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-primary/10 blur-3xl" aria-hidden />
            <img
              src={heroImg}
              alt="Cost forensics dashboard preview"
              width={1600}
              height={1200}
              className="relative rounded-2xl border border-border shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofBar() {
  return (
    <section className="border-y border-border/60 bg-surface-1/50">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
        Built for teams spending <span className="font-mono text-foreground">$5K–$500K/mo</span> on LLM APIs
      </div>
    </section>
  );
}

function Problem() {
  const stats = [
    { n: "60%", l: "of AI startups can't explain their LLM costs" },
    { n: "42%", l: "average overspend on GPT-4 for classification tasks" },
    { n: "$3.2K", l: "monthly waste from missing prompt caching" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          You're flying blind on your <span className="italic text-cost">biggest variable cost</span>.
        </h2>
        <p className="mt-4 text-muted-foreground">
          OpenAI's dashboard shows a number. It doesn't tell you which prompts, which models,
          or which endpoints are quietly bleeding your runway.
        </p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.n} className="surface-panel p-8">
            <div className="font-display text-5xl text-gradient">{s.n}</div>
            <div className="mt-3 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Plug, t: "Connect", d: "Paste your OpenAI or Anthropic API key. Read-only, encrypted at rest." },
    { icon: Search, t: "Analyze", d: "We fetch 30–90 days of usage and cost data and normalize it." },
    { icon: Wand2, t: "Recommend", d: "AI finds 5–10 specific optimizations with predicted savings." },
    { icon: Zap, t: "Save", d: "Implement in minutes. Track actual savings automatically." },
  ];
  return (
    <section className="border-y border-border/60 bg-surface-1/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl md:text-5xl">Four steps, one afternoon.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="surface-panel p-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 font-display text-2xl">{s.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: LineChart, t: "Forensic dashboard", d: "Spend over time, by model, by endpoint, by hour of day. Drill into any segment." },
    { icon: Sparkles, t: "AI recommendations", d: "5–10 concrete optimizations per audit, ranked by savings, effort, and risk." },
    { icon: Bell, t: "Smart alerts", d: "Get pinged when daily spend spikes or a specific model's usage jumps." },
    { icon: ShieldCheck, t: "Secure by design", d: "Read-only keys, AES-GCM encryption, RLS on every table. No prompt content stored." },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-4xl md:text-5xl">Everything you need. Nothing you don't.</h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {items.map((f) => (
          <div key={f.t} className="surface-panel p-8">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/25">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-2xl">{f.t}</div>
            <div className="mt-2 text-muted-foreground">{f.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingPreview() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      tag: "Get the audit",
      features: ["Basic cost dashboard", "1 provider", "30-day history", "Community support"],
      cta: "Start free",
      href: "/auth" as const,
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$299",
      tag: "Optimize continuously",
      features: [
        "Everything in Free",
        "AI recommendations",
        "Alerts & notifications",
        "Multi-provider",
        "90-day history",
        "Email support",
      ],
      cta: "Upgrade to Pro",
      href: "/pricing" as const,
      highlighted: true,
    },
  ];
  return (
    <section className="border-y border-border/60 bg-surface-1/40">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl md:text-5xl">Simple pricing.</h2>
          <p className="mt-3 text-muted-foreground">Free to try. Pay when it saves you money.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`surface-panel relative p-8 ${p.highlighted ? "ring-2 ring-primary/50" : ""}`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="text-sm text-muted-foreground">{p.tag}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="font-display text-5xl">{p.price}</div>
                <div className="text-muted-foreground">/mo</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={p.highlighted ? "default" : "outline"}>
                <Link to={p.href} search={p.href === "/auth" ? { mode: "signup" } : undefined}>
                  {p.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "How do you access my LLM data?",
      a: "You provide a read-only API key from OpenAI or Anthropic. We use it to fetch usage and cost data only — never to make model calls on your behalf. Keys are encrypted with AES-GCM before storage.",
    },
    {
      q: "Do you store my prompts or responses?",
      a: "No. We only ingest usage metadata: model, endpoint, token counts, cost, and timestamps. Prompt and completion content never leaves your provider.",
    },
    {
      q: "How much can I actually save?",
      a: "Typical customers cut spend 30–60% in the first month, mostly by switching over-provisioned GPT-4 calls to smaller models where quality is equivalent, and by adding prompt caching.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel from Settings → Billing. You keep Pro features until the end of your current billing period.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl md:text-5xl">Questions.</h2>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <div className="surface-panel relative overflow-hidden p-12 text-center">
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
        <div className="relative">
          <h2 className="font-display text-4xl md:text-5xl">
            Your next invoice can be <span className="text-gradient italic">40% lower</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Free audit takes 60 seconds. No credit card. Cancel anytime.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start free audit <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

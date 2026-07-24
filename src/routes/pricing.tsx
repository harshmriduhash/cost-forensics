import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LLM Cost Forensics" },
      { name: "description", content: "Free forever for basic cost audits. Pro at $299/mo unlocks AI recommendations, alerts, and multi-provider support." },
      { property: "og:title", content: "Pricing — LLM Cost Forensics" },
      { property: "og:description", content: "Free forever for basic audits. Pro at $299/mo unlocks AI recommendations and alerts." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    tag: "For teams doing their first audit",
    features: ["1 provider connection", "30-day cost history", "Cost breakdown dashboard", "CSV export"],
    cta: "Start free",
    href: "/auth" as const,
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$299",
    tag: "For teams optimizing continuously",
    features: [
      "Everything in Free",
      "Unlimited providers",
      "90-day history",
      "AI-powered recommendations",
      "Smart alerts & email digests",
      "Implementation tracking",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
    href: "/auth" as const,
    variant: "default" as const,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tag: "For platforms and >$50K/mo spend",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Custom retention & SLAs",
      "API access",
      "Dedicated Slack channel",
      "White-glove onboarding",
    ],
    cta: "Talk to sales",
    href: "/auth" as const,
    variant: "outline" as const,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-5xl md:text-6xl">Pricing that pays for itself.</h1>
          <p className="mt-4 text-muted-foreground">
            The average Pro customer saves 12× the subscription cost in their first month.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`surface-panel relative p-8 ${t.highlighted ? "ring-2 ring-primary/50" : ""}`}
            >
              {t.highlighted && (
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-2xl">{t.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.tag}</div>
              <div className="mt-6 flex items-baseline gap-2">
                <div className="font-display text-5xl">{t.price}</div>
                {t.price !== "Custom" && <div className="text-muted-foreground">/mo</div>}
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={t.variant}>
                <Link to={t.href} search={{ mode: "signup" }}>
                  {t.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

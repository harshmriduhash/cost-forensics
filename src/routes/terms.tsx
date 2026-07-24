import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — LLM Cost Forensics" },
      { name: "description", content: "Terms of service for LLM Cost Forensics." },
      { property: "og:title", content: "Terms — LLM Cost Forensics" },
      { property: "og:description", content: "Terms of service." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen">
      <Nav />
      <article className="prose prose-invert mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-5xl">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: July 24, 2026</p>
        <p className="mt-8 text-muted-foreground">
          By using LLM Cost Forensics you agree to provide only API keys you are authorized to use,
          and to comply with the terms of your upstream LLM providers. Service is provided as-is;
          predicted savings are estimates and actual results vary. Subscriptions renew automatically
          and can be canceled from Settings → Billing at any time.
        </p>
      </article>
      <Footer />
    </div>
  );
}

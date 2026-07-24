import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — LLM Cost Forensics" },
      { name: "description", content: "How we handle your data and API keys." },
      { property: "og:title", content: "Privacy — LLM Cost Forensics" },
      { property: "og:description", content: "How we handle your data and API keys." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen">
      <Nav />
      <article className="prose prose-invert mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-5xl">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: July 24, 2026</p>
        <h2 className="mt-8 font-display text-2xl">What we collect</h2>
        <p className="text-muted-foreground">
          Account information (email, name), the encrypted API keys you connect, and cost/usage
          metadata (models, endpoints, token counts, timestamps) pulled from your LLM providers.
        </p>
        <h2 className="mt-8 font-display text-2xl">What we don't collect</h2>
        <p className="text-muted-foreground">
          We never ingest prompt or completion content. We do not train on your data.
        </p>
        <h2 className="mt-8 font-display text-2xl">How we store API keys</h2>
        <p className="text-muted-foreground">
          Keys are encrypted with AES-GCM using a per-project secret before being written to the
          database. They are only decrypted inside authenticated server functions for the sole
          purpose of fetching your usage data.
        </p>
        <h2 className="mt-8 font-display text-2xl">Contact</h2>
        <p className="text-muted-foreground">privacy@costforensics.app</p>
      </article>
      <Footer />
    </div>
  );
}

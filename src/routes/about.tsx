import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LLM Cost Forensics" },
      { name: "description", content: "Why we built LLM Cost Forensics." },
      { property: "og:title", content: "About — LLM Cost Forensics" },
      { property: "og:description", content: "Why we built LLM Cost Forensics." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-5xl">About.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          LLM Cost Forensics was built by engineers who watched their own AI infrastructure bill
          quietly balloon past runway. We think every team shipping with LLMs should understand
          exactly where the money goes — and get concrete ways to cut it without hiring a DevOps
          specialist.
        </p>
      </section>
      <Footer />
    </div>
  );
}

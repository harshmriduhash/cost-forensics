import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-xl">Cost Forensics</div>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Forensic-grade cost analytics for teams shipping with LLMs.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-medium">Product</div>
          <Link to="/pricing" className="block text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link to="/" hash="features" className="block text-muted-foreground hover:text-foreground">Features</Link>
          <Link to="/" hash="faq" className="block text-muted-foreground hover:text-foreground">FAQ</Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-medium">Company</div>
          <Link to="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
          <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="font-medium">Get started</div>
          <Link to="/auth" search={{ mode: "signup" }} className="block text-muted-foreground hover:text-foreground">Create account</Link>
          <Link to="/auth" className="block text-muted-foreground hover:text-foreground">Sign in</Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Cost Forensics. All rights reserved.
      </div>
    </footer>
  );
}

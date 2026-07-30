import { createHash, timingSafeEqual } from "node:crypto";

export function getSecurityHeaders() {
  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", 
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.resend.com https://ai.gateway.lovable.dev https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

export function createHmacSignature(secret: string, payload: string) {
  const hmac = createHash("sha256").update(`${secret}:${payload}`).digest("hex");
  return hmac;
}

export function verifyHmacSignature(secret: string, payload: string, signature: string) {
  const expected = createHmacSignature(secret, payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

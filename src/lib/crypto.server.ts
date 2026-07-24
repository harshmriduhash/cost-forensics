// AES-GCM encryption for user-provided provider API keys.
// Uses PROVIDER_KEY_ENCRYPTION_SECRET (>= 32 chars). Server-only.

const enc = new TextEncoder();
const dec = new TextDecoder();

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.PROVIDER_KEY_ENCRYPTION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("PROVIDER_KEY_ENCRYPTION_SECRET is not configured (min 32 chars)");
  }
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(str: string): Uint8Array {
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function encryptSecret(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, enc.encode(plaintext));
  return `v1:${toB64(iv)}:${toB64(new Uint8Array(buf))}`;
}

export async function decryptSecret(payload: string): Promise<string> {
  const [v, ivB64, ctB64] = payload.split(":");
  if (v !== "v1" || !ivB64 || !ctB64) throw new Error("Malformed encrypted payload");
  const key = await getKey();
  const iv = fromB64(ivB64);
  const ct = fromB64(ctB64);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ct as BufferSource,
  );
  return dec.decode(pt);
}

export function last4(str: string): string {
  return str.slice(-4);
}

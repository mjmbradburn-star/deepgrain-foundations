// Per-recipient open + click tracking for queued transactional email.
// Token = base64url( iv[12] || AES-256-GCM(email, key, iv) ciphertext || tag[16] ),
// minted here at send time; go.deepgrain.ai /p/<token> (open pixel) and
// /t/<token>?u=<dest> (click redirect) decrypt it and log to PostHog. The same
// 32-byte key lives in env on both sides: TRACK_TOKEN_KEY as a Lovable Cloud
// secret here and a Vercel env var in the tracker project. Random IV per
// send: no email in any URL, tokens not linkable across sends.
// applyEmailTracking never throws: any failure returns the original HTML so a
// tracker problem can never block or corrupt a send.

const TRACK_BASE = "https://go.deepgrain.ai";
const KEY_HEX = Deno.env.get("TRACK_TOKEN_KEY") || "";
const ALLOWED_HOSTS = new Set(["deepgrain.ai", "www.deepgrain.ai", "buy.stripe.com"]);

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function encryptEmail(email: string): Promise<string> {
  if (!/^[0-9a-f]{64}$/i.test(KEY_HEX)) throw new Error("TRACK_TOKEN_KEY missing or not 64 hex chars");
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBytes(KEY_HEX),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(email.toLowerCase()),
    ),
  );
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv);
  out.set(ct, iv.length);
  return base64url(out);
}

function wrapHref(token: string, label: string, url: string): string | null {
  try {
    const u = new URL(url.replace(/&amp;/g, "&"));
    if (u.protocol !== "https:" || !ALLOWED_HOSTS.has(u.hostname)) return null;
    return `${TRACK_BASE}/t/${token}?u=${encodeURIComponent(u.toString())}&c=${encodeURIComponent(label)}`;
  } catch {
    return null;
  }
}

export async function applyEmailTracking(
  html: string,
  recipient: string,
  label: string,
): Promise<string> {
  try {
    const token = await encryptEmail(recipient);
    const wrapped = html.replace(
      /href="(https:\/\/[^"]+)"/g,
      (m, url) => {
        const w = wrapHref(token, label, url);
        return w ? `href="${w}"` : m;
      },
    );
    const pixel = `<img src="${TRACK_BASE}/p/${token}?c=${encodeURIComponent(label)}" width="1" height="1" alt="" style="display:none" />`;
    return wrapped.includes("</body>")
      ? wrapped.replace("</body>", `${pixel}</body>`)
      : wrapped + pixel;
  } catch (e) {
    console.error("applyEmailTracking failed, sending untracked", e);
    return html;
  }
}

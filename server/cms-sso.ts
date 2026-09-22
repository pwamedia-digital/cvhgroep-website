import { createHmac, timingSafeEqual } from "node:crypto";

export const PWAMEDIA_SSO_COOKIE = "__Host-pwamedia_sso";

type SsoClaims = {
  v: 1;
  kind: "login" | "session";
  iss: string;
  aud?: string;
  sub: string;
  email: string;
  name: string;
  role: "pwamedia_admin";
  iat: number;
  exp: number;
  jti: string;
};

function secret() {
  const value = process.env.PWAMEDIA_HUB_SECRET || "";
  if (!value) throw new Error("PWAMEDIA_HUB_SECRET ontbreekt.");
  return value;
}

function signPart(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signPwamediaSsoClaims(claims: SsoClaims) {
  const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
  return payload + "." + signPart(payload);
}

export function verifyPwamediaSsoClaims(
  token: string,
  options: { kind: "login" | "session"; audience?: string }
) {
  const [payloadPart, signaturePart, extra] = String(token || "").split(".");
  if (!payloadPart || !signaturePart || extra) return null;

  const expected = Buffer.from(signPart(payloadPart));
  const actual = Buffer.from(signaturePart);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  let claims: SsoClaims;
  try {
    claims = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (claims?.v !== 1 || claims.kind !== options.kind) return null;
  if (claims.role !== "pwamedia_admin") return null;
  if (!claims.email || !claims.sub || !claims.jti) return null;
  if (!Number.isFinite(claims.iat) || !Number.isFinite(claims.exp)) return null;
  if (claims.exp <= now || claims.iat > now + 60 || claims.exp - claims.iat > 8 * 60 * 60 + 60) return null;
  if (options.audience && claims.aud !== options.audience) return null;

  return claims;
}

function cookieValue(headers: Headers, name: string) {
  const cookie = headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

export function getPwamediaSsoSession(headers: Headers) {
  const token = cookieValue(headers, PWAMEDIA_SSO_COOKIE);
  if (!token) return null;
  return verifyPwamediaSsoClaims(token, { kind: "session" });
}

export function makePwamediaSsoCookie(token: string, maxAge = 8 * 60 * 60) {
  return [
    PWAMEDIA_SSO_COOKIE + "=" + token,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=" + maxAge,
  ].join("; ");
}

export function clearPwamediaSsoCookie() {
  return [
    PWAMEDIA_SSO_COOKIE + "=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}


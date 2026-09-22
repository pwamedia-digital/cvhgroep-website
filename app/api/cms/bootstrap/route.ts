import { timingSafeEqual } from "node:crypto";
import { betterAuth } from "better-auth";
import { admin, twoFactor } from "better-auth/plugins";
import { dbPool } from "@/server/db";
import { isSameOrigin } from "@/server/cms-access";
import { cmsAccessControl, klantbeheerderRole, pwamediaAdminRole } from "@/server/cms-permissions";

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET() {
  if (!dbPool) return Response.json({ canBootstrap: false, configured: false });

  try {
    const result = await dbPool.query('SELECT COUNT(*)::int AS count FROM "user"');
    const count = result.rows[0]?.count || 0;
    return Response.json(
      { canBootstrap: count === 0, configured: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("CMS bootstrap status failed:", error);
    return Response.json({ canBootstrap: false, configured: true }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Ongeldige request-origin." }, { status: 403 });
  }

  const secret = process.env.BETTER_AUTH_SECRET;
  const bootstrapSecret = process.env.CMS_BOOTSTRAP_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  if (!dbPool || !secret || !bootstrapSecret) {
    return Response.json({ error: "CMS-bootstrap is nog niet volledig geconfigureerd." }, { status: 503 });
  }

  try {
    const existing = await dbPool.query('SELECT COUNT(*)::int AS count FROM "user"');
    if ((existing.rows[0]?.count || 0) > 0) {
      return Response.json({ error: "Het eerste CMS-account is al aangemaakt." }, { status: 409 });
    }

    const body = await request.json().catch(() => ({}));
    const supplied = String(body.bootstrapSecret || "");
    if (!supplied || !safeEqual(supplied, bootstrapSecret)) {
      return Response.json({ error: "Ongeldige bootstrapcode." }, { status: 403 });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (
      !name ||
      name.length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      password.length < 12 ||
      password.length > 128
    ) {
      return Response.json(
        { error: "Controleer naam, e-mailadres en wachtwoord (12–128 tekens)." },
        { status: 400 }
      );
    }

    const bootstrapAuth = betterAuth({
      appName: process.env.CMS_SITE_NAME || "PWAMEDIA CMS",
      database: dbPool,
      secret,
      baseURL,
      emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        minPasswordLength: 12,
        maxPasswordLength: 128,
      },
      trustedOrigins: [new URL(baseURL).origin, new URL(request.url).origin],
      plugins: [
        admin({
          ac: cmsAccessControl,
          roles: {
            pwamedia_admin: pwamediaAdminRole,
            klantbeheerder: klantbeheerderRole,
          },
          defaultRole: "pwamedia_admin",
        }),
        twoFactor({
          issuer: process.env.CMS_SITE_NAME || "PWAMEDIA CMS",
          totpOptions: { period: 30, digits: 6 },
        }),
      ],
    });

    const result = await bootstrapAuth.api.signUpEmail({
      body: { name, email, password },
    });

    return Response.json({
      ok: true,
      user: { id: result.user.id, email: result.user.email, name: result.user.name },
    });
  } catch (error) {
    console.error("CMS bootstrap failed:", error);
    return Response.json({ error: "Eerste CMS-account aanmaken mislukt." }, { status: 500 });
  }
}


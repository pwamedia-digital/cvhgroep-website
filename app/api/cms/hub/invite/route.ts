import { randomBytes, timingSafeEqual } from "node:crypto";
import { auth } from "@/server/auth";
import { dbPool } from "@/server/db";
import { cmsEmailEnabled } from "@/server/email";

function authorized(request: Request) {
  const expected = process.env.PWAMEDIA_HUB_SECRET || "";
  const header = request.headers.get("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!auth || !dbPool) return Response.json({ error: "Authenticatie of database niet beschikbaar." }, { status: 503 });
  if (!cmsEmailEnabled) return Response.json({ error: "CMS-e-mail is niet geconfigureerd." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();

  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return Response.json({ error: "Controleer naam en e-mailadres." }, { status: 400 });
  }

  const existing = await dbPool.query(
    `SELECT id,name,email,role,"emailVerified","twoFactorEnabled"
     FROM "user"
     WHERE role='klantbeheerder'
     LIMIT 1`
  );

  let user = existing.rows[0];
  let createdNow = false;
  let replacedUnactivated = false;

  if (user && String(user.email).toLowerCase() !== email) {
    if (Boolean(user.emailVerified) || Boolean(user.twoFactorEnabled)) {
      return Response.json(
        { error: `Deze website heeft al een geactiveerde klantbeheerder: ${user.email}.` },
        { status: 409 }
      );
    }

    await dbPool.query(
      `DELETE FROM verification
       WHERE value=$1 AND identifier LIKE 'reset-password:%'`,
      [user.id]
    ).catch(() => {});
    await dbPool.query(
      `DELETE FROM "user" WHERE id=$1 AND role='klantbeheerder'`,
      [user.id]
    );
    user = null;
    replacedUnactivated = true;
  }

  if (!user) {
    const temporaryPassword = randomBytes(32).toString("base64url");
    const created = await auth.api.createUser({
      body: { name, email, password: temporaryPassword, role: "klantbeheerder" },
    });
    user = {
      id: created.user.id,
      name: created.user.name,
      email: created.user.email,
      role: "klantbeheerder",
      emailVerified: false,
      twoFactorEnabled: false,
    };
    createdNow = true;
  }

  try {
    const redirectTo = new URL("/admin", request.url).toString();
    await auth.api.requestPasswordReset({
      body: { email: user.email, redirectTo },
    });
  } catch (error) {
    if (createdNow) {
      await dbPool.query(
        `DELETE FROM verification
         WHERE value=$1 AND identifier LIKE 'reset-password:%'`,
        [user.id]
      ).catch(() => {});
      await dbPool.query(
        `DELETE FROM "user" WHERE id=$1 AND role='klantbeheerder'`,
        [user.id]
      ).catch(() => {});
    }
    throw error;
  }

  return Response.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: Boolean(user.emailVerified),
      twoFactorEnabled: Boolean(user.twoFactorEnabled),
    },
    activationEmailRequested: true,
    replacedUnactivated,
  });
}


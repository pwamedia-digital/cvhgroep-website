import { randomUUID } from "node:crypto";
import { dbPool } from "@/server/db";
import { writeCmsAudit } from "@/server/cms-audit";
import {
  makePwamediaSsoCookie,
  signPwamediaSsoClaims,
  verifyPwamediaSsoClaims,
} from "@/server/cms-sso";

export async function POST(request: Request) {
  if (!dbPool) return Response.json({ error: "Database niet beschikbaar." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const token = String(form?.get("token") || "");
  const origin = new URL(request.url).origin;
  const login = verifyPwamediaSsoClaims(token, { kind: "login", audience: origin });

  if (!login || login.iss !== "pwamedia-business-hub") {
    return Response.json({ error: "Ongeldige of verlopen PWAMEDIA-login." }, { status: 401 });
  }

  await dbPool.query(
    `DELETE FROM verification
     WHERE identifier='pwamedia-sso-used' AND "expiresAt" < now()`
  ).catch(() => {});

  const replay = await dbPool.query(
    `INSERT INTO verification (id,identifier,value,"expiresAt")
     VALUES ($1,'pwamedia-sso-used',$2,to_timestamp($3))
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    ["pwamedia-sso-" + login.jti, login.email, login.exp]
  );

  if (replay.rowCount !== 1) {
    return Response.json({ error: "Deze PWAMEDIA-login is al gebruikt." }, { status: 409 });
  }

  const collision = await dbPool.query(
    `SELECT id,role FROM "user" WHERE lower(email)=lower($1) LIMIT 1`,
    [login.email]
  );
  if (collision.rows[0] && collision.rows[0].role !== "pwamedia_admin") {
    return Response.json({ error: "Dit e-mailadres is al gekoppeld aan een ander CMS-account." }, { status: 409 });
  }

  let admin = (
    await dbPool.query(
      `SELECT id,name,email,role,banned,"banExpires"
       FROM "user" WHERE role='pwamedia_admin' LIMIT 1`
    )
  ).rows[0];

  if (!admin) {
    const id = randomUUID();
    const inserted = await dbPool.query(
      `INSERT INTO "user"
        (id,name,email,"emailVerified","twoFactorEnabled",role,banned,"createdAt","updatedAt")
       VALUES ($1,$2,$3,true,false,'pwamedia_admin',false,now(),now())
       RETURNING id,name,email,role,banned,"banExpires"`,
      [id, login.name || "PWAMEDIA", login.email]
    );
    admin = inserted.rows[0];
  } else {
    const updated = await dbPool.query(
      `UPDATE "user"
       SET name=$2,email=$3,"emailVerified"=true,"twoFactorEnabled"=false,"updatedAt"=now()
       WHERE id=$1
       RETURNING id,name,email,role,banned,"banExpires"`,
      [admin.id, login.name || "PWAMEDIA", login.email]
    );
    admin = updated.rows[0];

    await dbPool.query(`DELETE FROM session WHERE "userId"=$1`, [admin.id]).catch(() => {});
    await dbPool.query(`DELETE FROM account WHERE "userId"=$1`, [admin.id]).catch(() => {});
    await dbPool.query(`DELETE FROM "twoFactor" WHERE "userId"=$1`, [admin.id]).catch(() => {});
  }

  const now = Math.floor(Date.now() / 1000);
  const sessionToken = signPwamediaSsoClaims({
    v: 1,
    kind: "session",
    iss: "pwamedia-customer-cms",
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: "pwamedia_admin",
    iat: now,
    exp: now + 8 * 60 * 60,
    jti: randomUUID(),
  });

  await writeCmsAudit({
    actorUserId: admin.id,
    action: "sso.login",
    metadata: { source: "pwamedia-business-hub", centralUserId: login.sub },
    request,
  });

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL("/admin", request.url).toString(),
      "Set-Cookie": makePwamediaSsoCookie(sessionToken),
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}


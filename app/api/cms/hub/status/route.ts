import { timingSafeEqual } from "node:crypto";
import { dbPool } from "@/server/db";

function authorized(request: Request) {
  const expected = process.env.PWAMEDIA_HUB_SECRET || "";
  const header = request.headers.get("authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!dbPool) return Response.json({ error: "Database niet beschikbaar." }, { status: 503 });

  const [{ rows }, auditChecks] = await Promise.all([
    dbPool.query(
      `SELECT id,name,email,role,"emailVerified","twoFactorEnabled","createdAt","updatedAt"
       FROM "user"
       WHERE role IN ('klantbeheerder','pwamedia_admin')
       ORDER BY CASE WHEN role='klantbeheerder' THEN 0 ELSE 1 END`
    ),
    dbPool.query(
      `SELECT
         EXISTS(SELECT 1 FROM cms_audit_log WHERE action='content.publish') AS content_published,
         EXISTS(SELECT 1 FROM cms_audit_log WHERE action='media.upload') AS media_uploaded,
         EXISTS(SELECT 1 FROM cms_audit_log WHERE action='sso.login') AS pwamedia_sso_login`
    ),
  ]);
  const customer = rows.find((row:any)=>row.role==="klantbeheerder") || null;
  const pwamediaAdmin = rows.find((row:any)=>row.role==="pwamedia_admin") || null;
  const shape=(user:any)=>user ? {
    id:user.id,name:user.name,email:user.email,
    emailVerified:Boolean(user.emailVerified),
    twoFactorEnabled:Boolean(user.twoFactorEnabled),
    createdAt:user.createdAt,updatedAt:user.updatedAt,
  } : null;

  const checks = auditChecks.rows[0] || {};
  return Response.json({
    configured: Boolean(customer),
    user: shape(customer),
    pwamediaAdmin: shape(pwamediaAdmin),
    checks: {
      contentPublished: Boolean(checks.content_published),
      mediaUploaded: Boolean(checks.media_uploaded),
      pwamediaSsoLogin: Boolean(checks.pwamedia_sso_login),
      customerTwoFactor: Boolean(customer?.twoFactorEnabled),
    },
  });
}


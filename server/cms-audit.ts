import { dbPool } from "@/server/db";

type AuditArgs = {
  actorUserId?: string | null;
  action: string;
  targetUserId?: string | null;
  metadata?: Record<string, unknown>;
  request?: Request;
};

function clientIp(request?: Request) {
  if (!request) return null;
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
}

export async function writeCmsAudit({
  actorUserId = null,
  action,
  targetUserId = null,
  metadata = {},
  request,
}: AuditArgs) {
  if (!dbPool) return;

  await dbPool.query(
    `INSERT INTO cms_audit_log
      (actor_user_id, action, target_user_id, metadata, ip_address, user_agent)
     VALUES ($1,$2,$3,$4::jsonb,$5,$6)`,
    [
      actorUserId,
      action,
      targetUserId,
      JSON.stringify(metadata),
      clientIp(request),
      request?.headers.get("user-agent") || null,
    ]
  );
}


import { requirePwamediaAdmin } from "@/server/cms-access";
import { dbPool } from "@/server/db";

export async function GET(request: Request) {
  const access = await requirePwamediaAdmin(request);
  if (!access.ok) return access.response;
  if (!dbPool) return Response.json({ error: "Database niet beschikbaar." }, { status: 503 });

  const [users, audit] = await Promise.all([
    dbPool.query(
      `SELECT id,name,email,role,banned,"emailVerified","twoFactorEnabled","createdAt"
       FROM "user"
       ORDER BY "createdAt" ASC`
    ),
    dbPool.query(
      `SELECT l.id,l.action,l.actor_user_id,l.target_user_id,l.metadata,l.ip_address,l.created_at,
              actor.email AS actor_email,
              target.email AS target_email
       FROM cms_audit_log l
       LEFT JOIN "user" actor ON actor.id=l.actor_user_id
       LEFT JOIN "user" target ON target.id=l.target_user_id
       ORDER BY l.created_at DESC
       LIMIT 100`
    ),
  ]);

  return Response.json(
    {
      currentUser: access.user,
      users: users.rows,
      audit: audit.rows,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}


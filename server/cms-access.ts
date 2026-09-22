import { auth } from "@/server/auth";
import { dbPool } from "@/server/db";
import { getPwamediaSsoSession } from "@/server/cms-sso";

export type CmsRole = "pwamedia_admin" | "klantbeheerder";

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const requestOrigin = new URL(request.url).origin;
    if (new URL(origin).origin !== requestOrigin) return false;

    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function getCmsIdentity(headers: Headers) {
  if (!dbPool) return null;

  const sso = getPwamediaSsoSession(headers);
  if (sso) {
    const { rows } = await dbPool.query(
      `SELECT id,email,name,role,banned,"banExpires"
       FROM "user"
       WHERE id=$1 AND role='pwamedia_admin'
       LIMIT 1`,
      [sso.sub]
    );

    const user = rows[0];
    if (user) {
      const banActive = user.banned === true &&
        (!user.banExpires || new Date(user.banExpires).getTime() > Date.now());
      if (!banActive) {
        return {
          session: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: "pwamedia_admin",
              twoFactorEnabled: true,
              pwamediaSso: true,
            },
          },
          user: {
            id: user.id as string,
            email: user.email as string,
            name: user.name as string,
            role: "pwamedia_admin" as CmsRole,
          },
        };
      }
    }
  }

  if (!auth) return null;

  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  if ((session.user as { twoFactorEnabled?: boolean }).twoFactorEnabled !== true) return null;

  const { rows } = await dbPool.query(
    `SELECT id,email,name,role,banned,"banExpires"
     FROM "user"
     WHERE id=$1
     LIMIT 1`,
    [session.user.id]
  );

  const user = rows[0];
  if (!user) return null;

  const banActive = user.banned === true &&
    (!user.banExpires || new Date(user.banExpires).getTime() > Date.now());
  if (banActive) return null;

  if (user.role !== "pwamedia_admin" && user.role !== "klantbeheerder") return null;

  return {
    session,
    user: {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      role: user.role as CmsRole,
    },
  };
}

export async function getCmsSession(headers: Headers) {
  const identity = await getCmsIdentity(headers);
  return identity?.session || null;
}

export async function requireCmsAccess(
  request: Request,
  options: { write?: boolean } = {}
) {
  if (options.write && !isSameOrigin(request)) {
    return {
      ok: false as const,
      response: Response.json({ error: "Ongeldige request-origin." }, { status: 403 }),
    };
  }

  const identity = await getCmsIdentity(request.headers);
  if (!identity) {
    return {
      ok: false as const,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, ...identity };
}

export async function requirePwamediaAdmin(
  request: Request,
  options: { write?: boolean } = {}
) {
  const access = await requireCmsAccess(request, options);
  if (!access.ok) return access;

  if (access.user.role !== "pwamedia_admin") {
    return {
      ok: false as const,
      response: Response.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return access;
}


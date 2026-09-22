import { betterAuth } from "better-auth";
import { after } from "next/server";
import { admin, twoFactor } from "better-auth/plugins";
import { cmsEmailEnabled, sendCmsEmail } from "@/server/email";
import { dbPool } from "@/server/db";
import { cmsAccessControl, klantbeheerderRole, pwamediaAdminRole } from "@/server/cms-permissions";

const fallbackURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

function safeOrigin(value: string | null | undefined) {
  if (!value) return null;
  try { return new URL(value).origin; } catch { return null; }
}

function vercelOrigin(value: string | undefined) {
  if (!value) return null;
  return safeOrigin(value.startsWith("http") ? value : `https://${value}`);
}

const trustedOrigins = new Set<string>();
const configuredOrigin = safeOrigin(fallbackURL);
if (configuredOrigin) trustedOrigins.add(configuredOrigin);

const productionOrigin = vercelOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
if (productionOrigin) trustedOrigins.add(productionOrigin);

const deploymentOrigin = vercelOrigin(process.env.VERCEL_URL);
if (deploymentOrigin) trustedOrigins.add(deploymentOrigin);

if (process.env.NODE_ENV !== "production") {
  trustedOrigins.add("http://localhost:3000");
}

const emailVerification = cmsEmailEnabled
  ? {
      sendVerificationEmail: async ({ user, url }: any) => {
        await sendCmsEmail({
          to: user.email,
          subject: "Bevestig je e-mailadres · PWAMEDIA CMS",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px">
              <h1 style="font-size:28px">Bevestig je e-mailadres</h1>
              <p>Je CMS-account is aangemaakt. Bevestig eerst dit e-mailadres voordat je kunt inloggen.</p>
              <p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#17221d;color:white;text-decoration:none;border-radius:8px">E-mailadres bevestigen</a></p>
              <p style="font-size:12px;color:#66736c">Heb je dit account niet aangevraagd? Dan kun je deze e-mail negeren.</p>
            </div>`,
        });
      },
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      expiresIn: 3600,
    }
  : undefined;

const authDb = dbPool;

export const auth = authDb
  ? betterAuth({
      appName: process.env.CMS_SITE_NAME || "PWAMEDIA CMS",
      database: authDb,
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: fallbackURL,
      emailVerification,
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
        requireEmailVerification: cmsEmailEnabled,
        customSyntheticUser: ({ coreFields, additionalFields, id }: any) => ({
          ...coreFields,
          role: "klantbeheerder",
          banned: false,
          banReason: null,
          banExpires: null,
          twoFactorEnabled: false,
          ...additionalFields,
          id,
        }),
        sendResetPassword: cmsEmailEnabled
          ? async ({ user, url }: any) => {
              const siteName = process.env.CMS_SITE_NAME || "je website";
              after(async () => {
                try {
                  await sendCmsEmail({
                    to: user.email,
                    subject: `Stel je wachtwoord in · ${siteName}`,
                    html: `
                      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#17221d">
                        <p style="font-size:12px;font-weight:700;letter-spacing:.12em;color:#6f7c75">PWAMEDIA CMS</p>
                        <h1 style="font-size:28px">Stel je wachtwoord in</h1>
                        <p>Voor <strong>${siteName}</strong> werd een beveiligde link aangevraagd om je CMS-wachtwoord in te stellen of opnieuw in te stellen.</p>
                        <p><a href="${url}" style="display:inline-block;padding:12px 18px;background:#17221d;color:white;text-decoration:none;border-radius:8px">Wachtwoord instellen</a></p>
                        <p>Deze link is 60 minuten geldig en kan maar één keer gebruikt worden.</p>
                        <p style="font-size:12px;color:#66736c">Heb je dit niet aangevraagd? Dan kun je deze e-mail veilig negeren. Je bestaande wachtwoord blijft ongewijzigd.</p>
                      </div>`,
                  });
                } catch (error) {
                  console.error("CMS reset email failed:", error);
                }
              });
            }
          : undefined,
        resetPasswordTokenExpiresIn: 3600,
        onPasswordReset: async ({ user }: any) => {
          try {
            await authDb.query(
              `UPDATE "user"
               SET "emailVerified"=true,"updatedAt"=now()
               WHERE id=$1 AND "emailVerified"=false`,
              [user.id]
            );
          } catch (error) {
            console.error("CMS email verification after password reset failed:", error);
          }
        },
        revokeSessionsOnPasswordReset: true,
        minPasswordLength: 12,
        maxPasswordLength: 128,
      },
      trustedOrigins: [...trustedOrigins],
      session: {
        expiresIn: 60 * 60 * 24,
        updateAge: 60 * 60 * 6,
        freshAge: 60 * 10,
      },
      rateLimit: {
        enabled: true,
        storage: "database",
        modelName: "rateLimit",
        window: 60,
        max: 30,
        customRules: {
          "/sign-in/email": { window: 60, max: 5 },
          "/two-factor/verify-totp": { window: 60, max: 8 },
          "/two-factor/verify-backup-code": { window: 300, max: 5 },
          "/send-verification-email": { window: 300, max: 3 },
          "/request-password-reset": { window: 300, max: 3 },
          "/reset-password": { window: 300, max: 5 },
        },
      },
      plugins: [
        admin({
          ac: cmsAccessControl,
          roles: {
            pwamedia_admin: pwamediaAdminRole,
            klantbeheerder: klantbeheerderRole,
          },
          defaultRole: "klantbeheerder",
          bannedUserMessage: "Dit CMS-account is geblokkeerd. Neem contact op met PWAMEDIA.",
        }),
        twoFactor({
          issuer: process.env.CMS_SITE_NAME || "PWAMEDIA CMS",
          totpOptions: { period: 30, digits: 6 },
        }),
      ],
    })
  : null;


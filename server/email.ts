type MailArgs = {
  to: string;
  subject: string;
  html: string;
};

export const cmsEmailEnabled = Boolean(
  process.env.RESEND_API_KEY && process.env.CMS_FROM_EMAIL
);

export async function sendCmsEmail({ to, subject, html }: MailArgs) {
  if (!cmsEmailEnabled) {
    throw new Error("CMS e-mailprovider is nog niet geconfigureerd.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CMS_FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "CMS e-mail kon niet worden verzonden.");
  }
}


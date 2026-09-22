import type { MetadataRoute } from "next";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";
  const base = siteUrl().replace(/\/$/, "");

  return {
    rules: noindex
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    sitemap: noindex ? undefined : base + "/sitemap.xml",
    host: noindex ? undefined : base,
  };
}


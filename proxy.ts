import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const offline = process.env.SITE_OFFLINE === "true";
  if (!offline) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const allowed =
    pathname === "/offline" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    /\.[a-zA-Z0-9]{2,5}$/.test(pathname);

  if (allowed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/offline";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};


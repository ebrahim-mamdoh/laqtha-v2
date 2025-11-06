import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("laqtaha_token") || null;
  const user = req.cookies.get("laqtaha_user")
    ? JSON.parse(req.cookies.get("laqtaha_user"))
    : null;

  const { pathname } = req.nextUrl;

  // لو مش داخل وهو عايز يدخل شات أو أونبورديج → رجعه لوجين
  if (!token && (pathname.startsWith("/chat") || pathname.startsWith("/onboarding"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // لو داخل بس لسه ماكملش الاستبيان → يفضل في /onboarding
  if (token && user && user.profileComplete === false && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // لو داخل وكمل الاستبيان → يروح /chat على طول
  if (token && user && user.profileComplete === true && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/onboarding/:path*", "/login", "/register"],
};

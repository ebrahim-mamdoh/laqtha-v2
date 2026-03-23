import { NextResponse } from "next/server";

export function middleware(req) {
  const tokenCookie = req.cookies.get("laqtaha_token");
  const userCookie = req.cookies.get("laqtaha_user");

  const token = tokenCookie?.value || null;
  let user = null;

  try {
    if (userCookie?.value) {
      user = JSON.parse(decodeURIComponent(userCookie.value));
    }
  } catch (e) {
    console.error("Failed to parse user cookie:", e);
  }

  const { pathname } = req.nextUrl;

  // Rule 2: If user IS authenticated -> redirect to '/share'
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/share", req.url));
  }

  // Not authenticated & protected route -> redirect to login
  if (!token && (pathname.startsWith("/chat") || pathname.startsWith("/onboarding") || pathname.startsWith("/share"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Onboarding checks
  if (token && user && user.profileComplete === false && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if (token && user && user.profileComplete === true && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*", "/onboarding/:path*", "/login", "/register", "/share/:path*"],
};

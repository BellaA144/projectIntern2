import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isMainPage = req.nextUrl.pathname === "/";
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminPage && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

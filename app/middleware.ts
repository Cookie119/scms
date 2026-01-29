// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Redirect non-logged in users to login
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role-based redirection
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/dashboard/staff") && role !== "staff") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      path.startsWith("/dashboard/maintenance") &&
      role !== "maintenance"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      path.startsWith("/dashboard/security") &&
      role !== "Security"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Otherwise, continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};

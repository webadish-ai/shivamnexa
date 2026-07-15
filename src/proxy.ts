import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic auth for the internal admin tools. Set ADMIN_USER / ADMIN_PASSWORD in env;
// if unset, admin routes are disabled entirely (503) rather than left open.
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!user || !password) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [givenUser, givenPassword] = Buffer.from(auth.slice(6), "base64")
      .toString()
      .split(":");
    if (givenUser === user && givenPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Shivam NEXA Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/import-pdf"],
};

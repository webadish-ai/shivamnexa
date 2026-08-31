import { NextResponse, type NextRequest } from "next/server";
import { resolveVisitorCity, VISITOR_CITY_COOKIE } from "@/lib/geo";

export function proxy(request: NextRequest) {
  // Already resolved (or explicitly cleared) for this browser — don't redo the work.
  if (request.cookies.has(VISITOR_CITY_COOKIE)) return NextResponse.next();

  const country = request.headers.get("x-vercel-ip-country");
  if (country && country !== "IN") return NextResponse.next();

  const rawCity = request.headers.get("x-vercel-ip-city");
  const city = resolveVisitorCity(rawCity);

  const response = NextResponse.next();
  // Cache the outcome (including "no match") for a day so we don't reparse
  // the geo headers on every navigation — this cookie is read client-side.
  response.cookies.set(VISITOR_CITY_COOKIE, city?.slug ?? "", {
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|studio).*)"],
};

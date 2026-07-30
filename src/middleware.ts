import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.cookies.get("rowmotion_race_session")?.value) return NextResponse.next();
  const url = new URL("/connexion", request.url);
  url.searchParams.set("retour", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/tableau-de-bord/:path*", "/athletes/:path*", "/clubs/:path*", "/diagnostic-integration/:path*", "/competitions/:path*", "/depart/:path*", "/chronometrage/:path*", "/resultats/:path*", "/programme/:path*", "/classements/:path*"] };

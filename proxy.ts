import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/login"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("authToken")?.value

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
}

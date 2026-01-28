import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

/** Canonical origin: https + non-www. Others redirect here (301). Set NEXT_PUBLIC_APP_URL to https://billtosheet.com (no www). */
function getCanonicalOrigin(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL
  if (url) {
    try {
      const u = new URL(url)
      let hostname = u.hostname.replace(/^www\./i, '')
      return `https://${hostname}`
    } catch {
      /* ignore */
    }
  }
  return 'https://billtosheet.com'
}

export default clerkMiddleware(async (auth, req) => {
  // 1. Canonical redirect: http → https, www → non-www (production only)
  const canonical = getCanonicalOrigin()
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  const proto = (req.headers.get('x-forwarded-proto') || 'http').toLowerCase()
  const hostname = host.split(':')[0].toLowerCase()

  if (process.env.NODE_ENV === 'production' && hostname) {
    try {
      const canonUrl = new URL(canonical)
      const isHttps = proto === 'https'
      const isCanonicalHost = hostname === canonUrl.hostname
      const target = new URL(req.nextUrl.pathname + req.nextUrl.search, canonical)

      if (!isHttps || !isCanonicalHost) {
        return NextResponse.redirect(target, 301)
      }
    } catch {
      /* skip redirect on URL parse error */
    }
  }

  // 2. Auth
  // Temporarily disabled for local preview without real Clerk keys
  // if (isProtectedRoute(req)) {
  //   await auth.protect()
  // }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

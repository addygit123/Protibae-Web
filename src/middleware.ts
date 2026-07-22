import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ─── Store Mode Middleware ─────────────────────────────────────────────────────
 *
 * Handles maintenance mode at the edge level:
 * - Maintenance: redirects all public routes to /maintenance
 * - Admin routes always bypass regardless of store mode
 *
 * Note: coming-soon UI enforcement is done at the component/API level.
 * Middleware only handles the hard-block for maintenance mode.
 */

// Routes that are always accessible regardless of store mode
const ALWAYS_ALLOWED = [
  '/admin',
  '/api/auth',
  '/api/admin',
  '/maintenance',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

function isAlwaysAllowed(pathname: string): boolean {
  return ALWAYS_ALLOWED.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(req: NextRequest) {
  const storeMode = process.env.STORE_MODE?.trim().toLowerCase() ?? 'coming-soon';
  const { pathname } = req.nextUrl;

  // Admin and system routes always pass through
  if (isAlwaysAllowed(pathname)) {
    return NextResponse.next();
  }

  // Maintenance mode: redirect public users to /maintenance
  if (storeMode === 'maintenance') {
    if (pathname !== '/maintenance') {
      const maintenanceUrl = req.nextUrl.clone();
      maintenanceUrl.pathname = '/maintenance';
      return NextResponse.redirect(maintenanceUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)).*)',
  ],
};

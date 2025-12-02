import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ENABLE_LOCAL_MODE = process.env.NEXT_PUBLIC_ENABLE_LOCAL_MODE === 'true';

// Supported locales
const locales = ['en', 'zh', 'de'];

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a local mode route
  const localRouteMatch = pathname.match(/^\/([a-z]{2})\/local\/(.*)/);

  if (localRouteMatch && !ENABLE_LOCAL_MODE) {
    // Local mode is disabled - redirect to server route
    const [, locale, rest] = localRouteMatch;
    const serverPath = `/${locale}/${rest}`;
    const url = request.nextUrl.clone();
    url.pathname = serverPath;
    return NextResponse.redirect(url);
  }

  // Continue with next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  // Match internationalized pathnames including local routes
  matcher: ['/', '/(zh|en|de)/:path*']
};

import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't use a locale prefix for the default locale
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en|de)/:path*']
};

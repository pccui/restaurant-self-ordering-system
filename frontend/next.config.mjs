import nextIntlPlugin from 'next-intl/plugin';

const withNextIntl = nextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  experimental: {
    reactCompiler: true,
  },
}

export default withNextIntl(nextConfig);

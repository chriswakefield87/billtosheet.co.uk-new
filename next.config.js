/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/sitemap-pages.xml',
        destination: '/sitemap-pages',
      },
      {
        source: '/sitemap-converters.xml',
        destination: '/sitemap-converters',
      },
      {
        source: '/sitemap-guides.xml',
        destination: '/sitemap-guides',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize native modules to avoid webpack bundling issues
      config.externals = [...(config.externals || []), 'canvas', 'pdfjs-dist', 'pdf-poppler']
    }
    // Ignore node-specific modules but preserve existing aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
      '@': __dirname,
    }
    return config
  },
}

module.exports = nextConfig

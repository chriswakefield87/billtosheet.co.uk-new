import { MetadataRoute } from 'next'

// Main sitemap index - references all sub-sitemaps
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return [
    {
      url: `${baseUrl}/sitemap-pages.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-converters.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-guides.xml`,
      lastModified: new Date(),
    },
  ]
}

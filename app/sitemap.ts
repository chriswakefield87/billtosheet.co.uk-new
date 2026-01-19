import { MetadataRoute } from 'next'
import brandsData from '@/data/brands.json'
import extractData from '@/data/extract_pages.json'
import helpData from '@/data/help_pages.json'
import compareData from '@/data/compare_pages.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages
  const staticPages = [
    '',
    '/pricing',
    '/invoice-to-csv',
    '/blog',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Brand pages
  const brandPages = brandsData.map((brand) => ({
    url: `${baseUrl}/invoice-to-csv/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Extract pages
  const extractPages = extractData.map((page) => ({
    url: `${baseUrl}/extract/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Help pages
  const helpPages = helpData.map((page) => ({
    url: `${baseUrl}/help/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Compare pages
  const comparePages = compareData.map((page) => ({
    url: `${baseUrl}/compare/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...brandPages,
    ...extractPages,
    ...helpPages,
    ...comparePages,
  ]
}

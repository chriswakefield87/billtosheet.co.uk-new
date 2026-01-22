import { statSync } from 'fs'
import { join } from 'path'
import brandsData from '@/data/brands.json'

// Get file modification time for JSON data files
function getDataFileModTime(filename: string): Date {
  try {
    const filePath = join(process.cwd(), 'data', filename)
    const stats = statSync(filePath)
    return stats.mtime
  } catch {
    // Fallback to a fixed date if file can't be read
    return new Date('2024-01-01')
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Get modification time for brands data file
  const brandsModTime = getDataFileModTime('brands.json')

  // Brand converter pages - use actual file modification time
  const brandPages = brandsData.map((brand) => ({
    url: `${baseUrl}/invoice-to-csv/${brand.slug}`,
    lastModified: brandsModTime,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${brandPages.map((page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

import { statSync } from 'fs'
import { join } from 'path'
import extractData from '@/data/extract_pages.json'
import helpData from '@/data/help_pages.json'
import compareData from '@/data/compare_pages.json'

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

  // Get modification times for data files
  const extractModTime = getDataFileModTime('extract_pages.json')
  const helpModTime = getDataFileModTime('help_pages.json')
  const compareModTime = getDataFileModTime('compare_pages.json')

  // Extract pages - use actual file modification time
  const extractPages = extractData.map((page) => ({
    url: `${baseUrl}/extract/${page.slug}`,
    lastModified: extractModTime,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Help pages - use actual file modification time
  const helpPages = helpData.map((page) => ({
    url: `${baseUrl}/help/${page.slug}`,
    lastModified: helpModTime,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Compare pages - use actual file modification time
  const comparePages = compareData.map((page) => ({
    url: `${baseUrl}/compare/${page.slug}`,
    lastModified: compareModTime,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const allPages = [...extractPages, ...helpPages, ...comparePages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
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

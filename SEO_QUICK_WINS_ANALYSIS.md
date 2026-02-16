# BillToSheet SEO Quick Wins Analysis

**Date:** February 16, 2026  
**Context:** Analytics shows only 17 pages indexed after ~4 weeks. Sitemap contains ~150 indexable pages.

---

## Executive Summary

The BillToSheet site has a solid SEO foundation (metadata, schema, internal linking) but several issues are likely limiting indexation. With ~150 pages in the sitemap and only 17 indexed, there's a significant discovery/crawl gap. Below are prioritized quick wins.

---

## Page Inventory

| Category | Count | In Sitemap |
|----------|-------|------------|
| Static pages (home, pricing, etc.) | 12 | 11 (missing /about) |
| Brand converter pages | 32 | ✅ |
| Extract pages | 30 | ✅ |
| Help pages | 30 | ✅ |
| Compare pages | 36 | ✅ |
| Blog posts | 11 | ✅ |
| **Total indexable** | **~151** | **~150** |

---

## Quick Wins (Prioritized)

### 1. Add /about to Sitemap (HIGH – 5 min fix)

**Issue:** The About page exists at `/about`, is linked from the footer, but is **not in the sitemap**. Search engines may not discover it.

**Fix:** Add `'/about'` to the static pages array in `app/sitemap-pages/route.ts`.

---

### 2. Submit Sitemap to Google Search Console (HIGH – Manual)

**Issue:** If the sitemap hasn't been submitted to GSC, Google may be crawling slowly or not following the sitemap index.

**Action:** 
- Go to [Google Search Console](https://search.google.com/search-console)
- Add property for billtosheet.com (if not already)
- Submit sitemap URL: `https://billtosheet.com/sitemap.xml`
- Request indexing for key pages (home, /invoice-to-csv, /invoice-to-excel)

---

### 3. Verify Sitemap Index Accessibility (MEDIUM)

**Current setup:** 
- Root sitemap at `/sitemap.xml` (Next.js default from `sitemap.ts`)
- Sitemap index references: `/sitemap-pages.xml`, `/sitemap-converters.xml`, `/sitemap-guides.xml`
- Sub-sitemaps served via rewrites to route handlers

**Check:** Ensure `https://billtosheet.com/sitemap.xml` returns valid XML and that all three sub-sitemap URLs are reachable and return valid `<urlset>` XML.

---

### 4. Add Sitemap Ping on Deploy (MEDIUM – Optional)

**Issue:** Google and Bing don't automatically know when the sitemap changes.

**Fix:** Add a post-build or deploy step that pings:
- `https://www.google.com/ping?sitemap=https://billtosheet.com/sitemap.xml`
- `https://www.bing.com/ping?sitemap=https://billtosheet.com/sitemap.xml`

---

### 5. Strengthen Homepage Internal Links (MEDIUM)

**Issue:** The homepage links to 6 "popular converters" but not to all hub pages. Crawl depth from homepage affects how quickly deep pages get discovered.

**Current homepage links:** invoice-to-csv brand pages (6), pricing, blog  
**Consider adding:** Prominent links to `/invoice-to-excel`, `/extract`, `/help`, `/compare` if not already above the fold.

---

### 6. Ensure NEXT_PUBLIC_APP_URL is Set in Production (HIGH)

**Issue:** Sitemap and metadata use `process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'`. If this env var is missing in production, sitemap URLs could be wrong (e.g. localhost), causing indexing failures.

**Action:** Verify production build has `NEXT_PUBLIC_APP_URL=https://billtosheet.com` (or your production domain).

---

### 7. Index Now API (Optional – Bing/Microsoft)

**Action:** Submit URLs via [Index Now](https://www.indexnow.org/) for faster discovery on Bing and other supporting engines. Can be automated on deploy.

---

## What's Already Good

- ✅ Metadata (title, description, OG, Twitter) on all major pages
- ✅ Canonical URLs on key pages
- ✅ FAQ, Breadcrumb, Article, Organization, SoftwareApplication schema
- ✅ robots.txt allows crawling of public pages, disallows /dashboard, /convert/*, /api/*
- ✅ /convert/[id] correctly has noindex (user-specific conversion results)
- ✅ Strong internal linking from hub pages to spokes
- ✅ Static generation (generateStaticParams) for dynamic routes

---

## Expected Timeline

- **Weeks 1–2:** Fix sitemap, submit to GSC, verify env vars
- **Weeks 2–4:** Monitor GSC for "Discovered – currently not indexed" vs "Indexed"
- **Weeks 4–8:** Indexation typically improves as crawl budget increases for new sites

Four weeks is still early for a new site. Google allocates limited crawl budget initially; consistent sitemap submission and internal linking help accelerate discovery.

---

## Recommended Immediate Actions

1. **Code:** Add `/about` to sitemap
2. **Ops:** Confirm `NEXT_PUBLIC_APP_URL` in production
3. **Manual:** Submit sitemap in Google Search Console
4. **Manual:** Request indexing for top 5–10 priority pages in GSC

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import blogPostsData from "@/data/blog_posts.json";
import Breadcrumbs from "@/components/Breadcrumbs";
import UploadTool from "@/components/UploadTool";
import brandsData from "@/data/brands.json";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | BillToSheet Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = blogPostsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
    { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
  ]);

  const articleSchema = generateArticleSchema(post);

  // Get 3 brand pages for internal linking (mix of categories)
  const featuredBrands = brandsData.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Card with Upload Tool */}
        <article className="bg-white rounded-xl shadow-md p-8 md:p-12 mt-6">
          {/* Upload Tool */}
          <div className="mb-8">
            <UploadTool />
          </div>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                {post.category}
              </span>
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.readTime && (
                <span className="text-sm text-gray-500">• {post.readTime}</span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{post.title}</span>
            </h1>

            {post.author && (
              <p className="text-gray-600">By {post.author}</p>
            )}
          </div>

          {/* Article Content - Add your content here */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {/* 
                Write your blog post content here.
                You can use standard HTML elements, React components, or markdown.
              */}
            </div>
          </div>
        </article>

        {/* Back to Blog Link */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-2"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Related Invoice Converters */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Try Our Invoice Converters</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/invoice-to-csv/${brand.slug}`}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
              >
                <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
                  {brand.name} Invoice Converter
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Convert {brand.name} invoices to Excel with line items, totals, and tax information.
                </p>
                <span className="text-primary-600 font-medium text-sm">
                  Convert {brand.name} Invoices →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">More Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPostsData
              .filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
                >
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-3">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{relatedPost.excerpt}</p>
                  <span className="text-primary-600 font-medium text-sm">
                    Read More →
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/invoice-to-csv"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
            >
              <span className="font-medium text-primary-600">
                Invoice to CSV Converter →
              </span>
            </Link>
            <Link
              href="/invoice-to-excel"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
            >
              <span className="font-medium text-primary-600">
                Invoice to Excel Converter →
              </span>
            </Link>
            <Link
              href="/extract/invoice-data"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
            >
              <span className="font-medium text-primary-600">
                Extract Invoice Data →
              </span>
            </Link>
            <Link
              href="/help/getting-started"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow block"
            >
              <span className="font-medium text-primary-600">
                Getting Started Guide →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import blogPostsData from "@/data/blog_posts.json";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Blog - Invoice Conversion Tips & News",
  description: "Read the latest tips, guides, and news about invoice conversion, data extraction, and accounting automation.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  // Sort posts by date (newest first)
  const posts = [...blogPostsData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tips, guides, and insights about invoice conversion and accounting
            automation.
          </p>
        </div>

        {/* Vertical list of blog posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
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
                </div>
                {post.readTime && (
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                {post.author && (
                  <span className="text-sm text-gray-500">By {post.author}</span>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 font-medium hover:underline inline-flex items-center gap-2"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500">More articles coming soon!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

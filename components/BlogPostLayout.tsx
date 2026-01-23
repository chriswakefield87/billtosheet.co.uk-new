import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import blogPostsData from "@/data/blog_posts.json";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author?: string;
  readTime?: string;
}

interface BlogPostLayoutProps {
  post: BlogPost;
  children: React.ReactNode;
}

export default function BlogPostLayout({ post, children }: BlogPostLayoutProps) {
  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-md p-8 md:p-12">
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

          {/* Article Content */}
          <div className="max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6 
              [&_a]:text-primary-600 [&_a]:font-medium [&_a]:hover:text-primary-700 [&_a]:hover:underline [&_a]:transition-colors [&_a]:underline-offset-2
              [&_ol]:list-decimal [&_ol]:ml-8 [&_ol]:space-y-3 [&_ol]:my-4
              [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:space-y-3 [&_ul]:my-4
              [&_li]:mb-2 [&_li]:pl-2">
              {children}
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

        {/* Related Posts */}
        <div className="mt-12">
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
      </div>
    </div>
  );
}

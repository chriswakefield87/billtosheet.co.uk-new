import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import blogPostsData from "@/data/blog_posts.json";
import Breadcrumbs from "@/components/Breadcrumbs";

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

          {/* Article Content - Replace this with your actual content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {/* 
                TODO: Replace this section with your actual blog post content.
                You can use HTML, markdown-style formatting, or React components.
                
                Example structure:
              */}
              
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                {post.excerpt}
              </p>

              <h2 className="text-3xl font-bold mt-8 mb-4">Introduction</h2>
              <p>
                This is a template blog post. Replace this content with your actual article.
                You can structure your content with headings, paragraphs, lists, and more.
              </p>

              <h2 className="text-3xl font-bold mt-8 mb-4">Main Content Section</h2>
              <p>
                Add your main content here. You can include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Paragraphs with detailed explanations</li>
                <li>Bullet points and numbered lists</li>
                <li>Code examples if relevant</li>
                <li>Screenshots or images</li>
                <li>Links to related resources</li>
              </ul>

              <h3 className="text-2xl font-bold mt-6 mb-3">Subsection</h3>
              <p>
                You can create subsections with h3 tags. This helps organize longer articles
                and improves readability.
              </p>

              <h2 className="text-3xl font-bold mt-8 mb-4">Conclusion</h2>
              <p>
                Wrap up your article with a conclusion that summarizes key points and provides
                a call-to-action if appropriate.
              </p>

              {/* 
                Example: Add internal links to your other pages
              */}
              <div className="bg-primary-50 border-l-4 border-primary-600 p-6 my-8">
                <h3 className="text-xl font-bold mb-3">Related Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/invoice-to-csv" className="text-primary-600 hover:underline">
                      Invoice to CSV Converter →
                    </Link>
                  </li>
                  <li>
                    <Link href="/help/getting-started" className="text-primary-600 hover:underline">
                      Getting Started Guide →
                    </Link>
                  </li>
                </ul>
              </div>
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

        {/* Related Posts (Optional) */}
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

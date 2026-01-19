import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Invoice Conversion Tips & News",
  description: "Read the latest tips, guides, and news about invoice conversion, data extraction, and accounting automation.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  // Stub blog posts for MVP
  const posts = [
    {
      slug: "how-to-convert-invoices-to-csv",
      title: "How to Convert Invoices to CSV: Complete Guide",
      excerpt:
        "Learn how to efficiently convert your invoice PDFs to CSV format for easy import into accounting software.",
      date: "2026-01-15",
      category: "Guides",
    },
    {
      slug: "benefits-of-invoice-automation",
      title: "5 Benefits of Automating Invoice Data Entry",
      excerpt:
        "Discover how automating invoice data entry can save time, reduce errors, and improve your accounting workflow.",
      date: "2026-01-10",
      category: "Tips",
    },
    {
      slug: "csv-vs-excel-for-invoices",
      title: "CSV vs Excel: Which Format is Best for Invoice Data?",
      excerpt:
        "Compare CSV and Excel formats for storing and managing invoice data. Learn which one suits your needs.",
      date: "2026-01-05",
      category: "Comparisons",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tips, guides, and insights about invoice conversion and accounting
            automation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="card hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 font-medium text-sm hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">More articles coming soon!</p>
        </div>
      </div>
    </div>
  );
}

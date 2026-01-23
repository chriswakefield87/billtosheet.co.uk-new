import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "How to Convert Invoices to CSV: Complete Guide | BillToSheet Blog",
  description: "Learn how to efficiently convert your invoice PDFs to CSV format for easy import into accounting software.",
  alternates: {
    canonical: "/blog/how-to-convert-invoices-to-csv",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "how-to-convert-invoices-to-csv");

  if (!post) {
    return null;
  }

  return (
    <BlogPostLayout post={post}>
      {/* Write your blog post content here */}
      <p>Your content goes here...</p>
    </BlogPostLayout>
  );
}

import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "CSV vs Excel: Which Format is Best for Invoice Data? | BillToSheet Blog",
  description: "Compare CSV and Excel formats for storing and managing invoice data. Learn which one suits your needs.",
  alternates: {
    canonical: "/blog/csv-vs-excel-for-invoices",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "csv-vs-excel-for-invoices");

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

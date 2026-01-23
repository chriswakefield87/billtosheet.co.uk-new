import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "5 Benefits of Automating Invoice Data Entry | BillToSheet Blog",
  description: "Discover how automating invoice data entry can save time, reduce errors, and improve your accounting workflow.",
  alternates: {
    canonical: "/blog/benefits-of-invoice-automation",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "benefits-of-invoice-automation");

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

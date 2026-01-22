import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import helpData from "@/data/help_pages.json";
import { generateFAQSchema } from "@/lib/seo-utils";

interface HelpPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return helpData.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: HelpPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = helpData.find((p) => p.slug === slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/help/${slug}`,
    },
  };
}

export default async function HelpPage({ params }: HelpPageProps) {
  const { slug } = await params;
  const page = helpData.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Help", href: "/help" },
    { label: page.title, href: `/help/${page.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(page.faqs)),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />

            <h1 className="text-4xl font-bold mb-6">
              <span className="gradient-text">{page.title}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">{page.description}</p>
          </div>
        </section>

        <FAQSection faqs={page.faqs} />

        {/* Back to Hub Link */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/help"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to Help Center
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">More Help Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {helpData
                .filter((p) => p.slug !== slug)
                .slice(0, 4)
                .map((relatedPage) => (
                  <Link
                    key={relatedPage.slug}
                    href={`/help/${relatedPage.slug}`}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold text-primary-600 mb-1">
                      {relatedPage.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {relatedPage.description.substring(0, 80)}...
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

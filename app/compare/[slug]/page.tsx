import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import compareData from "@/data/compare_pages.json";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";
import brandsData from "@/data/brands.json";

interface ComparePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return compareData.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = compareData.find((p) => p.slug === slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const page = compareData.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Compare", href: "/compare" },
    { label: page.title, href: `/compare/${page.slug}` },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Compare", url: `${baseUrl}/compare` },
    { name: page.title, url: `${baseUrl}/compare/${page.slug}` },
  ]);

  // Get 3 brand pages for internal linking (mix of categories)
  const featuredBrands = brandsData.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(page.faqs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />

            <h1 className="text-4xl font-bold mb-6">
              <span className="gradient-text">{page.title}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12">{page.description}</p>

            <div className="text-center">
              <Link href="/" className="btn-primary">
                Try BillToSheet Free
              </Link>
            </div>
          </div>
        </section>

        <FAQSection faqs={page.faqs} />

        {/* Back to Hub Link */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/compare"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to All Comparisons
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Try Our Invoice Converters</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/invoice-to-csv/${brand.slug}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-primary-600 mb-1">
                    {brand.name} Invoice Converter
                  </h3>
                  <p className="text-sm text-gray-600">
                    Convert {brand.name} invoices to Excel with line items
                  </p>
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-12">More Comparisons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {compareData
                .filter((p) => p.slug !== slug)
                .map((relatedPage) => (
                  <Link
                    key={relatedPage.slug}
                    href={`/compare/${relatedPage.slug}`}
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

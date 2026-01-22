import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import extractData from "@/data/extract_pages.json";
import { generateFAQSchema } from "@/lib/seo-utils";

interface ExtractPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return extractData.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: ExtractPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = extractData.find((p) => p.slug === slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/extract/${slug}`,
    },
  };
}

export default async function ExtractPage({ params }: ExtractPageProps) {
  const { slug } = await params;
  const page = extractData.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Extract", href: "/extract" },
    { label: page.title, href: `/extract/${page.slug}` },
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
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="gradient-text">{page.title}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {page.description}
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        <FAQSection faqs={page.faqs} />

        {/* Back to Hub Link */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/extract"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to All Data Extraction Guides
            </Link>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/invoice-to-csv"
                className="card hover:shadow-lg transition-shadow"
              >
                <span className="font-medium text-primary-600">
                  Invoice Converters →
                </span>
              </Link>
              <Link
                href="/help/getting-started"
                className="card hover:shadow-lg transition-shadow"
              >
                <span className="font-medium text-primary-600">
                  Help Center →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

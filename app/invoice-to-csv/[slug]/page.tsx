import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import brandsData from "@/data/brands.json";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return brandsData.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandsData.find((b) => b.slug === slug);

  if (!brand) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: brand.metaTitle,
    description: brand.metaDescription,
    alternates: {
      canonical: `/invoice-to-csv/${slug}`,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = brandsData.find((b) => b.slug === slug);

  if (!brand) {
    notFound();
  }

  // Get related brands (6 from same category)
  const relatedBrands = brandsData
    .filter((b) => b.category === brand.category && b.slug !== brand.slug)
    .slice(0, 6);

  // Get one extract page and one help page for internal linking
  const extractLink = "/extract/invoice-data";
  const helpLink = "/help/getting-started";

  const breadcrumbItems = [
    { label: "Invoice to CSV", href: "/invoice-to-csv" },
    { label: brand.name, href: `/invoice-to-csv/${brand.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" },
    {
      name: "Invoice to CSV",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invoice-to-csv`,
    },
    {
      name: brand.name,
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invoice-to-csv/${brand.slug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(brand.faqs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {brand.name} Invoice PDF to{" "}
                <span className="gradient-text">Excel (Line Items Included)</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {brand.description}
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        {/* Export Steps */}
        {brand.exportSteps && brand.exportSteps.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                How to Export <span className="gradient-text">{brand.name}</span>{" "}
                Invoices
              </h2>

              <div className="max-w-4xl mx-auto">
                <ol className="space-y-6">
                  {brand.exportSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-lg pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* Unique Fields */}
        {brand.uniqueFields && brand.uniqueFields.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                What Gets Extracted from{" "}
                <span className="gradient-text">{brand.name}</span> Invoices
              </h2>

              <div className="card max-w-4xl mx-auto">
                <ul className="space-y-3">
                  {brand.uniqueFields.map((field, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Common Issues */}
        {brand.commonIssues && brand.commonIssues.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                Common <span className="gradient-text">{brand.name}</span> Invoice
                Issues
              </h2>

              <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                  <p className="text-gray-700">
                    Our converter handles these common {brand.name} invoice
                    formatting variations automatically, so you don't have to
                    worry about them.
                  </p>
                </div>

                <ul className="space-y-4">
                  {brand.commonIssues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-yellow-600 mr-3 mt-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <FAQSection faqs={brand.faqs} />

        {/* Back to Hub Link */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/invoice-to-csv"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to All Invoice Converters
            </Link>
          </div>
        </section>

        {/* Related Converters */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Other <span className="gradient-text">Invoice Converters</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedBrands.map((relatedBrand) => (
                <Link
                  key={relatedBrand.slug}
                  href={`/invoice-to-csv/${relatedBrand.slug}`}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {relatedBrand.name} Invoice Converter
                  </h3>
                  <p className="text-sm text-gray-600">
                    Convert {relatedBrand.name} invoices to CSV and Excel
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-4">
              <Link
                href={extractLink}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-primary-600 mb-1">
                  Extract Invoice Data →
                </h3>
                <p className="text-sm text-gray-600">
                  Learn more about invoice data extraction
                </p>
              </Link>
              <Link
                href={helpLink}
                className="card hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-primary-600 mb-1">
                  Getting Started →
                </h3>
                <p className="text-sm text-gray-600">
                  New to BillToSheet? Start here
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

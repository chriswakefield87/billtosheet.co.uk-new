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
                {brand.name} Invoice to{" "}
                <span className="gradient-text">CSV Converter</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {brand.description}
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Convert <span className="gradient-text">{brand.name}</span>{" "}
              Invoices
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Invoice</h3>
                <p className="text-gray-600">
                  Upload your {brand.name} invoice PDF using the tool above
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Automatic Processing
                </h3>
                <p className="text-gray-600">
                  Our system extracts all data from your {brand.name} invoice
                  automatically
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Download CSV</h3>
                <p className="text-gray-600">
                  Download your converted files in CSV and Excel format
                </p>
              </div>
            </div>

            <div className="card max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">
                What Gets Extracted from {brand.name} Invoices
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Vendor information (company name, address, contact details)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Invoice number, date, and payment terms</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    All line items with descriptions, quantities, and prices
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Tax information and breakdown</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary-600 mr-2 mt-1 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Subtotals, totals, and currency information</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={brand.faqs} />

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

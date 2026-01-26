import { Metadata } from "next";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import extractData from "@/data/extract_pages.json";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Extract Invoice Data | Invoice Data Extraction Tool",
  description:
    "Extract structured data from PDF invoices automatically. Get vendor details, dates, amounts, taxes, and line items in CSV and Excel format.",
  alternates: {
    canonical: "/extract",
  },
};

export default function ExtractHub() {
  const faqs = [
    {
      question: "What invoice data can be extracted?",
      answer:
        "Our tool extracts vendor names, invoice numbers, dates, currency, subtotals, tax amounts, totals, and detailed line items including descriptions, quantities, unit prices, and line totals.",
    },
    {
      question: "What file formats can I export extracted data to?",
      answer:
        "You can download your extracted invoice data in CSV format (invoice details and line items separately) or as a combined Excel workbook with multiple sheets.",
    },
    {
      question: "How accurate is the data extraction?",
      answer:
        "Our intelligent parsing system uses advanced OCR and pattern recognition to extract invoice data with high accuracy. We support invoices from all major platforms and accounting software.",
    },
    {
      question: "Can I extract data from multiple invoices at once?",
      answer:
        "Currently, we process one invoice at a time to ensure accuracy. You can process multiple invoices sequentially using your credit balance.",
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Extract", url: `${baseUrl}/extract` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Extract Invoice <span className="gradient-text">Data</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Automatically extract structured data from PDF invoices including vendor information, dates, amounts, tax details, and line items into CSV and Excel formats.
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        {/* Extract Pages Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Data Extraction <span className="gradient-text">Guides</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extractData.map((page) => (
                <Link
                  key={page.slug}
                  href={`/extract/${page.slug}`}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {page.description}
                  </p>
                  <span className="text-primary-600 font-medium text-sm">
                    Learn More →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Extract Data? */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why <span className="gradient-text">Extract</span> Invoice Data?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600">
                  Automatically extract invoice data in seconds instead of manually entering information line by line.
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Structured Data</h3>
                <p className="text-gray-600">
                  Get clean, structured CSV and Excel files ready to import into your accounting software or database.
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Reduce Errors</h3>
                <p className="text-gray-600">
                  Eliminate human transcription errors and ensure consistent data formatting across all your invoices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Extract <span className="gradient-text">Invoice Data</span>?
            </h2>
            <p className="text-gray-600 mb-8">
              Extract your first invoice for free. No account required.
            </p>
            <Link href="/" className="btn-primary text-lg px-8 py-4">
              Extract Invoice Data Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

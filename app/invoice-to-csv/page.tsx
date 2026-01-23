import { Metadata } from "next";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import brandsData from "@/data/brands.json";
import { generateFAQSchema, generateSoftwareApplicationSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Invoice to CSV Converter | Convert Invoice PDF to CSV Online",
  description:
    "Convert invoice PDFs to CSV format instantly. Extract invoice data from Amazon, Stripe, QuickBooks, and more. Free trial available.",
  alternates: {
    canonical: "/invoice-to-csv",
  },
};

export default function InvoiceToCSVHub() {
  const faqs = [
    {
      question: "How do I convert an invoice PDF to CSV?",
      answer:
        "Simply upload your invoice PDF using our converter tool. Our system automatically extracts all invoice data including vendor details, dates, line items, and totals, then generates downloadable CSV files.",
    },
    {
      question: "What invoice formats are supported?",
      answer:
        "We support PDF invoices from all major platforms including Amazon, Stripe, PayPal, QuickBooks, Xero, FreshBooks, Shopify, and most accounting software.",
    },
    {
      question: "Is the conversion free?",
      answer:
        "Yes! You can convert your first invoice for free without creating an account. For additional conversions, purchase affordable credit packs starting at £9 for 25 credits.",
    },
    {
      question: "What data is extracted from my invoices?",
      answer:
        "We extract vendor information, invoice numbers, dates, currency, subtotals, taxes, totals, and detailed line items including descriptions, quantities, prices, and line totals.",
    },
  ];

  // Group brands by category
  const groupedBrands = brandsData.reduce((acc, brand) => {
    if (!acc[brand.category]) {
      acc[brand.category] = [];
    }
    acc[brand.category].push(brand);
    return acc;
  }, {} as Record<string, typeof brandsData>);

  const categoryNames: Record<string, string> = {
    ecommerce: "E-Commerce Platforms",
    payments: "Payment Processors",
    accounting: "Accounting Software",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSoftwareApplicationSchema()) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Convert Invoice PDF to{" "}
                <span className="gradient-text">CSV Format</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Extract structured data from your invoice PDFs and convert to CSV
                format. Works with invoices from any platform or accounting
                software.
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        {/* Popular Converters by Category */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Convert Invoices by <span className="gradient-text">Platform</span>
            </h2>

            {Object.entries(groupedBrands).map(([category, brands]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">
                  {categoryNames[category] || category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/invoice-to-csv/${brand.slug}`}
                      className="card hover:shadow-xl transition-shadow"
                    >
                      <h4 className="text-xl font-semibold mb-2">
                        {brand.name} Invoice Converter
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        {brand.description.substring(0, 120)}...
                      </p>
                      <span className="text-primary-600 font-medium text-sm">
                        Convert {brand.name} Invoices →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Use Our <span className="gradient-text">CSV Converter</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  Structured CSV Output
                </h3>
                <p className="text-gray-600">
                  Get clean, structured CSV files ready to import into Excel,
                  accounting software, or databases.
                </p>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Instant Processing</h3>
                <p className="text-gray-600">
                  Upload your invoice PDF and get CSV files in seconds. No
                  waiting, no complex setup.
                </p>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">
                  Accurate Data Extraction
                </h3>
                <p className="text-gray-600">
                  Our intelligent parser extracts all invoice details accurately,
                  including line items, taxes, and totals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection faqs={faqs} />

        {/* Related Links */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/extract/invoice-data"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Extract Invoice Data →
                </span>
              </Link>
              <Link
                href="/help/getting-started"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Getting Started Guide →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

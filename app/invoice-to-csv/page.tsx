import { Metadata } from "next";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import brandsData from "@/data/brands.json";
import { generateFAQSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Invoice to CSV Converter | Convert Invoice PDF to CSV & Excel Online",
  description:
    "Convert invoice PDFs to CSV and Excel format instantly. Extract invoice data, line items, and tax information from Amazon, Stripe, QuickBooks, and more. Free trial available.",
  alternates: {
    canonical: "/invoice-to-csv",
  },
};

export default function InvoiceToCSVHub() {
  const faqs = [
    {
      question: "How do I convert an invoice PDF to CSV?",
      answer:
        "Simply upload your invoice PDF using our converter tool. Our system automatically extracts all invoice data including vendor details, dates, line items, and totals, then generates downloadable CSV and Excel files ready for import into accounting software.",
    },
    {
      question: "What's the difference between CSV and Excel output?",
      answer:
        "CSV files are simple text files that work with any spreadsheet or accounting software. Excel files (.xlsx) contain multiple sheets with formatting. We provide both formats - CSV for universal compatibility and Excel for detailed analysis with separate sheets for invoice details and line items.",
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
      question: "Can I convert multiple invoices at once?",
      answer:
        "Yes! Sign in to your dashboard and use our bulk conversion feature to upload and process multiple invoices simultaneously. All files process concurrently for maximum speed, with live progress tracking for each file.",
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Invoice to CSV", url: `${baseUrl}/invoice-to-csv` },
  ]);

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
                Convert Invoice PDF to{" "}
                <span className="gradient-text">CSV & Excel</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Extract structured data from your invoice PDFs and convert to CSV and Excel formats with full line items, totals, and VAT.
                Works with invoices from any platform or accounting software. Convert single invoices or process multiple at once with bulk conversion.
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">
                  Bulk Conversion
                </h3>
                <p className="text-gray-600">
                  Process multiple invoices simultaneously with concurrent processing. Perfect for monthly reconciliation and batch jobs.
                </p>
              </div>

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

        {/* Related Searches */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Searches</h2>
            <div className="card">
              <p className="text-gray-600 mb-4">You might also search for:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• <Link href="/invoice-to-excel" className="text-primary-600 hover:underline">Convert invoice PDF to spreadsheet</Link></li>
                <li>• <Link href="/invoice-to-excel" className="text-primary-600 hover:underline">PDF to Excel invoice converter</Link></li>
                <li>• <Link href="/invoice-to-excel" className="text-primary-600 hover:underline">Invoice PDF to Excel online</Link></li>
                <li>• <Link href="/invoice-to-excel" className="text-primary-600 hover:underline">Extract table from invoice to Excel</Link></li>
                <li>• <Link href="/invoice-to-excel" className="text-primary-600 hover:underline">Invoice line items to Excel</Link></li>
                <li>• <Link href="/invoice-to-csv" className="text-primary-600 hover:underline">Invoice PDF to CSV converter</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Tools & Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/invoice-to-excel"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Invoice to Excel Converter →
                </span>
              </Link>
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
              <Link
                href="/help/bulk-conversion"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Bulk Conversion Guide →
                </span>
              </Link>
              <Link
                href="/blog"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Blog & Guides →
                </span>
              </Link>
              <Link
                href="/compare"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Compare Options →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

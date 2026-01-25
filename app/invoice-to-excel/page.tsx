import { Metadata } from "next";
import Link from "next/link";
import UploadTool from "@/components/UploadTool";
import FAQSection from "@/components/FAQSection";
import brandsData from "@/data/brands.json";
import { generateFAQSchema, generateSoftwareApplicationSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Invoice PDF to Excel Converter — Extract Line Items | BillToSheet",
  description:
    "Convert invoice PDFs to Excel with full line items, totals, and VAT. Upload invoice PDFs and download structured Excel files ready for bookkeeping, reporting, and analysis. Works best on digitally generated invoices.",
  alternates: {
    canonical: "/invoice-to-excel",
  },
};

export default function InvoiceToExcelHub() {
  const faqs = [
    {
      question: "How do I convert an invoice PDF to Excel with line items?",
      answer:
        "Simply upload your invoice PDF using our converter tool above. Our system automatically extracts all invoice data including vendor details, dates, line items, totals, and tax information, then generates a downloadable Excel file (.xlsx) with structured sheets ready for bookkeeping.",
    },
    {
      question: "How does an invoice PDF convert to Excel?",
      answer:
        "Our intelligent parser reads your invoice PDF, identifies structured data like tables and line items, extracts all relevant information (vendor, invoice number, dates, line items with quantities and prices, subtotals, taxes, totals), and organizes it into a clean Excel workbook with separate sheets for invoice details and line items.",
    },
    {
      question: "What invoice formats work with PDF to Excel conversion?",
      answer:
        "We support PDF invoices from all major platforms including Amazon, Stripe, PayPal, QuickBooks, Xero, FreshBooks, Shopify, and most accounting software. Works best with digitally generated PDFs (not scanned images).",
    },
    {
      question: "Can I convert multiple invoice PDFs to Excel at once?",
      answer:
        "Yes! Sign in to your dashboard and use our bulk conversion feature to upload and process multiple invoices simultaneously. All files process concurrently for maximum speed, with live progress tracking. Each invoice becomes a separate Excel file you can download individually.",
    },
    {
      question: "What data is extracted from invoice PDFs to Excel?",
      answer:
        "We extract vendor information, invoice numbers, dates, currency, subtotals, taxes, totals, and detailed line items including descriptions, quantities, unit prices, and line totals. All data is organized into structured Excel sheets ready for import into accounting software or analysis.",
    },
    {
      question: "Why do generic PDF to Excel tools fail with invoice tables?",
      answer:
        "Generic PDF converters treat invoices as plain text or images, often breaking table structures and losing line item relationships. Our converter is specifically designed for invoices, recognizing invoice layouts, preserving line item tables, and extracting structured data that maintains relationships between items, quantities, prices, and totals.",
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
                <span className="gradient-text">Excel (Line Items Included)</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Upload invoice PDFs and download structured Excel files with full line items, totals, and VAT. 
                Ready for bookkeeping, reporting, and analysis. Works with invoices from any platform or accounting software.
              </p>
            </div>

            <UploadTool />
          </div>
        </section>

        {/* What PDF to Excel Means for Invoices */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              What "PDF to Excel" Means for{" "}
              <span className="gradient-text">Invoices</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Structured Data Extraction</h3>
                <p className="text-gray-600">
                  Unlike generic PDF converters that treat your invoice as plain text, our converter recognizes 
                  invoice structure and extracts data into organized Excel sheets. Line items become rows, 
                  quantities and prices become columns, and totals are calculated correctly.
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Ready for Bookkeeping</h3>
                <p className="text-gray-600">
                  The Excel output is formatted specifically for accounting workflows. Separate sheets for 
                  invoice details and line items make it easy to import into QuickBooks, Xero, Sage, or 
                  any accounting software that accepts Excel imports.
                </p>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-3">Preserves Relationships</h3>
                <p className="text-gray-600">
                  Our converter maintains the relationship between line items, quantities, prices, and totals. 
                  Each line item row includes description, quantity, unit price, and line total—exactly as it 
                  appears on your invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Generic Tools Fail */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Generic PDF → Excel Tools{" "}
              <span className="gradient-text">Fail Invoice Tables</span>
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card bg-red-50 border-red-200">
                  <h3 className="text-lg font-semibold mb-2 text-red-800">Generic Converters</h3>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>• Break table structures</li>
                    <li>• Lose line item relationships</li>
                    <li>• Merge columns incorrectly</li>
                    <li>• Require manual cleanup</li>
                    <li>• Miss invoice-specific fields</li>
                  </ul>
                </div>

                <div className="card bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold mb-2 text-green-800">BillToSheet</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Preserves table structure</li>
                    <li>• Maintains line item relationships</li>
                    <li>• Clean column separation</li>
                    <li>• Ready to use immediately</li>
                    <li>• Extracts invoice-specific data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Converters by Category */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Convert Invoice PDFs to Excel by{" "}
              <span className="gradient-text">Platform</span>
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
                        {brand.name} Invoice to Excel
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Convert {brand.name} invoice PDFs to Excel with line items, totals, and tax information.
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
              Why Use Our <span className="gradient-text">Excel Converter</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">
                  Structured Excel Output
                </h3>
                <p className="text-gray-600">
                  Get clean Excel workbooks with separate sheets for invoice details and line items, ready to import into accounting software.
                </p>
              </div>

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
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Instant Processing</h3>
                <p className="text-gray-600">
                  Upload your invoice PDF and get Excel files in seconds. No waiting, no complex setup, no manual cleanup required.
                </p>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">
                  Accurate Line Items
                </h3>
                <p className="text-gray-600">
                  Our intelligent parser extracts all line items accurately, preserving quantities, prices, and line totals exactly as shown on your invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works: Invoice PDF →{" "}
              <span className="gradient-text">Excel</span>
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>
                  <p className="text-gray-600 text-sm">
                    Drag and drop or select your invoice PDF file. Works with invoices from any platform.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Extract Data</h3>
                  <p className="text-gray-600 text-sm">
                    Our system automatically extracts line items, totals, tax, and all invoice details in seconds.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Download Excel</h3>
                  <p className="text-gray-600 text-sm">
                    Get your structured Excel file (.xlsx) with separate sheets for invoice details and line items.
                  </p>
                </div>
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
            <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/invoice-to-csv"
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-600 transition-colors"
              >
                <span className="font-medium text-primary-600">
                  Invoice to CSV Converter →
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

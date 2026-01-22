import { Metadata } from "next";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import compareData from "@/data/compare_pages.json";
import { generateFAQSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Invoice Converter Comparisons | BillToSheet vs Alternatives",
  description:
    "Compare BillToSheet with manual data entry, other invoice converters, and desktop software. See why automated invoice conversion saves time and reduces errors.",
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareHub() {
  const faqs = [
    {
      question: "Why should I use an automated invoice converter?",
      answer:
        "Automated invoice converters save hours of manual data entry, eliminate transcription errors, and ensure consistent formatting. BillToSheet processes invoices in seconds compared to 5-10 minutes per invoice manually.",
    },
    {
      question: "How does BillToSheet compare to other invoice converters?",
      answer:
        "BillToSheet offers instant conversion, both CSV and Excel outputs, 30-day file retention, affordable pay-as-you-go pricing with no subscriptions, and works with invoices from any platform.",
    },
    {
      question: "Should I use CSV or Excel format?",
      answer:
        "CSV files are simple and universally compatible, ideal for importing into accounting software. Excel files can contain multiple sheets and formatting, better for analysis and reporting. BillToSheet provides both formats.",
    },
    {
      question: "Is online conversion better than desktop software?",
      answer:
        "Online converters require no installation, work on any device, always have the latest features, and your data is accessible from anywhere. BillToSheet processes invoices just as fast as desktop software without the maintenance overhead.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Invoice Converter <span className="gradient-text">Comparisons</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Compare BillToSheet with manual data entry, other invoice converters, and desktop software. 
                See why automated invoice conversion is the best choice for your business.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Pages Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Detailed <span className="gradient-text">Comparisons</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compareData.map((page) => (
                <Link
                  key={page.slug}
                  href={`/compare/${page.slug}`}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {page.description}
                  </p>
                  <span className="text-primary-600 font-medium text-sm">
                    Read Comparison →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Compare Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why <span className="gradient-text">Compare</span> Options?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-2">
                  Save Time
                </h3>
                <p className="text-gray-600">
                  Automated conversion saves 8.5+ hours per month compared to manual data entry. 
                  Process invoices in seconds instead of minutes.
                </p>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Reduce Errors</h3>
                <p className="text-gray-600">
                  Eliminate human transcription errors and ensure consistent data formatting 
                  across all your invoices automatically.
                </p>
              </div>

              <div className="card">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">
                  Better Value
                </h3>
                <p className="text-gray-600">
                  Compare pricing models, features, and value. BillToSheet offers 
                  affordable pay-as-you-go pricing with no subscriptions.
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
              Ready to Try <span className="gradient-text">BillToSheet</span>?
            </h2>
            <p className="text-gray-600 mb-8">
              Convert your first invoice for free. No account required.
            </p>
            <Link href="/" className="btn-primary text-lg px-8 py-4">
              Convert Your First Invoice
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

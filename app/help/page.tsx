import { Metadata } from "next";
import Link from "next/link";
import FAQSection from "@/components/FAQSection";
import helpData from "@/data/help_pages.json";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "Help Center | BillToSheet Support & Documentation",
  description:
    "Get help with BillToSheet invoice converter. Find answers to common questions, tutorials, and guides for converting invoices to CSV and Excel.",
  alternates: {
    canonical: "/help",
  },
};

export default function HelpHub() {
  const faqs = [
    {
      question: "How do I convert my first invoice?",
      answer:
        "Simply visit the homepage, click the upload area or drag and drop your PDF invoice. The conversion happens automatically and you'll be able to download CSV and Excel files within seconds.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No, you can convert one invoice for free without creating an account. For additional conversions and to save your conversion history, create a free account.",
    },
    {
      question: "What invoice formats are supported?",
      answer:
        "BillToSheet supports standard PDF invoices from major platforms including Amazon, Stripe, PayPal, QuickBooks, Xero, FreshBooks, and most other business software.",
    },
    {
      question: "How does the credits system work?",
      answer:
        "Each invoice conversion uses 1 credit. You get 1 free conversion without an account. After signing in, purchase credit packs: 25 credits for £9, 100 for £19, or 500 for £49. Credits never expire.",
    },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Help", url: `${baseUrl}/help` },
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
                Help <span className="gradient-text">Center</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Find answers to common questions, tutorials, and guides for converting invoices to CSV and Excel formats.
              </p>
            </div>
          </div>
        </section>

        {/* Help Pages Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Help <span className="gradient-text">Articles</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpData.map((page) => (
                <Link
                  key={page.slug}
                  href={`/help/${page.slug}`}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {page.description}
                  </p>
                  <span className="text-primary-600 font-medium text-sm">
                    Read Article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Use BillToSheet Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why <span className="gradient-text">BillToSheet</span>?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                <p className="text-gray-600">
                  Convert invoices in seconds with our automated system. No manual data entry required.
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p className="text-gray-600">
                  Download your converted invoices in CSV or Excel format, ready to import into your accounting software.
                </p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">Accurate Results</h3>
                <p className="text-gray-600">
                  Our intelligent parsing system extracts invoice data with high accuracy from any platform.
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
              Still Need <span className="gradient-text">Help</span>?
            </h2>
            <p className="text-gray-600 mb-8">
              Can't find what you're looking for? Contact our support team for assistance.
            </p>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

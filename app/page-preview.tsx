import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BillToSheet - Convert Invoice PDF to CSV & Excel Instantly",
  description:
    "Convert invoice PDFs to CSV and Excel format in seconds. Extract invoice data, line items, and tax information automatically. Try 1 free conversion.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const features = [
    {
      title: "Instant Conversion",
      description: "Upload your invoice PDF and get CSV + Excel files in seconds",
      icon: "⚡",
    },
    {
      title: "All Invoice Types",
      description: "Works with Amazon, Stripe, PayPal, QuickBooks, Xero, and more",
      icon: "📄",
    },
    {
      title: "Secure & Private",
      description: "Your data is processed securely and never shared",
      icon: "🔒",
    },
    {
      title: "Instant Access",
      description: "Access your converted files immediately after conversion",
      icon: "💾",
    },
  ];

  const popularConverters = [
    { name: "Amazon", href: "/invoice-to-csv/amazon" },
    { name: "Stripe", href: "/invoice-to-csv/stripe" },
    { name: "PayPal", href: "/invoice-to-csv/paypal" },
    { name: "QuickBooks", href: "/invoice-to-csv/quickbooks" },
    { name: "Xero", href: "/invoice-to-csv/xero" },
    { name: "Shopify", href: "/invoice-to-csv/shopify" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Convert Invoice PDFs to{" "}
              <span className="gradient-text">CSV & Excel</span> Instantly
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Extract invoice data, line items, and tax information automatically.
              Save hours of manual data entry with our intelligent converter.
            </p>
          </div>

          {/* Upload Tool Placeholder */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="border-2 border-dashed rounded-xl p-8 border-gray-300 bg-white">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <button className="btn-primary mb-2">
                  Choose Invoice PDF
                </button>

                <p className="text-sm text-gray-500 mt-2">
                  or drag and drop your PDF here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum file size: 10MB
                </p>

                <p className="text-sm text-primary-600 font-medium mt-4">
                  Add Clerk & Stripe keys to enable full functionality
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                1 Free Conversion
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="gradient-text">BillToSheet</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Converters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular <span className="gradient-text">Invoice Converters</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularConverters.map((converter) => (
              <Link
                key={converter.name}
                href={converter.href}
                className="card text-center hover:shadow-xl transition-shadow"
              >
                <p className="font-semibold text-primary-600">
                  {converter.name}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/invoice-to-csv" className="btn-secondary">
              View All Converters
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Save Hours of Manual Work?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start converting your invoices today. No credit card required.
          </p>
          <Link href="/pricing" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            View Pricing Plans
          </Link>
        </div>
      </section>
    </>
  );
}

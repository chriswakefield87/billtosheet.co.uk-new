import Link from "next/link";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generateOrganizationSchema } from "@/lib/seo-utils";

const UploadTool = dynamic(() => import("@/components/UploadTool"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "BillToSheet - Convert Invoice PDF to CSV & Excel Instantly",
  description:
    "Convert invoice PDFs to CSV and Excel format in seconds. Extract invoice data, line items, and tax information automatically. Try 1 free conversion.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BillToSheet - Convert Invoice PDF to CSV & Excel",
      },
    ],
  },
  twitter: {
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  const organizationSchema = generateOrganizationSchema();
  const features = [
    {
      title: "Bulk Conversion",
      description: "Convert multiple invoices at once with our powerful bulk upload feature",
      icon: "📦",
    },
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
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Convert Invoice PDFs to{" "}
              <span suppressHydrationWarning className="gradient-text">CSV & Excel</span> Instantly
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Extract invoice data, line items, and tax information automatically.
              Convert single invoices or process hundreds at once with bulk conversion.
              Save hours of manual data entry with our intelligent converter.
            </p>
          </div>

          {/* Upload Tool */}
          <UploadTool />

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

      {/* Bulk Convert Feature */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Convert <span className="gradient-text">Multiple Invoices</span> at Once
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our powerful bulk conversion feature lets you upload and process dozens of invoices simultaneously. 
                Perfect for monthly reconciliation, batch processing, or handling large volumes of invoices.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Process multiple PDFs concurrently for maximum speed</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Live progress tracking with real-time status updates</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Download all files individually or view in your dashboard</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Only pay for successful conversions - failed files don't use credits</span>
                </li>
              </ul>
              <Link href="/sign-up" className="btn-primary">
                Start Bulk Converting →
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-primary-200">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-4">Bulk Conversion</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Upload Multiple PDFs</span>
                    <span className="text-primary-600 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Concurrent Processing</span>
                    <span className="text-primary-600 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Live Status Updates</span>
                    <span className="text-primary-600 font-bold">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Individual Downloads</span>
                    <span className="text-primary-600 font-bold">✓</span>
                  </div>
                </div>
              </div>
            </div>
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

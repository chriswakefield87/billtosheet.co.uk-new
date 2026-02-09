import { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/seo-utils";

export const metadata: Metadata = {
  title: "About the Team | BillToSheet",
  description: "Learn about the team behind BillToSheet. We're dedicated to making invoice data extraction simple, accurate, and affordable for businesses.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "About the Team", url: `${baseUrl}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About the <span className="gradient-text">BillToSheet Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're a small team of developers and accountants who built BillToSheet to solve a real problem: getting invoice data out of PDFs and into spreadsheets shouldn't be painful.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                BillToSheet started when we were manually typing invoice data into spreadsheets for bookkeeping. After the hundredth invoice, we thought: <em>there has to be a better way</em>.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                We tried existing solutions — some were too expensive, others required complex setup, and many just didn't work well with the variety of invoice formats we encountered from different vendors.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                So we built our own. BillToSheet was designed from the ground up to handle invoices from any source — Amazon, Stripe, your accounting software, or that small supplier who uses a custom template.
              </p>

              <h2 className="text-3xl font-bold mb-6 mt-12">What We Believe</h2>

              <ul className="space-y-4 text-gray-700">
                <li><strong>Simple pricing</strong> — Pay-as-you-go credits with no subscriptions. You shouldn't pay monthly for something you use occasionally.</li>
                <li><strong>Instant results</strong> — Upload a PDF, get CSV and Excel files in seconds. No waiting, no queues, no complexity.</li>
                <li><strong>Privacy first</strong> — Your invoice data is yours. We process it, you download it, we delete it. No training AI models on your data, no selling information.</li>
                <li><strong>Universal compatibility</strong> — Our CSV files work with QuickBooks, Xero, Sage, Excel, Google Sheets, and basically anything that reads spreadsheets.</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12">Our Expertise</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Our team combines experience in:
              </p>

              <ul className="space-y-3 text-gray-700">
                <li><strong>Software Development</strong> — Building reliable, fast web applications that handle real-world data extraction challenges.</li>
                <li><strong>Accounting & Bookkeeping</strong> — Understanding what accountants actually need from invoice data, not just what's technically possible to extract.</li>
                <li><strong>Document Processing</strong> — Years of work with OCR, PDF parsing, and machine learning for structured data extraction.</li>
                <li><strong>Small Business Operations</strong> — We've been on the receiving end of vendor invoices. We know the pain points.</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12">Continuous Improvement</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                We're constantly improving BillToSheet based on user feedback and new invoice formats we encounter. When a conversion doesn't work perfectly, we learn from it and improve the system.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Recent improvements include:
              </p>

              <ul className="space-y-3 text-gray-700 mb-6">
                <li>Bulk conversion with concurrent processing for massive speed improvements</li>
                <li>Better handling of multi-currency invoices</li>
                <li>Improved extraction of complex table layouts</li>
                <li>30-day file retention for easy re-downloads</li>
                <li>Support for more international date formats</li>
              </ul>

              <h2 className="text-3xl font-bold mb-6 mt-12">Get in Touch</h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Have questions about invoice conversion? Run into a format we don't handle well? We'd love to hear from you.
              </p>

              <p className="text-gray-700 leading-relaxed">
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium underline">
                  Contact us
                </Link> or try our <Link href="/invoice-to-csv" className="text-primary-600 hover:text-primary-700 font-medium underline">invoice converter</Link> — your first conversion is free.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Link
              href="/invoice-to-csv"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2">Try the Converter</h3>
              <p className="text-gray-600 text-sm mb-3">Convert your first invoice free</p>
              <span className="text-primary-600 font-medium">Get Started →</span>
            </Link>
            <Link
              href="/blog"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2">Read Our Blog</h3>
              <p className="text-gray-600 text-sm mb-3">Tips, guides, and best practices</p>
              <span className="text-primary-600 font-medium">View Blog →</span>
            </Link>
            <Link
              href="/contact"
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-center"
            >
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm mb-3">Questions or feedback?</p>
              <span className="text-primary-600 font-medium">Get in Touch →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

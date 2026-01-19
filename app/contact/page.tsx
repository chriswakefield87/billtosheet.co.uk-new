import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with BillToSheet. We're here to help with your invoice conversion needs.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help with your invoice conversion needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              For general inquiries and support
            </p>
            <a
              href="mailto:support@billtosheet.com"
              className="text-primary-600 font-medium hover:underline"
            >
              support@billtosheet.com
            </a>
          </div>

          <div className="card">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Help Center</h3>
            <p className="text-gray-600 mb-4">
              Find answers to common questions
            </p>
            <a
              href="/help/getting-started"
              className="text-primary-600 font-medium hover:underline"
            >
              Visit Help Center →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            We typically respond within 24 hours during business days.
          </p>
        </div>

        <div className="mt-12 card bg-primary-50 border-primary-200">
          <h3 className="text-xl font-semibold mb-4">
            Quick Links
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/pricing"
              className="text-primary-600 font-medium hover:underline"
            >
              View Pricing
            </a>
            <a
              href="/help/getting-started"
              className="text-primary-600 font-medium hover:underline"
            >
              Getting Started
            </a>
            <a
              href="/privacy"
              className="text-primary-600 font-medium hover:underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

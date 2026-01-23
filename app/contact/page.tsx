import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

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

        <ContactForm />

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

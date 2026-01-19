import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BillToSheet privacy policy. Learn how we protect your data and invoice information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">
            <span className="gradient-text">Privacy Policy</span>
          </h1>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                BillToSheet ("we", "our", or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your information when you use our invoice conversion
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Account Information:</strong> Email address, name, and
                  authentication data provided through Clerk
                </li>
                <li>
                  <strong>Invoice Data:</strong> Content of uploaded PDF invoices
                  for processing
                </li>
                <li>
                  <strong>Payment Information:</strong> Payment details processed
                  securely through Stripe
                </li>
                <li>
                  <strong>Usage Data:</strong> Conversion history, credit balance,
                  and service usage patterns
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, and cookies
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Process and convert your invoice PDFs</li>
                <li>Manage your account and credits</li>
                <li>Process payments through Stripe</li>
                <li>Provide customer support</li>
                <li>Improve our service and user experience</li>
                <li>Send important service notifications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We take data security seriously:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Original PDFs:</strong> Not stored after processing
                  completes
                </li>
                <li>
                  <strong>Converted Files:</strong> Stored securely for 30 days
                  (paid users) then automatically deleted
                </li>
                <li>
                  <strong>Anonymous Users:</strong> Conversion results available
                  during session only
                </li>
                <li>
                  <strong>Authentication:</strong> Managed securely through Clerk
                </li>
                <li>
                  <strong>Payments:</strong> Processed securely through Stripe (we
                  never store card details)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your data for the following periods:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Conversion files: 30 days for paid users, session-only for anonymous users</li>
                <li>Account data: Until account deletion requested</li>
                <li>Transaction records: 7 years for legal compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
                <li>Object to processing of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies for authentication and session management.
                We also use analytics cookies to improve our service. You can
                control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Clerk:</strong> Authentication and user management
                </li>
                <li>
                  <strong>Stripe:</strong> Payment processing
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                These services have their own privacy policies and handle data
                according to their terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify
                you of any significant changes by email or through our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy or want to exercise
                your rights, please contact us through our{" "}
                <a href="/contact" className="text-primary-600 hover:underline">
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "BillToSheet terms of service. Read our terms and conditions for using our invoice conversion service.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8">
            <span className="gradient-text">Terms of Service</span>
          </h1>

          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using BillToSheet ("Service"), you accept and
                agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                BillToSheet provides an online invoice conversion service that
                converts PDF invoices to CSV and Excel formats. The Service
                extracts data from uploaded invoices and generates downloadable
                files.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To access certain features, you may need to create an account:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>You must provide accurate and complete information</li>
                <li>
                  You are responsible for maintaining account confidentiality
                </li>
                <li>You are responsible for all activities under your account</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Credits and Payments</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our Service operates on a credit-based system:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>1 credit = 1 invoice conversion</li>
                <li>Anonymous users receive 1 free conversion</li>
                <li>Credit packs can be purchased through Stripe</li>
                <li>Purchased credits never expire</li>
                <li>All prices are in GBP and include applicable taxes</li>
                <li>Payments are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">File Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain converted files according to our retention policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>Original PDFs are not stored after processing</li>
                <li>Converted files are stored for 30 days for paid users</li>
                <li>Anonymous conversions are available during session only</li>
                <li>Files are automatically deleted after the retention period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Upload malicious files or malware</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service for illegal activities</li>
                <li>Abuse, harass, or harm others</li>
                <li>Reverse engineer or copy our Service</li>
                <li>Use automated systems to access the Service excessively</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Intellectual Property
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The Service and its original content, features, and functionality
                are owned by BillToSheet and are protected by international
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Disclaimer of Warranties
              </h2>
              <p className="text-gray-600 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND. We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li>The Service will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The Service is free of viruses or harmful components</li>
                <li>Results of using the Service will be accurate or reliable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, BillToSheet shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Accuracy</h2>
              <p className="text-gray-600 leading-relaxed">
                While we strive for accurate data extraction, we cannot guarantee
                100% accuracy. Users are responsible for verifying the accuracy of
                converted data before using it for business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to terminate or suspend your account and
                access to the Service immediately, without prior notice, for
                conduct that we believe violates these Terms or is harmful to
                other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                notify users of material changes via email or through the Service.
                Continued use of the Service after changes constitutes acceptance
                of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with
                the laws of the United Kingdom, without regard to its conflict of
                law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us
                through our{" "}
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

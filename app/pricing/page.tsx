import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { CREDIT_PACKS } from "@/lib/stripe";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing - Credit Packs",
  description:
    "Choose the right credit pack for your invoice conversion needs. Pay only for what you use with no monthly subscriptions.",
  alternates: {
    canonical: "/pricing",
  },
};

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">Pay-As-You-Go</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No subscriptions, no hidden fees. Purchase credits and use them
            whenever you need. Credits never expire.
          </p>
        </div>

        {/* Free Tier */}
        <div className="max-w-md mx-auto mb-12">
          <div className="card border-2 border-primary-600 text-center">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              Free Trial
            </div>
            <h3 className="text-2xl font-bold mb-2">Try Before You Buy</h3>
            <p className="text-gray-600 mb-6">
              Convert your first invoice for free, no account required.
            </p>
            <div className="text-4xl font-bold gradient-text mb-6">
              1 Free Conversion
            </div>
            <Link href="/" className="btn-primary w-full">
              Convert Now
            </Link>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`card ${
                pack.popular
                  ? "border-2 border-primary-600 relative"
                  : "border border-gray-200"
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-600 to-emerald-600 text-white text-sm font-semibold px-4 py-1 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{pack.priceDisplay}</span>
                </div>
                <div className="text-xl font-semibold text-primary-600 mb-6">
                  {pack.credits} Credits
                </div>
                <p className="text-gray-600 mb-2">
                  {(pack.price / pack.credits / 100).toFixed(2)} per conversion
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm">
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
                  CSV + Excel output
                </li>
                <li className="flex items-center text-sm">
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
                  30-day file storage
                </li>
                <li className="flex items-center text-sm">
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
                  Re-download anytime
                </li>
                <li className="flex items-center text-sm">
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
                  Credits never expire
                </li>
              </ul>

              <CheckoutButton
                packId={pack.id}
                packName={pack.name}
                credits={pack.credits}
                price={pack.price}
                popular={pack.popular}
                userId={userId}
              />
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Pricing <span className="gradient-text">FAQs</span>
          </h2>

          <div className="space-y-6">
            <details className="card cursor-pointer group">
              <summary className="font-semibold flex justify-between items-center">
                Do credits expire?
                <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600">
                No! Your purchased credits never expire. Use them whenever you
                need to convert invoices, whether that's tomorrow or next year.
              </p>
            </details>

            <details className="card cursor-pointer group">
              <summary className="font-semibold flex justify-between items-center">
                Can I get a refund?
                <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600">
                If you're not satisfied with a conversion, contact us within 7
                days for a credit refund. We'll review and refund credits if
                appropriate.
              </p>
            </details>

            <details className="card cursor-pointer group">
              <summary className="font-semibold flex justify-between items-center">
                What payment methods do you accept?
                <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600">
                We accept all major credit and debit cards through Stripe,
                including Visa, Mastercard, American Express, and more.
              </p>
            </details>

            <details className="card cursor-pointer group">
              <summary className="font-semibold flex justify-between items-center">
                Do you offer volume discounts?
                <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600">
                Larger credit packs already include better per-conversion rates.
                For enterprise needs (500+ conversions/month), contact us for
                custom pricing.
              </p>
            </details>

            <details className="card cursor-pointer group">
              <summary className="font-semibold flex justify-between items-center">
                Is there a monthly subscription?
                <span className="ml-4 text-primary-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600">
                No! We use a simple credit system with no recurring charges. Buy
                credits when you need them, use them at your own pace.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your invoice conversions and manage your account",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  // Ensure user exists in database
  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
    },
  });

  // Get conversions
  const conversions = await prisma.conversion.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{clerkUser.firstName || "there"}</span>
          </h1>
          <p className="text-gray-600">Manage your invoice conversions and credits</p>
        </div>

        {/* Credits Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-600 to-emerald-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Credits Balance</h3>
            <p className="text-4xl font-bold">{user.creditsBalance}</p>
            <p className="text-sm mt-2 opacity-90">
              1 credit = 1 conversion
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Total Conversions</h3>
            <p className="text-4xl font-bold text-primary-600">
              {conversions.length}
            </p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>

          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold mb-2">Need More Credits?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Purchase credit packs starting at £9
            </p>
            <Link href="/pricing" className="btn-primary text-sm py-2">
              Buy Credits
            </Link>
          </div>
        </div>

        {/* Data Storage Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Data Storage
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                We store your invoice data securely in our database. Files are generated
                on-demand when you download them. Your data remains accessible as long as
                your account is active.
              </p>
            </div>
          </div>
        </div>

        {/* Conversions List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Your Conversions</h2>
          </div>

          {conversions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">
                You haven't converted any invoices yet.
              </p>
              <Link href="/" className="btn-primary">
                Convert Your First Invoice
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conversions.map((conversion) => (
                    <tr key={conversion.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(conversion.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conversion.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conversion.invoiceNumber || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conversion.currency} {conversion.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/convert/${conversion.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

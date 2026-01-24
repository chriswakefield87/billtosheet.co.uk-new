import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Metadata } from "next";
import SignupTracker from "@/components/SignupTracker";
import DataStorageNotice from "@/components/DataStorageNotice";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your invoice conversions and manage your account",
};

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  // Ensure user exists in database and give new users 1 free credit
  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      creditsBalance: 1, // Give new users 1 free credit
    },
  });

  // Check if this is a new signup (user created within last 30 seconds and has no conversions)
  const isNewSignup = (Date.now() - new Date(user.createdAt).getTime()) < 30000;
  const conversions = await prisma.conversion.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const isActuallyNew = isNewSignup && conversions.length === 0;

  return (
    <>
      <SignupTracker isNewSignup={isActuallyNew} />
      <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{clerkUser.firstName || "there"}</span>
            </h1>
            <p className="text-gray-600">Manage your invoice conversions and credits</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/invoice-to-csv" 
              className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Convert
            </Link>
            <Link 
              href="/dashboard/bulk-convert" 
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Bulk Convert
            </Link>
          </div>
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
        <DataStorageNotice />

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
    </>
  );
}

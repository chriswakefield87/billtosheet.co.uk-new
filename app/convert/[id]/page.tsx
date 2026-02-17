"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { trackError } from "@/lib/analytics-errors";

interface ConversionResult {
  vendor: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  subtotal: number;
  taxTotal: number;
  shipping: number;
  total: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

export default function ConversionResultPage({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<ConversionResult | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'lineItems'>('details');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch conversion data
    fetch(`/api/conversion/${params.id}`)
      .then(res => {
        if (res.status === 403) {
          setIsAuthorized(false);
          return null;
        }
        if (res.status === 404) {
          notFound();
          return null;
        }
        return res.json();
      })
      .then(result => {
        if (result) {
          setData(result.data);
          setIsLoggedIn(result.isLoggedIn);
          setIsAuthorized(true);
          
          // Track conversion viewed
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion_viewed');
          }
        }
      })
      .catch(err => {
        console.error('Failed to load conversion:', err);
        trackError({
          error_message: err instanceof Error ? err.message : "Failed to load conversion",
          error_type: "api",
          source: "ConversionResultPage",
        });
        setIsAuthorized(false);
      });
  }, [params.id]);

  // Format date - ensure DD-MM-YYYY format
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // If already in DD-MM-YYYY format (day is <= 31), return as is
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const firstPart = parseInt(parts[0]);
      // If first part is a day (<=31), it's already DD-MM-YYYY
      if (firstPart <= 31) {
        return dateStr;
      }
      // If first part is a year (>31), convert from YYYY-MM-DD to DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  if (!mounted || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    notFound();
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-gray-500">Loading conversion data...</p>
      </div>
    );
  }

  const formattedDate = formatDate(data.invoiceDate);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">
              Conversion <span className="gradient-text">Complete</span>
            </h1>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <p className="font-semibold">{data.vendor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Invoice Number</p>
              <p className="font-semibold">{data.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-semibold text-primary-600">
                {data.currency} {data.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Download Files</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href={`/api/download/${params.id}/invoice-details`}
              className="btn-primary text-center"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'download_csv');
                }
              }}
            >
              📄 Invoice Details (CSV)
            </a>
            <a
              href={`/api/download/${params.id}/line-items`}
              className="btn-primary text-center"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'download_csv');
                }
              }}
            >
              📋 Line Items (CSV)
            </a>
            <a
              href={`/api/download/${params.id}/excel`}
              className="btn-primary text-center"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'download_excel');
                }
              }}
            >
              📊 Combined (Excel)
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Files are generated on-demand from your stored conversion data
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'details'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Invoice Details
              </button>
              <button
                onClick={() => setActiveTab('lineItems')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'lineItems'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Line Items ({data.lineItems.length})
              </button>
            </nav>
          </div>

          {/* Invoice Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Invoice Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Vendor</dt>
                      <dd className="font-medium">{data.vendor}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Invoice Number</dt>
                      <dd className="font-medium">{data.invoiceNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Date</dt>
                      <dd className="font-medium">{formattedDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Currency</dt>
                      <dd className="font-medium">{data.currency}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Totals</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="font-medium">
                        {data.currency} {data.subtotal.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="font-medium">
                        {data.currency} {data.taxTotal.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd className="font-medium">
                        {data.shipping > 0 ? `${data.currency} ${data.shipping.toFixed(2)}` : '-'}
                      </dd>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <dt className="font-semibold">Total</dt>
                      <dd className="font-bold text-primary-600">
                        {data.currency} {data.total.toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Tab */}
          {activeTab === 'lineItems' && (
            <div className="p-6">
              <h3 className="font-semibold mb-4">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.lineItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {data.currency} {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {data.currency} {item.lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {!isLoggedIn && (
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">
              Want to save your conversions?
            </h3>
            <p className="text-gray-600 mb-4">
              Sign up for free to keep your conversion history for 30 days and
              get more credits.
            </p>
            <Link href="/sign-up" className="btn-primary">
              Create Free Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

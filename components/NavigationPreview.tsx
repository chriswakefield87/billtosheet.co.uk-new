"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationPreview() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/invoice-to-csv", label: "Converters" },
    { href: "/help/getting-started", label: "Help" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">BillToSheet</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary-600"
                      : "text-gray-600 hover:text-primary-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 italic">
              Preview Mode
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Always do a full page reload when navigating to dashboard to ensure fresh data
    e.preventDefault();
    if (pathname === '/dashboard') {
      // If already on dashboard, do a full reload
      window.location.reload();
    } else {
      // Navigate to dashboard with full page load
      window.location.href = '/dashboard';
    }
  };
  
  // Check if Clerk is available (preview mode)
  const hasClerk = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 20;

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
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="BillToSheet"
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
                quality={100}
              />
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
          {!mounted ? (
            <div className="w-32 h-9" />
          ) : (
            <>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600"
                >
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={handleDashboardClick}
                  className="text-sm font-medium text-gray-600 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
}

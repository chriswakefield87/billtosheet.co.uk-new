import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "BillToSheet - Convert Invoice PDF to CSV & Excel Instantly",
    template: "%s | BillToSheet"
  },
  description: "Convert invoice PDFs to CSV and Excel format instantly. Extract invoice data, line items, and tax information automatically. Free trial available.",
  keywords: ["invoice converter", "PDF to CSV", "PDF to Excel", "invoice parser", "invoice data extraction"],
  authors: [{ name: "BillToSheet" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "BillToSheet",
    title: "BillToSheet - Convert Invoice PDF to CSV & Excel Instantly",
    description: "Convert invoice PDFs to CSV and Excel format instantly. Extract invoice data automatically.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BillToSheet - Convert Invoice PDF to CSV & Excel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillToSheet - Convert Invoice PDF to CSV & Excel",
    description: "Convert invoice PDFs to CSV and Excel format instantly.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we have real Clerk keys (for local preview without keys)
  const hasRealClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') || 
     process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_live_')) && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 20;

  if (!hasRealClerkKeys) {
    // Local preview mode without Clerk
    return (
      <html lang="en">
        <body className={inter.className}>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

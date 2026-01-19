import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationPreview from "@/components/NavigationPreview";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BillToSheet - Convert Invoice PDF to CSV & Excel Instantly",
    template: "%s | BillToSheet"
  },
  description: "Convert invoice PDFs to CSV and Excel format instantly. Extract invoice data, line items, and tax information automatically. Free trial available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationPreview />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

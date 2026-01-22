import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: "Pricing", href: "/pricing" },
      { label: "Invoice to CSV", href: "/invoice-to-csv" },
      { label: "Extract Data", href: "/extract" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    Converters: [
      { label: "Amazon Invoices", href: "/invoice-to-csv/amazon" },
      { label: "Stripe Invoices", href: "/invoice-to-csv/stripe" },
      { label: "QuickBooks Invoices", href: "/invoice-to-csv/quickbooks" },
      { label: "View All", href: "/invoice-to-csv" },
    ],
    Resources: [
      { label: "Help Center", href: "/help/getting-started" },
      { label: "Comparisons", href: "/compare" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/logo.png"
                alt="BillToSheet"
                width={150}
                height={40}
                className="h-10 w-auto"
                quality={100}
              />
            </div>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BillToSheet. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

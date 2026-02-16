import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "Receipt vs Invoice: What's the Difference and When to Convert Each | BillToSheet Blog",
  description: "Receipts and invoices look similar but serve different purposes for accounting and tax. Learn when to use each, what data to extract, and how to convert both for your records.",
  alternates: {
    canonical: "/blog/receipt-vs-invoice-difference",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "receipt-vs-invoice-difference");

  if (!post) {
    return null;
  }

  return (
    <BlogPostLayout post={post}>
      <p>Receipts and invoices both document transactions, but they're not interchangeable. Understanding the difference matters for your accounting, tax records, and when you need to convert documents to spreadsheets. Here's what you need to know.</p>
      
      <h3 className="text-2xl font-bold mb-6">What's the difference?</h3>
      
      <p><strong>An invoice</strong> is a request for payment. It's sent <em>before</em> payment is made – it lists what's owed, when it's due, and payment terms. Think of it as a bill from a supplier or vendor. Invoices typically include line items, quantities, unit prices, tax breakdowns, and payment instructions.</p>
      
      <p><strong>A receipt</strong> is proof of payment. It's issued <em>after</em> payment is received – it confirms that money has changed hands. Receipts are usually simpler: date, amount paid, what was purchased, and sometimes a transaction or reference number. Coffee shop receipts, fuel receipts, and Stripe payment confirmations are all receipts.</p>
      
      <h3 className="text-2xl font-bold mb-6">When to use each</h3>
      
      <p><strong>Use invoices</strong> when you need to:</p>
      
      <ul>
        <li><strong>Track what you owe</strong> – Invoices go into accounts payable. You record them when received and clear them when paid.</li>
        <li><strong>Claim input VAT</strong> – For VAT-registered businesses, invoices from suppliers are usually required to reclaim input tax.</li>
        <li><strong>Audit supplier relationships</strong> – Invoices document agreed terms, pricing, and delivery expectations.</li>
      </ul>
      
      <p><strong>Use receipts</strong> when you need to:</p>
      
      <ul>
        <li><strong>Prove an expense</strong> – For tax deductions and expense claims, receipts show you actually paid.</li>
        <li><strong>Reconcile bank statements</strong> – Match receipts to bank transactions for accurate bookkeeping.</li>
        <li><strong>Record small or one-off purchases</strong> – Many businesses don't receive formal invoices for minor expenses – receipts are what you have.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">What data to extract from each</h3>
      
      <p>Whether it's an invoice or a receipt, the key fields for accounting are similar. You typically need:</p>
      
      <ul>
        <li><strong>Vendor or payee name</strong></li>
        <li><strong>Date</strong></li>
        <li><strong>Amount (total and, for invoices, line items)</strong></li>
        <li><strong>Tax amount</strong> (if applicable)</li>
        <li><strong>Reference or transaction number</strong></li>
        <li><strong>Description of goods or services</strong></li>
      </ul>
      
      <p>Invoices usually have more structure – line items with quantities and unit prices – which makes them ideal for detailed expense tracking. Receipts often have less detail, but the essentials (vendor, date, amount) are still there. Our <a title="Invoice to CSV converter" href="/invoice-to-csv">invoice and receipt converter</a> extracts the relevant data from both document types.</p>
      
      <h3 className="text-2xl font-bold mb-6">How to convert both for your records</h3>
      
      <p>The good news: <strong>you can convert both invoices and receipts</strong> to CSV or Excel using the same process. Upload your PDF, and our tool extracts the data into structured spreadsheets. For a step-by-step walkthrough, see our <a title="How to convert invoices to CSV" href="/blog/how-to-convert-invoices-to-csv">guide on converting invoices to CSV</a> – the workflow is identical for receipts.</p>
      
      <p>Once converted, you'll get:</p>
      
      <ul>
        <li><strong>Invoice/receipt details CSV</strong> – Vendor, date, reference, totals, tax</li>
        <li><strong>Line items CSV</strong> – For invoices with itemised breakdowns (receipts may have a single line)</li>
        <li><strong>Excel format</strong> – If you prefer <a title="CSV vs Excel for invoices" href="/blog/csv-vs-excel-for-invoices">Excel over CSV</a> for analysis and reporting</li>
      </ul>
      
      <p>From there, import into your accounting software. Our <a title="Import invoice CSV into accounting software" href="/blog/import-invoice-csv-accounting-software">guide on importing CSV into QuickBooks, Xero, and Sage</a> covers the exact steps.</p>
      
      <h3 className="text-2xl font-bold mb-6">The bottom line</h3>
      
      <p>Invoices = request for payment. Receipts = proof of payment. Both matter for accounting and tax, and both can be converted to CSV or Excel for your records. Use our <a title="PDF to CSV converter" href="/invoice-to-csv">PDF to CSV converter</a> to extract data from invoices and receipts alike – your first conversion is free.</p>
      
      <p>Got a mix of both? Use our <a title="Bulk conversion" href="/dashboard/bulk-convert">bulk conversion feature</a> to process them all at once and keep your records organised.</p>
    </BlogPostLayout>
  );
}

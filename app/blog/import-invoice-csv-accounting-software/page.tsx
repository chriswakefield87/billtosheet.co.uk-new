import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "How to Import Invoice CSV into QuickBooks, Xero & Sage | BillToSheet Blog",
  description: "Step-by-step guide to importing your converted invoice CSV files into popular accounting software. Learn the exact process for QuickBooks, Xero, and Sage.",
  alternates: {
    canonical: "/blog/import-invoice-csv-accounting-software",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "import-invoice-csv-accounting-software");

  if (!post) {
    return null;
  }

  return (
    <BlogPostLayout post={post}>
      <p>You've converted your invoices to CSV – <strong>now what?</strong> The real value comes when you import that data into your accounting software. This guide walks you through the exact steps for QuickBooks, Xero, and Sage.</p>
      <p><img src="/import-invoice-csv-quickbooks-xero-sage.jpg" alt="How to import invoice CSV into QuickBooks, Xero and Sage" /></p>
      
      <h3 className="text-2xl font-bold mb-6">Before you start</h3>
      
      <p>A few things to check before importing:</p>
      
      <ul>
        <li><strong>Choose the right CSV file</strong> – BillToSheet gives you two CSV files: <em>invoice_details.csv</em> (header information) and <em>line_items.csv</em> (individual items). Most imports use the invoice details file, but check what your software expects.</li>
        <li><strong>Check date formats</strong> – Our CSV uses ISO format (YYYY-MM-DD) which most software accepts. If you have issues, check your software's regional settings.</li>
        <li><strong>Back up first</strong> – Before any bulk import, make sure you have a recent backup of your accounting data. Better safe than sorry.</li>
      </ul>
      
      <p>If you haven't converted your invoices yet, use our <a title="PDF to CSV converter" href="https://billtosheet.com/invoice-to-csv">PDF to CSV converter</a> to get started. It's free for your first invoice.</p>
      
      <h3 className="text-2xl font-bold mb-6">Importing into QuickBooks</h3>
      
      <p><a title="QuickBooks invoice converter" href="https://billtosheet.com/invoice-to-csv/quickbooks">QuickBooks</a> has slightly different import processes depending on whether you're using QuickBooks Online or QuickBooks Desktop. For more details, see <a href="https://quickbooks.intuit.com/learn-support/en-uk/help-article/import-transactions/manually-import-transactions-quickbooks-self/L1KiFIsJD_GB_en_GB" target="_blank" rel="noopener">Intuit's official guide to manually importing CSV transactions</a>.</p>
      
      <h4 className="text-xl font-semibold mb-4">QuickBooks Online</h4>
      
      <ol>
        <li>Go to <strong>Banking</strong> in the left menu</li>
        <li>Click <strong>Upload transactions</strong></li>
        <li>Select the bank account you want to import to (or create a clearing account for invoice imports)</li>
        <li>Choose your CSV file and click <strong>Continue</strong></li>
        <li>Map the columns: Date → Date, Amount → Amount, Vendor name → Description</li>
        <li>Review the transactions and click <strong>Accept</strong></li>
      </ol>
      
      <h4 className="text-xl font-semibold mb-4">QuickBooks Desktop</h4>
      
      <ol>
        <li>Go to <strong>File → Utilities → Import → Excel Files</strong></li>
        <li>Select your CSV file (QuickBooks will open it as Excel format)</li>
        <li>Use the import wizard to map fields to QuickBooks fields</li>
        <li>Match invoice number, date, vendor, and amount fields</li>
        <li>Review and complete the import</li>
      </ol>
      
      <p><strong>QuickBooks tip:</strong> Use the invoice number field to prevent duplicate imports. QuickBooks will warn you if it detects a matching invoice number.</p>
      
      <h3 className="text-2xl font-bold mb-6">Importing into Xero</h3>
      
      <p><a title="Xero invoice converter" href="https://billtosheet.com/invoice-to-csv/xero">Xero</a> makes CSV imports straightforward through the bank account import feature. For comprehensive instructions, check <a href="https://central.xero.com/s/article/Import-a-bank-statement" target="_blank" rel="noopener">Xero's help center on importing bank statements</a>.</p>
      
      <ol>
        <li>Go to <strong>Accounting → Bank accounts</strong></li>
        <li>Select the account you want to import to</li>
        <li>Click <strong>Import Statement</strong> in the top right</li>
        <li>Choose your CSV file</li>
        <li>Map the columns to Xero fields (Date, Amount, Reference, Description)</li>
        <li>Review the transactions and click <strong>Import</strong></li>
      </ol>
      
      <p><strong>Xero tip:</strong> Xero prefers dates in YYYY-MM-DD format, which is exactly what BillToSheet outputs. You can also set up <strong>bank rules</strong> to automatically categorise future imports from the same vendors.</p>
      
      <p>For multi-currency invoices, make sure you're importing to a bank account with the matching currency, or Xero will convert amounts using the current exchange rate.</p>
      
      <h3 className="text-2xl font-bold mb-6">Importing into Sage</h3>
      
      <p><a title="Sage invoice converter" href="https://billtosheet.com/invoice-to-csv/sage">Sage</a> has different import processes depending on your version. Refer to <a href="https://help.sagesoftware.co.uk/sage50c/27.1/en-gb/Content/Basics/Import_Data.htm" target="_blank" rel="noopener">Sage's official documentation on importing data</a> for version-specific guidance.</p>
      
      <h4 className="text-xl font-semibold mb-4">Sage 50</h4>
      
      <ol>
        <li>Go to <strong>File → Import</strong></li>
        <li>Select <strong>Transactions</strong> as the import type</li>
        <li>Choose CSV format and select your file</li>
        <li>Use the import wizard to map fields</li>
        <li>Make sure nominal codes match your chart of accounts</li>
        <li>Review and complete the import</li>
      </ol>
      
      <h4 className="text-xl font-semibold mb-4">Sage Business Cloud</h4>
      
      <ol>
        <li>Go to <strong>Settings → Import data</strong></li>
        <li>Choose the transaction type you're importing</li>
        <li>Upload your CSV file</li>
        <li>Map columns to Sage fields</li>
        <li>Review and import</li>
      </ol>
      
      <p><strong>Sage tip:</strong> Ensure your tax codes in the CSV match your Sage tax code setup. If they don't match exactly, Sage may apply the wrong VAT rates or reject the import.</p>
      
      <h3 className="text-2xl font-bold mb-6">Troubleshooting common errors</h3>
      
      <p>Sometimes imports don't go smoothly. Here are the most common issues and how to fix them:</p>
      
      <ul>
        <li><strong>"Date format not recognised"</strong> – Check your software's regional settings. You may need to adjust the date column format in Excel before importing.</li>
        <li><strong>"Duplicate transaction"</strong> – The invoice number already exists in your system. Either skip the duplicate or delete the existing entry first.</li>
        <li><strong>"Amount doesn't match"</strong> – Check for currency symbols or thousands separators in the amount column. Remove any non-numeric characters.</li>
        <li><strong>"Missing required field"</strong> – Some software requires specific fields like vendor name or description. Make sure these columns are populated in your CSV.</li>
        <li><strong>"Invalid tax code"</strong> – Your CSV tax codes don't match the codes set up in your accounting software. Update either the CSV or your software's tax code list.</li>
      </ul>
      
      <p>For more detailed troubleshooting, check our <a title="Importing into accounting software help" href="https://billtosheet.com/help/importing-into-accounting-software">help guide on importing into accounting software</a>.</p>
      
      <h3 className="text-2xl font-bold mb-6">Best practices for invoice imports</h3>
      
      <ul>
        <li><strong>Always review before confirming</strong> – Take 30 seconds to scan the import preview. It's much easier to catch errors now than fix them later.</li>
        <li><strong>Start with a small batch</strong> – If you're importing for the first time, try 5-10 invoices first to make sure the mapping is correct.</li>
        <li><strong>Keep original PDFs</strong> – Even after importing, keep your original invoice PDFs. You may need them for audits or disputes.</li>
        <li><strong>Use consistent vendor names</strong> – This helps with reporting and makes it easier to track spending by supplier.</li>
        <li><strong>Set up recurring imports</strong> – If you regularly receive invoices from the same vendors, consider setting up bank rules or templates to speed up future imports.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">What about other accounting software?</h3>
      
      <p>The general process is similar for most accounting software:</p>
      
      <ol>
        <li>Find the import or upload feature (usually under Settings, Banking, or Transactions)</li>
        <li>Select CSV format</li>
        <li>Map columns to your software's fields</li>
        <li>Review and confirm</li>
      </ol>
      
      <p>If you're using FreshBooks, Wave, Zoho Books, or another platform, check their help documentation for specific CSV import instructions. Our <a title="CSV column guide" href="https://billtosheet.com/help/csv-column-guide">CSV column guide</a> explains exactly what fields BillToSheet exports, which makes mapping easier.</p>
      
      <h3 className="text-2xl font-bold mb-6">Ready to import?</h3>
      
      <p>That's it – you now know how to get your invoice data from PDF to accounting software in just a few steps.</p>
      
      <p>If you haven't converted your invoices yet, start with our <a title="PDF to CSV converter" href="https://billtosheet.com/invoice-to-csv">PDF to CSV converter</a>. Your first conversion is free, no account needed.</p>
      
      <p>Got a stack of invoices to process? Use <a title="Bulk conversion" href="https://billtosheet.com/dashboard/bulk-convert">bulk conversion</a> to convert them all at once – they process simultaneously, so even 50 invoices takes just seconds.</p>
    </BlogPostLayout>
  );
}

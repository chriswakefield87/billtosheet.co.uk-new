import { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";
import blogPostsData from "@/data/blog_posts.json";

export const metadata: Metadata = {
  title: "Common Invoice Conversion Errors and How to Fix Them | BillToSheet Blog",
  description: "Troubleshoot PDF to CSV conversion issues with our comprehensive guide. Learn how to fix poor scan quality, missing data, formatting problems, and more.",
  alternates: {
    canonical: "/blog/invoice-conversion-errors-fixes",
  },
};

export default function BlogPostPage() {
  const post = blogPostsData.find((p) => p.slug === "invoice-conversion-errors-fixes");

  if (!post) {
    return null;
  }

  return (
    <BlogPostLayout post={post}>
      <p>Converting invoices from PDF to CSV should be straightforward, but <strong>sometimes things go wrong</strong>. Whether it's a poorly scanned document, unusual formatting, or missing data, conversion errors can be frustrating. This guide walks you through the most common issues and exactly how to fix them.</p>
      
      <p><img src="/invoice-conversion-errors-troubleshooting.jpg" alt="Common invoice conversion errors and how to fix them" /></p>
      
      <h3 className="text-2xl font-bold mb-6">Understanding conversion errors</h3>
      
      <p>Most invoice conversion errors fall into a few categories:</p>
      
      <ul>
        <li><strong>OCR issues</strong> – The text recognition can't read certain characters or numbers</li>
        <li><strong>Layout problems</strong> – Complex tables or unusual formats confuse the extraction logic</li>
        <li><strong>Data quality</strong> – Poor scans, low resolution, or image artifacts make text unreadable</li>
        <li><strong>Missing information</strong> – Key fields like totals or dates aren't detected</li>
        <li><strong>Format inconsistencies</strong> – Different date formats, currency symbols, or number separators</li>
      </ul>
      
      <p>The good news? Most of these are fixable. Let's go through them one by one.</p>
      
      <h3 className="text-2xl font-bold mb-6">Error 1: "Unable to extract text from PDF"</h3>
      
      <p>This usually happens when your PDF is an image-only scan without selectable text. <a href="https://en.wikipedia.org/wiki/Optical_character_recognition" target="_blank" rel="noopener">OCR (Optical Character Recognition)</a> needs to work harder on these files.</p>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Check your PDF quality</strong> – Open the file and try to select text with your mouse. If you can't select anything, it's an image-only PDF.</li>
        <li><strong>Improve scan quality</strong> – If you scanned the invoice yourself, try re-scanning at higher DPI (at least 300 DPI for best results).</li>
        <li><strong>Ensure good lighting</strong> – Dark or shadowy scans are harder to read. Make sure the original document is well-lit and flat when scanning.</li>
        <li><strong>Use the original digital PDF</strong> – If possible, download the invoice directly from the sender's system rather than printing and scanning it.</li>
      </ul>
      
      <p>For more details on handling scanned documents, see our <a title="Supported invoice formats" href="https://billtosheet.com/help/supported-formats">help guide on supported formats</a>.</p>
      
      <h3 className="text-2xl font-bold mb-6">Error 2: Missing or incorrect amounts</h3>
      
      <p>Sometimes the invoice converts, but the amounts are wrong or missing entirely. This usually happens when:</p>
      
      <ul>
        <li>The PDF uses unusual number formatting (e.g., <code>1.234,56</code> instead of <code>1,234.56</code>)</li>
        <li>Currency symbols overlap with numbers</li>
        <li>Tables have merged cells or complex layouts</li>
        <li>The subtotal, tax, and total aren't clearly labelled</li>
      </ul>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Check the original PDF structure</strong> – Open your PDF and look at how the amounts are displayed. Are they in a table? Are they clearly separated?</li>
        <li><strong>Look for calculation errors</strong> – Sometimes the issue isn't conversion but a mistake in the original invoice. Double-check the math.</li>
        <li><strong>Review currency formats</strong> – Our system handles most international formats, but extremely unusual formatting can cause issues. See our <a title="Date format handling" href="https://billtosheet.com/help/date-format-handling">guide on format handling</a>.</li>
        <li><strong>Manual correction</strong> – If a specific field is consistently wrong, you can edit the CSV after conversion. It's still faster than typing everything manually.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">Error 3: Dates not recognised</h3>
      
      <p>Date recognition problems occur when invoices use non-standard date formats or when dates appear in unusual places on the document.</p>
      
      <h4 className="text-xl font-semibold mb-4">Common date issues:</h4>
      
      <ul>
        <li><strong>Ambiguous formats</strong> – Is "01/02/2026" January 2nd or February 1st? <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener">ISO 8601 format</a> (YYYY-MM-DD) eliminates this ambiguity.</li>
        <li><strong>Multiple dates</strong> – Invoices often have issue dates, due dates, and delivery dates. The converter needs to identify which is which.</li>
        <li><strong>Written-out dates</strong> – "January 15th, 2026" vs "15/01/2026" vs "2026-01-15" are all valid but different formats.</li>
      </ul>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Check for date labels</strong> – Make sure your invoice clearly labels dates as "Invoice Date", "Due Date", etc.</li>
        <li><strong>Use standard formats</strong> – If you're generating invoices, stick to common formats like DD/MM/YYYY or ISO format.</li>
        <li><strong>Verify in the CSV</strong> – After conversion, quickly scan the date column. BillToSheet outputs dates in ISO format (YYYY-MM-DD) for maximum compatibility.</li>
      </ul>
      
      <p>For more on date handling, check our <a title="Date format handling guide" href="https://billtosheet.com/help/date-format-handling">date format handling guide</a>.</p>
      
      <h3 className="text-2xl font-bold mb-6">Error 4: Line items missing or incomplete</h3>
      
      <p>This is one of the trickier issues – when the invoice header converts fine, but the line item table is incomplete or scrambled.</p>
      
      <h4 className="text-xl font-semibold mb-4">Why this happens:</h4>
      
      <ul>
        <li><strong>Complex table layouts</strong> – Merged cells, nested tables, or split columns can confuse table detection.</li>
        <li><strong>Multi-page invoices</strong> – Tables that span multiple pages sometimes break across page boundaries.</li>
        <li><strong>Inconsistent formatting</strong> – Different fonts, sizes, or alignments within the same table.</li>
        <li><strong>Images or graphics</strong> – Company logos or watermarks overlapping the table data.</li>
      </ul>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Review the line_items.csv</strong> – We generate a separate file for line items. Check if the data is there but in a different structure than expected.</li>
        <li><strong>Simplify the source</strong> – If you control the invoice format, use simple tables without merged cells or complex formatting.</li>
        <li><strong>Check page breaks</strong> – For <a title="Multi-page invoices" href="https://billtosheet.com/help/multi-page-invoices">multi-page invoices</a>, ensure tables don't break mid-row.</li>
        <li><strong>Manual cleanup</strong> – If a few rows are missing or merged, it's often faster to fix them in Excel than try to re-convert.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">Error 5: Special characters appear as symbols</h3>
      
      <p>You might see weird symbols (<code>â‚¬</code>, <code>Â£</code>, <code>â€"</code>) instead of proper currency symbols or punctuation.</p>
      
      <h4 className="text-xl font-semibold mb-4">What's happening:</h4>
      
      <p>This is a <strong>character encoding issue</strong>. The PDF uses one character set (usually UTF-8), but somewhere in the conversion or when you open the CSV, it's being interpreted as a different encoding.</p>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Open CSV in UTF-8 mode</strong> – Most modern software defaults to UTF-8, but older versions of Excel might not. When opening the CSV, explicitly select "UTF-8" as the encoding.</li>
        <li><strong>Use Google Sheets</strong> – It handles UTF-8 automatically and won't have encoding issues.</li>
        <li><strong>Import into Excel properly</strong> – Instead of double-clicking the CSV, use Excel's "Data" → "From Text/CSV" import wizard and select UTF-8 encoding.</li>
      </ul>
      
      <p>For more details, see <a href="https://support.microsoft.com/en-us/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba" target="_blank" rel="noopener">Microsoft's guide to importing CSV files with proper encoding</a>.</p>
      
      <h3 className="text-2xl font-bold mb-6">Error 6: Duplicate data or repeated fields</h3>
      
      <p>Sometimes the same information appears multiple times in the CSV – invoice numbers repeated, or line items duplicated.</p>
      
      <h4 className="text-xl font-semibold mb-4">Why this happens:</h4>
      
      <ul>
        <li><strong>Headers and footers</strong> – Invoice numbers or company names in page headers get extracted multiple times.</li>
        <li><strong>Summary sections</strong> – If the invoice has both a line item total and a summary section, both might be extracted.</li>
        <li><strong>Multi-page tables</strong> – Table headers repeated on each page can appear as duplicate data.</li>
      </ul>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Remove duplicates in Excel</strong> – Use "Data" → "Remove Duplicates" to clean up the CSV quickly.</li>
        <li><strong>Check for summary sections</strong> – Look at the original PDF. If there's a summary box at the bottom, that's probably where the duplicate came from.</li>
        <li><strong>Filter by unique invoice numbers</strong> – When importing to accounting software, use the invoice number as the unique identifier to prevent double-entry.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">Error 7: Password-protected or encrypted PDFs</h3>
      
      <p>Some invoices are password-protected for security, which prevents automated conversion.</p>
      
      <h4 className="text-xl font-semibold mb-4">How to fix it:</h4>
      
      <ul>
        <li><strong>Remove the password first</strong> – Use Adobe Acrobat or a free tool to unlock the PDF before conversion.</li>
        <li><strong>Request unprotected versions</strong> – If you regularly receive protected invoices from a vendor, ask them to send unprotected versions.</li>
        <li><strong>Check our compatibility</strong> – Some password protections are easier to work with than others. See our <a title="Password protected PDFs" href="https://billtosheet.com/help/password-protected-pdfs">password-protected PDF guide</a>.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">Best practices to avoid errors</h3>
      
      <p>Prevention is better than cure. Here's how to minimize conversion errors from the start:</p>
      
      <ul>
        <li><strong>Use digital PDFs when possible</strong> – Download directly from the source rather than printing and scanning.</li>
        <li><strong>Standardise your invoice format</strong> – If you're sending invoices, use consistent layouts and simple tables.</li>
        <li><strong>Check file size limits</strong> – Very large files (over 10MB) can cause issues. See our <a title="File size limits" href="https://billtosheet.com/help/file-size-limits">file size guide</a>.</li>
        <li><strong>Test with one invoice first</strong> – Before bulk converting, try one invoice to ensure the format works well.</li>
        <li><strong>Keep originals</strong> – Always save the original PDF. If conversion doesn't work perfectly, you have the source to reference.</li>
      </ul>
      
      <h3 className="text-2xl font-bold mb-6">Still having issues?</h3>
      
      <p>Most conversion errors can be fixed with the steps above, but if you're still stuck:</p>
      
      <ol>
        <li><strong>Check our help center</strong> – We have detailed guides for specific issues in our <a title="Help center" href="https://billtosheet.com/help">help center</a>.</li>
        <li><strong>Try the conversion again</strong> – Sometimes temporary glitches happen. A second attempt often works.</li>
        <li><strong>Contact support</strong> – Send us the problematic invoice (remove sensitive info if needed) and we can take a look. We're constantly improving the system based on real-world examples.</li>
      </ol>
      
      <p>Want to see if your invoices convert cleanly? Try our <a title="PDF to CSV converter" href="https://billtosheet.com/invoice-to-csv">PDF to CSV converter</a> – your first conversion is free, and you'll see exactly how your documents are handled.</p>
      
      <p>For bulk conversions, our <a title="Bulk conversion" href="https://billtosheet.com/dashboard/bulk-convert">bulk processing feature</a> can handle hundreds of invoices at once, making it easy to identify any problematic formats in your document collection.</p>
    </BlogPostLayout>
  );
}

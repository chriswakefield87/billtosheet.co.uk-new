import ExcelJS from 'exceljs'
import OpenAI from 'openai'

export interface InvoiceData {
  vendor: string
  invoiceNumber: string
  invoiceDate: string
  currency: string
  subtotal: number
  taxTotal: number
  shipping: number
  total: number
  lineItems: LineItem[]
}

export interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// AI-powered PDF extraction using OpenAI responses API
export async function extractInvoiceData(pdfBuffer: Buffer): Promise<InvoiceData> {
  try {
    console.log('Converting PDF to base64...')
    const base64String = pdfBuffer.toString('base64')
    
    console.log(`PDF size: ${pdfBuffer.length} bytes`)
    console.log('Sending PDF to OpenAI responses API...')
    
    const systemInstructions = `You are an expert at extracting structured data from invoice PDFs. 

CRITICAL RULES:
1. Extract EVERY line item - do not skip any, even if there are 50+ items
2. If a field is missing, use 0 for numbers
3. Calculate missing fields when possible:
   - If subtotal missing: total - tax - shipping
   - If tax missing: total - subtotal - shipping
   - For line items: lineTotal = quantity × unitPrice
4. Infer currency from symbols (£=GBP, $=USD, €=EUR) or context
5. Convert dates to DD-MM-YYYY format (day-month-year) - IMPORTANT: day first, then month, then year
6. Return ONLY valid JSON with no other text

Extract ALL data and return as JSON with this exact structure:
{
  "vendor": "company name",
  "invoiceNumber": "invoice ID",
  "invoiceDate": "DD-MM-YYYY",
  "currency": "GBP|USD|EUR",
  "subtotal": 0.00,
  "taxTotal": 0.00,
  "shipping": 0.00,
  "total": 0.00,
  "lineItems": [
    {"description": "item", "quantity": 0, "unitPrice": 0.00, "lineTotal": 0.00}
  ]
}`
    
    const response = await (openai as any).responses.create({
      model: 'gpt-4.1-2025-04-14',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              filename: 'invoice.pdf',
              file_data: `data:application/pdf;base64,${base64String}`,
            },
            {
              type: 'input_text',
              text: `${systemInstructions}\n\nIMPORTANT: Extract EVERY single line item from this invoice. Return ONLY the JSON object.`,
            },
          ],
        },
      ],
    })

    const content = response.output_text
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    console.log('=== OPENAI RAW RESPONSE ===')
    console.log(content)
    console.log('=== END OPENAI RESPONSE ===')
    
    // Parse JSON
    let parsed
    try {
      console.log('Attempting to parse as direct JSON...')
      parsed = JSON.parse(content)
      console.log('Successfully parsed as direct JSON')
    } catch (e) {
      console.log('Direct JSON parse failed, trying to extract JSON from text...')
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        console.log('Found JSON in response, parsing...')
        parsed = JSON.parse(jsonMatch[0])
        console.log('Successfully extracted and parsed JSON')
      } else {
        console.error('Could not find JSON in response')
        throw new Error('Could not parse JSON from response')
      }
    }
    
    console.log('=== PARSED DATA ===')
    console.log(JSON.stringify(parsed, null, 2))
    console.log('=== END PARSED DATA ===')
    
    // Convert date from any format to DD-MM-YYYY
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      
      // If already in DD-MM-YYYY format, return as is
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      
      // If in YYYY-MM-DD format, convert it
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
      }
      
      // Try parsing and formatting
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      } catch {
        return dateStr;
      }
    };

    // Validate and clean
    const result = {
      vendor: parsed.vendor || 'Unknown Vendor',
      invoiceNumber: parsed.invoiceNumber || `INV-${Math.floor(Math.random() * 100000)}`,
      invoiceDate: formatDate(parsed.invoiceDate),
      currency: parsed.currency || 'GBP',
      subtotal: parseFloat(parsed.subtotal) || 0,
      taxTotal: parseFloat(parsed.taxTotal) || 0,
      shipping: parseFloat(parsed.shipping) || 0,
      total: parseFloat(parsed.total) || 0,
      lineItems: (parsed.lineItems || []).map((item: any) => ({
        description: (item.description || 'Unknown Item').substring(0, 200),
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        lineTotal: parseFloat(item.lineTotal) || 0,
      }))
    }
    
    console.log(`Successfully extracted ${result.lineItems.length} line items`)
    return result
    
  } catch (error) {
    console.error('PDF parsing error:', error)
    return getFallbackData()
  }
}

function getFallbackData(): InvoiceData {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  
  return {
    vendor: "Unknown Vendor",
    invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
    invoiceDate: formattedDate,
    currency: "GBP",
    subtotal: 0,
    taxTotal: 0,
    shipping: 0,
    total: 0,
    lineItems: [],
  }
}

export async function generateCSVFiles(data: InvoiceData): Promise<{ invoiceDetailsCSV: string; lineItemsCSV: string }> {
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

  const invoiceDetailsCSV = [
    'Field,Value',
    `Vendor,"${data.vendor.replace(/"/g, '""')}"`,
    `Invoice Number,${data.invoiceNumber}`,
    `Invoice Date,${formatDate(data.invoiceDate)}`,
    `Currency,${data.currency}`,
    `Subtotal,${data.subtotal.toFixed(2)}`,
    `Tax Total,${data.taxTotal.toFixed(2)}`,
    `Shipping,${data.shipping > 0 ? data.shipping.toFixed(2) : '-'}`,
    `Total,${data.total.toFixed(2)}`
  ].join('\n')

  const lineItemsCSV = [
    'Description,Quantity,Unit Price,Line Total',
    ...data.lineItems.map(item => 
      `"${item.description.replace(/"/g, '""')}",${item.quantity},${item.unitPrice.toFixed(2)},${item.lineTotal.toFixed(2)}`
    )
  ].join('\n')

  return { invoiceDetailsCSV, lineItemsCSV }
}

export async function generateExcelFile(data: InvoiceData): Promise<Buffer> {
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

  const workbook = new ExcelJS.Workbook()

  const detailsSheet = workbook.addWorksheet('Invoice Details')
  detailsSheet.columns = [
    { header: 'Field', key: 'field', width: 20 },
    { header: 'Value', key: 'value', width: 30 }
  ]
  detailsSheet.addRows([
    { field: 'Vendor', value: data.vendor },
    { field: 'Invoice Number', value: data.invoiceNumber },
    { field: 'Invoice Date', value: formatDate(data.invoiceDate) },
    { field: 'Currency', value: data.currency },
    { field: 'Subtotal', value: data.subtotal },
    { field: 'Tax Total', value: data.taxTotal },
    { field: 'Shipping', value: data.shipping > 0 ? data.shipping : '-' },
    { field: 'Total', value: data.total }
  ])

  detailsSheet.getRow(1).font = { bold: true }
  detailsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F5E9' }
  }

  const itemsSheet = workbook.addWorksheet('Line Items')
  itemsSheet.columns = [
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Quantity', key: 'quantity', width: 10 },
    { header: 'Unit Price', key: 'unitPrice', width: 12 },
    { header: 'Line Total', key: 'lineTotal', width: 12 }
  ]
  itemsSheet.addRows(data.lineItems)

  itemsSheet.getRow(1).font = { bold: true }
  itemsSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE8F5E9' }
  }

  itemsSheet.getColumn('unitPrice').numFmt = '#,##0.00'
  itemsSheet.getColumn('lineTotal').numFmt = '#,##0.00'

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

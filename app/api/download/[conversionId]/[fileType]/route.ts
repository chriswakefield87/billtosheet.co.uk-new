import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { generateCSVFiles, generateExcelFile, InvoiceData } from '@/lib/converter'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversionId: string; fileType: string }> }
) {
  try {
    const { conversionId, fileType } = await params
    const { userId: clerkUserId } = await auth()

    // Get conversion
    const conversion = await prisma.conversion.findUnique({
      where: { id: conversionId },
      include: {
        user: true,
      },
    })

    if (!conversion) {
      return NextResponse.json({ error: 'Conversion not found' }, { status: 404 })
    }

    // Check access permissions
    const cookieStore = cookies()
    const anonymousId = cookieStore.get('anonymous_id')?.value

    const hasAccess =
      (clerkUserId && conversion.user && conversion.user.clerkUserId === clerkUserId) ||
      (!clerkUserId && anonymousId && conversion.anonymousId === anonymousId)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Parse extracted data
    const invoiceData: InvoiceData = JSON.parse(conversion.extractedData)

    // Generate files on-the-fly from stored data
    let fileContent: Buffer | string
    let fileName: string
    let contentType: string

    switch (fileType) {
      case 'invoice-details': {
        const { invoiceDetailsCSV } = await generateCSVFiles(invoiceData)
        fileContent = invoiceDetailsCSV
        fileName = 'invoice_details.csv'
        contentType = 'text/csv'
        break
      }
      case 'line-items': {
        const { lineItemsCSV } = await generateCSVFiles(invoiceData)
        fileContent = lineItemsCSV
        fileName = 'line_items.csv'
        contentType = 'text/csv'
        break
      }
      case 'excel': {
        fileContent = await generateExcelFile(invoiceData)
        fileName = 'combined.xlsx'
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Return generated file
    const response = new NextResponse(fileContent as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
    return response
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}

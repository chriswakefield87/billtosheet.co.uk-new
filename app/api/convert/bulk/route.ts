import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { canUserConvert, deductCredit } from '@/lib/credits'
import { extractInvoiceData } from '@/lib/converter'

interface BulkConversionResult {
  fileName: string
  success: boolean
  conversionId?: string
  error?: string
  vendor?: string
  invoiceNumber?: string
  total?: number
  currency?: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Ensure user exists in database
    const dbUser = await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        creditsBalance: 1,
      },
    })

    // Check if user has enough credits
    const { allowed, creditsRemaining } = await canUserConvert(userId)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Insufficient credits', creditsRemaining: creditsRemaining || 0 },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Check if user has enough credits for all files
    if (dbUser.creditsBalance < files.length) {
      return NextResponse.json(
        { 
          error: `Insufficient credits. You have ${dbUser.creditsBalance} credits but selected ${files.length} files.`,
          creditsRemaining: dbUser.creditsBalance 
        },
        { status: 403 }
      )
    }

    // Process all files concurrently
    const processFile = async (file: File): Promise<BulkConversionResult> => {
      const fileName = file.name
      
      try {
        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Extract invoice data
        const invoiceData = await extractInvoiceData(buffer)

        // Create conversion record
        const conversion = await prisma.conversion.create({
          data: {
            userId: dbUser.id,
            vendor: invoiceData.vendor,
            invoiceNumber: invoiceData.invoiceNumber,
            invoiceDate: invoiceData.invoiceDate,
            currency: invoiceData.currency,
            total: invoiceData.total,
            extractedData: JSON.stringify(invoiceData),
            status: 'completed',
          },
        })

        // Deduct credit for successful conversion
        await deductCredit(userId)

        return {
          fileName,
          success: true,
          conversionId: conversion.id,
          vendor: invoiceData.vendor,
          invoiceNumber: invoiceData.invoiceNumber,
          total: invoiceData.total,
          currency: invoiceData.currency,
        }
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
        
        // Return failed conversion (but don't save to database or deduct credit)
        return {
          fileName,
          success: false,
          error: error instanceof Error ? error.message : 'Conversion failed',
        }
      }
    }

    // Process all files concurrently
    const results = await Promise.all(files.map(processFile))
    const successfulCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      results,
      successfulCount,
      failedCount: results.length - successfulCount,
      creditsUsed: successfulCount,
    })
  } catch (error) {
    console.error('Bulk conversion error:', error)
    return NextResponse.json(
      { error: 'Bulk conversion failed. Please try again.' },
      { status: 500 }
    )
  }
}

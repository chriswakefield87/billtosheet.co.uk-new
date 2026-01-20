import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { canUserConvert, deductCredit } from '@/lib/credits'
import { extractInvoiceData, generateCSVFiles, generateExcelFile } from '@/lib/converter'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Get user info
    const { userId } = await auth()
    const user = userId ? await currentUser() : null

    // Get or create anonymous ID for non-logged-in users
    let anonymousId: string | null = null
    if (!userId) {
      const cookieStore = cookies()
      anonymousId = cookieStore.get('anonymous_id')?.value || uuidv4()
      cookieStore.set('anonymous_id', anonymousId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
    }

    // Ensure user exists in database and give new users 1 free credit
    // This must happen BEFORE checking if they can convert
    let dbUser = null
    if (userId && user) {
      dbUser = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {},
        create: {
          clerkUserId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          creditsBalance: 1, // Give new users 1 free credit
        },
      })
    }

    // Check if user can convert (after ensuring user exists)
    const { allowed, reason } = await canUserConvert(userId)

    if (!allowed) {
      return NextResponse.json(
        { error: reason, requiresAuth: !userId },
        { status: 403 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract invoice data (mocked for MVP)
    const invoiceData = await extractInvoiceData(buffer)

    // Create conversion record (no file storage, just metadata)
    const conversion = await prisma.conversion.create({
      data: {
        userId: dbUser?.id || undefined,
        anonymousId: anonymousId || undefined,
        vendor: invoiceData.vendor,
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.invoiceDate,
        currency: invoiceData.currency,
        total: invoiceData.total,
        extractedData: JSON.stringify(invoiceData),
        status: 'completed',
      },
    })

    // Deduct credit if logged in
    if (userId) {
      await deductCredit(userId)
    }

    return NextResponse.json({
      conversionId: conversion.id,
      success: true,
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json(
      { error: 'Conversion failed. Please try again.' },
      { status: 500 }
    )
  }
}

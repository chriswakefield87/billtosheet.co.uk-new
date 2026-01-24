import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * API route to clean up old conversion data
 * Should be called via cron job (e.g., Vercel Cron, external cron service)
 * 
 * Deletes conversions older than 30 days for logged-in users
 * Deletes conversions older than 1 day for anonymous users
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron request (optional security check)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Delete conversions older than 30 days for logged-in users
    const loggedInResult = await prisma.conversion.deleteMany({
      where: {
        userId: { not: null },
        createdAt: { lt: thirtyDaysAgo },
      },
    })

    // Delete conversions older than 1 day for anonymous users
    const anonymousResult = await prisma.conversion.deleteMany({
      where: {
        userId: null,
        createdAt: { lt: oneDayAgo },
      },
    })

    return NextResponse.json({
      success: true,
      deleted: {
        loggedIn: loggedInResult.count,
        anonymous: anonymousResult.count,
        total: loggedInResult.count + anonymousResult.count,
      },
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Cleanup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also allow GET for manual testing (remove in production or add auth)
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Count conversions that would be deleted
    const loggedInCount = await prisma.conversion.count({
      where: {
        userId: { not: null },
        createdAt: { lt: thirtyDaysAgo },
      },
    })

    const anonymousCount = await prisma.conversion.count({
      where: {
        userId: null,
        createdAt: { lt: oneDayAgo },
      },
    })

    return NextResponse.json({
      wouldDelete: {
        loggedIn: loggedInCount,
        anonymous: anonymousCount,
        total: loggedInCount + anonymousCount,
      },
      retention: {
        loggedIn: '30 days',
        anonymous: '1 day',
      },
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Cleanup preview error:', error)
    return NextResponse.json(
      { error: 'Failed to preview cleanup' },
      { status: 500 }
    )
  }
}

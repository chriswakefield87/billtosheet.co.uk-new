import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId: clerkUserId } = await auth()
    const cookieStore = cookies()
    const anonymousId = cookieStore.get('anonymous_id')?.value

    const conversion = await prisma.conversion.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!conversion) {
      return NextResponse.json({ error: 'Conversion not found' }, { status: 404 })
    }

    // Check access permissions
    const hasAccess =
      (clerkUserId && conversion.user && conversion.user.clerkUserId === clerkUserId) ||
      (!clerkUserId && anonymousId && conversion.anonymousId === anonymousId)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Return conversion data
    const data = JSON.parse(conversion.extractedData)

    return NextResponse.json({
      data,
      isLoggedIn: !!clerkUserId,
    })
  } catch (error) {
    console.error('Conversion fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversion' }, { status: 500 })
  }
}

import { prisma } from './db'
import { cookies } from 'next/headers'

const ANONYMOUS_CONVERSION_LIMIT = 1

export async function getAnonymousConversionCount(): Promise<number> {
  const cookieStore = cookies()
  const anonymousId = cookieStore.get('anonymous_id')?.value
  
  if (!anonymousId) {
    return 0
  }

  const count = await prisma.conversion.count({
    where: {
      anonymousId,
    },
  })

  return count
}

export async function canUserConvert(userId: string | null): Promise<{ allowed: boolean; reason?: string; creditsRemaining?: number }> {
  // Logged-in user
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return { allowed: false, reason: 'User not found' }
    }

    if (user.creditsBalance <= 0) {
      return { allowed: false, reason: 'Insufficient credits', creditsRemaining: 0 }
    }

    return { allowed: true, creditsRemaining: user.creditsBalance }
  }

  // Anonymous user
  const anonymousCount = await getAnonymousConversionCount()
  
  if (anonymousCount >= ANONYMOUS_CONVERSION_LIMIT) {
    return { allowed: false, reason: 'Free conversion limit reached. Please sign in to continue.' }
  }

  return { allowed: true, creditsRemaining: ANONYMOUS_CONVERSION_LIMIT - anonymousCount }
}

export async function deductCredit(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        creditsBalance: {
          decrement: 1,
        },
      },
    }),
    prisma.creditTransaction.create({
      data: {
        user: {
          connect: { clerkUserId: userId },
        },
        amount: -1,
        type: 'usage',
        description: 'Invoice conversion',
      },
    }),
  ])
}

export async function addCredits(userId: string, amount: number, stripePaymentId: string): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        creditsBalance: {
          increment: amount,
        },
      },
    }),
    prisma.creditTransaction.create({
      data: {
        user: {
          connect: { clerkUserId: userId },
        },
        amount,
        type: 'purchase',
        description: `Purchased ${amount} credits`,
        stripePaymentId,
      },
    }),
  ])
}

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addCredits } from '@/lib/credits'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata?.userId
    const credits = parseInt(session.metadata?.credits || '0')
    const paymentIntentId = session.payment_intent as string

    if (userId && credits > 0) {
      try {
        await addCredits(userId, credits, paymentIntentId)
        console.log(`Added ${credits} credits to user ${userId}`)
      } catch (error) {
        console.error('Failed to add credits:', error)
        return NextResponse.json(
          { error: 'Failed to add credits' },
          { status: 500 }
        )
      }
    }
  }

  return NextResponse.json({ received: true })
}

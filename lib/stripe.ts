import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const CREDIT_PACKS = [
  {
    id: 'pack_25',
    name: 'Starter Pack',
    credits: 25,
    price: 900, // £9.00 in pence
    priceDisplay: '£9',
    popular: false,
  },
  {
    id: 'pack_100',
    name: 'Pro Pack',
    credits: 100,
    price: 1900, // £19.00 in pence
    priceDisplay: '£19',
    popular: true,
  },
  {
    id: 'pack_500',
    name: 'Business Pack',
    credits: 500,
    price: 4900, // £49.00 in pence
    priceDisplay: '£49',
    popular: false,
  },
]

# Quick Setup Guide

Get BillToSheet running locally in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Your API Keys

### Clerk (Authentication)

1. Go to https://dashboard.clerk.com
2. Click "Create Application"
3. Name it "BillToSheet" and choose "Email" as sign-in method
4. Go to "API Keys" in sidebar
5. Copy both keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

### Stripe (Payments)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Make sure you're in "Test mode" (toggle in top right)
3. Copy both keys:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

## Step 3: Configure Environment

Edit `.env.local` and replace the placeholder keys with your actual keys from above:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE

# Leave this for now - we'll get it in Step 5
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

## Step 4: Initialize Database

```bash
npm run db:push
```

This creates the SQLite database file at `prisma/dev.db`.

## Step 5: Start the Dev Server

```bash
npm run dev
```

Open http://localhost:3000 - you should see the BillToSheet homepage!

## Step 6: Setup Stripe Webhooks (For Payments)

**Open a NEW terminal window** and run:

```bash
npm run stripe:listen
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy that `whsec_xxxxxxxxxxxxx` value and update `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Keep this terminal running!** It forwards Stripe webhooks to your local server.

## Step 7: Test It Out!

### Test Anonymous Conversion (No Login)

1. Go to http://localhost:3000
2. Upload any PDF file (extraction is mocked for MVP)
3. Download the generated CSV and Excel files

### Test Account Creation

1. Click "Sign Up" in top right
2. Enter your email and create a password
3. You'll be redirected to the dashboard
4. Notice you have 0 credits

### Test Credit Purchase

1. Go to http://localhost:3000/pricing
2. Click "Purchase" on any pack
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
4. Complete the checkout
5. Check the terminal running `stripe listen` - you should see the webhook event
6. Go back to dashboard - credits should be added!

### Test Paid Conversion

1. Upload another invoice from homepage or dashboard
2. It should deduct 1 credit
3. Files are retained for 30 days in your dashboard

## Common Issues

### "Clerk keys not found"
- Make sure you've added the Clerk keys to `.env.local`
- Restart the dev server after adding keys

### "Credits not added after payment"
- Make sure `stripe listen` is running in a separate terminal
- Check that `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the output from `stripe listen`
- Check the `stripe listen` terminal for webhook events

### "Database error"
- Run `npm run db:push` again
- Delete `prisma/dev.db` and `prisma/dev.db-journal`, then run `npm run db:push`

### Port 3000 already in use
- Stop other processes on port 3000, or
- Run `npm run dev -- -p 3001` to use a different port

## Next Steps

- Explore all the pSEO pages (e.g., http://localhost:3000/invoice-to-csv/amazon)
- Check out the help center at http://localhost:3000/help/getting-started
- View the sitemap at http://localhost:3000/sitemap.xml
- Test the dashboard features at http://localhost:3000/dashboard

## Database Management

View your database in a GUI:

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit data.

## Production Deployment

When you're ready to deploy:

1. Replace SQLite with PostgreSQL/MySQL
2. Use a cloud storage service (S3, R2) for file storage
3. Update Clerk and Stripe to production keys
4. Set up a proper Stripe webhook endpoint (not CLI)
5. Deploy to Vercel, Railway, or your preferred platform

See README.md for more details!

---

**Need help?** Check README.md for the full documentation.

# BillToSheet - Invoice PDF to CSV/Excel Converter

A production-quality SaaS application that converts invoice PDFs to CSV and Excel formats with automatic data extraction.

## Features

- 🚀 **Instant Conversion**: Upload PDF invoices and get CSV/Excel files in seconds
- 🔐 **Secure Authentication**: Clerk-based authentication with email login
- 💳 **Credit System**: Pay-as-you-go model with Stripe integration
- 📊 **Multiple Formats**: Export to CSV (separate files) and Excel (combined workbook)
- 🔄 **30-Day Retention**: Converted files stored for 30 days for logged-in users
- 🎯 **pSEO Optimized**: Programmatic SEO pages for brands, extraction, help, and comparisons
- 📱 **Responsive Design**: Beautiful, modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: Prisma + SQLite (local dev)
- **File Generation**: ExcelJS for XLSX, native Node.js for CSV

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account ([https://clerk.com](https://clerk.com))
- Stripe account ([https://stripe.com](https://stripe.com))
- Stripe CLI for webhook testing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs (keep as-is for local dev)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (MySQL via Docker)
DATABASE_URL="mysql://billtosheet_user:billtosheet_pass@localhost:3306/billtosheet"

# OpenAI (for PDF parsing)
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Getting Clerk Keys:

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Navigate to "API Keys" in the sidebar
4. Copy your publishable and secret keys

#### Getting Stripe Keys:

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your publishable key and secret key (use test mode keys)
3. For webhook secret, see step 5 below

#### Getting OpenAI API Key:

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and paste into .env.local

### 3. Start MySQL Database (Docker)

```bash
docker-compose up -d
```

This starts MySQL in a Docker container on `localhost:3306`.

### 4. Initialize Database

```bash
npx prisma db push
```

This creates the tables in MySQL and generates the Prisma client.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 5. Setup Stripe Webhooks (Required for Payments)

In a separate terminal, run:

```bash
npm run stripe:listen
```

This will output a webhook signing secret like `whsec_...`. Copy this value and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

Keep this terminal running when testing payments.

## Testing the Application

### Free Conversion (Anonymous User)

1. Go to [http://localhost:3000](http://localhost:3000)
2. Upload a PDF invoice (any PDF will work for MVP as extraction is mocked)
3. You'll be redirected to the conversion results page
4. Download the CSV and Excel files

### Creating an Account

1. Click "Sign Up" in the navigation
2. Create an account with email
3. You'll be redirected to the dashboard

### Purchasing Credits

1. Sign in to your account
2. Go to [http://localhost:3000/pricing](http://localhost:3000/pricing)
3. Click "Purchase" on any credit pack
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code
5. Complete checkout
6. Verify credits appear in your dashboard

**Important**: Make sure `stripe listen` is running for the webhook to process the payment and add credits!

### Converting Invoices (Logged In)

1. From the dashboard or homepage, upload an invoice PDF
2. View the conversion results
3. Download files in CSV or Excel format
4. Check your dashboard to see conversion history

## Project Structure

```
billtosheet/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── convert/              # Invoice conversion endpoint
│   │   ├── checkout/             # Stripe checkout
│   │   ├── download/             # File download endpoint
│   │   └── webhooks/stripe/      # Stripe webhook handler
│   ├── invoice-to-csv/           # pSEO hub + brand pages
│   │   ├── page.tsx              # Hub page
│   │   └── [slug]/               # Dynamic brand pages
│   ├── extract/[slug]/           # Extract pages (pSEO)
│   ├── help/[slug]/              # Help pages (pSEO)
│   ├── compare/[slug]/           # Comparison pages (pSEO)
│   ├── convert/[id]/             # Conversion results page
│   ├── dashboard/                # User dashboard
│   ├── pricing/                  # Pricing page
│   ├── sign-in/                  # Sign in page
│   ├── sign-up/                  # Sign up page
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── contact/                  # Contact page
│   ├── blog/                     # Blog (stubbed)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/                   # React components
│   ├── Navigation.tsx            # Header navigation
│   ├── Footer.tsx                # Footer
│   ├── UploadTool.tsx            # PDF upload component
│   ├── FAQSection.tsx            # FAQ display
│   └── Breadcrumbs.tsx           # Breadcrumb navigation
├── lib/                          # Utility libraries
│   ├── db.ts                     # Prisma client
│   ├── stripe.ts                 # Stripe configuration
│   ├── credits.ts                # Credits management
│   ├── converter.ts              # Invoice conversion logic
│   └── seo-utils.ts              # SEO schema generators
├── data/                         # JSON datasets for pSEO
│   ├── brands.json               # Brand converter pages
│   ├── extract_pages.json        # Extract pages
│   ├── help_pages.json           # Help articles
│   └── compare_pages.json        # Comparison pages
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
├── storage/                      # Converted files (gitignored)
├── uploads/                      # Temporary uploads (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Database Schema

### User
- Stores Clerk user ID, email, and credit balance
- Linked to conversions and credit transactions

### Conversion
- Stores extraction results and metadata
- Links to user (or anonymous ID)
- Has expiry date for file retention

### ConversionFiles
- Stores file paths for generated CSVs and Excel files
- Linked to conversion

### CreditTransaction
- Tracks all credit purchases and usage
- Links to user and Stripe payment ID

## URL Structure

### Public Pages
- `/` - Homepage with upload tool
- `/pricing` - Credit packs and pricing
- `/blog` - Blog index (stubbed)
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/contact` - Contact page

### pSEO Hubs
- `/invoice-to-csv` - Main converter hub
- `/extract/invoice-data` - Extract hub (use first slug from dataset)
- `/help/getting-started` - Help hub (use first slug from dataset)
- `/compare/billtosheet-vs-manual-entry` - Compare hub

### pSEO Spokes (Dynamic)
- `/invoice-to-csv/[slug]` - Brand converter pages (e.g., `/invoice-to-csv/amazon`)
- `/extract/[slug]` - Extract pages
- `/help/[slug]` - Help articles
- `/compare/[slug]` - Comparison pages

### Protected Pages
- `/dashboard` - User dashboard (requires authentication)
- `/convert/[id]` - Conversion results (requires ownership)

## SEO Features

✅ Dynamic metadata with `generateMetadata()`  
✅ Canonical URLs for all pages  
✅ Automatic sitemap generation  
✅ Robots.txt configuration  
✅ JSON-LD structured data (FAQ schema)  
✅ JSON-LD breadcrumb schema  
✅ Breadcrumb navigation components  
✅ Internal linking between related pages  
✅ Optimized page titles and descriptions  

## Credits System

- **Anonymous Users**: 1 free conversion (tracked via cookie)
- **Logged-in Users**: Purchase credit packs
  - £9 = 25 credits
  - £19 = 100 credits  
  - £49 = 500 credits
- **1 credit = 1 conversion**
- **Credits never expire**

## File Retention

- **Anonymous Users**: Files available during session only
- **Logged-in Users**: Files stored for 30 days
- **Original PDFs**: Never stored after processing
- **Auto-deletion**: Files automatically deleted after expiry

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push        # Apply schema changes
npm run db:studio      # Open Prisma Studio (DB GUI)

# Stripe webhook testing
npm run stripe:listen  # Forward webhooks to local server
```

## Testing Stripe Payments Locally

1. Ensure Stripe CLI is installed: `brew install stripe/stripe-cli/stripe` (macOS)
2. Login: `stripe login`
3. Run webhook forwarding: `npm run stripe:listen`
4. Copy the webhook signing secret to `.env.local`
5. Use test card `4242 4242 4242 4242` for successful payments
6. Check terminal running `stripe listen` to see webhook events
7. Verify credits added in dashboard after successful payment

## Invoice Conversion Flow

For the MVP, invoice extraction is mocked with sample data. To implement real extraction:

1. Install PDF parsing library (e.g., `pdf-parse`, `pdfjs-dist`)
2. Or integrate AI service (OpenAI, Google Document AI)
3. Update `lib/converter.ts` `extractInvoiceData()` function
4. Extract actual fields from PDF content
5. Return structured InvoiceData object

## Deployment Considerations

When deploying to production:

1. Replace SQLite with PostgreSQL or MySQL
2. Update `DATABASE_URL` in environment variables
3. Use cloud storage (S3, Cloudflare R2) instead of local filesystem
4. Update file paths in `lib/converter.ts`
5. Set up proper Stripe webhook endpoint (not CLI)
6. Configure production Clerk and Stripe keys
7. Enable CORS and security headers
8. Set up monitoring and error tracking

## Support

For questions or issues:
- Check `/help/getting-started` in the app
- Review this README
- Contact via `/contact` page

## License

Proprietary - All rights reserved

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.

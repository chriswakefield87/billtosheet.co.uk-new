# Local Development Setup Guide (Mac)

Complete guide to running BillToSheet locally on your Mac with Docker for MySQL.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/) or install via Homebrew: `brew install node`
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/) for Mac
- **Git** - Usually pre-installed, or `brew install git`
- **Stripe CLI** (optional, for webhook testing) - `brew install stripe/stripe-cli/stripe`

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd billtosheet.co.uk

# Install dependencies
npm install
```

### 2. Start MySQL with Docker

```bash
# Start MySQL container
docker-compose up -d

# Verify it's running
docker ps
# You should see 'billtosheet-mysql' container running
```

This starts MySQL 8.0 on `localhost:3306` with:
- Database: `billtosheet`
- User: `billtosheet_user`
- Password: `billtosheet_pass`
- Port: `3306`

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit with your API keys
nano .env.local  # or use your preferred editor (VS Code, etc.)
```

You'll need to get API keys from:

#### Clerk (Authentication)
1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Go to "API Keys" in sidebar
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

#### Stripe (Payments - Test Mode)
1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
4. Leave `STRIPE_WEBHOOK_SECRET` as `whsec_placeholder` for now (we'll get it in step 5)

#### OpenAI (PDF Parsing)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
# Opens at http://localhost:5555
```

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 6. Setup Stripe Webhooks (For Testing Payments)

**Open a NEW terminal window** and run:

```bash
# Login to Stripe CLI (first time only)
stripe login

# Forward webhooks to local server
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

**Restart your dev server** (`npm run dev`) after updating the webhook secret.

## Testing the Application

### Test Anonymous Conversion
1. Go to [http://localhost:3000](http://localhost:3000)
2. Upload any PDF file
3. Download the generated CSV and Excel files

### Test Account Creation
1. Click "Sign Up" in top right
2. Enter your email and create a password
3. You'll be redirected to the dashboard
4. Notice you have 0 credits

### Test Credit Purchase
1. Go to [http://localhost:3000/pricing](http://localhost:3000/pricing)
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

## Common Commands

```bash
# Start MySQL
docker-compose up -d

# Stop MySQL
docker-compose down

# View MySQL logs
docker-compose logs -f mysql

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d
npx prisma db push

# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run build
npm start

# Database management
npx prisma studio          # Open database GUI
npx prisma db push         # Apply schema changes
npx prisma generate        # Regenerate Prisma client

# Add credits to a user (for testing)
node scripts/add-credits.js your-email@example.com 100

# Stripe webhook testing
npm run stripe:listen      # Forward webhooks to localhost:3000
```

## Troubleshooting

### MySQL Connection Issues

```bash
# Check if MySQL container is running
docker ps

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Test connection manually
docker exec -it billtosheet-mysql mysql -u billtosheet_user -p
# Password: billtosheet_pass
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process, or use a different port
npm run dev -- -p 3001
```

If port 3306 (MySQL) is already in use:

```bash
# Edit docker-compose.yml to use a different port
# Change: "3306:3306" to "3307:3306"
# Then update DATABASE_URL in .env.local to use port 3307
```

### Database Schema Issues

```bash
# Reset database completely
docker-compose down -v
docker-compose up -d
npx prisma db push

# Or just reset Prisma
npx prisma migrate reset
```

### Environment Variables Not Loading

- Make sure `.env.local` exists (not `.env`)
- Restart the dev server after changing `.env.local`
- Check for typos in variable names
- Ensure no extra spaces around `=`

### Stripe Webhooks Not Working

- Make sure `stripe listen` is running in a separate terminal
- Verify `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the output from `stripe listen`
- Restart dev server after updating webhook secret
- Check the `stripe listen` terminal for webhook events

### Clerk Authentication Issues

- Verify you're using **test mode** keys (start with `pk_test_` and `sk_test_`)
- Make sure Clerk application is configured for email sign-in
- Check Clerk dashboard for any errors
- Clear browser cookies and try again

## Project Structure

```
billtosheet.co.uk/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── dashboard/          # User dashboard
│   ├── invoice-to-csv/     # pSEO pages
│   └── ...
├── components/             # React components
├── lib/                    # Utilities
│   ├── db.ts              # Prisma client
│   ├── stripe.ts          # Stripe config
│   └── converter.ts       # PDF conversion
├── prisma/
│   └── schema.prisma      # Database schema
├── docker-compose.yml      # MySQL Docker setup
├── .env.local.example      # Environment template
└── package.json
```

## Database Management

### View Database in GUI

```bash
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555) - browse and edit data visually.

### Add Test Credits

```bash
node scripts/add-credits.js your-email@example.com 100
```

### Manual Database Access

```bash
# Connect to MySQL
docker exec -it billtosheet-mysql mysql -u billtosheet_user -p
# Password: billtosheet_pass

# Then run SQL commands:
USE billtosheet;
SELECT * FROM User;
SELECT * FROM Conversion;
```

## Development Workflow

1. **Start MySQL**: `docker-compose up -d`
2. **Start dev server**: `npm run dev` (in one terminal)
3. **Start Stripe webhooks**: `npm run stripe:listen` (in another terminal)
4. **Make changes** to code
5. **Test locally** at http://localhost:3000
6. **View database**: `npx prisma studio`

## Next Steps

- Explore the pSEO pages (e.g., `/invoice-to-csv/amazon`)
- Check out the help center at `/help/getting-started`
- View the sitemap at `/sitemap.xml`
- Test the dashboard features at `/dashboard`
- Review the code structure in `app/` and `components/`

## Production vs Local

| Feature | Local Dev | Production |
|---------|-----------|------------|
| Database | MySQL (Docker) | MySQL (Digital Ocean) |
| File Storage | Local filesystem | Cloud storage (S3/R2) |
| Stripe | Test mode keys | Live mode keys |
| Clerk | Test mode keys | Live mode keys |
| Webhooks | Stripe CLI | Production endpoint |

## Need Help?

- Check `SETUP.md` for more detailed setup
- Review `README.md` for project overview
- Check `DEPLOYMENT.md` for production deployment
- Look at error messages in terminal/logs

---

**Happy coding! 🚀**

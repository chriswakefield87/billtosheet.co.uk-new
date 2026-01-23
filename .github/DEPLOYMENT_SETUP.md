# GitHub Actions Deployment Setup

This guide explains how to configure the GitHub Actions workflow for automated deployment to Digital Ocean.

## Required GitHub Secrets

Configure these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### SSH Connection Secrets

1. **`SSH_HOST`** - Your Digital Ocean server IP address or hostname
   - Example: `123.456.789.0` or `billtosheet.example.com`

2. **`SSH_USER`** - SSH username for your server
   - Example: `root` or `deploy` (if you created a deploy user)

3. **`SSH_PRIVATE_KEY`** - Private SSH key for authentication
   - Generate with: `ssh-keygen -t ed25519 -C "github-actions"`
   - Copy the **private** key content (starts with `-----BEGIN OPENSSH PRIVATE KEY-----`)
   - Add the **public** key to your server: `~/.ssh/authorized_keys`

### Application Secrets (for build process)

**Why these are needed in GitHub Secrets:**
- The build happens on GitHub Actions, not on your server
- `NEXT_PUBLIC_*` variables are embedded into the JavaScript bundle at BUILD time
- Your server's `.env.local` is only used at runtime, but the build already happened on GitHub

4. **`DATABASE_URL`** - MySQL connection string (needed for Prisma generate)
   - Format: `mysql://username:password@host:port/database?ssl-mode=REQUIRED`
   - Example: `mysql://billtosheet:password@db.example.com:25060/billtosheet?ssl-mode=REQUIRED`

5. **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** - Clerk publishable key (production)
   - Starts with `pk_live_...`
   - **Required**: Embedded in client bundle at build time

6. **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** - Stripe publishable key (production)
   - Starts with `pk_live_...`
   - **Required**: Embedded in client bundle at build time

7. **`NEXT_PUBLIC_APP_URL`** - Your production app URL
   - Example: `https://billtosheet.co.uk`
   - **Required**: Used in API routes and redirects, embedded at build time

**Note:** Server-side secrets (`CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`) are **NOT** needed in GitHub Secrets. They're only used at runtime on your server, which reads them from `.env.local`.

## Server Setup

### 1. Initial Server Configuration

On your Digital Ocean server, ensure:

```bash
# Node.js 18+ is installed
node --version

# PM2 is installed globally
npm install -g pm2

# Directory exists and has correct permissions
sudo mkdir -p /var/www/billtosheet.co.uk
sudo chown $USER:$USER /var/www/billtosheet.co.uk

# Backup directory exists
sudo mkdir -p /var/backups/billtosheet
```

### 2. Setup SSH Key Authentication

On your **local machine**:

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server-ip
```

On your **server**, verify the key was added:

```bash
cat ~/.ssh/authorized_keys
```

### 3. Create Production Environment File

On your server, create `/var/www/billtosheet.co.uk/.env.local`:

```bash
cd /var/www/billtosheet.co.uk
nano .env.local
```

Add all your production environment variables (same as the GitHub secrets, plus any additional ones).

**Required server-side variables:**
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY` - Get from [resend.com](https://resend.com) dashboard
- `DATABASE_URL` (if not using GitHub secret)
- `OPENAI_API_KEY` (if using OpenAI for PDF parsing)

**Important:** The `.env.local` file on the server will NOT be overwritten during deployment (it's excluded from the archive).

### 4. Initial PM2 Setup

On your server, after first deployment:

```bash
cd /var/www/billtosheet.co.uk
pm2 start npm --name "billtosheet" -- start
pm2 save
pm2 startup  # Follow instructions to enable auto-start on reboot
```

## How It Works

1. **Trigger**: Workflow runs on push to `main` branch or manual trigger
2. **Build**: Application is built on GitHub Actions runner
3. **Archive**: Creates a tar.gz file with source code and build output
4. **Transfer**: SCP transfers archive to Digital Ocean server
5. **Deploy**: 
   - Backs up current deployment
   - Extracts new files
   - Installs dependencies
   - Generates Prisma client
   - Restarts PM2 application

## Manual Deployment

You can also trigger deployments manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Digital Ocean** workflow
3. Click **Run workflow** → **Run workflow**

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection from GitHub Actions
# Add this as a test step in the workflow temporarily
ssh -v ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}
```

### Build Failures

Check the GitHub Actions logs for specific error messages. Common issues:
- Missing environment variables
- Database connection issues during Prisma generate
- Build errors in Next.js

### Deployment Failures

SSH into your server and check:

```bash
# Check PM2 status
pm2 status
pm2 logs billtosheet

# Check if files were extracted
ls -la /var/www/billtosheet.co.uk

# Check backups
ls -la /var/backups/billtosheet
```

### Permission Issues

If you see permission errors:

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/billtosheet.co.uk

# Ensure user can write to backup directory
sudo chown -R $USER:$USER /var/backups/billtosheet
```

## Security Notes

- Never commit `.env.local` files to git
- Use production keys (not test/development keys)
- Rotate SSH keys periodically
- Use a dedicated deploy user instead of root (recommended)
- Enable firewall on your server
- Keep backups of your database separately

## Backup Strategy

The workflow automatically creates backups in `/var/backups/billtosheet/` before each deployment. Backups older than 5 days are automatically deleted.

To restore from a backup:

```bash
cd /var/www/billtosheet.co.uk
tar -xzf /var/backups/billtosheet/backup-YYYYMMDD-HHMMSS.tar.gz
pm2 restart billtosheet
```

# Digital Ocean Deployment Guide

Complete guide to deploying BillToSheet on a Digital Ocean server.

## Local Development with Docker MySQL

For local development, we use Docker to run MySQL:

### Start MySQL Locally

```bash
docker-compose up -d
```

This starts MySQL on `localhost:3306` with:
- Database: `billtosheet`
- User: `billtosheet_user`
- Password: `billtosheet_pass`

### Stop MySQL

```bash
docker-compose down
```

### Reset Database (if needed)

```bash
docker-compose down -v  # Delete volumes
docker-compose up -d    # Restart fresh
npx prisma db push      # Recreate tables
```

### Add Credits to User

```bash
node scripts/add-credits.js your-email@example.com 100
```

---

## Production Deployment Prerequisites

- Digital Ocean Droplet (Ubuntu 22.04 LTS recommended)
- Domain name pointed to your droplet's IP
- MySQL database (can be on same server or managed database)

## Option 1: Using Managed MySQL Database (Recommended)

### 1. Create MySQL Database on Digital Ocean

1. Go to Digital Ocean Dashboard → Databases
2. Click "Create Database Cluster"
3. Choose MySQL 8.0+
4. Select datacenter close to your droplet
5. Choose plan based on expected traffic
6. Create database named `billtosheet`
7. Note down connection details

### 2. Get Connection String

Your connection string will look like:
```
mysql://username:password@host:port/billtosheet?ssl-mode=REQUIRED
```

## Option 2: MySQL on Same Droplet

### Install MySQL

```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Create Database and User

```bash
sudo mysql

CREATE DATABASE billtosheet;
CREATE USER 'billtosheet'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON billtosheet.* TO 'billtosheet'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Your connection string:
```
mysql://billtosheet:your_secure_password@localhost:3306/billtosheet
```

## Server Setup

### 1. SSH into Your Droplet

```bash
ssh root@your_droplet_ip
```

### 2. Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
node --version  # Should be v18+
```

### 3. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 4. Install Nginx (Reverse Proxy)

```bash
sudo apt install nginx -y
```

### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Deploy Application

### 1. Clone or Upload Your Code

```bash
cd /var/www
sudo mkdir billtosheet
sudo chown $USER:$USER billtosheet
cd billtosheet

# Either clone from git or upload via SCP/SFTP
# If using git:
# git clone your_repo_url .
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create production `.env.local`:

```bash
nano .env.local
```

Add your production configuration:

```env
# Clerk (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
CLERK_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe (Production Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_PRODUCTION_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET

# MySQL Database
DATABASE_URL="mysql://username:password@host:port/billtosheet?ssl-mode=REQUIRED"

# Resend (Email Service)
RESEND_API_KEY=re_your_resend_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Run Database Migrations

```bash
npx prisma generate
npx prisma db push
```

### 5. Build Application

```bash
npm run build
```

### 6. Start with PM2

```bash
pm2 start npm --name "billtosheet" -- start
pm2 save
pm2 startup  # Follow the instructions it gives
```

## Configure Nginx

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/billtosheet
```

Add this configuration:

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;  # Allow 10MB file uploads
}
```

### 2. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/billtosheet /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 3. Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure SSL and redirect HTTP to HTTPS.

### 4. Canonical domain redirects (recommended for SEO)

Google indexes `http://`, `https://`, `www`, and non-`www` as separate URLs. Use **one canonical** (e.g. `https://billtosheet.com`) and 301-redirect the rest so Search Console consolidates quicker.

**Option A – Next.js (already in place)**  
The app middleware redirects `http` → `https` and `www` → non-`www` in production. Ensure `NEXT_PUBLIC_APP_URL` is `https://billtosheet.com` (no `www`).

**Option B – Apache**  
Redirect at the edge before traffic hits Node. Enable `mod_rewrite`, `mod_proxy`, `mod_proxy_http`, and `mod_headers`:

```bash
sudo a2enmod rewrite proxy proxy_http headers
```

Create (or adjust) VirtualHosts so that:

1. **HTTP (port 80)** → `301 https://billtosheet.com` + path + query.
2. **HTTPS www** → `301 https://billtosheet.com` + path + query.
3. **HTTPS non-www** → proxy to the app.

Example (replace `billtosheet.com` with your domain; SSL paths assume Certbot `--apache`):

```apache
# HTTP → HTTPS non-www
<VirtualHost *:80>
    ServerName billtosheet.com
    ServerAlias www.billtosheet.com
    RewriteEngine On
    RewriteRule ^ https://billtosheet.com%{REQUEST_URI} [R=301,L]
</VirtualHost>

# HTTPS www → non-www
<VirtualHost *:443>
    ServerName www.billtosheet.com
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/billtosheet.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/billtosheet.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
    RewriteEngine On
    RewriteRule ^ https://billtosheet.com%{REQUEST_URI} [R=301,L]
</VirtualHost>

# HTTPS non-www – main app (proxy to Next.js)
<VirtualHost *:443>
    ServerName billtosheet.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/billtosheet.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/billtosheet.com/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    LimitRequestBody 10485760
</VirtualHost>
```

`LimitRequestBody 10485760` allows ~10 MB uploads. Then:

```bash
sudo apache2ctl configtest && sudo systemctl reload apache2
```

**Option C – Nginx**  
If you use Nginx instead, configure:

1. **HTTP** → `301 https://billtosheet.com$request_uri`
2. **HTTPS www** → `301 https://billtosheet.com$request_uri`
3. **HTTPS non-www** → `proxy_pass` to `http://localhost:3000` with `Host`, `X-Forwarded-Proto`, `X-Forwarded-For`.

See the Nginx section elsewhere in this doc for a full `server { … }` example.

**Search Console:** Add a property for `https://billtosheet.com` (no `www`) if you haven’t. Use *Settings → Preferred domain* only if you still use the legacy “Preferred domain” option; otherwise, canonicals and redirects are enough.

## Configure Stripe Webhooks

### 1. Create Webhook Endpoint in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Listen to: `checkout.session.completed`
5. Copy the signing secret (starts with `whsec_`)

### 2. Update Environment Variable

```bash
nano .env.local
```

Update `STRIPE_WEBHOOK_SECRET` with the new webhook secret, then restart:

```bash
pm2 restart billtosheet
```

## Monitoring & Maintenance

### View Application Logs

```bash
pm2 logs billtosheet
```

### Monitor Application

```bash
pm2 monit
```

### Restart Application

```bash
pm2 restart billtosheet
```

### Update Application

```bash
cd /var/www/billtosheet
git pull  # If using git
npm install
npm run build
npx prisma generate
npx prisma db push  # Only if schema changed
pm2 restart billtosheet
```

### Auto-restart on Crashes

PM2 automatically restarts your app if it crashes. View restarts:

```bash
pm2 list
```

## Backup Strategy

### Database Backups

If using managed database, enable automated backups in Digital Ocean dashboard.

For local MySQL:

```bash
# Create backup script
nano /root/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u billtosheet -p'your_password' billtosheet > /root/backups/billtosheet_$DATE.sql
# Keep only last 7 days
find /root/backups/ -name "billtosheet_*.sql" -mtime +7 -delete
```

```bash
chmod +x /root/backup-db.sh
mkdir /root/backups

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /root/backup-db.sh
```

## Automated Cleanup (30-Day Retention)

BillToSheet automatically deletes conversion data older than 30 days (1 day for anonymous users) to protect privacy and comply with data retention policies.

### Option 1: API Route with External Cron (Recommended)

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com) to call your cleanup endpoint:

1. **Set up CRON_SECRET** in your `.env.local`:

```bash
CRON_SECRET=your-random-secret-key-here
```

2. **Create cron job** that calls:
   ```
   POST https://yourdomain.com/api/cleanup
   Authorization: Bearer your-random-secret-key-here
   ```

3. **Schedule**: Run daily (e.g., 3 AM UTC)

### Option 2: Server-Side Cron Job

If deploying to a VPS, set up a cron job on the server:

```bash
# Create cleanup script
nano /root/cleanup-conversions.sh
```

```bash
#!/bin/bash
cd /var/www/billtosheet
node scripts/cleanup-old-conversions.js
```

```bash
chmod +x /root/cleanup-conversions.sh

# Add to crontab (daily at 3 AM)
crontab -e
# Add line:
0 3 * * * /root/cleanup-conversions.sh >> /var/log/billtosheet-cleanup.log 2>&1
```

### Option 3: Vercel Cron (If Using Vercel)

If deploying to Vercel, add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

And set `CRON_SECRET` in Vercel environment variables.

### Testing Cleanup

Test the cleanup script manually:

```bash
# Preview what would be deleted (dry run)
npm run cleanup:dry-run

# Actually run cleanup
npm run cleanup
```

Or test the API endpoint:

```bash
# Preview (development only)
curl http://localhost:3000/api/cleanup

# Run cleanup (production)
curl -X POST https://yourdomain.com/api/cleanup \
  -H "Authorization: Bearer your-cron-secret"
```

## Security Hardening

### 1. Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

### 3. Setup Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Performance Optimization

### 1. Enable Nginx Caching

Add to nginx config inside `server` block:

```nginx
location /_next/static {
    alias /var/www/billtosheet/.next/static;
    expires 365d;
    access_log off;
}

location /static {
    alias /var/www/billtosheet/public;
    expires 30d;
    access_log off;
}
```

### 2. Enable Gzip Compression

Add to nginx config:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

Then restart nginx:

```bash
sudo systemctl restart nginx
```

## Monitoring & Alerts

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Server Monitoring

Consider installing:
- Digital Ocean monitoring agent (free)
- Netdata for real-time monitoring
- Uptime monitoring service (UptimeRobot, Pingdom)

## Troubleshooting

### Application Won't Start

```bash
pm2 logs billtosheet --lines 100
```

### Database Connection Issues

```bash
# Test connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Nginx Issues

```bash
sudo nginx -t  # Test config
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Renewal

Certbot auto-renews. Test renewal:

```bash
sudo certbot renew --dry-run
```

## Cost Estimate

Example monthly costs on Digital Ocean:

- **Basic Droplet** (1GB RAM, 1 vCPU): $6/month
- **Managed MySQL** (Basic): $15/month
- **Total**: ~$21/month

For higher traffic:
- **Standard Droplet** (2GB RAM, 2 vCPU): $12/month
- **Managed MySQL** (Standard): $30/month
- **Total**: ~$42/month

## Scaling Considerations

When traffic grows:

1. **Upgrade Droplet**: More CPU/RAM for Next.js app
2. **Scale Database**: Upgrade MySQL plan or add read replicas
3. **Add Load Balancer**: For multiple app instances
4. **Use CDN**: CloudFlare for static assets
5. **Separate Services**: Move database to dedicated server

## Support

For deployment issues:
- Check Digital Ocean Community tutorials
- Review PM2 documentation
- Check Nginx error logs
- Review application logs with `pm2 logs`

---

**Deployment Checklist:**

- [ ] MySQL database created and accessible
- [ ] Node.js 18+ installed
- [ ] Application code uploaded
- [ ] Production environment variables configured
- [ ] Database migrations run
- [ ] Application built successfully
- [ ] PM2 running application
- [ ] Nginx configured and SSL enabled
- [ ] Stripe webhook endpoint created
- [ ] Domain DNS pointing to server
- [ ] Firewall configured
- [ ] Backups scheduled
- [ ] Monitoring setup

Your BillToSheet application is now live! 🚀

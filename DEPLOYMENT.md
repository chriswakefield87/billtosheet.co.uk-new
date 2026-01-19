# Digital Ocean Deployment Guide

Complete guide to deploying BillToSheet on a Digital Ocean server.

## Prerequisites

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

# Database Management Guide

This guide covers how to access and manage the MySQL database for BillToSheet, including adding credits to users.

## Database Credentials

- **Database Name:** `billtosheet`
- **Database User:** `billtosheet`
- **Database Password:** `BtS2024!Secure#Pass`
- **Host:** `localhost`
- **Port:** `3306`

## Connection String

```
mysql://billtosheet:BtS2024!Secure%23Pass@localhost:3306/billtosheet
```

Note: The `#` in the password is URL-encoded as `%23` in the connection string.

## Method 1: Using the Add Credits Script (Recommended)

The easiest way to add credits to a user is using the provided script:

```bash
cd /var/www/billtosheet.co.uk
node scripts/add-credits.js <email> <amount>
```

### Examples

```bash
# Add 100 credits to a user
node scripts/add-credits.js user@example.com 100

# Add 50 credits to a user
node scripts/add-credits.js user@example.com 50
```

The script will:
- Find the user by email
- Add the specified amount to their current credit balance
- Display the new balance
- Show an error if the user is not found

## Method 2: Direct MySQL Access

### Connecting to MySQL

You can connect to MySQL directly via the terminal:

```bash
# Interactive connection (you'll be prompted for password)
mysql -u billtosheet -p billtosheet

# Or with password inline (less secure but convenient)
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet
```

### Useful SQL Commands

Once connected to MySQL, you can run the following commands:

#### View All Users

```sql
SELECT id, email, creditsBalance, createdAt FROM User;
```

#### View a Specific User

```sql
-- By email
SELECT * FROM User WHERE email = 'user@example.com';

-- By ID
SELECT * FROM User WHERE id = 'user-id-here';

-- By Clerk User ID
SELECT * FROM User WHERE clerkUserId = 'clerk-user-id';
```

#### Add Credits to a User

```sql
-- Add credits by email
UPDATE User SET creditsBalance = creditsBalance + 100 WHERE email = 'user@example.com';

-- Add credits by ID
UPDATE User SET creditsBalance = creditsBalance + 100 WHERE id = 'user-id-here';

-- Set credits to a specific amount (use with caution)
UPDATE User SET creditsBalance = 500 WHERE email = 'user@example.com';
```

#### View Credit Transactions

```sql
-- View recent credit transactions
SELECT * FROM CreditTransaction ORDER BY createdAt DESC LIMIT 20;

-- View transactions for a specific user
SELECT ct.*, u.email 
FROM CreditTransaction ct
JOIN User u ON ct.userId = u.id
WHERE u.email = 'user@example.com'
ORDER BY ct.createdAt DESC;
```

#### View User Conversions

```sql
-- View conversions for a specific user
SELECT c.*, u.email
FROM Conversion c
JOIN User u ON c.userId = u.id
WHERE u.email = 'user@example.com'
ORDER BY c.createdAt DESC;
```

#### Database Statistics

```sql
-- Total number of users
SELECT COUNT(*) as total_users FROM User;

-- Total credits across all users
SELECT SUM(creditsBalance) as total_credits FROM User;

-- Users with zero credits
SELECT email, creditsBalance FROM User WHERE creditsBalance = 0;

-- Top users by credit balance
SELECT email, creditsBalance FROM User ORDER BY creditsBalance DESC LIMIT 10;
```

#### Exit MySQL

```sql
exit;
```

## Database Schema

### User Table

- `id` (String, Primary Key) - UUID
- `clerkUserId` (String, Unique) - Clerk user ID
- `email` (String) - User email address
- `creditsBalance` (Int) - Current credit balance
- `createdAt` (DateTime) - Account creation date
- `updatedAt` (DateTime) - Last update timestamp

### Conversion Table

- `id` (String, Primary Key) - UUID
- `userId` (String, Foreign Key) - Links to User
- `anonymousId` (String) - For anonymous conversions
- `vendor` (String) - Invoice vendor
- `invoiceNumber` (String) - Invoice number
- `invoiceDate` (String) - Invoice date
- `currency` (String) - Currency code
- `total` (Float) - Invoice total
- `extractedData` (String) - JSON of extracted data
- `status` (String) - Conversion status
- `createdAt` (DateTime) - Conversion date

### CreditTransaction Table

- `id` (String, Primary Key) - UUID
- `userId` (String, Foreign Key) - Links to User
- `amount` (Int) - Credit amount (positive for purchases, negative for usage)
- `type` (String) - Transaction type
- `description` (String) - Transaction description
- `stripePaymentId` (String) - Stripe payment ID (if applicable)
- `createdAt` (DateTime) - Transaction date

## Quick Reference Commands

### One-liner Commands (without entering MySQL)

```bash
# View all users
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet -e "SELECT email, creditsBalance FROM User;"

# Add credits by email
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet -e "UPDATE User SET creditsBalance = creditsBalance + 100 WHERE email = 'user@example.com';"

# View specific user
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet -e "SELECT * FROM User WHERE email = 'user@example.com';"

# View recent transactions
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet -e "SELECT * FROM CreditTransaction ORDER BY createdAt DESC LIMIT 10;"
```

## Security Notes

⚠️ **Warning:** Using passwords on the command line can be insecure as they may appear in shell history. For production environments, consider:

1. Using MySQL's `.my.cnf` file for credentials
2. Using environment variables
3. Using the interactive `-p` flag (without password) and typing the password when prompted

### Creating a .my.cnf file (Optional)

Create `~/.my.cnf` with:

```ini
[client]
user=billtosheet
password=BtS2024!Secure#Pass
database=billtosheet
```

Then you can connect simply with:
```bash
mysql billtosheet
```

## Troubleshooting

### Connection Issues

If you can't connect, check:

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet -e "SELECT 1;"
```

### Permission Issues

If you get permission errors, you may need to use the root MySQL user:

```bash
sudo mysql -u root
```

Then grant permissions if needed:
```sql
GRANT ALL PRIVILEGES ON billtosheet.* TO 'billtosheet'@'localhost';
FLUSH PRIVILEGES;
```

## Backup and Restore

### Create a Backup

```bash
# Backup entire database
mysqldump -u billtosheet -p'BtS2024!Secure#Pass' billtosheet > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific table
mysqldump -u billtosheet -p'BtS2024!Secure#Pass' billtosheet User > user_backup.sql
```

### Restore from Backup

```bash
mysql -u billtosheet -p'BtS2024!Secure#Pass' billtosheet < backup_file.sql
```

---

**Last Updated:** January 2025

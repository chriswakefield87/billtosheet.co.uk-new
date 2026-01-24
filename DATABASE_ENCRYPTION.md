# Database Encryption at Rest

This document explains how to enable encryption at rest for your MySQL database to ensure your invoice data is securely stored.

## Overview

Encryption at rest protects your data when it's stored on disk. This is important for compliance (GDPR, PCI-DSS) and security best practices.

## Production (Managed Database Services)

Most managed database services provide encryption at rest by default or as an option:

### Digital Ocean Managed Database
- Encryption at rest is **enabled by default** for all managed databases
- No additional configuration needed
- Data is encrypted using AES-256

### AWS RDS
- Enable encryption when creating the database instance
- Select "Enable encryption" in the RDS console
- Uses AWS KMS for key management

### Google Cloud SQL
- Encryption at rest is **enabled by default**
- Uses Google-managed encryption keys
- Can optionally use customer-managed keys (CMEK)

### Other Providers
- Check your provider's documentation for encryption settings
- Most modern managed databases have encryption enabled by default

## Local Development (Docker)

For local development with Docker, you can enable MySQL encryption:

### Option 1: Enable MySQL Encryption (Recommended for Production-like Testing)

1. Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: billtosheet-mysql
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: billtosheet_root_pass
      MYSQL_DATABASE: billtosheet
      MYSQL_USER: billtosheet_user
      MYSQL_PASSWORD: billtosheet_pass
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-config:/etc/mysql/conf.d  # Add config directory
    command: 
      - --default-authentication-plugin=mysql_native_password
      - --early-plugin-load=keyring_file.so
      - --keyring_file_data=/var/lib/mysql-keyring/keyring
```

2. Create MySQL configuration file:

```bash
mkdir -p mysql-config
```

Create `mysql-config/encryption.cnf`:

```ini
[mysqld]
# Enable encryption for InnoDB tables
default_table_encryption=ON
# Enable encryption for system tables
encrypt_binlog=ON
```

3. Create keyring directory:

```bash
docker exec -it billtosheet-mysql mkdir -p /var/lib/mysql-keyring
docker exec -it billtosheet-mysql chown mysql:mysql /var/lib/mysql-keyring
```

4. Restart MySQL:

```bash
docker-compose restart mysql
```

### Option 2: Use Encrypted Volume (Simpler for Local Dev)

If you're using Docker volumes, you can encrypt the volume itself:

**macOS:**
- Docker Desktop uses encrypted disk images by default if FileVault is enabled

**Linux:**
- Use LUKS encryption for the Docker volume directory
- Or use encrypted filesystem for the Docker data directory

**Windows:**
- Use BitLocker to encrypt the drive where Docker stores volumes

## Application-Level Encryption (Optional)

For additional security, you can encrypt sensitive fields at the application level:

### Example: Encrypting extractedData Field

1. Install encryption library:

```bash
npm install crypto-js
npm install --save-dev @types/crypto-js
```

2. Create encryption utility:

```typescript
// lib/encryption.ts
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'your-secret-key-here'

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
```

3. Use in conversion creation:

```typescript
// Before saving
const encryptedData = encryptData(JSON.stringify(invoiceData))

// When reading
const decryptedData = JSON.parse(decryptData(conversion.extractedData))
```

**Note:** Application-level encryption adds complexity and performance overhead. Database-level encryption is usually sufficient.

## Verification

### Check if MySQL Encryption is Enabled

```sql
-- Check InnoDB encryption status
SHOW VARIABLES LIKE 'default_table_encryption';
-- Should show: default_table_encryption = ON

-- Check if tables are encrypted
SELECT 
  TABLE_SCHEMA,
  TABLE_NAME,
  CREATE_OPTIONS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'billtosheet'
  AND CREATE_OPTIONS LIKE '%ENCRYPTION%';
```

### Check Managed Database Encryption

- **Digital Ocean**: Check in database dashboard under "Settings" → "Encryption"
- **AWS RDS**: Check in RDS console under "Configuration" → "Encryption"
- **Google Cloud SQL**: Check in Cloud SQL console under "Overview" → "Encryption"

## Best Practices

1. **Use Managed Databases**: They handle encryption automatically
2. **Enable SSL/TLS**: Always use encrypted connections (`ssl-mode=REQUIRED` in DATABASE_URL)
3. **Secure Keys**: Never commit encryption keys to version control
4. **Key Rotation**: Rotate encryption keys periodically (managed services handle this)
5. **Backup Encryption**: Ensure backups are also encrypted
6. **Access Control**: Limit database access to only necessary services

## Environment Variables

For production, ensure your `DATABASE_URL` includes SSL:

```env
DATABASE_URL="mysql://user:password@host:3306/database?ssl-mode=REQUIRED"
```

## Compliance

Encryption at rest helps with:
- **GDPR**: Article 32 (Security of processing)
- **PCI-DSS**: Requirement 3.4 (Encrypt cardholder data)
- **SOC 2**: CC6.6 (Encryption requirements)
- **HIPAA**: Technical safeguards (if applicable)

## Summary

- **Production**: Use managed databases (encryption enabled by default)
- **Local Dev**: Use encrypted volumes or enable MySQL encryption
- **Connection**: Always use SSL/TLS (`ssl-mode=REQUIRED`)
- **Application**: Database-level encryption is usually sufficient

For most use cases, using a managed database service (Digital Ocean, AWS RDS, etc.) provides encryption at rest automatically with no additional configuration needed.

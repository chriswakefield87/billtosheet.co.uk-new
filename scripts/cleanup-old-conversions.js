/**
 * Standalone script to clean up old conversion data
 * 
 * Usage:
 *   node scripts/cleanup-old-conversions.js [--dry-run]
 * 
 * Options:
 *   --dry-run: Preview what would be deleted without actually deleting
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanupOldConversions(dryRun = false) {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    console.log('🧹 Starting cleanup of old conversions...')
    console.log(`   Current time: ${now.toISOString()}`)
    console.log(`   Logged-in users: deleting conversions older than ${thirtyDaysAgo.toISOString()}`)
    console.log(`   Anonymous users: deleting conversions older than ${oneDayAgo.toISOString()}`)
    console.log('')

    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No data will be deleted\n')

      // Count conversions that would be deleted
      const loggedInCount = await prisma.conversion.count({
        where: {
          userId: { not: null },
          createdAt: { lt: thirtyDaysAgo },
        },
      })

      const anonymousCount = await prisma.conversion.count({
        where: {
          userId: null,
          createdAt: { lt: oneDayAgo },
        },
      })

      console.log(`📊 Would delete:`)
      console.log(`   - ${loggedInCount} conversions from logged-in users (older than 30 days)`)
      console.log(`   - ${anonymousCount} conversions from anonymous users (older than 1 day)`)
      console.log(`   - Total: ${loggedInCount + anonymousCount} conversions`)
    } else {
      // Delete conversions older than 30 days for logged-in users
      const loggedInResult = await prisma.conversion.deleteMany({
        where: {
          userId: { not: null },
          createdAt: { lt: thirtyDaysAgo },
        },
      })

      // Delete conversions older than 1 day for anonymous users
      const anonymousResult = await prisma.conversion.deleteMany({
        where: {
          userId: null,
          createdAt: { lt: oneDayAgo },
        },
      })

      console.log(`✅ Cleanup completed:`)
      console.log(`   - Deleted ${loggedInResult.count} conversions from logged-in users`)
      console.log(`   - Deleted ${anonymousResult.count} conversions from anonymous users`)
      console.log(`   - Total deleted: ${loggedInResult.count + anonymousResult.count} conversions`)
    }

    console.log('')
    console.log('✨ Done!')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

cleanupOldConversions(dryRun)

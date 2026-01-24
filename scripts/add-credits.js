// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCredits(email, amount, clerkUserId = null) {
  try {
    // Find users by email
    const users = await prisma.user.findMany({
      where: clerkUserId 
        ? { clerkUserId: clerkUserId }
        : { email: email },
    });

    if (users.length === 0) {
      console.log(`❌ User not found.`);
      if (clerkUserId) {
        console.log(`   Searched by Clerk User ID: ${clerkUserId}`);
      } else {
        console.log(`   Searched by email: ${email}`);
        console.log(`💡 The user will automatically get 1 credit when they sign up.`);
      }
      return;
    }

    if (users.length > 1 && !clerkUserId) {
      console.log(`⚠️  Found ${users.length} users with email ${email}:`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. Clerk ID: ${user.clerkUserId}, Current Credits: ${user.creditsBalance}, Created: ${user.createdAt}`);
      });
      console.log(`\n💡 Adding credits to ALL users with this email...`);
    }

    // Add credits to all matching users
    for (const user of users) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsBalance: user.creditsBalance + amount,
        },
      });
      
      // Create credit transaction record
      await prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: amount,
          type: 'manual',
          description: `Manual credit addition via script`,
        },
      });

      console.log(`✅ Added ${amount} credits to ${email} (Clerk ID: ${user.clerkUserId})`);
      console.log(`   Previous balance: ${user.creditsBalance}, New balance: ${updatedUser.creditsBalance}`);
    }
  } catch (error) {
    console.error('Error adding credits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email/clerkUserId and credits from command line args
// Usage: node add-credits.js <email> <amount>
//    or: node add-credits.js --clerk <clerkUserId> <amount>
const args = process.argv.slice(2);

let email = null;
let clerkUserId = null;
let credits = 100;

if (args[0] === '--clerk' || args[0] === '-c') {
  clerkUserId = args[1];
  credits = parseInt(args[2]) || 100;
  console.log(`Adding ${credits} credits to Clerk User ID: ${clerkUserId}...`);
  addCredits(null, credits, clerkUserId);
} else {
  email = args[0] || 'wakey7dev@gmail.com';
  credits = parseInt(args[1]) || 100;
  console.log(`Adding ${credits} credits to ${email}...`);
  addCredits(email, credits);
}

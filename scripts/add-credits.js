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

async function addCredits(email, amount) {
  try {
    // Find user by email (using findFirst since email is not unique in schema)
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsBalance: user.creditsBalance + amount,
        },
      });
      console.log(`✅ Added ${amount} credits to ${email}`);
      console.log(`Current balance: ${updatedUser.creditsBalance} credits`);
    } else {
      console.log(`❌ User with email ${email} not found.`);
      console.log(`💡 The user will automatically get 1 credit when they sign up.`);
    }
  } catch (error) {
    console.error('Error adding credits:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email and credits from command line args
const email = process.argv[2] || 'wakey7dev@gmail.com';
const credits = parseInt(process.argv[3]) || 100;

console.log(`Adding ${credits} credits to ${email}...`);
addCredits(email, credits);

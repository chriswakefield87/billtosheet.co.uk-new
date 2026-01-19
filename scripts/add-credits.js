const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCredits(email, amount) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { email: email },
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

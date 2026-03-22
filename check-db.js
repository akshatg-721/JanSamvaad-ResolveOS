const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    });
    console.log('Users in DB:', users);
    
    // Check for operator specifically
    const operator = await prisma.user.findUnique({
      where: { email: 'operator' }
    });
    console.log('Operator user found:', !!operator);
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

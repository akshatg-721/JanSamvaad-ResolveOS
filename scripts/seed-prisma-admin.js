const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    const hash = await bcrypt.hash('operator', 10);
    const user = await prisma.user.upsert({
      where: { email: 'operator' },
      update: { password: hash },
      create: {
        email: 'operator',
        name: 'System Operator',
        password: hash,
        role: 'ADMIN',
      },
    });
    console.log('Seeded Admin:', user.email);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

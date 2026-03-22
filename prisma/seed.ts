const { PrismaClient, Role, ComplaintStatus, ComplaintCategory, Severity } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Reset DB
  await prisma.comment.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@resolveos.com',
      name: 'System Admin',
      phone: '9876543210',
      passwordHash,
      role: Role.ADMIN
    }
  });

  const official = await prisma.user.create({
    data: {
      email: 'official@mcd.gov',
      name: 'Ward Officer',
      passwordHash,
      role: Role.OFFICIAL
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'Rahul Sharma',
      phone: '9123456789',
      passwordHash,
      role: Role.USER
    }
  });

  // Create Complaints
  const complaint1 = await prisma.complaint.create({
    data: {
      title: 'Massive Pothole on Main Road',
      description: 'There is a huge pothole causing daily accidents.',
      category: ComplaintCategory.ROADS,
      severity: Severity.HIGH,
      status: ComplaintStatus.IN_PROGRESS,
      address: 'MG Road, near Metro Station',
      lat: 28.5355,
      lng: 77.3910,
      userId: user1.id,
      assignedToId: official.id,
      statusHistory: {
        create: [
          { fromStatus: ComplaintStatus.PENDING, toStatus: ComplaintStatus.ACKNOWLEDGED, changedById: admin.id },
          { fromStatus: ComplaintStatus.ACKNOWLEDGED, toStatus: ComplaintStatus.IN_PROGRESS, changedById: official.id }
        ]
      },
      attachments: {
        create: [
          {
            filename: 'pothole.jpg',
            cloudinaryId: 'seed-mock',
            url: 'https://placehold.co/600x400',
            mimeType: 'image/jpeg',
            size: 102400,
            userId: user1.id
          }
        ]
      }
    }
  });

  console.log(`Seeded complaint: ${complaint1.title}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

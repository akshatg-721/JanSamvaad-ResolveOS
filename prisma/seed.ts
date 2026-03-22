import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('?? Seeding database...');

  // Clean existing data
  await prisma.upvote.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Admin@123456', 10);
  const userPassword = await bcrypt.hash('User@123456', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@jansamvaad.gov.in', password: hashedPassword, name: 'Admin User', role: 'ADMIN', phone: '+91 98765 00001' },
  });

  const official = await prisma.user.create({
    data: { email: 'official@jansamvaad.gov.in', password: hashedPassword, name: 'Rajesh Kumar', role: 'OFFICIAL', phone: '+91 98765 00002' },
  });

  const user1 = await prisma.user.create({
    data: { email: 'rahul@example.com', password: userPassword, name: 'Rahul Sharma', role: 'USER', phone: '+91 98765 00003' },
  });

  const user2 = await prisma.user.create({
    data: { email: 'priya@example.com', password: userPassword, name: 'Priya Patel', role: 'USER', phone: '+91 98765 00004' },
  });

  const user3 = await prisma.user.create({
    data: { email: 'amit@example.com', password: userPassword, name: 'Amit Singh', role: 'USER', phone: '+91 98765 00005' },
  });

  console.log('? Users created');

  // Create complaints
  const complaints = [
    { title: 'Massive pothole on MG Road causing accidents daily', description: 'There is a very large pothole near MG Road junction that has been causing multiple accidents. Several two-wheelers have fallen and people have been injured. The pothole is about 2 feet deep and 3 feet wide. This needs immediate attention from the road maintenance department. Multiple complaints have been filed but no action taken so far.', category: 'ROADS', status: 'PENDING', userId: user1.id, location: { address: 'MG Road Junction', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' } },
    { title: 'No water supply in Sector 15 for the past 3 days', description: 'Residents of Sector 15 have been without water supply for the past 3 days. Multiple families are affected and people are forced to buy water from tankers at very high prices. The water board has not responded to any calls or complaints. This is a basic necessity and needs immediate resolution.', category: 'WATER', status: 'ACKNOWLEDGED', userId: user2.id, location: { address: 'Sector 15, Block C', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301' } },
    { title: 'Street lights not working on entire NH-48 stretch', description: 'All the street lights on the NH-48 highway stretch from Toll Plaza to City Mall are not functioning for the past 2 weeks. This is causing major safety concerns especially for women and elderly commuters during night time. There have been 3 chain snatching incidents in this dark stretch already.', category: 'ELECTRICITY', status: 'IN_PROGRESS', userId: user1.id, location: { address: 'NH-48 Highway', city: 'Gurugram', state: 'Haryana', pincode: '122001' } },
    { title: 'Garbage overflow near City Park entrance', description: 'The garbage bins near City Park main entrance have been overflowing for a week. The stench is unbearable and it is attracting stray dogs and rats. Residents nearby are complaining of health issues. The municipal corporation garbage collection truck has not visited this area for over 10 days.', category: 'SANITATION', status: 'RESOLVED', userId: user3.id, location: { address: 'City Park, Main Gate', city: 'Bangalore', state: 'Karnataka', pincode: '560001' } },
    { title: 'Broken footpath near Central Metro Station dangerously uneven', description: 'The footpath near Central Metro Station exit is severely broken and uneven. Senior citizens and people with disabilities find it extremely difficult to walk. During monsoon, water accumulates in the broken areas making it even more dangerous. Multiple pedestrians have tripped and fallen.', category: 'ROADS', status: 'PENDING', userId: user2.id, location: { address: 'Central Metro Station', city: 'Delhi', state: 'Delhi', pincode: '110001' } },
    { title: 'Contaminated water supply causing illness in Ward 7', description: 'Multiple families in Ward 7 have reported falling ill after consuming tap water. The water appears yellowish and has a foul smell. At least 15 children have been hospitalized with waterborne diseases. Urgent water quality testing and alternative supply arrangement is needed immediately.', category: 'WATER', status: 'IN_PROGRESS', userId: user1.id, location: { address: 'Ward 7, Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040' } },
    { title: 'Continuous power outage for 12+ hours daily', description: 'Our area has been experiencing power cuts of more than 12 hours every day for the past month. This is severely affecting work from home professionals, students preparing for exams, and elderly people who depend on medical equipment. The electricity board has not provided any explanation or timeline for resolution.', category: 'ELECTRICITY', status: 'ACKNOWLEDGED', userId: user3.id, location: { address: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033' } },
    { title: 'Open drain near school causing health hazard for children', description: 'There is an open drain running right next to the Government Primary School boundary wall. The drain is overflowing with sewage and the smell is making children sick. Several parents have stopped sending children to school due to health concerns. This drain needs to be covered or redirected immediately.', category: 'SANITATION', status: 'PENDING', userId: user2.id, location: { address: 'Near Govt Primary School, Salt Lake', city: 'Kolkata', state: 'West Bengal', pincode: '700064' } },
    { title: 'Bus stop shelter completely destroyed by storm', description: 'The bus stop shelter at Shivaji Nagar junction was completely destroyed in last week storm. Commuters are now standing in the open sun and rain while waiting for buses. The metal debris from the broken shelter is also a safety hazard. A new shelter needs to be installed urgently.', category: 'TRANSPORTATION', status: 'PENDING', userId: user1.id, location: { address: 'Shivaji Nagar Junction', city: 'Pune', state: 'Maharashtra', pincode: '411005' } },
    { title: 'No pedestrian crossing signal at busy intersection near school', description: 'The intersection near DPS School on Tonk Road has no pedestrian crossing signal. Children crossing the road during school hours are at extreme risk. Last month a child was hit by a speeding car at this crossing. We urgently need a pedestrian signal, speed breakers, and a school zone marking here.', category: 'PUBLIC_SAFETY', status: 'RESOLVED', userId: user3.id, location: { address: 'Tonk Road, near DPS School', city: 'Jaipur', state: 'Rajasthan', pincode: '302015' } },
  ];

  for (const data of complaints) {
    const complaint = await prisma.complaint.create({ data: data as any });

    // Add status history for non-pending complaints
    if (data.status !== 'PENDING') {
      await prisma.statusHistory.create({
        data: {
          complaintId: complaint.id,
          fromStatus: 'PENDING',
          toStatus: data.status as any,
          changedById: official.id,
          comment: `Status updated to ${data.status}`,
        },
      });
    }

    // Add some upvotes
    const upvoters = [user1, user2, user3].filter((u) => u.id !== data.userId);
    if (Math.random() > 0.3) {
      await prisma.upvote.create({
        data: { complaintId: complaint.id, userId: upvoters[0].id },
      });
    }
    if (Math.random() > 0.5) {
      await prisma.upvote.create({
        data: { complaintId: complaint.id, userId: upvoters[1].id },
      });
    }
  }

  console.log('? Complaints created');
  console.log('');
  console.log('?? Seeding complete!');
  console.log('');
  console.log('?? Login credentials:');
  console.log('  Admin:    admin@jansamvaad.gov.in / Admin@123456');
  console.log('  Official: official@jansamvaad.gov.in / Admin@123456');
  console.log('  User:     rahul@example.com / User@123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

import { PrismaClient, ComplaintCategory, ComplaintStatus } from '../src/generated/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const usersSeed = [
  { email: 'admin@jansamvaad.gov.in', name: 'System Admin', password: 'Admin@123456', role: 'ADMIN' as const, phone: '+919900000001' },
  { email: 'official@jansamvaad.gov.in', name: 'Ward Official', password: 'Official@123456', role: 'OFFICIAL' as const, phone: '+919900000002' },
  { email: 'rahul@example.com', name: 'Rahul Sharma', password: 'User@123456', role: 'USER' as const, phone: '+919900000003' },
  { email: 'priya@example.com', name: 'Priya Verma', password: 'User@123456', role: 'USER' as const, phone: '+919900000004' },
  { email: 'amit@example.com', name: 'Amit Kumar', password: 'User@123456', role: 'USER' as const, phone: '+919900000005' },
];

const complaintsSeed = [
  {
    title: 'Pothole near Connaught Place Outer Circle',
    description: 'Large pothole causing frequent traffic jams and bike skids near Gate 3. Needs urgent repair before monsoon.',
    category: 'ROADS' as ComplaintCategory,
    status: 'PENDING' as ComplaintStatus,
    priority: 3,
    location: { address: 'Connaught Place, New Delhi', city: 'New Delhi', state: 'Delhi', pincode: '110001', lat: 28.6315, lng: 77.2167 },
  },
  {
    title: 'Water leakage from pipeline in Lajpat Nagar',
    description: 'Continuous leakage from underground pipeline for 48 hours. Water is flooding side lane and affecting shops.',
    category: 'WATER' as ComplaintCategory,
    status: 'IN_PROGRESS' as ComplaintStatus,
    priority: 2,
    location: { address: 'Lajpat Nagar Central Market, Delhi', city: 'New Delhi', state: 'Delhi', pincode: '110024', lat: 28.5677, lng: 77.2431 },
  },
  {
    title: 'Street lights not working on MG Road',
    description: 'Around 12 street lights are non-functional from metro station to service road, creating safety issues at night.',
    category: 'ELECTRICITY' as ComplaintCategory,
    status: 'ACKNOWLEDGED' as ComplaintStatus,
    priority: 2,
    location: { address: 'MG Road, Gurugram', city: 'Gurugram', state: 'Haryana', pincode: '122002', lat: 28.4691, lng: 77.0878 },
  },
  {
    title: 'Garbage not collected in Koramangala 5th Block',
    description: 'Garbage bins overflowing for three days. Stray animals are scattering waste and causing foul smell.',
    category: 'SANITATION' as ComplaintCategory,
    status: 'RESOLVED' as ComplaintStatus,
    priority: 1,
    location: { address: 'Koramangala 5th Block, Bangalore', city: 'Bengaluru', state: 'Karnataka', pincode: '560095', lat: 12.9349, lng: 77.6202 },
  },
  {
    title: 'Illegal encroachment blocking footpath in Andheri',
    description: 'Temporary stalls have blocked full sidewalk making pedestrians walk on road near station entrance.',
    category: 'PUBLIC_SAFETY' as ComplaintCategory,
    status: 'PENDING' as ComplaintStatus,
    priority: 2,
    location: { address: 'Andheri East Station Road, Mumbai', city: 'Mumbai', state: 'Maharashtra', pincode: '400069', lat: 19.1136, lng: 72.8697 },
  },
  {
    title: 'Broken traffic signal at Banjara Hills Junction',
    description: 'Signal light timers are malfunctioning and conflicting. Multiple near-miss incidents reported in peak hours.',
    category: 'TRANSPORTATION' as ComplaintCategory,
    status: 'IN_PROGRESS' as ComplaintStatus,
    priority: 3,
    location: { address: 'Road No. 1, Banjara Hills, Hyderabad', city: 'Hyderabad', state: 'Telangana', pincode: '500034', lat: 17.4193, lng: 78.4385 },
  },
  {
    title: 'Open manhole near Salt Lake Sector V',
    description: 'Uncovered manhole in service lane posing severe hazard for commuters and two-wheelers.',
    category: 'PUBLIC_SAFETY' as ComplaintCategory,
    status: 'ACKNOWLEDGED' as ComplaintStatus,
    priority: 3,
    location: { address: 'Sector V, Salt Lake, Kolkata', city: 'Kolkata', state: 'West Bengal', pincode: '700091', lat: 22.5767, lng: 88.4316 },
  },
  {
    title: 'Drainage overflow in Anna Nagar',
    description: 'Sewage mixed water overflowing from stormwater drain after light rain. Needs immediate cleaning.',
    category: 'SANITATION' as ComplaintCategory,
    status: 'PENDING' as ComplaintStatus,
    priority: 2,
    location: { address: 'Anna Nagar West, Chennai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', lat: 13.0878, lng: 80.207 },
  },
  {
    title: 'Intermittent power cut in Kothrud',
    description: 'Power outage occurs every evening around 7 PM for 20-30 minutes affecting residential blocks.',
    category: 'ELECTRICITY' as ComplaintCategory,
    status: 'RESOLVED' as ComplaintStatus,
    priority: 1,
    location: { address: 'Kothrud, Pune', city: 'Pune', state: 'Maharashtra', pincode: '411038', lat: 18.5074, lng: 73.8077 },
  },
  {
    title: 'Road shoulder collapse near Sabarmati bridge',
    description: 'Portion of side shoulder has collapsed due to drainage erosion. Vehicles forced into single lane.',
    category: 'ROADS' as ComplaintCategory,
    status: 'IN_PROGRESS' as ComplaintStatus,
    priority: 3,
    location: { address: 'Sabarmati Riverfront Road, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', pincode: '380005', lat: 23.0395, lng: 72.5668 },
  },
];

async function main() {
  const seededUsers: Record<string, string> = {};

  for (const entry of usersSeed) {
    const hash = await bcrypt.hash(entry.password, 10);
    const user = await prisma.user.upsert({
      where: { email: entry.email },
      update: {
        name: entry.name,
        phone: entry.phone,
        role: entry.role,
      },
      create: {
        email: entry.email,
        name: entry.name,
        phone: entry.phone,
        role: entry.role,
        password: hash,
      },
    });
    seededUsers[entry.email] = user.id;
  }

  const adminId = seededUsers['admin@jansamvaad.gov.in'];
  const officialId = seededUsers['official@jansamvaad.gov.in'];
  const citizenIds = [
    seededUsers['rahul@example.com'],
    seededUsers['priya@example.com'],
    seededUsers['amit@example.com'],
  ];

  for (let i = 0; i < complaintsSeed.length; i++) {
    const entry = complaintsSeed[i];
    const existing = await prisma.complaint.findFirst({ where: { title: entry.title } });
    if (existing) continue;

    const userId = citizenIds[i % citizenIds.length];

    const complaint = await prisma.complaint.create({
      data: {
        title: entry.title,
        description: entry.description,
        category: entry.category,
        status: entry.status,
        priority: entry.priority,
        location: entry.location,
        userId,
        assignedToId: i % 2 === 0 ? officialId : null,
        resolvedAt: entry.status === 'RESOLVED' ? new Date() : null,
      },
    });

    await prisma.statusHistory.create({
      data: {
        complaintId: complaint.id,
        fromStatus: 'PENDING',
        toStatus: entry.status,
        changedById: officialId,
        comment: `Seeded transition to ${entry.status}`,
      },
    });

    if (i % 2 === 0) {
      await prisma.upvote.createMany({
        data: citizenIds
          .filter((uid) => uid !== userId)
          .slice(0, 2)
          .map((uid) => ({ complaintId: complaint.id, userId: uid })),
        skipDuplicates: true,
      });
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
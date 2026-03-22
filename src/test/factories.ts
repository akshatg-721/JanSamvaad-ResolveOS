import { faker } from '@faker-js/faker';

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    role: 'USER',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function createMockComplaint(overrides = {}) {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    description: faker.lorem.paragraphs(2),
    category: faker.helpers.arrayElement([
      'ROADS', 'WATER', 'ELECTRICITY', 'SANITATION',
      'PUBLIC_SAFETY', 'TRANSPORTATION', 'OTHER',
    ]),
    status: faker.helpers.arrayElement([
      'PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED',
    ]),
    location: {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      pincode: faker.location.zipCode(),
    },
    userId: faker.string.uuid(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    user: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    attachments: [],
    _count: {
      upvotes: faker.number.int({ min: 0, max: 50 }),
    },
    ...overrides,
  };
}

export function createMockAttachment(overrides = {}) {
  return {
    id: faker.string.uuid(),
    filename: faker.system.fileName(),
    url: faker.image.url(),
    thumbnailUrl: faker.image.url(),
    mimeType: 'image/jpeg',
    size: faker.number.int({ min: 10000, max: 5000000 }),
    userId: faker.string.uuid(),
    complaintId: faker.string.uuid(),
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

export function createMockStats(overrides = {}) {
  return {
    total: faker.number.int({ min: 10, max: 100 }),
    pending: faker.number.int({ min: 2, max: 20 }),
    resolved: faker.number.int({ min: 5, max: 40 }),
    inProgress: faker.number.int({ min: 3, max: 15 }),
    myComplaints: faker.number.int({ min: 1, max: 10 }),
    byCategory: {
      ROADS: faker.number.int({ min: 1, max: 10 }),
      WATER: faker.number.int({ min: 1, max: 10 }),
      ELECTRICITY: faker.number.int({ min: 1, max: 10 }),
    },
    recentComplaints: Array.from({ length: 5 }, () => createMockComplaint()),
    ...overrides,
  };
}

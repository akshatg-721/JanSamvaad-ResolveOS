import { faker } from "@faker-js/faker";

export function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: "USER",
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

export function createMockComplaint(overrides: Record<string, unknown> = {}) {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 5, max: 10 }),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement([
      "ROADS",
      "WATER",
      "ELECTRICITY",
      "SANITATION",
      "PUBLIC_SAFETY",
      "TRANSPORTATION",
      "OTHER",
    ]),
    status: faker.helpers.arrayElement(["PENDING", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"]),
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

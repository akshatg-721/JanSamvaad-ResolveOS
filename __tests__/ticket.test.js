const mockClient = {
  query: jest.fn(),
  release: jest.fn()
};

const mockConnect = jest.fn();

jest.mock('../src/db', () => ({
  connect: mockConnect
}));

const { createTicket, isSlaBreached, setIo } = require('../src/crm/ticket');

describe('createTicket SLA deadline calculation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockConnect.mockResolvedValue(mockClient);
    setIo({ emit: jest.fn() });

    mockClient.query.mockImplementation((sql, params) => {
      if (sql === 'BEGIN') {
        return Promise.resolve({});
      }

      if (sql === 'COMMIT') {
        return Promise.resolve({});
      }

      if (sql === 'ROLLBACK') {
        return Promise.resolve({});
      }

      if (typeof sql === 'string' && sql.includes('INTERVAL \'1 hour\'')) {
        return Promise.resolve({ rows: [] });
      }

      if (typeof sql === 'string' && sql.includes('SELECT id FROM contacts')) {
        return Promise.resolve({ rows: [{ id: 99 }] });
      }

      if (typeof sql === 'string' && sql.includes('INSERT INTO tickets')) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              contact_id: 99,
              ref: 'JS-TEST01',
              category: params[2],
              ward_id: params[3],
              severity: params[4],
              status: 'open',
              sla_deadline: params[6],
              created_at: new Date()
            }
          ]
        });
      }

      return Promise.resolve({ rows: [] });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets a 24-hour SLA deadline for Medium severity', async () => {
    await createTicket('+919999999999', {
      category: 'Water',
      ward_id: 1,
      severity: 'Medium'
    });

    const insertCall = mockClient.query.mock.calls.find(
      ([sql]) => typeof sql === 'string' && sql.includes('INSERT INTO tickets')
    );
    const slaDeadline = insertCall[1][6];
    const now = new Date('2026-01-01T00:00:00.000Z');
    const hours = (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    expect(hours).toBe(24);
  });

  it('sets a 48-hour SLA deadline for Low severity', async () => {
    await createTicket('+919999999999', {
      category: 'Sanitation',
      ward_id: 2,
      severity: 'Low'
    });

    const insertCall = mockClient.query.mock.calls.find(
      ([sql]) => typeof sql === 'string' && sql.includes('INSERT INTO tickets')
    );
    const slaDeadline = insertCall[1][6];
    const now = new Date('2026-01-01T00:00:00.000Z');
    const hours = (slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    expect(hours).toBe(48);
  });

  it('flags ticket as breached when SLA deadline is in the past', () => {
    const pastDeadline = new Date('2025-12-31T23:00:00.000Z');
    expect(isSlaBreached(pastDeadline)).toBe(true);
  });

  it('rolls back transaction when ticket insert fails', async () => {
    mockClient.query.mockImplementation((sql) => {
      if (sql === 'BEGIN') {
        return Promise.resolve({});
      }

      if (sql === 'ROLLBACK') {
        return Promise.resolve({});
      }

      if (typeof sql === 'string' && sql.includes('INTERVAL \'1 hour\'')) {
        return Promise.resolve({ rows: [] });
      }

      if (typeof sql === 'string' && sql.includes('SELECT id FROM contacts')) {
        return Promise.resolve({ rows: [{ id: 99 }] });
      }

      if (typeof sql === 'string' && sql.includes('INSERT INTO tickets')) {
        return Promise.reject(new Error('db insert failed'));
      }

      return Promise.resolve({ rows: [] });
    });

    await expect(
      createTicket('+919999999999', {
        category: 'Water',
        ward_id: 1,
        severity: 'Medium'
      })
    ).rejects.toThrow('db insert failed');

    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });
});

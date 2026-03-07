process.env.NODE_ENV = 'test';
process.env.ENABLE_SLA_CRON = 'false';

const request = require('supertest');

const mockQuery = jest.fn();
const mockConnect = jest.fn();

jest.mock('../src/db', () => ({
  query: (...args) => mockQuery(...args),
  connect: (...args) => mockConnect(...args)
}));

const { app } = require('../server');

describe('api integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health returns 200 with status ok', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.uptime).toBe('number');
  });

  it('GET /api/stats returns open closed slaHitRate', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ open: 5, closed: 10, breach_risk: 2 }]
    });

    const response = await request(app).get('/api/stats').expect(200);
    expect(response.body).toEqual({
      open: 5,
      closed: 10,
      breach_risk: 2,
      slaHitRate: '66.7%'
    });
  });

  it('GET /api/tickets returns masked phone numbers', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          ref: 'JS-AAA111',
          category: 'Water',
          severity: 'Medium',
          status: 'open',
          sla_deadline: null,
          evidence_url: null,
          created_at: new Date().toISOString(),
          ward_id: 1,
          phone: '+919876543210'
        }
      ]
    });

    const response = await request(app).get('/api/tickets').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].phone).toBe('+91******3210');
  });

  it('POST /api/evidence/upload returns url and hash', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 10,
          ref: 'JS-UP1234',
          evidence_url: 'http://localhost:3000/evidence/hash'
        }
      ]
    });

    const response = await request(app)
      .post('/api/evidence/upload')
      .send({ ticket_id: 10 })
      .expect(200);

    expect(typeof response.body.url).toBe('string');
    expect(typeof response.body.hash).toBe('string');
  });
});

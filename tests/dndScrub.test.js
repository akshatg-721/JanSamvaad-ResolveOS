const express = require('express');
const request = require('supertest');

const {
  isDndNumber,
  addToDnd,
  clearDndList
} = require('../lib/dndScrub');

describe('dnd scrub library', () => {
  beforeEach(() => {
    clearDndList();
  });

  it('returns true when number exists in DND list', async () => {
    addToDnd('+919123456789');
    await expect(isDndNumber('+919123456789')).resolves.toBe(true);
  });

  it('returns false for unknown number', async () => {
    addToDnd('+919123456789');
    await expect(isDndNumber('+919000000000')).resolves.toBe(false);
  });
});

describe('voice flow dnd guard', () => {
  it('calls isDndNumber before call proceeds', async () => {
    const mockedIsDndNumber = jest.fn().mockResolvedValue(true);

    jest.resetModules();
    jest.doMock('../lib/dndScrub', () => ({
      isDndNumber: mockedIsDndNumber
    }));
    jest.doMock('../src/db', () => ({
      query: jest.fn()
    }));
    jest.doMock('../src/services/llm', () => ({
      transcribeAudio: jest.fn(),
      extractIntent: jest.fn()
    }));
    jest.doMock('../src/crm/ticket', () => ({
      createTicket: jest.fn()
    }));

    const voiceRouter = require('../src/webhooks/voice');
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(voiceRouter);

    await request(app)
      .post('/voice')
      .type('form')
      .send({ From: '+919123456789' })
      .expect(200);

    expect(mockedIsDndNumber).toHaveBeenCalledWith('+919123456789');
  });
});

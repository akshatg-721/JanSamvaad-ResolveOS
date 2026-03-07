const fs = require('fs');

const dndNumbers = new Set();

function normalizePhone(phoneNumber) {
  return String(phoneNumber || '').replace(/\s+/g, '').trim();
}

function loadFromEnv() {
  const raw = process.env.DND_LIST || '';
  const entries = raw
    .split(',')
    .map((value) => normalizePhone(value))
    .filter(Boolean);

  for (const phone of entries) {
    dndNumbers.add(phone);
  }
}

async function isDndNumber(phoneNumber) {
  return dndNumbers.has(normalizePhone(phoneNumber));
}

function addToDnd(phone) {
  const normalized = normalizePhone(phone);
  if (normalized) {
    dndNumbers.add(normalized);
  }
}

function loadDndFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content
    .split(/\r?\n/g)
    .map((value) => normalizePhone(value))
    .filter(Boolean);

  for (const phone of lines) {
    dndNumbers.add(phone);
  }
}

function clearDndList() {
  dndNumbers.clear();
}

loadFromEnv();

module.exports = {
  isDndNumber,
  addToDnd,
  loadDndFromFile,
  clearDndList
};

CREATE TABLE IF NOT EXISTS wards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  consent BOOLEAN NOT NULL DEFAULT TRUE,
  dnd BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  ref VARCHAR(20) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  ward_id INTEGER REFERENCES wards(id) ON DELETE SET NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('High', 'Medium', 'Low')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  sla_deadline TIMESTAMPTZ,
  evidence_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS call_consents (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  consented BOOLEAN NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_contact_id ON tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_deadline ON tickets(sla_deadline);
CREATE INDEX IF NOT EXISTS idx_call_consents_phone ON call_consents(phone);

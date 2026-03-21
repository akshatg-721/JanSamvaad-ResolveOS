CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'in_progress', 'resolved', 'closed')),
  sla_deadline TIMESTAMPTZ,
  evidence_url TEXT,
  resolve_token VARCHAR(64),
  feedback_rating INTEGER,
  feedback_text TEXT,
  sentiment VARCHAR(20),
  frustration_level VARCHAR(20),
  detected_language VARCHAR(50),
  translated_text TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geo_address TEXT,
  location_accuracy VARCHAR(50),
  nearby_landmarks TEXT,
  weather_condition VARCHAR(50),
  temperature DECIMAL(5, 2),
  weather_boosted BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tickets_updated_at') THEN
    CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;

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

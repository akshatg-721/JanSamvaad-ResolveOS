-- Ensure you are connected to the correct database before running this script.

-- Insert a demo contact if not exists
INSERT INTO contacts (phone, consent, dnd) VALUES (
  '+919876543210', TRUE, FALSE
) ON CONFLICT (phone) DO NOTHING;

-- Insert demo tickets (Assuming some ward_ids exist, e.g., 1, 2, 3)
-- If ward_ids are different, adjust accordingly.
INSERT INTO tickets (contact_id, ref, category, severity, status, sla_deadline, created_at, ward_id)
VALUES
(
  (SELECT id FROM contacts WHERE phone = '+919876543210'),
  'JS-DEMO1',
  'road',
  'High',
  'open',
  NOW() + INTERVAL '12 hours',
  NOW() - INTERVAL '2 days',
  1
),
(
  (SELECT id FROM contacts WHERE phone = '+919876543210'),
  'JS-DEMO2',
  'sanitation',
  'Medium',
  'open',
  NOW() + INTERVAL '24 hours',
  NOW() - INTERVAL '1 day',
  2
),
(
  (SELECT id FROM contacts WHERE phone = '+919876543210'),
  'JS-DEMO3',
  'electricity',
  'Low',
  'closed',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '3 days',
  3
) ON CONFLICT (ref) DO NOTHING;

-- Update updated_at for existing rows to ensure consistency
UPDATE tickets SET updated_at = created_at WHERE updated_at IS NULL;

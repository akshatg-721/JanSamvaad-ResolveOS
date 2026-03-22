// Dashboard section identifiers — shared by Sidebar, Header, and demo/page
export type Section = "overview" | "gis" | "ledger" | "activity" | "analytics" | "settings";

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status   = 'OPEN' | 'IN-PROGRESS' | 'RESOLVED';
export type Category = string;

export interface Grievance {
  id: string;
  refId: string;
  category: Category;
  severity: Severity;
  ward: string;
  wardName: string;
  status: Status;
  slaTimer: string;
  slaSeconds: number;
  description: string;
  transcript: string;
  language: string;
  citizenPhone: string;
  coordinates: [number, number];
  createdAt: string;
  assignedTo: string;
  evidence: string[];
  hash: string;
  resolvedAt?: string;
  resolutionNote?: string;
  upvotes?: number;
}

export interface ApiTicket {
  id: number;
  ref: string;
  category: string;
  ward_id: number;
  severity: string;
  status: string;
  sla_deadline: string | null;
  created_at: string;
  evidence_url: string | null;
  phone: string | null;
}

export function mapTicket(t: ApiTicket): Grievance {
  const rawStatus = t.status?.toLowerCase() ?? 'open';
  let status: Status = 'OPEN';
  if (rawStatus === 'closed' || rawStatus === 'resolved') status = 'RESOLVED';
  else if (rawStatus === 'in-progress' || rawStatus === 'in_progress') status = 'IN-PROGRESS';

  const rawSev = (t.severity ?? 'LOW').toUpperCase() as Severity;
  const severity: Severity = ['CRITICAL','HIGH','MEDIUM','LOW'].includes(rawSev) ? rawSev : 'LOW';

  let slaTimer = '—';
  let slaSeconds = 0;
  if (t.sla_deadline && status !== 'RESOLVED') {
    const diff = new Date(t.sla_deadline).getTime() - Date.now();
    if (diff > 0) {
      slaSeconds = Math.floor(diff / 1000);
      const h = Math.floor(slaSeconds / 3600);
      const m = Math.floor((slaSeconds % 3600) / 60);
      const s = slaSeconds % 60;
      slaTimer = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    } else {
      slaTimer = 'BREACHED';
    }
  }

  return {
    id: String(t.id),
    refId: t.ref,
    category: (t.category ?? 'Sanitation') as Grievance['category'],
    severity,
    ward: `Ward ${t.ward_id ?? '?'}`,
    wardName: `Ward ${t.ward_id}`,
    status,
    slaTimer,
    slaSeconds,
    description: 'No detailed description available.',
    transcript: 'No transcript provided.',
    language: 'Hindi',
    citizenPhone: t.phone ?? 'N/A',
    coordinates: [28.6139, 77.2090], // Default coords for Delhi
    createdAt: new Date(t.created_at).toLocaleString('en-IN'),
    assignedTo: 'Pending Assignment',
    evidence: t.evidence_url ? [t.evidence_url] : [],
    hash: '0x000000000...',
    upvotes: 0,
  };
}

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';
import { Grievance, Severity, Status, ApiTicket, mapTicket } from '../types';

type FilterStatus = 'ALL' | Status;

const SEV: Record<Severity, { color: string; bg: string; label: string }> = {
  CRITICAL: { color: 'var(--red)',    bg: 'var(--red-bg)',    label: 'CRITICAL' },
  HIGH:     { color: 'var(--orange)', bg: 'var(--orange-bg)', label: 'HIGH' },
  MEDIUM:   { color: 'var(--amber)',  bg: 'var(--amber-bg)',  label: 'MEDIUM' },
  LOW:      { color: 'var(--ink-3)',  bg: 'var(--bg-raised)', label: 'LOW' },
};

function Dot({ sev }: { sev: Severity }) {
  return (
    <span style={{
      display: 'inline-block',
      width: '5px', height: '5px',
      borderRadius: '50%',
      background: SEV[sev].color,
      flexShrink: 0,
      marginRight: '5px',
    }} />
  );
}

function SevBadge({ s }: { s: Severity }) {
  const c = SEV[s];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--f-mono)',
      fontSize: '9px', letterSpacing: '0.1em',
      color: c.color, background: c.bg,
      padding: '3px 7px',
      border: `1px solid ${c.color}33`,
    }}>
      <Dot sev={s} />
      {s}
    </span>
  );
}

function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, { fg: string; bg: string; border: string }> = {
    OPEN:         { fg: 'var(--ink-2)',  bg: 'transparent',        border: 'var(--border)' },
    'IN-PROGRESS':{ fg: 'var(--orange)',bg: 'var(--orange-bg)',    border: 'var(--orange)' },
    RESOLVED:     { fg: 'var(--green)', bg: 'var(--green-bg)',     border: 'var(--green)' },
  };
  const c = map[s];
  return (
    <span style={{
      fontFamily: 'var(--f-mono)',
      fontSize: '9px', letterSpacing: '0.08em',
      color: c.fg, background: c.bg,
      padding: '3px 7px',
      border: `1px solid ${c.border}66`,
    }}>
      {s}
    </span>
  );
}

/* ── Evidence / Detail modal ── */
function Modal({ gr, onClose, onResolve }: {
  gr: Grievance;
  onClose: () => void;
  onResolve: (id: string) => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(24,24,26,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          width: '500px',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
      >
        {/* modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 22px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--f-serif)',
              fontSize: '22px', fontStyle: 'italic',
              color: 'var(--ink)',
            }}>{gr.refId}</span>
            <SevBadge s={gr.severity} />
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '18px', color: 'var(--ink-3)', lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ padding: '22px' }}>
          {/* meta row */}
          <div style={{
            display: 'flex', gap: '24px', flexWrap: 'wrap',
            marginBottom: '22px',
            paddingBottom: '18px',
            borderBottom: '1px solid var(--border)',
          }}>
            {[
              { l: 'CATEGORY',  v: gr.category },
              { l: 'WARD',      v: `${gr.ward} · ${gr.wardName}` },
              { l: 'STATUS',    v: gr.status },
              { l: 'SLA TIMER', v: gr.slaTimer },
              { l: 'ASSIGNED',  v: gr.assignedTo },
              { l: 'FILED',     v: gr.createdAt },
            ].map(row => (
              <div key={row.l}>
                <div style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '9px', color: 'var(--ink-4)',
                  letterSpacing: '0.12em', marginBottom: '3px',
                }}>{row.l}</div>
                <div style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '11px', color: 'var(--ink)',
                }}>{row.v}</div>
              </div>
            ))}
          </div>

          {/* transcript */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-4)',
              letterSpacing: '0.12em', marginBottom: '8px',
            }}>
              AI TRANSCRIPT — {gr.language}
            </div>
            <blockquote style={{
              borderLeft: '2px solid var(--border-hi)',
              paddingLeft: '14px',
              fontFamily: 'var(--f-serif)',
              fontSize: '14px', fontStyle: 'italic',
              color: 'var(--ink-2)', lineHeight: 1.65,
              background: 'var(--bg-raised)',
              padding: '12px 14px',
              margin: 0,
            }}>
              &ldquo;{gr.transcript}&rdquo;
            </blockquote>
          </div>

          {/* description */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-4)',
              letterSpacing: '0.12em', marginBottom: '8px',
            }}>DESCRIPTION</div>
            <p style={{
              fontSize: '12px', color: 'var(--ink-2)',
              lineHeight: 1.65, fontFamily: 'var(--f-sans)',
            }}>{gr.description}</p>
          </div>

          {/* evidence files */}
          {gr.evidence.length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '9px', color: 'var(--ink-4)',
                letterSpacing: '0.12em', marginBottom: '8px',
              }}>EVIDENCE FILES</div>
              {gr.evidence.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', marginBottom: '4px',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '10px', color: 'var(--ink-3)',
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect x="1" y="1" width="9" height="9" stroke="currentColor" strokeWidth="0.8"/>
                    <line x1="3" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="0.8"/>
                    <line x1="3" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="0.8"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* citizen ref */}
          <div style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '9px', color: 'var(--ink-4)',
            letterSpacing: '0.1em', marginBottom: '20px',
          }}>
            CITIZEN REF: {gr.citizenPhone}
          </div>

          {/* actions */}
          {gr.status !== 'RESOLVED' && (
            <button
              onClick={() => { onResolve(gr.id); onClose(); }}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--ink)', color: 'var(--bg)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--f-mono)',
                fontSize: '10px', letterSpacing: '0.14em',
              }}
            >
              VERIFY &amp; RESOLVE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ── */
export default function Dashboard() {
  const [filterStatus,   setFilterStatus]   = useState<FilterStatus>('ALL');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterWard,     setFilterWard]     = useState('ALL');
  const [search,         setSearch]         = useState('');
  const [activeGr,       setActiveGr]       = useState<Grievance | null>(null);
  const [toast,          setToast]          = useState<{ msg: string; sub: string } | null>(null);
  const [resolved,       setResolved]       = useState<Set<string>>(new Set());
  const [grievances,     setGrievances]     = useState<Grievance[]>([]);
  const [loading,        setLoading]        = useState(true);

  // Fetch real tickets from backend
  useEffect(() => {
    apiFetch<ApiTicket[]>('/api/tickets')
      .then(tickets => {
        if (tickets && tickets.length > 0) {
          setGrievances(tickets.map(mapTicket));
        }
      })
      .catch((err) => console.error('Failed to load live tickets', err))
      .finally(() => setLoading(false));
  }, []);

  /* simulated incoming voice call toast */
  useEffect(() => {
    const t = setTimeout(() => {
      setToast({ msg: 'New Voice Intake', sub: 'GR-8870 — Water Supply · Ward 04 (Hindi)' });
    }, 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleResolve = async (id: string) => {
    setResolved(prev => new Set([...prev, id]));
    // Call backend if it's a numeric ID (real ticket)
    const numId = Number(id);
    if (!isNaN(numId) && numId > 0) {
      apiFetch(`/api/tickets/${numId}/resolve`, { method: 'POST' }).catch(() => {});
    }
  };

  const wards      = ['ALL', ...Array.from(new Set(grievances.map(g => g.ward)))];
  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const statusTabs: FilterStatus[] = ['ALL', 'OPEN', 'IN-PROGRESS', 'RESOLVED'];

  const data = grievances.map(g =>
    resolved.has(g.id) ? { ...g, status: 'RESOLVED' as Status } : g
  );

  const filtered = data.filter(g => {
    if (filterStatus !== 'ALL' && g.status !== filterStatus) return false;
    if (filterSeverity !== 'ALL' && g.severity !== filterSeverity) return false;
    if (filterWard !== 'ALL' && g.ward !== filterWard) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!g.refId.toLowerCase().includes(q) && !g.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openCount    = data.filter(g => g.status !== 'RESOLVED').length;
  const resolvedCount= data.filter(g => g.status === 'RESOLVED').length;
  const breachCount  = data.filter(g => g.severity === 'CRITICAL' && g.status !== 'RESOLVED').length;

  return (
    <Layout>
      <div style={{ padding: '28px 30px', maxWidth: '1080px' }}>

        {loading && (
          <div style={{
            fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-4)',
            letterSpacing: '0.1em', marginBottom: '16px',
          }}>SYNCING WITH BACKEND...</div>
        )}

        {/* ── KPI row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1px',
          background: 'var(--border)',
          marginBottom: '30px',
        }}>
          {[
            { label: 'AWAITING ACTION',  value: openCount,     accent: 'var(--ink)',  sub: 'total open' },
            { label: 'RESOLVED TODAY',   value: resolvedCount, accent: 'var(--green)',sub: 'this shift' },
            { label: 'BREACH RISK',      value: breachCount,   accent: 'var(--red)',  sub: 'critical · SLA' },
          ].map(k => (
            <div key={k.label} style={{
              background: 'var(--surface)',
              padding: '22px 24px 20px',
            }}>
              <div style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '9px', color: 'var(--ink-4)',
                letterSpacing: '0.14em', marginBottom: '10px',
              }}>{k.label}</div>
              <div style={{
                fontFamily: 'var(--f-serif)',
                fontSize: '52px', fontStyle: 'italic',
                color: k.accent, lineHeight: 1,
              }}>{k.value}</div>
              <div style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '9px', color: 'var(--ink-4)',
                marginTop: '8px', letterSpacing: '0.06em',
              }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Filter bar ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: '10px', alignItems: 'center',
          marginBottom: '14px',
        }}>
          {/* search */}
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '260px' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
              width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="4" stroke="var(--ink)" strokeWidth="1.2"/>
              <line x1="8" y1="8" x2="11" y2="11" stroke="var(--ink)" strokeWidth="1.2"/>
            </svg>
            <input
              type="text"
              placeholder="Search ID or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px 8px 28px',
                border: '1px solid var(--border)', background: 'transparent',
                fontFamily: 'var(--f-mono)',
                fontSize: '11px', color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>

          {/* status tabs */}
          <div style={{ display: 'flex' }}>
            {statusTabs.map((s, i) => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '8px 14px',
                border: '1px solid var(--border)',
                marginLeft: i > 0 ? '-1px' : '0',
                background: filterStatus === s ? 'var(--ink)' : 'transparent',
                color: filterStatus === s ? 'var(--bg)' : 'var(--ink-3)',
                fontFamily: 'var(--f-mono)',
                fontSize: '10px', letterSpacing: '0.08em',
                cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>

          {/* severity */}
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', color: 'var(--ink-2)',
              outline: 'none', cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            {severities.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Severity' : s}</option>)}
          </select>

          {/* ward */}
          <select
            value={filterWard}
            onChange={e => setFilterWard(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', color: 'var(--ink-2)',
              outline: 'none', cursor: 'pointer',
              letterSpacing: '0.06em',
            }}
          >
            {wards.map(w => <option key={w} value={w}>{w === 'ALL' ? 'All Wards' : w}</option>)}
          </select>
        </div>

        {/* ── Table ── */}
        <div style={{ border: '1px solid var(--border)' }}>
          {/* table head label */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-raised)',
          }}>
            <span style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-3)',
              letterSpacing: '0.14em',
            }}>OPERATIONAL LEDGER</span>
            <span style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-4)',
            }}>{filtered.length} records</span>
          </div>

          {/* col headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '90px 148px 108px 148px 110px 108px 1fr',
            padding: '9px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-raised)',
          }}>
            {['REF ID','CATEGORY','SEVERITY','WARD','STATUS','SLA','ACTIONS'].map(h => (
              <span key={h} style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '9px', color: 'var(--ink-4)',
                letterSpacing: '0.12em',
              }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{
              padding: '48px 16px', textAlign: 'center',
              fontFamily: 'var(--f-mono)',
              fontSize: '11px', color: 'var(--ink-4)',
            }}>
              No records match current filters.
            </div>
          ) : (
            filtered.map((g, i) => (
              <div
                key={g.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 148px 108px 148px 110px 108px 1fr',
                  padding: '13px 16px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--f-serif)',
                  fontSize: '15px', fontStyle: 'italic',
                  color: 'var(--ink)',
                }}>{g.refId}</span>

                <span style={{
                  fontFamily: 'var(--f-sans)',
                  fontSize: '12px', color: 'var(--ink-2)',
                }}>{g.category}</span>

                <span><SevBadge s={g.severity} /></span>

                <div>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: '12px', color: 'var(--ink)' }}>{g.ward}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', marginTop: '2px' }}>{g.wardName}</div>
                </div>

                <span><StatusPill s={g.status} /></span>

                <span style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '12px',
                  color: g.slaSeconds < 5000 && g.status !== 'RESOLVED' ? 'var(--red)' : 'var(--ink-3)',
                  fontWeight: g.slaSeconds < 5000 ? 500 : 400,
                }}>
                  {g.status === 'RESOLVED' ? '—' : g.slaTimer}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setActiveGr(g)}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '9px', letterSpacing: '0.08em',
                      color: 'var(--ink-3)', cursor: 'pointer',
                    }}
                  >
                    EVIDENCE
                  </button>
                  {g.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(g.id)}
                      style={{
                        padding: '5px 10px',
                        border: 'none',
                        background: 'var(--ink)',
                        color: 'var(--bg)',
                        fontFamily: 'var(--f-mono)',
                        fontSize: '9px', letterSpacing: '0.08em',
                        cursor: 'pointer',
                      }}
                    >
                      RESOLVE
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ink)',
          color: 'var(--bg)',
          padding: '14px 20px',
          minWidth: '360px', maxWidth: '440px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          border: '1px solid rgba(255,255,255,0.08)',
          zIndex: 300,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ marginTop: '1px', flexShrink: 0 }}>
            <path d="M2 9.5V4a4.5 4.5 0 019 0v5.5" stroke="var(--bg)" strokeWidth="1"/>
            <path d="M2 9.5h9" stroke="var(--bg)" strokeWidth="1"/>
            <circle cx="6.5" cy="11.5" r="1" fill="var(--bg)"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', letterSpacing: '0.1em',
              marginBottom: '3px',
            }}>{toast.msg}</div>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', color: 'rgba(255,255,255,0.5)',
            }}>{toast.sub}</div>
          </div>
          <button onClick={() => setToast(null)} style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            fontSize: '16px', lineHeight: 1, flexShrink: 0,
          }}>×</button>
        </div>
      )}

      {/* ── Modal ── */}
      {activeGr && (
        <Modal
          gr={activeGr}
          onClose={() => setActiveGr(null)}
          onResolve={handleResolve}
        />
      )}
    </Layout>
  );
}

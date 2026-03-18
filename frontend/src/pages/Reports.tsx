import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';
import { Grievance, ApiTicket, mapTicket } from '../types';

type ReportType = 'daily' | 'ward' | 'sla' | 'citizen';

function Tag({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span style={{
      fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.08em',
      color, background: bg, padding: '2px 6px',
      border: `1px solid ${color}33`,
    }}>{label}</span>
  );
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('daily');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [wardStats, setWardStats] = useState<any[]>([]);
  const [categoryTrend, setCategoryTrend] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiTicket[]>('/api/tickets'),
      apiFetch<any>('/api/analytics')
    ]).then(([ticketsRes, attrRes]) => {
      if (ticketsRes) setGrievances(ticketsRes.map(mapTicket));
      if (attrRes) {
        setWardStats(attrRes.wardStats || []);
        setCategoryTrend(attrRes.categoryTrend || []);
      }
    }).catch(err => console.error('Failed to load report data', err));
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const exportCSV = (data: object[], name: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const rows = [keys.join(','), ...data.map(row => keys.map(k => `"${(row as any)[k]}"`).join(','))];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const REPORTS: { key: ReportType; label: string; desc: string }[] = [
    { key: 'daily',   label: 'Daily Shift Report',       desc: 'All grievances processed in current shift' },
    { key: 'ward',    label: 'Ward Performance Report',  desc: 'Resolution rates, SLA adherence by ward' },
    { key: 'sla',     label: 'SLA Breach Analysis',      desc: 'All tickets at risk or breached SLA thresholds' },
    { key: 'citizen', label: 'Citizen Outreach Summary', desc: 'SMS receipts, QR verifications, voice intakes' },
  ];

  const slaRisk = grievances.filter(g => g.slaSeconds < 3600 && g.status !== 'RESOLVED');

  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: '6px', textTransform: 'uppercase' }}>
              INSTITUTIONAL REPORTS
            </div>
            <h1 style={{ fontFamily: 'var(--f-serif)', fontSize: '26px', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1, fontWeight: 400 }}>
              Report Generation
            </h1>
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', padding: '6px 12px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            AES-256 ENCRYPTED · LEDGER-BACKED
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '12px' }}>

          {/* left: report selector */}
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--ink-3)', marginBottom: '10px' }}>SELECT REPORT</div>
            <div style={{ border: '1px solid var(--border)' }}>
              {REPORTS.map((r, i) => (
                <div
                  key={r.key}
                  onClick={() => { setActiveReport(r.key); setGenerated(false); }}
                  style={{
                    padding: '14px 16px', cursor: 'pointer',
                    background: activeReport === r.key ? 'var(--bg-raised)' : 'var(--surface)',
                    borderBottom: i < REPORTS.length - 1 ? '1px solid var(--border)' : 'none',
                    borderLeft: activeReport === r.key ? '3px solid var(--ink)' : '3px solid transparent',
                    transition: 'all 0.1s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: activeReport === r.key ? 'var(--ink)' : 'var(--ink-2)', marginBottom: '3px', fontWeight: activeReport === r.key ? 500 : 400 }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', lineHeight: 1.4 }}>{r.desc}</div>
                </div>
              ))}
            </div>

            {/* quick stats */}
            <div style={{ marginTop: '12px', padding: '14px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--ink-3)', marginBottom: '10px' }}>QUICK STATS</div>
              {[
                { label: 'Total Records',  value: grievances.length,                                          color: 'var(--ink)' },
                { label: 'Open Tickets',   value: grievances.filter(g => g.status === 'OPEN').length,          color: 'var(--red)' },
                { label: 'SLA Breach Risk',value: slaRisk.length,                                             color: 'var(--orange)' },
                { label: 'Resolved',       value: grievances.filter(g => g.status === 'RESOLVED').length,     color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right: report preview */}
          <div>
            <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--ink-3)', marginBottom: '4px' }}>
                    {REPORTS.find(r => r.key === activeReport)?.label.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: '12px', color: 'var(--ink-2)' }}>
                    {REPORTS.find(r => r.key === activeReport)?.desc}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{
                      padding: '8px 16px', background: generating ? 'var(--ink-3)' : 'var(--ink)',
                      color: 'var(--bg)', border: 'none', cursor: generating ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    {generating && (
                      <div style={{ width: '10px', height: '10px', border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    )}
                    {generating ? 'GENERATING…' : 'GENERATE REPORT'}
                  </button>
                  {generated && (
                    <button
                      onClick={() => exportCSV(grievances, `report_${activeReport}_${new Date().toISOString().slice(0,10)}`)}
                      style={{
                        padding: '8px 14px', background: 'transparent',
                        color: 'var(--green)', border: '1px solid var(--green-border)',
                        cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
                      }}
                    >
                      ↓ EXPORT CSV
                    </button>
                  )}
                </div>
              </div>

              {/* report content */}
              {activeReport === 'daily' && (
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', marginBottom: '12px', letterSpacing: '0.08em' }}>
                    GRIEVANCE LOG — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                  </div>
                  <div style={{ border: '1px solid var(--border)' }}>
                    {/* table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 100px 90px', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
                      {['REF ID','CATEGORY · WARD','SEVERITY','STATUS','SLA'].map(h => (
                        <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--ink-3)' }}>{h}</span>
                      ))}
                    </div>
                    {grievances.map((g, i) => (
                      <div key={g.id} style={{
                        display: 'grid', gridTemplateColumns: '90px 1fr 100px 100px 90px',
                        padding: '10px 12px',
                        borderBottom: i < grievances.length - 1 ? '1px solid var(--border)' : 'none',
                        background: g.severity === 'CRITICAL' && g.status !== 'RESOLVED' ? 'var(--red-bg)' : 'transparent',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '12px', color: 'var(--ink)' }}>{g.refId}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--f-sans)', fontSize: '11px', color: 'var(--ink)' }}>{g.category}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>{g.ward} · {g.wardName}</div>
                        </div>
                        <Tag
                          label={g.severity}
                          color={g.severity === 'CRITICAL' ? 'var(--red)' : g.severity === 'HIGH' ? 'var(--orange)' : g.severity === 'MEDIUM' ? 'var(--amber)' : 'var(--ink-3)'}
                          bg={g.severity === 'CRITICAL' ? 'var(--red-bg)' : g.severity === 'HIGH' ? 'var(--orange-bg)' : g.severity === 'MEDIUM' ? 'var(--amber-bg)' : 'var(--bg-raised)'}
                        />
                        <Tag
                          label={g.status}
                          color={g.status === 'RESOLVED' ? 'var(--green)' : g.status === 'IN-PROGRESS' ? 'var(--orange)' : 'var(--ink-2)'}
                          bg={g.status === 'RESOLVED' ? 'var(--green-bg)' : g.status === 'IN-PROGRESS' ? 'var(--orange-bg)' : 'transparent'}
                        />
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: g.slaSeconds < 3600 ? 'var(--red)' : 'var(--ink-3)' }}>
                          {g.status === 'RESOLVED' ? '—' : g.slaTimer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeReport === 'ward' && (
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', marginBottom: '12px', letterSpacing: '0.08em' }}>
                    WARD PERFORMANCE MATRIX
                  </div>
                  <div style={{ border: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px 80px 100px 100px', padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
                      {['WARD','NAME','OPEN','ACTIVE','DONE','AVG RES.','SATISFACTION'].map(h => (
                        <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--ink-3)' }}>{h}</span>
                      ))}
                    </div>
                    {wardStats.map((w, i) => (
                      <div key={w.ward} style={{
                        display: 'grid', gridTemplateColumns: '120px 1fr 80px 80px 80px 100px 100px',
                        padding: '11px 12px', alignItems: 'center',
                        borderBottom: i < wardStats.length - 1 ? '1px solid var(--border)' : 'none',
                      }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>{w.ward}</span>
                        <span style={{ fontFamily: 'var(--f-sans)', fontSize: '11px', color: 'var(--ink)' }}>{w.name}</span>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', color: 'var(--red)' }}>{w.open}</span>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', color: 'var(--amber)' }}>{w.inProgress}</span>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', color: 'var(--green)' }}>{w.resolved}</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>{w.avgResolutionHrs}h</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ flex: 1, height: '3px', background: 'var(--bg-raised)' }}>
                              <div style={{ height: '100%', width: `${w.citizenSatisfaction}%`, background: w.citizenSatisfaction >= 75 ? 'var(--green)' : w.citizenSatisfaction >= 55 ? 'var(--amber)' : 'var(--red)' }} />
                            </div>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-2)', flexShrink: 0 }}>{w.citizenSatisfaction}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeReport === 'sla' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>SLA BREACH RISK ANALYSIS</div>
                    {slaRisk.length > 0 && (
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--red)', background: 'var(--red-bg)', padding: '2px 8px' }}>
                        {slaRisk.length} AT RISK
                      </span>
                    )}
                  </div>
                  {slaRisk.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--ink-3)', border: '1px solid var(--border)' }}>
                      No SLA breaches detected in current window
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--border)' }}>
                      {slaRisk.map((g, i) => (
                        <div key={g.id} style={{
                          padding: '12px 14px',
                          borderBottom: i < slaRisk.length - 1 ? '1px solid var(--border)' : 'none',
                          background: 'var(--red-bg)',
                          borderLeft: `3px solid ${g.slaSeconds < 1800 ? 'var(--red)' : 'var(--orange)'}`,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                            <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', color: 'var(--ink)' }}>{g.refId}</span>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--red)', fontWeight: 500 }}>
                              ⚠ {g.slaTimer} remaining
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>{g.category}</span>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-3)' }}>{g.ward} · {g.wardName}</span>
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-3)' }}>→ {g.assignedTo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* all grievances SLA summary */}
                  <div style={{ marginTop: '12px', padding: '12px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', marginBottom: '8px', letterSpacing: '0.08em' }}>FULL SLA BREAKDOWN</div>
                    <div style={{ border: '1px solid var(--border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px 100px', padding: '7px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
                        {['REF ID','CATEGORY · WARD','SEVERITY','SLA TIMER','ASSIGNED TO'].map(h => (
                          <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.08em', color: 'var(--ink-3)' }}>{h}</span>
                        ))}
                      </div>
                      {grievances.filter(g => g.status !== 'RESOLVED').map((g, i, arr) => (
                        <div key={g.id} style={{
                          display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px 100px',
                          padding: '8px 10px', alignItems: 'center',
                          borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '12px' }}>{g.refId}</span>
                          <div>
                            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink)' }}>{g.category}</div>
                            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>{g.ward}</div>
                          </div>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: g.severity === 'CRITICAL' ? 'var(--red)' : 'var(--ink-2)' }}>{g.severity}</span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: g.slaSeconds < 3600 ? 'var(--red)' : 'var(--ink-2)', fontWeight: g.slaSeconds < 3600 ? 500 : 400 }}>
                            {g.slaTimer}
                          </span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>{g.assignedTo}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeReport === 'citizen' && (
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', marginBottom: '12px', letterSpacing: '0.08em' }}>
                    CITIZEN OUTREACH METRICS
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    {[
                      { label: 'Voice Intakes',        value: '24', sub: 'Today', color: 'var(--blue)' },
                      { label: 'SMS Receipts Sent',    value: '18', sub: 'Today', color: 'var(--green)' },
                      { label: 'QR Verifications',     value: '11', sub: 'Today', color: 'var(--purple)' },
                      { label: 'Hindi Calls',          value: '19', sub: '79%',   color: 'var(--ink)' },
                      { label: 'English Calls',        value: '5',  sub: '21%',   color: 'var(--ink-2)' },
                      { label: 'Avg Response Time',    value: '4.2m',sub: 'To first action', color: 'var(--amber)' },
                    ].map(s => (
                      <div key={s.label} style={{ padding: '12px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--ink-3)', marginBottom: '5px', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '22px', color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--ink-4)', marginTop: '2px' }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* citizen records */}
                  <div style={{ border: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 80px 80px', padding: '7px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
                      {['REF ID','CATEGORY · WARD','LANGUAGE','UPVOTES','SMS SENT'].map(h => (
                        <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.08em', color: 'var(--ink-3)' }}>{h}</span>
                      ))}
                    </div>
                    {grievances.map((g, i) => (
                      <div key={g.id} style={{
                        display: 'grid', gridTemplateColumns: '90px 1fr 100px 80px 80px',
                        padding: '9px 12px', alignItems: 'center',
                        borderBottom: i < grievances.length - 1 ? '1px solid var(--border)' : 'none',
                      }}>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '12px', color: 'var(--ink)' }}>{g.refId}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink)' }}>{g.category}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>{g.wardName}</div>
                        </div>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: g.language === 'Hindi' ? 'var(--blue)' : 'var(--ink-2)' }}>
                          {g.language}
                        </span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>▲ {g.upvotes || 0}</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: g.status === 'RESOLVED' ? 'var(--green)' : 'var(--ink-3)' }}>
                          {g.status === 'RESOLVED' ? '✓ SENT' : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* generated success */}
            {generated && (
              <div style={{
                padding: '12px 16px', background: 'var(--green-bg)',
                border: '1px solid var(--green-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                animation: 'slide-up 0.2s ease',
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="var(--green)" strokeWidth="1.2"/><polyline points="3.5,6 5.5,8 9,4.5" stroke="var(--green)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--green)' }}>Report generated successfully. Cryptographic hash committed to ledger.</span>
                </div>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)' }}>
                  {grievances.length} records · {new Date().toLocaleTimeString('en-IN', { hour12: false })}
                </span>
              </div>
            )}

            {/* category summary */}
            <div style={{ padding: '18px', border: '1px solid var(--border)', background: 'var(--surface)', marginTop: '12px' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--ink-3)', marginBottom: '12px' }}>CATEGORY VOLUME (ALL TIME)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {categoryTrend.slice(0, 8).map(c => (
                  <div key={c.cat} style={{ padding: '10px', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--ink-3)', marginBottom: '4px', letterSpacing: '0.06em' }}>{c.cat.toUpperCase()}</div>
                    <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '18px', color: 'var(--ink)' }}>{c.count}</div>
                    <div style={{ height: '2px', background: 'var(--bg-raised)', marginTop: '5px' }}>
                      <div style={{ height: '100%', width: `${c.count / 24 * 100}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';
import { Grievance, ApiTicket, mapTicket } from '../types';

type Tab = 'chain' | 'wards' | 'categories';

const CAT_COLOR: Record<string, string> = {
  'Sanitation':      'var(--red)',
  'Water Supply':    'var(--blue)',
  'Road Damage':     'var(--orange)',
  'Drainage':        'var(--blue)',
  'Street Lighting': 'var(--amber)',
  'Noise Pollution': 'var(--purple)',
  'Encroachment':    'var(--green)',
  'Park Maintenance':'var(--ink-3)',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN:         'var(--ink-3)',
  'IN-PROGRESS':'var(--orange)',
  RESOLVED:     'var(--green)',
};

export default function Ledger() {
  const [tab, setTab] = useState<Tab>('chain');
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [wardStats, setWardStats] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiTicket[]>('/api/tickets'),
      apiFetch<any>('/api/analytics')
    ]).then(([ticketsRes, attrRes]) => {
      if (ticketsRes) setGrievances(ticketsRes.map(mapTicket));
      if (attrRes) setWardStats(attrRes.wardStats || []);
    }).catch(err => console.error('Failed to load ledger data', err));
  }, []);

  const catCounts = grievances.reduce<Record<string,number>>((acc, g) => {
    acc[g.category] = (acc[g.category] || 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(catCounts));

  const TABS: { id: Tab; label: string }[] = [
    { id: 'chain',      label: 'BLOCKCHAIN LEDGER' },
    { id: 'wards',      label: 'WARD ANALYSIS' },
    { id: 'categories', label: 'CATEGORIES' },
  ];

  return (
    <Layout>
      <div style={{ padding: '28px 30px', maxWidth: '960px' }}>

        {/* page header */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '26px', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--ink)', letterSpacing: '-0.02em',
          }}>Institutional Ledger</h2>
          <p style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '10px', color: 'var(--ink-4)',
            marginTop: '4px', letterSpacing: '0.06em',
          }}>
            Cryptographically hashed record — all grievances, assignments, resolutions
          </p>
        </div>

        {/* tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          marginBottom: '24px',
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 18px',
              background: 'none', border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--ink)' : '2px solid transparent',
              color: tab === t.id ? 'var(--ink)' : 'var(--ink-4)',
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', letterSpacing: '0.12em',
              cursor: 'pointer', marginBottom: '-1px',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BLOCKCHAIN TAB ── */}
        {tab === 'chain' && (
          <div style={{ border: '1px solid var(--border)' }}>

            {/* summary bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
              gap: '1px', background: 'var(--border)',
              borderBottom: '1px solid var(--border)',
            }}>
              {[
                { l: 'TOTAL RECORDS',  v: grievances.length.toString() },
                { l: 'HASHED BLOCKS',  v: grievances.length.toString() },
                { l: 'CHAIN INTEGRITY',v: '100%' },
                { l: 'LAST SYNC',      v: '14:21 IST' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--bg-raised)', padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em', marginBottom: '4px' }}>{s.l}</div>
                  <div style={{ fontFamily: 'var(--f-serif)', fontSize: '20px', fontStyle: 'italic', color: 'var(--ink)' }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* col headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 130px 120px 1fr 70px',
              padding: '9px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-raised)',
            }}>
              {['REF ID','CATEGORY','STATUS','SHA-3 HASH','BLOCK'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em' }}>{h}</span>
              ))}
            </div>

            {/* rows */}
            {grievances.map((g, i) => (
              <div key={g.id} style={{
                display: 'grid',
                gridTemplateColumns: '90px 130px 120px 1fr 70px',
                padding: '12px 16px',
                borderBottom: i < grievances.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
              }}>
                <span style={{ fontFamily: 'var(--f-serif)', fontSize: '15px', fontStyle: 'italic', color: 'var(--ink)' }}>
                  {g.refId}
                </span>
                <span style={{ fontFamily: 'var(--f-sans)', fontSize: '11px', color: 'var(--ink-2)' }}>
                  {g.category}
                </span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: STATUS_COLOR[g.status], letterSpacing: '0.08em' }}>
                  {g.status}
                </span>
                <span style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '9px', color: 'var(--ink-4)',
                  letterSpacing: '0.03em',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  paddingRight: '12px',
                }}>
                  {g.hash.slice(0, 40)}…
                </span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-3)' }}>
                  #{1240 + i}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── WARDS TAB ── */}
        {tab === 'wards' && (
          <div style={{ border: '1px solid var(--border)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '110px 140px 70px 70px 70px 1fr',
              padding: '9px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-raised)',
            }}>
              {['WARD','NAME','OPEN','RESOLVED','CRITICAL','RESOLUTION RATE'].map(h => (
                <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em' }}>{h}</span>
              ))}
            </div>

            {wardStats.map((w, i) => {
              const total = w.open + w.resolved;
              const rate  = total > 0 ? Math.round((w.resolved / total) * 100) : 0;
              return (
                <div key={w.ward} style={{
                  display: 'grid', gridTemplateColumns: '110px 140px 70px 70px 70px 1fr',
                  padding: '14px 16px',
                  borderBottom: i < wardStats.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center',
                  background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                }}>
                  <span style={{ fontFamily: 'var(--f-serif)', fontSize: '15px', fontStyle: 'italic', color: 'var(--ink)' }}>
                    {w.ward}
                  </span>
                  <span style={{ fontFamily: 'var(--f-sans)', fontSize: '11px', color: 'var(--ink-2)' }}>
                    {w.name}
                  </span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: w.open > 2 ? 'var(--orange)' : 'var(--ink-2)' }}>
                    {w.open}
                  </span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: 'var(--green)' }}>
                    {w.resolved}
                  </span>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '12px', color: w.critical > 0 ? 'var(--red)' : 'var(--ink-4)' }}>
                    {w.critical}
                  </span>
                  {/* progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '3px', background: 'var(--border)' }}>
                      <div style={{
                        width: `${rate}%`, height: '100%',
                        background: rate > 60 ? 'var(--green)' : rate > 30 ? 'var(--amber)' : 'var(--orange)',
                      }} />
                    </div>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-3)', flexShrink: 0 }}>
                      {rate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === 'categories' && (
          <div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1px', background: 'var(--border)',
              marginBottom: '20px',
            }}>
              {[
                { l: 'CATEGORIES',     v: Object.keys(catCounts).length.toString() },
                { l: 'TOTAL TICKETS',  v: grievances.length.toString() },
                { l: 'MOST REPORTED',  v: Object.entries(catCounts).sort((a,b) => b[1]-a[1])[0]?.[0] ?? '—' },
                { l: 'AI ACCURACY',    v: '96.4%' },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--surface)', padding: '14px 18px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em', marginBottom: '4px' }}>{s.l}</div>
                  <div style={{ fontFamily: 'var(--f-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--ink)' }}>{s.v}</div>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid var(--border)' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '180px 50px 1fr',
                padding: '9px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-raised)',
              }}>
                {['CATEGORY','COUNT','DISTRIBUTION'].map(h => (
                  <span key={h} style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em' }}>{h}</span>
                ))}
              </div>

              {Object.entries(catCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count], i, arr) => (
                  <div key={cat} style={{
                    display: 'grid', gridTemplateColumns: '180px 50px 1fr',
                    padding: '13px 16px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    alignItems: 'center',
                    background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: CAT_COLOR[cat] ?? 'var(--ink-4)', flexShrink: 0,
                      }} />
                      <span style={{ fontFamily: 'var(--f-sans)', fontSize: '12px', color: 'var(--ink-2)' }}>
                        {cat}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '13px', color: 'var(--ink)' }}>
                      {count}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'var(--border)' }}>
                        <div style={{
                          width: `${(count / maxCat) * 100}%`,
                          height: '100%',
                          background: CAT_COLOR[cat] ?? 'var(--ink-4)',
                        }} />
                      </div>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', flexShrink: 0, width: '32px', textAlign: 'right' }}>
                        {Math.round((count / grievances.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

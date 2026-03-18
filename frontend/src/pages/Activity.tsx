import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';

export interface ActivityItem {
  id: string;
  type: 'voice' | 'alert' | 'verify' | 'system' | 'escalation' | 'sms' | 'ai';
  message: string;
  time: string;
  isAlert?: boolean;
}

type AType = ActivityItem['type'];

const TYPE_META: Record<AType, { label: string; color: string; icon: React.ReactNode }> = {
  voice: {
    label: 'VOICE INTAKE',
    color: 'var(--blue)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <rect x="3.5" y="1" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1"/>
        <path d="M1.5 6.5c0 2.2 1.8 3.5 4 3.5s4-1.3 4-3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <line x1="5.5" y1="10" x2="5.5" y2="11" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  alert: {
    label: 'SLA ALERT',
    color: 'var(--red)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <polygon points="5.5,1 10.5,9.5 0.5,9.5" stroke="currentColor" strokeWidth="1" fill="none"/>
        <line x1="5.5" y1="4.5" x2="5.5" y2="7" stroke="currentColor" strokeWidth="1"/>
        <circle cx="5.5" cy="8.2" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  verify: {
    label: 'VERIFIED',
    color: 'var(--green)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
        <polyline points="3,5.5 5,7.5 8,4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  system: {
    label: 'SYSTEM',
    color: 'var(--ink-3)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <rect x="1" y="1" width="9" height="9" stroke="currentColor" strokeWidth="1"/>
        <line x1="1" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="1"/>
        <circle cx="3" cy="2.5" r="0.6" fill="currentColor"/>
        <circle cx="5" cy="2.5" r="0.6" fill="currentColor"/>
      </svg>
    ),
  },
  escalation: {
    label: 'ESCALATION',
    color: 'var(--red)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <line x1="5.5" y1="9" x2="5.5" y2="2" stroke="currentColor" strokeWidth="1"/>
        <polyline points="2.5,5 5.5,2 8.5,5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  sms: {
    label: 'SMS SENT',
    color: 'var(--green)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <rect x="1" y="2" width="9" height="6.5" rx="1" stroke="currentColor" strokeWidth="1"/>
        <polyline points="1.5,2.5 5.5,5.5 9.5,2.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  ai: {
    label: 'AI CLASSIFY',
    color: 'var(--purple)',
    icon: (
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <polygon points="5.5,1 8.5,3.5 8.5,7.5 5.5,10 2.5,7.5 2.5,3.5" stroke="currentColor" strokeWidth="1" fill="none"/>
        <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
};

export default function Activity() {
  type FilterType = 'ALL' | AType;
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [live,   setLive]   = useState(true);
  const [feed,   setFeed]   = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchActivity = () => {
      apiFetch<ActivityItem[]>('/api/activity')
        .then(res => {
          if (res) setFeed(res);
        })
        .catch(err => console.error('Failed to load activity', err));
    };

    fetchActivity();

    if (!live) return;
    const interval = setInterval(fetchActivity, 8000);
    return () => clearInterval(interval);
  }, [live]);

  const types: FilterType[] = ['ALL', 'voice', 'alert', 'verify', 'escalation', 'ai', 'sms', 'system'];
  const filtered = filter === 'ALL' ? feed : feed.filter(f => f.type === filter);

  return (
    <Layout>
      <div style={{ padding: '28px 30px', maxWidth: '780px' }}>

        {/* page title */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '28px',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--f-serif)',
              fontSize: '26px', fontStyle: 'italic', fontWeight: 400,
              color: 'var(--ink)', letterSpacing: '-0.02em',
            }}>Activity Stream</h2>
            <p style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', color: 'var(--ink-4)',
              marginTop: '4px', letterSpacing: '0.06em',
            }}>
              Institutional audit trail — all operator and system actions
            </p>
          </div>

          {/* live toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-4)',
              letterSpacing: '0.1em',
            }}>LIVE</span>
            <button
              onClick={() => setLive(v => !v)}
              style={{
                width: '32px', height: '18px',
                background: live ? 'var(--ink)' : 'var(--border)',
                border: 'none', cursor: 'pointer',
                position: 'relative', borderRadius: '9px',
              }}
            >
              <span style={{
                position: 'absolute',
                top: '3px', left: live ? '16px' : '3px',
                width: '12px', height: '12px',
                borderRadius: '50%', background: 'var(--bg)',
                transition: 'left 0.15s',
                display: 'block',
              }} />
            </button>
            {live && (
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            )}
          </div>
        </div>

        {/* type filter chips */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '6px',
          marginBottom: '22px',
        }}>
          {types.map(t => {
            const meta = t !== 'ALL' ? TYPE_META[t as AType] : null;
            const active = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '5px 10px',
                  border: `1px solid ${active ? 'var(--ink)' : 'var(--border)'}`,
                  background: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--bg)' : (meta ? meta.color : 'var(--ink-3)'),
                  fontFamily: 'var(--f-mono)',
                  fontSize: '9px', letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {meta && <span style={{ color: active ? 'var(--bg)' : meta.color }}>{meta.icon}</span>}
                {t === 'ALL' ? 'ALL' : TYPE_META[t as AType].label}
                <span style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '9px', opacity: 0.55,
                }}>
                  {t === 'ALL' ? feed.length : feed.filter(f => f.type === t).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* feed list */}
        <div style={{ border: '1px solid var(--border)' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '40px', textAlign: 'center',
              fontFamily: 'var(--f-mono)',
              fontSize: '11px', color: 'var(--ink-4)',
            }}>
              No events for this filter.
            </div>
          ) : (
            filtered.map((item, i) => {
              const meta  = TYPE_META[item.type];
              const isNew = i === 0 && live;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr 50px',
                    gap: '0',
                    padding: '12px 16px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    alignItems: 'flex-start',
                    background: item.isAlert
                      ? 'var(--red-bg)'
                      : isNew
                      ? 'var(--blue-bg)'
                      : i % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                  }}
                >
                  {/* icon */}
                  <span style={{ color: meta.color, paddingTop: '1px' }}>{meta.icon}</span>

                  {/* content */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '9px', letterSpacing: '0.1em',
                      color: meta.color, marginBottom: '3px',
                    }}>
                      {meta.label}
                      {isNew && (
                        <span style={{
                          marginLeft: '8px',
                          background: 'var(--blue)', color: 'var(--bg)',
                          padding: '1px 5px', fontSize: '8px',
                          letterSpacing: '0.1em',
                        }}>NEW</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: 'var(--f-sans)',
                      fontSize: '12px',
                      color: item.isAlert ? 'var(--red)' : 'var(--ink-2)',
                      lineHeight: 1.4,
                    }}>
                      {item.message}
                    </div>
                  </div>

                  {/* time */}
                  <div style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: '10px', color: 'var(--ink-4)',
                    textAlign: 'right',
                    paddingTop: '1px',
                  }}>
                    {item.time}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../api/client';

const NAV = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1"/>
        <rect x="8.5" y="1" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1"/>
        <rect x="1" y="8.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    path: '/gis',
    label: 'GIS Intel',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1"/>
        <ellipse cx="7.5" cy="7.5" rx="2.5" ry="6" stroke="currentColor" strokeWidth="1"/>
        <line x1="1.5" y1="7.5" x2="13.5" y2="7.5" stroke="currentColor" strokeWidth="1"/>
        <line x1="1.5" y1="4.5" x2="13.5" y2="4.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
        <line x1="1.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <polyline points="1,12 4,7 7,9 10,4 14,6" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1"/>
        <circle cx="4" cy="7" r="1" fill="currentColor"/>
        <circle cx="10" cy="4" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    path: '/ledger',
    label: 'Ledger',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <line x1="2" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="7.5" x2="13" y2="7.5" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="1" x2="2" y2="14" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    path: '/activity',
    label: 'Activity',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="3" width="13" height="9" stroke="currentColor" strokeWidth="1"/>
        <line x1="4" y1="6.5" x2="11" y2="6.5" stroke="currentColor" strokeWidth="1"/>
        <line x1="4" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1"/>
        <line x1="1" y1="3" x2="7.5" y2="0.5" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="14" y1="3" x2="7.5" y2="0.5" stroke="currentColor" strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="1" width="11" height="13" stroke="currentColor" strokeWidth="1"/>
        <line x1="5" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1"/>
        <line x1="5" y1="7.5" x2="10" y2="7.5" stroke="currentColor" strokeWidth="1"/>
        <line x1="5" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="1"/>
        <line x1="2" y1="3.5" x2="13" y2="3.5" stroke="currentColor" strokeWidth="0.5"/>
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Config',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1"/>
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.6 2.6l1.1 1.1M11.3 11.3l1.1 1.1M11.3 3.7l-1.1 1.1M3.8 11.2l-1.1 1.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(n.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleExit = () => {
    clearToken();
    navigate('/');
  };

  const S: Record<string, React.CSSProperties> = {
    root: {
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: 'var(--bg)', overflow: 'hidden',
    },
    header: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: '46px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', flexShrink: 0,
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    logo: {
      fontFamily: 'var(--f-serif)', fontSize: '15px', fontStyle: 'italic',
      color: 'var(--ink)', letterSpacing: '-0.01em', userSelect: 'none',
      cursor: 'pointer',
    },
    sep: { width: '1px', height: '14px', background: 'var(--border)' },
    liveChip: { display: 'flex', alignItems: 'center', gap: '5px' },
    liveDot: {
      width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E',
      animation: 'blink 2s ease-in-out infinite',
    },
    liveText: {
      fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em',
      color: 'var(--ink-3)', textTransform: 'uppercase' as const,
    },
    operatorTag: {
      fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
      color: 'var(--ink-3)', textTransform: 'uppercase' as const,
    },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    clockWrap: { textAlign: 'right' as const },
    clockTime: {
      fontFamily: 'var(--f-mono)', fontSize: '13px', fontWeight: 500,
      color: 'var(--ink)', letterSpacing: '0.04em', lineHeight: 1.2,
    },
    clockDate: {
      fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.1em',
      color: 'var(--ink-3)', textTransform: 'uppercase' as const, lineHeight: 1,
    },
    exitBtn: {
      display: 'flex', alignItems: 'center', gap: '6px',
      fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
      color: 'var(--ink-3)', textTransform: 'uppercase' as const,
      background: 'transparent', border: '1px solid var(--border)',
      padding: '5px 10px', cursor: 'pointer', transition: 'all 0.15s',
    },
    body: { display: 'flex', flex: 1, overflow: 'hidden' },
    sidebar: {
      width: '48px', borderRight: '1px solid var(--border)',
      background: 'var(--surface)', display: 'flex',
      flexDirection: 'column', alignItems: 'center',
      padding: '12px 0', gap: '2px', flexShrink: 0,
    },
    main: { flex: 1, overflow: 'auto', position: 'relative' as const },
  };

  return (
    <div style={S.root}>
      <header style={S.header}>
        <div style={S.headerLeft}>
          <span style={S.logo} onClick={() => navigate('/dashboard')}>ResolveOS</span>
          <div style={S.sep} />
          <div style={S.liveChip}>
            <span style={S.liveDot} />
            <span style={S.liveText}>Live Uplink</span>
          </div>
          <div style={S.sep} />
          <span style={S.operatorTag}>JS-Admin-01</span>
        </div>
        <div style={S.headerRight}>
          <div style={S.clockWrap}>
            <div style={S.clockTime}>{time}</div>
            <div style={S.clockDate}>New Delhi IST · {date}</div>
          </div>
          <div style={S.sep} />
          <button style={S.exitBtn} onClick={handleExit}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M4 2H2v6h2M6 3l3 2-3 2M9 5H4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            Secure Exit
          </button>
        </div>
      </header>

      <div style={S.body}>
        <nav style={S.sidebar}>
          {NAV.map(n => {
            const active = location.pathname === n.path;
            return (
              <button
                key={n.path}
                title={n.label}
                onClick={() => navigate(n.path)}
                style={{
                  width: '34px', height: '34px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? 'var(--ink)' : 'transparent',
                  border: 'none',
                  color: active ? 'var(--bg)' : 'var(--ink-3)',
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-raised)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-3)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                {n.icon}
              </button>
            );
          })}
        </nav>
        <main style={S.main}>{children}</main>
      </div>
    </div>
  );
}

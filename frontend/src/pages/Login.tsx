import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getToken } from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId]  = useState('');
  const [accessKey, setAccessKey]    = useState('');
  const [loading, setLoading]        = useState(false);
  const [error, setError]            = useState('');
  const [time, setTime]              = useState('');

  // If already authenticated, skip to dashboard
  useEffect(() => {
    if (getToken()) navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString('en-IN', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId.trim() || !accessKey.trim()) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(operatorId.trim(), accessKey);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── grid lines helper ── */
  const vLines = Array.from({ length: 9 });
  const hLines = Array.from({ length: 7 });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* structural grid */}
      {vLines.map((_, i) => (
        <div key={`v${i}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${(i + 1) * (100 / 10)}%`,
          width: '1px',
          background: 'rgba(0,0,0,0.04)',
          pointerEvents: 'none',
        }} />
      ))}
      {hLines.map((_, i) => (
        <div key={`h${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: `${(i + 1) * (100 / 8)}%`,
          height: '1px',
          background: 'rgba(0,0,0,0.04)',
          pointerEvents: 'none',
        }} />
      ))}

      {/* corner label — top left */}
      <div style={{
        position: 'absolute', top: '28px', left: '32px',
        fontFamily: 'var(--f-mono)',
        fontSize: '9px',
        color: 'var(--ink-4)',
        letterSpacing: '0.12em',
        lineHeight: 1.7,
      }}>
        <div>JANSAMVAAD MUNICIPAL CORP.</div>
        <div>OPERATOR TERMINAL — v4.2</div>
      </div>

      {/* corner label — top right: live clock */}
      <div style={{
        position: 'absolute', top: '28px', right: '32px',
        fontFamily: 'var(--f-mono)',
        fontSize: '9px',
        color: 'var(--ink-4)',
        letterSpacing: '0.1em',
        textAlign: 'right',
        lineHeight: 1.7,
      }}>
        <div>{time}</div>
        <div>NEW DELHI IST</div>
      </div>

      {/* form panel */}
      <form onSubmit={submit} style={{ width: '380px', position: 'relative', zIndex: 1 }}>

        {/* eyebrow */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '32px',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <polygon points="6,0.5 11.5,3.2 11.5,8.8 6,11.5 0.5,8.8 0.5,3.2"
              stroke="var(--ink-4)" strokeWidth="0.8" fill="none" />
          </svg>
          <span style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '9px',
            color: 'var(--ink-4)',
            letterSpacing: '0.16em',
          }}>
            MUNICIPAL COMMAND &amp; CONTROL
          </span>
        </div>

        {/* headline */}
        <h1 style={{
          fontFamily: 'var(--f-serif)',
          fontSize: '38px',
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          marginBottom: '10px',
        }}>
          JanSamvaad<br />ResolveOS
        </h1>
        <p style={{
          fontFamily: 'var(--f-mono)',
          fontSize: '10px',
          color: 'var(--ink-3)',
          marginBottom: '48px',
          letterSpacing: '0.04em',
        }}>
          Encrypted operator terminal — voice-to-resolution pipeline
        </p>

        {/* operator id */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--f-mono)',
            fontSize: '9px',
            color: 'var(--ink-3)',
            letterSpacing: '0.14em',
            marginBottom: '8px',
          }}>
            OPERATOR ID
          </label>
          <input
            type="text"
            value={operatorId}
            onChange={e => setOperatorId(e.target.value)}
            placeholder="operator"
            autoComplete="username"
            style={{
              width: '100%',
              padding: '11px 14px',
              background: 'transparent',
              border: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--ink)',
              fontFamily: 'var(--f-mono)',
              outline: 'none',
              borderRadius: 0,
              letterSpacing: '0.04em',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
            onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* access key */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--f-mono)',
            fontSize: '9px',
            color: 'var(--ink-3)',
            letterSpacing: '0.14em',
            marginBottom: '8px',
          }}>
            SECURE ACCESS KEY
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              value={accessKey}
              onChange={e => setAccessKey(e.target.value)}
              placeholder="· · · · · · · · · ·"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '11px 40px 11px 14px',
                background: 'transparent',
                border: '1px solid var(--border)',
                fontSize: '13px',
                color: 'var(--ink)',
                fontFamily: 'var(--f-mono)',
                outline: 'none',
                borderRadius: 0,
                letterSpacing: '0.1em',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--ink)')}
              onBlur={e  => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            {/* fingerprint icon */}
            <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}
              width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5 1.5 2.5 4 2.5 7c0 2 .5 3.5 1.5 4.5" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M8 3.5C6 3.5 4.5 5 4.5 7c0 1.5.3 2.8 1 3.8" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M8 5.5C7 5.5 6.5 6 6.5 7c0 1 .2 2 .6 2.8" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M8 1.5c3 0 5.5 2.5 5.5 5.5 0 2-.5 3.5-1.5 4.5" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M8 3.5c2 0 3.5 1.5 3.5 3.5 0 1.5-.3 2.8-1 3.8" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* error */}
        {error && (
          <div style={{
            marginBottom: '16px',
            fontFamily: 'var(--f-mono)',
            fontSize: '10px',
            color: 'var(--red)',
            letterSpacing: '0.06em',
          }}>
            {error}
          </div>
        )}

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px',
            background: loading ? 'var(--ink-2)' : 'var(--ink)',
            color: 'var(--bg)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--f-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {loading ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="6" cy="6" r="5" stroke="var(--bg)" strokeWidth="1.5" strokeDasharray="20 10" />
              </svg>
              AUTHENTICATING...
            </>
          ) : (
            'INITIALIZE COMMAND BRIDGE →'
          )}
        </button>

        {/* footer meta */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px',
          fontFamily: 'var(--f-mono)',
          fontSize: '9px',
          color: 'var(--ink-4)',
          letterSpacing: '0.08em',
        }}>
          <span>V4.2.0</span>
          <span>AES-256 · TLS 1.3</span>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

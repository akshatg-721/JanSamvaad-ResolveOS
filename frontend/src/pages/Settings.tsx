import { useState } from 'react';
import Layout from '../components/Layout';

interface Toggle {
  id: string;
  label: string;
  desc: string;
  value: boolean;
  group: string;
}

const INIT: Toggle[] = [
  { id: 'live_uplink',   group: 'CONNECTIVITY',  label: 'Live Uplink',          desc: 'Real-time WebSocket connection to ingestion server',         value: true  },
  { id: 'socket_sync',   group: 'CONNECTIVITY',  label: 'Socket Sync',          desc: 'Synchronize ticket state across all operator terminals',     value: true  },
  { id: 'sms_receipts',  group: 'NOTIFICATIONS', label: 'SMS Receipts',         desc: 'Auto-send Twilio SMS confirmation on grievance resolve',     value: true  },
  { id: 'sla_alerts',    group: 'NOTIFICATIONS', label: 'SLA Breach Alerts',    desc: 'Trigger toast notification on imminent SLA breach',          value: true  },
  { id: 'toast_voice',   group: 'NOTIFICATIONS', label: 'Voice Intake Toasts',  desc: 'Show notification for each new voice call processed',        value: true  },
  { id: 'ai_classify',   group: 'AI MODULE',     label: 'AI Classification',    desc: 'Gemini LLM auto-classify grievance category on intake',      value: true  },
  { id: 'ai_severity',   group: 'AI MODULE',     label: 'AI Severity Scoring',  desc: 'Automated severity assignment based on transcript NLP',      value: true  },
  { id: 'bhashini',      group: 'LANGUAGE',      label: 'Bhashini Transcription',desc: 'Use Bhashini API for Hindi/dialect voice transcription',    value: true  },
  { id: 'auto_escalate', group: 'PROTOCOL',      label: 'Auto Escalation',      desc: 'Escalate CRITICAL tickets after SLA breach to Commissioner', value: false },
  { id: 'qr_receipts',   group: 'PROTOCOL',      label: 'QR-Verified Receipts', desc: 'Generate QR code proof of resolution for field officers',    value: false },
  { id: 'heatmap',       group: 'GIS',           label: 'GIS Heatmap',          desc: 'Render density heatmap layer on GIS Intelligence map',       value: true  },
  { id: 'ward_bounds',   group: 'GIS',           label: 'Ward Boundaries',      desc: 'Show official municipal ward boundary polylines on map',     value: true  },
];

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: '34px', height: '18px',
        background: on ? 'var(--ink)' : 'var(--border)',
        border: 'none', cursor: 'pointer',
        position: 'relative', borderRadius: '9px',
        flexShrink: 0, transition: 'background 0.15s',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px', left: on ? '17px' : '3px',
        width: '12px', height: '12px',
        borderRadius: '50%', background: 'var(--surface)',
        transition: 'left 0.15s', display: 'block',
      }} />
    </button>
  );
}

export default function Settings() {
  const [toggles, setToggles] = useState(INIT);
  const [saved,   setSaved]   = useState(false);

  const flip = (id: string) => setToggles(ts => ts.map(t => t.id === id ? { ...t, value: !t.value } : t));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const groups = Array.from(new Set(INIT.map(t => t.group)));

  return (
    <Layout>
      <div style={{ padding: '28px 30px', maxWidth: '680px' }}>

        {/* page header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--f-serif)',
            fontSize: '26px', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--ink)', letterSpacing: '-0.02em',
          }}>System Configuration</h2>
          <p style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '10px', color: 'var(--ink-4)',
            marginTop: '4px', letterSpacing: '0.06em',
          }}>
            Operator terminal settings — changes take effect immediately
          </p>
        </div>

        {/* operator card */}
        <div style={{
          padding: '18px 20px',
          border: '1px solid var(--border)',
          marginBottom: '28px',
          background: 'var(--surface)',
        }}>
          <div style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '9px', color: 'var(--ink-4)',
            letterSpacing: '0.14em', marginBottom: '14px',
          }}>OPERATOR PROFILE</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {[
              { l: 'OPERATOR ID',    v: 'JS-ADMIN-01' },
              { l: 'CLEARANCE',      v: 'LEVEL 3 — FULL' },
              { l: 'SESSION START',  v: '09:00 IST' },
              { l: 'MUNICIPALITY',   v: 'New Delhi Municipal Corp.' },
              { l: 'TERMINAL',       v: 'TERM-04-NORTH' },
              { l: 'ENCRYPTION',     v: 'AES-256 / TLS 1.3' },
            ].map(row => (
              <div key={row.l}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', letterSpacing: '0.12em', marginBottom: '3px' }}>{row.l}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--ink)' }}>{row.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* toggle groups */}
        {groups.map(group => (
          <div key={group} style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '9px', color: 'var(--ink-4)',
              letterSpacing: '0.14em',
              marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border)',
            }}>
              {group}
            </div>

            {toggles.filter(t => t.group === group).map((t, i, arr) => (
              <div
                key={t.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <div style={{
                    fontFamily: 'var(--f-sans)',
                    fontSize: '13px', color: 'var(--ink)',
                    marginBottom: '2px',
                  }}>{t.label}</div>
                  <div style={{
                    fontFamily: 'var(--f-mono)',
                    fontSize: '10px', color: 'var(--ink-4)',
                    lineHeight: 1.5,
                  }}>{t.desc}</div>
                </div>
                <ToggleSwitch on={t.value} onChange={() => flip(t.id)} />
              </div>
            ))}
          </div>
        ))}

        {/* save + terminal actions */}
        <div style={{
          display: 'flex', gap: '10px', flexWrap: 'wrap',
          paddingTop: '8px',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            onClick={save}
            style={{
              padding: '11px 24px',
              background: 'var(--ink)', color: 'var(--bg)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--f-mono)',
              fontSize: '10px', letterSpacing: '0.12em',
            }}
          >
            {saved ? 'SAVED ✓' : 'SAVE CONFIGURATION'}
          </button>
          <button style={{
            padding: '11px 20px',
            background: 'transparent',
            border: '1px solid var(--border)',
            fontFamily: 'var(--f-mono)',
            fontSize: '10px', letterSpacing: '0.1em',
            color: 'var(--ink-3)', cursor: 'pointer',
          }}>
            RESET DEFAULTS
          </button>
          <button style={{
            padding: '11px 20px',
            background: 'transparent',
            border: '1px solid var(--red)33',
            fontFamily: 'var(--f-mono)',
            fontSize: '10px', letterSpacing: '0.1em',
            color: 'var(--red)', cursor: 'pointer',
          }}>
            FORCE SYNC
          </button>
        </div>

        {/* version footer */}
        <div style={{
          marginTop: '32px',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--f-mono)',
          fontSize: '9px', color: 'var(--ink-4)',
          letterSpacing: '0.08em',
        }}>
          <span>JanSamvaad ResolveOS v4.2.0</span>
          <span>Node 20.x · React 18 · Vite 5</span>
        </div>
      </div>
    </Layout>
  );
}

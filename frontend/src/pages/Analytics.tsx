import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Cell,
} from 'recharts';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';

type Period = '7d' | '30d' | '90d';

const TOOLTIP_STYLE: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 0, fontFamily: 'var(--f-mono)', fontSize: '10px',
  color: 'var(--ink)', padding: '8px 10px', boxShadow: 'none',
};

function StatCard({ label, value, sub, color, delta }: {
  label: string; value: string | number; sub?: string;
  color?: string; delta?: { val: string; up: boolean };
}) {
  return (
    <div style={{
      padding: '18px 20px', border: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: 'var(--ink-3)', marginBottom: '8px', textTransform: 'uppercase' as const }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <div style={{ fontFamily: 'var(--f-serif)', fontSize: '32px', fontStyle: 'italic', color: color || 'var(--ink)', lineHeight: 1 }}>{value}</div>
        {delta && (
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: delta.up ? 'var(--green)' : 'var(--red)', padding: '2px 5px', background: delta.up ? 'var(--green-bg)' : 'var(--red-bg)' }}>
            {delta.up ? '↑' : '↓'} {delta.val}
          </span>
        )}
      </div>
      {sub && <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--ink-3)', textTransform: 'uppercase' as const }}>{title}</div>
      {sub && <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ marginBottom: '4px', color: 'var(--ink-3)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState<Period>('7d');
  const [liveTime, setLiveTime] = useState('');
  
  const [data, setData] = useState<any>({
    trendData: [], categoryTrend: [], hourlyData: [], slaPerformance: [], wardStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<any>('/api/analytics')
      .then(res => {
        if (res) setData(res);
      })
      .catch(err => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tick = () => setLiveTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const wardStats = data.wardStats || [];
  const trendData = data.trendData || [];
  const categoryTrend = data.categoryTrend || [];
  const hourlyData = data.hourlyData || [];
  const slaPerformance = data.slaPerformance || [];

  const totalOpen     = wardStats.reduce((acc: number, w: any) => acc + w.open, 0);
  const totalResolved = wardStats.reduce((acc: number, w: any) => acc + w.resolved, 0);
  const totalInProgress= wardStats.reduce((acc: number, w: any) => acc + w.inProgress, 0);
  const totalGrievances= totalOpen + totalResolved + totalInProgress;
  const avgSLA        = wardStats.length ? wardStats.reduce((a: number, b: any) => a + b.avgResolutionHrs, 0) / wardStats.length : 0;

  const radarData = wardStats.map((w: any) => ({
    ward: w.name.split(' ')[0],
    resolution: w.citizenSatisfaction,
    speed: Math.round(100 - w.avgResolutionHrs * 5),
    coverage: Math.round(w.resolved / Math.max(1, (w.open + w.resolved + w.inProgress)) * 100),
  }));

  const statusDist = [
    { name: 'Open',        value: totalOpen,          color: 'var(--red)' },
    { name: 'In Progress', value: totalInProgress,    color: 'var(--orange)' },
    { name: 'Resolved',    value: totalResolved,       color: 'var(--green)' },
  ];

  const S: React.CSSProperties = {
    padding: '24px', maxWidth: '1400px', margin: '0 auto',
  };

  return (
    <Layout>
      <div style={S}>
        {/* page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', paddingBottom: '18px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: '6px', textTransform: 'uppercase' }}>
              INTELLIGENCE ANALYTICS
            </div>
            <h1 style={{ fontFamily: 'var(--f-serif)', fontSize: '26px', fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1, fontWeight: 400 }}>
              Performance Overview
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(['7d','30d','90d'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
                padding: '6px 12px',
                background: period === p ? 'var(--ink)' : 'transparent',
                color: period === p ? 'var(--bg)' : 'var(--ink-3)',
                border: '1px solid var(--border)',
                cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.12s',
              }}>{p}</button>
            ))}
            <div style={{ padding: '6px 12px', border: '1px solid var(--border)', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', background: 'var(--surface)' }}>
              ● LIVE {liveTime}
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          <StatCard label="Total Grievances" value={totalGrievances} sub="All time records" delta={{ val: '+3 today', up: true }} />
          <StatCard label="Active Open" value={totalOpen} sub="Awaiting action" color="var(--red)" delta={{ val: '-2 vs yesterday', up: false }} />
          <StatCard label="Resolved Today" value={totalResolved} sub="This shift" color="var(--green)" delta={{ val: '+4 vs yesterday', up: true }} />
          <StatCard label="Avg Resolution" value={`${avgSLA.toFixed(1)}h`} sub="Across all wards" color="var(--blue)" delta={{ val: '-0.4h improved', up: false }} />
        </div>

        {/* row 2: trend chart + status dist */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {/* area chart */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="7-Day Intake vs Resolution" sub="Voice calls processed daily" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="intakeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--red)"   stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--red)"   stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="intake"   name="Intake"   stroke="var(--red)"   strokeWidth={1.5} fill="url(#intakeGrad)"   dot={{ fill: 'var(--red)',   r: 3, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="var(--green)" strokeWidth={1.5} fill="url(#resolvedGrad)" dot={{ fill: 'var(--green)', r: 3, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="breached" name="Breached" stroke="var(--orange)" strokeWidth={1.5} fill="none" strokeDasharray="4 3" dot={{ fill: 'var(--orange)', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              {[
                { color: 'var(--red)',    label: 'Intake' },
                { color: 'var(--green)',  label: 'Resolved' },
                { color: 'var(--orange)', label: 'Breached' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '16px', height: '1.5px', background: item.color }} />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--ink-3)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* status distribution */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="Status Distribution" />
            <div style={{ marginBottom: '16px' }}>
              {statusDist.map(s => {
                const pct = Math.round(s.value / grievances.length * 100);
                return (
                  <div key={s.name} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink-2)' }}>{s.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', color: s.color }}>{s.value}</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)' }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: '3px', background: 'var(--bg-raised)' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-3)', marginBottom: '6px', letterSpacing: '0.08em' }}>SEVERITY BREAKDOWN</div>
              {(['CRITICAL','HIGH','MEDIUM','LOW'] as const).map(sev => {
                const colors = { CRITICAL: 'var(--red)', HIGH: 'var(--orange)', MEDIUM: 'var(--amber)', LOW: 'var(--ink-3)' };
                // Extracted from ward stats array directly
                const cnt = sev === 'CRITICAL' ? wardStats.reduce((acc: number, w: any) => acc + w.critical, 0) : 0;
                return (
                  <div key={sev} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: colors[sev] }}>{sev}</span>
                    <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-2)' }}>{sev === 'CRITICAL' ? cnt : '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* row 3: hourly + category bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {/* hourly heatmap-bar */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="Hourly Intake Pattern" sub="Average calls per hour (24h)" />
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={hourlyData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontFamily: 'var(--f-mono)', fontSize: 8, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fontFamily: 'var(--f-mono)', fontSize: 8, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Calls" radius={0}>
                  {hourlyData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.count >= 12 ? 'var(--red)' : entry.count >= 8 ? 'var(--orange)' : entry.count >= 4 ? 'var(--amber)' : 'var(--border-hi)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', marginTop: '8px' }}>
              Peak hours: 09:00–11:00 · 15:00–17:00 IST
            </div>
          </div>

          {/* category bar chart */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="Category Distribution" sub="Total grievances by type" />
            <div style={{ overflowY: 'auto', maxHeight: '190px' }}>
              {categoryTrend.map(item => {
                const pct = Math.round(item.count / categoryTrend.reduce((a, b) => a + b.count, 0) * 100);
                return (
                  <div key={item.cat} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-2)' }}>{item.cat}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--ink)' }}>{item.count}</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--ink-4)' }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: '2px', background: 'var(--bg-raised)' }}>
                      <div style={{ height: '100%', width: `${pct * 3}%`, maxWidth: '100%', background: item.color, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* row 4: SLA performance + ward radar + ward table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {/* SLA line chart */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="SLA Performance" sub="Weekly on-time resolution %" />
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={slaPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} domain={[60,100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="onTime" name="On Time %" stroke="var(--green)" strokeWidth={2} dot={{ fill: 'var(--green)', r: 4, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="breached" name="Breached %" stroke="var(--red)" strokeWidth={1.5} strokeDasharray="4 3" dot={{ fill: 'var(--red)', r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* radar */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="Ward Performance Radar" sub="Satisfaction · Speed · Coverage" />
            <ResponsiveContainer width="100%" height={160}>
              <RadarChart data={radarData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="ward" tick={{ fontFamily: 'var(--f-mono)', fontSize: 8, fill: 'var(--ink-3)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Satisfaction" dataKey="resolution" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="Speed"        dataKey="speed"      stroke="var(--green)" fill="var(--green)" fillOpacity={0.08} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* ward comparison */}
          <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <SectionHeader title="Ward Comparison" sub="Resolution efficiency" />
            <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
              {[...wardStats].sort((a, b) => b.citizenSatisfaction - a.citizenSatisfaction).map((w, i) => (
                <div key={w.ward} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', width: '12px' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-2)' }}>{w.name}</div>
                    <div style={{ height: '2px', background: 'var(--bg-raised)', marginTop: '2px' }}>
                      <div style={{
                        height: '100%', width: `${w.citizenSatisfaction}%`,
                        background: w.citizenSatisfaction >= 75 ? 'var(--green)' : w.citizenSatisfaction >= 55 ? 'var(--amber)' : 'var(--red)',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', color: 'var(--ink-2)', width: '32px', textAlign: 'right' }}>
                    {w.citizenSatisfaction}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* row 5: total volume bar */}
        <div style={{ padding: '20px', border: '1px solid var(--border)', background: 'var(--surface)', marginBottom: '28px' }}>
          <SectionHeader title="Weekly Volume — Intake vs Resolution vs Breach" sub="7-day operational summary" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trendData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'var(--f-mono)', fontSize: 9, fill: 'var(--ink-3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="intake"   name="Intake"   fill="var(--red)"    fillOpacity={0.7} />
              <Bar dataKey="resolved" name="Resolved" fill="var(--green)"  fillOpacity={0.8} />
              <Bar dataKey="breached" name="Breached" fill="var(--orange)" fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* footer note */}
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--ink-4)', textAlign: 'center', paddingBottom: '12px' }}>
          Data refreshes in real-time via WebSocket · All times IST · JanSamvaad ResolveOS v4.2.0
        </div>
      </div>
    </Layout>
  );
}

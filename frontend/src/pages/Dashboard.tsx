import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';
import { Grievance, Status, ApiTicket, mapTicket } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  ArrowUpRight,
  Upload,
  X,
  Zap,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';

/* ── UI Components ── */

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`card-premium p-6 ${className}`}>
    {children}
  </div>
);

const SevBadge = ({ s }: { s: string }) => {
  const configs: Record<string, { color: string, bg: string }> = {
    CRITICAL: { color: 'text-[var(--red)]', bg: 'bg-red-500/10 border-red-500/20' },
    HIGH:     { color: 'text-orange-400',   bg: 'bg-orange-400/10 border-orange-400/20' },
    MEDIUM:   { color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20' },
    LOW:      { color: 'text-[var(--ink-4)]', bg: 'bg-gray-400/10 border-gray-400/20' },
  };
  const c = configs[s] || configs.LOW;
  return (
    <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full border ${c.bg} ${c.color} text-[10px] font-bold tracking-wide uppercase w-fit`}>
      <span className={`w-1 h-1 rounded-full bg-current ${s === 'CRITICAL' ? 'animate-pulse' : ''}`} />
      {s}
    </div>
  );
};

const StatusBadge = ({ s }: { s: string }) => {
  const styles: Record<string, string> = {
    'OPEN':        'text-[var(--blue)] border-[var(--blue)]/30 bg-[var(--blue)]/5',
    'IN-PROGRESS': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
    'RESOLVED':    'text-[var(--green)] border-[var(--green)]/30 bg-[var(--green)]/5',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wide uppercase ${styles[s] || 'text-[var(--ink-4)] border-[var(--border)]'}`}>
      {s}
    </span>
  );
};

/* ── Modal ── */
const TicketModal = ({ ticket, onClose, onResolve }: { ticket: Grievance, onClose: () => void, onResolve: (id: string) => void }) => {
  if (!ticket) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="glass border-[var(--border-hi)] w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
               <span className="text-[12px] font-mono text-[var(--ink-4)] tracking-widest uppercase">Ticket Reference</span>
               <StatusBadge s={ticket.status} />
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight mt-2">{ticket.refId}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-raised)] rounded-xl transition-all text-[var(--ink-4)] hover:text-[var(--ink)]">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 max-h-[70vh] custom-scrollbar">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-widest flex items-center gap-1.5"><Zap size={10}/> Category</span>
              <p className="text-[14px] font-medium">{ticket.category}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10}/> Ward</span>
              <p className="text-[14px] font-medium">{ticket.wardName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10}/> Severity</span>
              <SevBadge s={ticket.severity} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10}/> Deadline</span>
              <div className="flex items-center gap-2 text-[14px] font-mono font-bold">
                <span className={ticket.slaTimer === 'BREACHED' ? 'text-[var(--red)]' : 'text-[var(--blue)]'}>{ticket.slaTimer}</span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-[#0A0A0A] p-6 rounded-xl border border-[var(--border)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue-glow)] blur-3xl rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            <p className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[var(--blue)] shadow-[0_0_8px_var(--blue)]" />
              Intelligent Transcript Summary
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--ink-2)] font-medium">
              "{ticket.transcript || 'Citizen reported issue via voice uplink. Initial classification suggests urgent attention required for municipal maintenance and rapid response.'}"
            </p>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-3">
            <p className="text-[10px] text-[var(--ink-4)] font-bold uppercase tracking-widest">Resolution Verification Evidence</p>
            <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 flex flex-col items-center justify-center text-[var(--ink-4)] hover:border-[var(--blue)] hover:bg-[var(--blue)]/5 transition-all cursor-pointer group">
              <Upload size={32} className="mb-4 group-hover:text-[var(--blue)] group-hover:scale-110 transition-all duration-300" />
              <p className="text-[14px] font-semibold text-[var(--ink-2)]">Drag and drop evidence assets</p>
              <p className="text-[11px] mt-1 opacity-60">High-resolution JPEG or PNG preferred</p>
            </div>
          </div>
        </div>

        <div className="p-8 pt-4 flex gap-4 bg-[var(--surface-raised)]/30">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-[12px] font-bold border border-[var(--border)] hover:bg-[var(--surface-raised)] transition-all rounded-xl uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onResolve(ticket.id); onClose(); }}
            disabled={ticket.status === 'RESOLVED'}
            className={`flex-[2] py-3 text-[12px] font-bold rounded-xl transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg ${
              ticket.status === 'RESOLVED' 
              ? 'bg-[var(--surface-raised)] text-[var(--ink-4)] cursor-not-allowed border border-[var(--border)]' 
              : 'bg-[var(--ink)] text-[var(--bg)] hover:bg-white active:scale-[0.97]'
            }`}
          >
            <CheckCircle2 size={18} />
            Finalize Resolution
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Dashboard ── */

export default function Dashboard() {
  const [tickets, setTickets] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState<Grievance | null>(null);
  const [filterWard, setFilterWard] = useState('ALL');
  const [filterSev, setFilterSev] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch<ApiTicket[]>('/api/tickets');
        if (res) setTickets(res.map(mapTicket));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED' as Status } : t));
    apiFetch(`/api/tickets/${id}/resolve`, { method: 'POST' }).catch(console.error);
  };

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (filterWard !== 'ALL' && t.wardName !== filterWard) return false;
      if (filterSev !== 'ALL' && t.severity !== filterSev) return false;
      return true;
    });
  }, [tickets, filterWard, filterSev]);

  const stats = useMemo(() => {
    const wards = Array.from(new Set(tickets.map(t => t.wardName))).sort();
    const wardData = wards.map(w => ({
      name: w.replace('Ward ', 'W'),
      unresolved: tickets.filter(t => t.wardName === w && t.status !== 'RESOLVED').length
    }));

    const slaData = [
      { time: '08:00', breaches: 2 },
      { time: '10:00', breaches: 5 },
      { time: '12:00', breaches: 3 },
      { time: '14:00', breaches: 8 },
      { time: '16:00', breaches: 4 },
      { time: '18:00', breaches: 6 },
    ];

    return { wardData, slaData };
  }, [tickets]);

  return (
    <Layout>
      <div className="space-y-8 max-w-[1400px] mx-auto pt-6 pb-12 animate-fade-in px-4 lg:px-0">
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 relative overflow-hidden group h-[350px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--blue-glow)] blur-[100px] rounded-full -mr-32 -mt-32 opacity-20" />
            <div className="relative z-10 flex flex-col h-full">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-[16px] font-bold font-display tracking-tight">Municipal Response Latency</h3>
                  <p className="text-[11px] text-[var(--ink-4)] font-medium uppercase tracking-widest mt-1">SLA Breach Points by Hour</p>
                </div>
                <div className="p-2 bg-[var(--surface-raised)] rounded-lg">
                  <Clock size={16} className="text-[var(--blue)]" />
                </div>
              </header>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.slaData}>
                    <defs>
                      <linearGradient id="colorBreach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ink-4)' }} dy={10} />
                    <YAxis hide />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="breaches" 
                      stroke="var(--blue)" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorBreach)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="h-[350px] flex flex-col">
            <header className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[16px] font-bold font-display tracking-tight">Geographic Density</h3>
                <p className="text-[11px] text-[var(--ink-4)] font-medium uppercase tracking-widest mt-1">Unresolved Issues</p>
              </div>
            </header>
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stats.wardData}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--ink-4)' }} />
                   <Tooltip cursor={{ fill: 'var(--surface-raised)' }} />
                   <Bar dataKey="unresolved" radius={[6, 6, 0, 0]}>
                     {stats.wardData.map((_entry, index) => (
                       <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--blue)' : 'var(--border-hi)'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Operational Table */}
        <Card className="!p-0 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 flex items-center justify-between bg-[var(--surface-raised)]/30 backdrop-blur-sm border-b border-[var(--border)]">
            <div className="flex items-center gap-4">
               <div>
                 <h3 className="text-[16px] font-bold font-display tracking-tight">Active Operation Queue</h3>
                 <p className="text-[11px] text-[var(--ink-4)] font-medium mt-1 uppercase tracking-[0.1em]">Real-time system telemetry</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-[#000] border border-[var(--border)] rounded-full group cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse shadow-[0_0_8px_var(--green)]" />
                  <span className="text-[10px] font-bold font-mono text-[var(--ink-2)]">{filtered.length} Live Feeds</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <select 
                  value={filterWard}
                  onChange={e => setFilterWard(e.target.value)}
                  className="bg-[var(--surface)] border border-[var(--border)] text-[11px] font-bold px-4 py-2 rounded-lg outline-none focus:border-[var(--blue)] transition-all cursor-pointer"
                >
                  <option value="ALL">All Wards</option>
                  {[1,2,3,4,5].map(w => <option key={w} value={`Ward ${w}`}>Ward {w}</option>)}
                </select>
                <select 
                  value={filterSev}
                  onChange={e => setFilterSev(e.target.value)}
                  className="bg-[var(--surface)] border border-[var(--border)] text-[11px] font-bold px-4 py-2 rounded-lg outline-none focus:border-[var(--blue)] transition-all cursor-pointer"
                >
                  <option value="ALL">All Urgency</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="MEDIUM">Medium</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-subtle)]/50">
                  <th className="pl-8 pr-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold">Reference ID</th>
                  <th className="px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold">Category</th>
                  <th className="px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold">Location</th>
                  <th className="px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold">Urgency</th>
                  <th className="px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold">SLA State</th>
                  <th className="px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-[var(--ink-5)] font-bold text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((t) => (
                  <tr 
                    key={t.id} 
                    onClick={() => setActiveTicket(t)}
                    className="hover:bg-[var(--surface-hover)] transition-all duration-200 cursor-pointer group"
                  >
                    <td className="pl-8 pr-4 py-5">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${t.status === 'RESOLVED' ? 'bg-[var(--green)]' : 'bg-[var(--blue)] animate-pulse shadow-[0_0_8px_var(--blue)]'}`} />
                         <span className="font-bold text-[14px] text-[var(--ink)] tracking-tight">{t.refId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-[13px] text-[var(--ink-2)] font-medium">{t.category}</td>
                    <td className="px-4 py-5 text-[13px] text-[var(--ink-3)] font-medium">{t.wardName}</td>
                    <td className="px-4 py-5"><SevBadge s={t.severity} /></td>
                    <td className="px-4 py-5 font-mono text-[12px] font-bold">
                       <span className={t.slaTimer === 'BREACHED' ? 'text-[var(--red)]' : 'text-[var(--ink-4)]'}>
                         {t.status === 'RESOLVED' ? <div className="text-[var(--green)]">CLOSED</div> : t.slaTimer}
                       </span>
                    </td>
                    <td className="px-4 py-5 text-right pr-8">
                       <div className="flex items-center justify-end gap-2">
                         <StatusBadge s={t.status} />
                         <div className="p-2 rounded-lg group-hover:bg-[var(--blue-glow)] group-hover:text-[var(--blue)] transition-all">
                           <ArrowUpRight size={18} />
                         </div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-[var(--ink-5)] gap-4">
                <AlertCircle size={48} className="opacity-20" />
                <p className="text-[12px] font-bold uppercase tracking-[0.2em]">Queue Synchronized • No Records</p>
              </div>
            )}
          </div>
        </Card>

        {activeTicket && (
          <TicketModal 
            ticket={activeTicket} 
            onClose={() => setActiveTicket(null)} 
            onResolve={handleResolve}
          />
        )}
      </div>
    </Layout>
  );
}


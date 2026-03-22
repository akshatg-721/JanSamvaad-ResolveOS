'use client';

import { useDashboardStats, useTickets, useRealtimeSocket, useActivity, type Ticket, type ActivityItem } from '@/hooks/use-dashboard';
import { apiFetch } from '@/lib/api-client';
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

// ── Severity Badge ─────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    Critical: 'bg-red-900/50 text-red-300 border-red-800',
    High: 'bg-orange-900/50 text-orange-300 border-orange-800',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
    Low: 'bg-green-900/50 text-green-300 border-green-800',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${colors[severity] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
      {severity}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'text-blue-400',
    in_progress: 'text-yellow-400',
    'in-progress': 'text-yellow-400',
    resolved: 'text-green-400',
    closed: 'text-zinc-400',
  };
  return (
    <span className={`text-[11px] font-medium capitalize ${colors[status] ?? 'text-zinc-500'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const { stats, isLoading } = useDashboardStats();

  const items = stats
    ? [
        { label: 'Open Tickets', value: stats.open, accent: 'text-blue-400' },
        { label: 'Resolved Today', value: stats.closed, accent: 'text-green-400' },
        { label: 'SLA Hit Rate', value: stats.slaHitRate, accent: 'text-[#A3C9AA]' },
        { label: 'Breach Risk', value: stats.breach_risk, accent: 'text-red-400' },
      ]
    : Array(4).fill(null);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col gap-2">
          {isLoading || !item ? (
            <>
              <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
            </>
          ) : (
            <>
              <span className={`text-3xl font-light font-mono ${item.accent}`}>{item.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8A80]">{item.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Ticket Table ──────────────────────────────────────────────────────────────
function TicketTable({ statusFilter, severityFilter, search }: {
  statusFilter: string;
  severityFilter: string;
  search: string;
}) {
  const { tickets, isLoading, refresh } = useTickets({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    severity: severityFilter !== 'all' ? severityFilter : undefined,
  });
  const [resolvingIds, setResolvingIds] = useState<Record<number, boolean>>({});

  // Subscribe to real-time socket and refresh data on events
  useRealtimeSocket({
    onTicketCreated: () => refresh(),
    onTicketResolved: () => refresh(),
  });

  const handleResolve = useCallback(async (ticketId: number) => {
    setResolvingIds((prev) => ({ ...prev, [ticketId]: true }));
    try {
      await apiFetch(`/api/complaints/${ticketId}/status`, { 
        method: 'POST',
        body: JSON.stringify({ status: 'RESOLVED', comment: 'Resolved from dashboard' })
      });
      toast.success('Ticket resolved successfully');
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to resolve ticket');
    } finally {
      setResolvingIds((prev) => ({ ...prev, [ticketId]: false }));
    }
  }, [refresh]);

  const filtered = tickets.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.ref.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array(5).fill(null).map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-24 text-[#8E8A80]">
        <p className="text-4xl mb-4">📭</p>
        <p className="font-light">No tickets found{search ? ` matching "${search}"` : ''}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-white/10 text-[#8E8A80]">
            <th className="pb-4 pr-6 font-mono text-[10px] tracking-widest uppercase">Ref</th>
            <th className="pb-4 pr-6 font-mono text-[10px] tracking-widest uppercase">Category</th>
            <th className="pb-4 pr-6 font-mono text-[10px] tracking-widest uppercase hidden md:table-cell">Ward</th>
            <th className="pb-4 pr-6 font-mono text-[10px] tracking-widest uppercase">Severity</th>
            <th className="pb-4 pr-6 font-mono text-[10px] tracking-widest uppercase">Status</th>
            <th className="pb-4 font-mono text-[10px] tracking-widest uppercase text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {filtered.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-white/5 transition-colors duration-200 group">
              <td className="py-4 pr-6 font-mono text-[#A3C9AA] text-xs">{ticket.ref}</td>
              <td className="py-4 pr-6 text-[#C2BCB0] capitalize">{ticket.category}</td>
              <td className="py-4 pr-6 text-[#8E8A80] text-xs hidden md:table-cell">
                {ticket.ward_name || (ticket.ward_id ? `Ward ${ticket.ward_id}` : '—')}
              </td>
              <td className="py-4 pr-6"><SeverityBadge severity={ticket.severity} /></td>
              <td className="py-4 pr-6"><StatusBadge status={ticket.status} /></td>
              <td className="py-4 text-right">
                <button
                  onClick={() => handleResolve(ticket.id)}
                  disabled={ticket.status === 'resolved' || ticket.status === 'closed' || resolvingIds[ticket.id]}
                  className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm transition-all duration-200 ${
                    ticket.status === 'resolved' || ticket.status === 'closed'
                      ? 'text-zinc-600 cursor-not-allowed'
                      : 'bg-[#A3C9AA]/10 border border-[#A3C9AA]/30 text-[#A3C9AA] hover:bg-[#A3C9AA]/20'
                  }`}
                >
                  {resolvingIds[ticket.id] ? '...' : ticket.status === 'resolved' || ticket.status === 'closed' ? 'Done' : 'Resolve'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
function ActivityFeed() {
  const { activity, isLoading } = useActivity();

  const typeConfig: Record<string, { color: string; icon: string }> = {
    voice: { color: 'text-blue-400', icon: '🎙️' },
    escalation: { color: 'text-red-400', icon: '🚨' },
    verify: { color: 'text-green-400', icon: '✅' },
    system: { color: 'text-zinc-400', icon: '⚙️' },
  };

  return (
    <div className="bg-[#0c0c0c]/80 border border-white/10 rounded-lg p-6 h-full max-h-[500px] overflow-y-auto">
      <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] uppercase mb-4">Live Activity</div>
      {isLoading ? (
        <div className="space-y-3">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 font-mono text-[11px]">
          {activity.map((item) => {
            const cfg = typeConfig[item.type] ?? typeConfig.system;
            return (
              <div key={item.id} className="flex gap-3 items-start py-1 hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                <span className="shrink-0">{cfg.icon}</span>
                <span className={`shrink-0 w-8 text-[#8E8A80]`}>{item.time}</span>
                <span className={`${cfg.color} truncate`}>{item.message}</span>
              </div>
            );
          })}
          {activity.length === 0 && (
            <p className="text-[#8E8A80] text-center py-8">No recent activity</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── DashboardShell (main export) ──────────────────────────────────────────────
export default function DashboardShell() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  return (
    <div className="min-h-screen bg-[#050505] text-[#F8F5F0] p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-2">Operations Center</p>
        <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
      </div>

      {/* Stats */}
      <StatsBar />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
        {/* Ticket Management */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-light">Ticket Queue</h2>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Search ref or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tickets"
                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-xs text-[#F8F5F0] placeholder:text-[#8E8A80] focus:outline-none focus:border-[#A3C9AA]/50 w-48"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#A3C9AA]/50"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                aria-label="Filter by severity"
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-[#F8F5F0] focus:outline-none focus:border-[#A3C9AA]/50"
              >
                <option value="all">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <TicketTable statusFilter={statusFilter} severityFilter={severityFilter} search={search} />
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </div>
  );
}

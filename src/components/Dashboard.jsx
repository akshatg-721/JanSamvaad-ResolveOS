import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function maskPhone(phone) {
  if (!phone) return 'N/A';
  const normalized = String(phone);
  if (normalized.length < 4) return normalized;
  const prefix = normalized.startsWith('+91') ? '+91' : normalized.slice(0, 2);
  const suffix = normalized.slice(-4);
  return `${prefix}******${suffix}`;
}

function normalizeSeverity(value) {
  const raw = String(value || '').trim().toUpperCase();
  const valid = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  return valid.includes(raw) ? raw : 'MEDIUM';
}

function normalizeStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (['open', 'in_progress', 'resolved'].includes(raw)) return raw;
  if (raw === 'closed') return 'resolved';
  return 'open';
}

function formatClock(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatRelativeTime(value) {
  if (!value) return 'just now';
  const delta = Date.now() - new Date(value).getTime();
  const sec = Math.max(0, Math.floor(delta / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  return `${day} day${day === 1 ? '' : 's'} ago`;
}

function formatCountdown(deadline, nowMs) {
  if (!deadline) return { label: 'No SLA', tone: 'text-slate-300', urgent: false };
  const diff = new Date(deadline).getTime() - nowMs;
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  const label = `${diff < 0 ? '-' : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (diff < 0) {
    return { label: `BREACHED ${label}`, tone: 'text-red-300', urgent: true };
  }
  if (diff <= 30 * 60000) {
    return { label, tone: 'text-red-300', urgent: true };
  }
  if (diff <= 2 * 3600000) {
    return { label, tone: 'text-yellow-300', urgent: false };
  }
  return { label, tone: 'text-green-300', urgent: false };
}

function formatTrend(value) {
  if (value > 0) return { icon: '▲', cls: 'text-emerald-300', text: `+${value}` };
  if (value < 0) return { icon: '▼', cls: 'text-rose-300', text: `${value}` };
  return { icon: '•', cls: 'text-slate-400', text: '0' };
}

function displayCategory(category) {
  const raw = String(category || '').trim().toLowerCase();
  if (!raw || raw === 'unclassified' || raw === 'other' || raw === 'unknown') {
    return 'General Complaint';
  }
  if (raw.includes('road')) return 'Road Damage';
  if (raw.includes('pothole')) return 'Pothole';
  if (raw.includes('water')) return 'Water Leakage';
  if (raw.includes('electricity') || raw.includes('power')) return 'Electricity Outage';
  if (raw.includes('sanitation') || raw.includes('garbage')) return 'Garbage Collection';
  if (raw.includes('drainage')) return 'Drainage Blocked';
  if (raw.includes('street light') || raw.includes('streetlight')) return 'Street Light';
  if (raw.includes('noise')) return 'Noise Complaint';
  if (raw.includes('sewage')) return 'Sewage Overflow';
  if (raw.includes('park')) return 'Park Maintenance';
  return 'General Complaint';
}

function displayWard(ticket) {
  if (ticket && ticket.ward_name) {
    return ticket.ward_name;
  }
  if (ticket && ticket.ward_id !== null && ticket.ward_id !== undefined && `${ticket.ward_id}` !== '') {
    return `Ward ${ticket.ward_id}`;
  }
  return '—';
}

function displaySummary(ticket) {
  const raw = String(ticket?.summary || ticket?.ai_summary || '').trim();
  if (!raw) {
    return 'No summary available';
  }
  return raw;
}

function getDepartmentMeta(category) {
  const value = displayCategory(category).toLowerCase();
  if (value.includes('road') || value.includes('pothole') || value.includes('street')) {
    return { label: '🛣️ Roads Dept', badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/50' };
  }
  if (value.includes('water') || value.includes('drainage')) {
    return { label: '💧 Water Dept', badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' };
  }
  if (value.includes('electricity') || value.includes('power')) {
    return { label: '⚡ Electricity Dept', badgeClass: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' };
  }
  if (value.includes('sanitation') || value.includes('garbage') || value.includes('waste')) {
    return { label: '🗑️ Sanitation Dept', badgeClass: 'bg-green-500/20 text-green-300 border border-green-500/50' };
  }
  return { label: '📋 General Dept', badgeClass: 'bg-slate-500/20 text-slate-300 border border-slate-500/50' };
}

function seededWardFromTicket(ticket) {
  const seed = `${ticket?.id || ''}${ticket?.ref || ''}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 997;
  }
  return (Math.abs(hash) % 10) + 1;
}

function normalizeWardId(value, ticket) {
  if (value === null || value === undefined || value === '—') {
    return seededWardFromTicket(ticket);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return seededWardFromTicket(ticket);
  }
  return Math.floor(parsed);
}

function normalizeTicket(ticket) {
  const wardId = normalizeWardId(ticket?.ward_id, ticket);
  return {
    ...ticket,
    ward_id: wardId,
    severity: normalizeSeverity(ticket?.severity),
    status: normalizeStatus(ticket?.status),
    phone: maskPhone(ticket?.phone),
    created_at: ticket?.created_at || new Date().toISOString(),
    summary: ticket?.summary || ticket?.ai_summary || ''
  };
}

function buildDemoTicket({
  id,
  ref,
  category,
  ward_id,
  severity,
  status,
  hoursAgo,
  phone,
  summary,
  resolutionHours
}) {
  const createdAt = new Date(Date.now() - hoursAgo * 3600000);
  const slaWindow = severity === 'CRITICAL' ? 24 : severity === 'HIGH' ? 48 : severity === 'MEDIUM' ? 72 : 96;
  const resolvedAt = status === 'resolved' && resolutionHours
    ? new Date(createdAt.getTime() + resolutionHours * 3600000)
    : null;
  return normalizeTicket({
    id,
    ref,
    category,
    ward_id,
    severity,
    status,
    phone,
    summary,
    created_at: createdAt.toISOString(),
    resolved_at: resolvedAt ? resolvedAt.toISOString() : null,
    sla_deadline: new Date(createdAt.getTime() + slaWindow * 3600000).toISOString(),
    evidence_url: status === 'resolved' ? `${API}/evidence/${ref.toLowerCase()}` : null
  });
}

const DEMO_TICKETS = [
  buildDemoTicket({ id: 1, ref: 'GRV-A1B2C3', category: 'Pothole', ward_id: 3, severity: 'HIGH', status: 'open', hoursAgo: 6, phone: '+919812345601', summary: 'Resident reports large pothole near Ward 3 market causing vehicle tire damage.' }),
  buildDemoTicket({ id: 2, ref: 'GRV-D4E5F6', category: 'Water Leakage', ward_id: 1, severity: 'CRITICAL', status: 'open', hoursAgo: 4, phone: '+919812345602', summary: 'Major pipeline leak near school in Ward 1 flooding footpath and blocking traffic.' }),
  buildDemoTicket({ id: 3, ref: 'GRV-G7H8I9', category: 'Street Light', ward_id: 5, severity: 'MEDIUM', status: 'in_progress', hoursAgo: 18, phone: '+919812345603', summary: 'Three street lights not working on Ward 5 main lane creating safety concern at night.' }),
  buildDemoTicket({ id: 4, ref: 'GRV-J1K2L3', category: 'Garbage Collection', ward_id: 2, severity: 'HIGH', status: 'open', hoursAgo: 12, phone: '+919812345604', summary: 'Garbage pileup outside apartment gate in Ward 2 attracting stray animals.' }),
  buildDemoTicket({ id: 5, ref: 'GRV-M4N5O6', category: 'Electricity Outage', ward_id: 4, severity: 'CRITICAL', status: 'in_progress', hoursAgo: 9, phone: '+919812345605', summary: 'Frequent power outage in Ward 4 block B affecting small shops and clinics.' }),
  buildDemoTicket({ id: 6, ref: 'GRV-P7Q8R9', category: 'Drainage Blocked', ward_id: 6, severity: 'HIGH', status: 'open', hoursAgo: 20, phone: '+919812345606', summary: 'Drain near Ward 6 bus stand is blocked and overflow starts after light rain.' }),
  buildDemoTicket({ id: 7, ref: 'GRV-S1T2U3', category: 'Road Damage', ward_id: 3, severity: 'MEDIUM', status: 'resolved', hoursAgo: 34, resolutionHours: 4, phone: '+919812345607', summary: 'Road surface cracked near Ward 3 hospital entry; patchwork requested by residents.' }),
  buildDemoTicket({ id: 8, ref: 'GRV-V4W5X6', category: 'Noise Complaint', ward_id: 7, severity: 'LOW', status: 'open', hoursAgo: 5, phone: '+919812345608', summary: 'Late-night loudspeaker noise near Ward 7 temple disturbing senior citizens.' }),
  buildDemoTicket({ id: 9, ref: 'GRV-Y7Z8A9', category: 'Sewage Overflow', ward_id: 2, severity: 'HIGH', status: 'in_progress', hoursAgo: 16, phone: '+919812345609', summary: 'Sewage overflow reported in Ward 2 residential lane causing foul smell and hygiene risk.' }),
  buildDemoTicket({ id: 10, ref: 'GRV-B1C2D3', category: 'Park Maintenance', ward_id: 8, severity: 'LOW', status: 'resolved', hoursAgo: 27, resolutionHours: 3, phone: '+919812345610', summary: 'Broken swings and overgrown grass in Ward 8 children park fixed after complaint.' }),
  buildDemoTicket({ id: 11, ref: 'GRV-E4F5G6', category: 'Pothole', ward_id: 1, severity: 'MEDIUM', status: 'open', hoursAgo: 30, phone: '+919812345611', summary: 'Medium pothole near Ward 1 dairy booth causing two-wheeler skidding incidents.' }),
  buildDemoTicket({ id: 12, ref: 'GRV-H7I8J9', category: 'Water Leakage', ward_id: 4, severity: 'HIGH', status: 'resolved', hoursAgo: 36, resolutionHours: 5, phone: '+919812345612', summary: 'Water leakage from overhead valve in Ward 4 repaired by pipeline team.' }),
  buildDemoTicket({ id: 13, ref: 'GRV-K1L2M3', category: 'Street Light', ward_id: 5, severity: 'LOW', status: 'in_progress', hoursAgo: 22, phone: '+919812345613', summary: 'Single street light flickering in Ward 5 internal road; maintenance team assigned.' }),
  buildDemoTicket({ id: 14, ref: 'GRV-N4O5P6', category: 'Garbage Collection', ward_id: 6, severity: 'MEDIUM', status: 'open', hoursAgo: 14, phone: '+919812345614', summary: 'Missed garbage pickup for two days in Ward 6 apartment cluster.' }),
  buildDemoTicket({ id: 15, ref: 'GRV-Q7R8S9', category: 'Electricity Outage', ward_id: 2, severity: 'CRITICAL', status: 'open', hoursAgo: 3, phone: '+919812345615', summary: 'Transformer fault in Ward 2 causing complete outage for multiple blocks.' }),
  buildDemoTicket({ id: 16, ref: 'GRV-T1U2V3', category: 'Drainage Blocked', ward_id: 7, severity: 'HIGH', status: 'resolved', hoursAgo: 32, resolutionHours: 6, phone: '+919812345616', summary: 'Ward 7 drainage line desilted and waterlogging cleared within same day.' }),
  buildDemoTicket({ id: 17, ref: 'GRV-W4X5Y6', category: 'Road Damage', ward_id: 8, severity: 'MEDIUM', status: 'in_progress', hoursAgo: 26, phone: '+919812345617', summary: 'Road edge collapse near Ward 8 flyover service lane under repair planning.' }),
  buildDemoTicket({ id: 18, ref: 'GRV-Z7A8B9', category: 'Noise Complaint', ward_id: 3, severity: 'LOW', status: 'open', hoursAgo: 8, phone: '+919812345618', summary: 'Construction noise before permitted hours reported in Ward 3 residential pocket.' }),
  buildDemoTicket({ id: 19, ref: 'GRV-C1D2E3', category: 'Sewage Overflow', ward_id: 1, severity: 'MEDIUM', status: 'in_progress', hoursAgo: 19, phone: '+919812345619', summary: 'Intermittent sewage overflow near Ward 1 metro gate under field inspection.' }),
  buildDemoTicket({ id: 20, ref: 'GRV-F4G5H6', category: 'Park Maintenance', ward_id: 5, severity: 'LOW', status: 'resolved', hoursAgo: 24, resolutionHours: 2, phone: '+919812345620', summary: 'Ward 5 park lighting and benches repaired after repeated resident complaints.' }),
  buildDemoTicket({ id: 21, ref: 'GRV-I7J8K9', category: 'Pothole', ward_id: 4, severity: 'HIGH', status: 'in_progress', hoursAgo: 10, phone: '+919812345621', summary: 'Deep pothole at Ward 4 junction marked and temporary filling started.' }),
  buildDemoTicket({ id: 22, ref: 'GRV-L1M2N3', category: 'Water Leakage', ward_id: 6, severity: 'MEDIUM', status: 'open', hoursAgo: 11, phone: '+919812345622', summary: 'Slow but continuous water leakage in Ward 6 lane affecting daily supply pressure.' }),
  buildDemoTicket({ id: 23, ref: 'GRV-O4P5Q6', category: 'Street Light', ward_id: 2, severity: 'MEDIUM', status: 'resolved', hoursAgo: 28, resolutionHours: 7, phone: '+919812345623', summary: 'Street light controller in Ward 2 replaced and corridor lighting restored.' }),
  buildDemoTicket({ id: 24, ref: 'GRV-R7S8T9', category: 'Garbage Collection', ward_id: 8, severity: 'MEDIUM', status: 'resolved', hoursAgo: 40, resolutionHours: 8, phone: '+919812345624', summary: 'Bulk waste cleared from Ward 8 market lane with follow-up collection schedule set.' }),
  buildDemoTicket({ id: 25, ref: 'GRV-U1V2W3', category: 'Electricity Outage', ward_id: 7, severity: 'HIGH', status: 'in_progress', hoursAgo: 7, phone: '+919812345625', summary: 'Localized power interruption in Ward 7 due to feeder tripping under restoration.' })
];

function decodeJwtUsername(token) {
  try {
    const payloadPart = String(token || '').split('.')[1];
    if (!payloadPart) {
      return 'Operator';
    }
    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = `${normalized}${'='.repeat((4 - (normalized.length % 4)) % 4)}`;
    const payload = JSON.parse(atob(padded));
    return payload?.username || 'Operator';
  } catch (error) {
    return 'Operator';
  }
}

function getInitials(name) {
  const tokens = String(name || 'Operator').trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return 'OP';
  }
  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase();
  }
  return `${tokens[0][0] || ''}${tokens[1][0] || ''}`.toUpperCase();
}

function useAnimatedNumber(value, duration = 800) {
  const [display, setDisplay] = useState(0);
  const previousRef = useRef(0);

  useEffect(() => {
    const start = previousRef.current;
    const end = Number(value || 0);
    const startTime = performance.now();

    let raf = 0;
    const step = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const next = Math.round(start + (end - start) * progress);
      setDisplay(next);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        previousRef.current = end;
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

/* props: { title, value, trend, accent, delayMs } */
const KPICard = memo(function KPICard({ title, value, trend, accent, delayMs }) {
  const animated = useAnimatedNumber(value, 800);
  const trendMeta = formatTrend(trend);

  return (
    <div
      className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20 transition-all duration-200 ease-in-out"
      style={{ animation: `kpiIn 420ms ease-in-out ${delayMs}ms both` }}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-3xl font-semibold ${accent}`}>{animated.toLocaleString()}</p>
        <p className={`text-xs font-semibold ${trendMeta.cls}`}>
          {trendMeta.icon} {trendMeta.text} vs yesterday
        </p>
      </div>
    </div>
  );
});

/* props: { tickets } */
const SeverityBar = memo(function SeverityBar({ tickets, counts }) {
  const total = counts.CRITICAL + counts.HIGH + counts.MEDIUM + counts.LOW || 1;

  const segments = [
    { key: 'CRITICAL', color: 'bg-red-500', count: counts.CRITICAL },
    { key: 'HIGH', color: 'bg-orange-500', count: counts.HIGH },
    { key: 'MEDIUM', color: 'bg-yellow-500', count: counts.MEDIUM },
    { key: 'LOW', color: 'bg-green-500', count: counts.LOW }
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">Severity Breakdown</h3>
        <p className="text-xs text-slate-400">{tickets.length} tickets</p>
      </div>
      <div className="flex h-8 overflow-hidden rounded-md">
        {segments.map((segment, index) => {
          const pct = (segment.count / total) * 100;
          return (
            <div
              key={segment.key}
              tabIndex={0}
              className={`${segment.color} group flex items-center justify-center text-[10px] font-bold text-black transition-all duration-500 ease-in-out`}
              style={{
                width: `${Math.max(2, pct)}%`,
                transitionDelay: `${index * 120}ms`
              }}
              title={`${segment.key}: ${segment.count}`}
            >
              {pct >= 10 ? (
                <span className="hidden sm:inline group-hover:inline group-active:inline group-focus:inline">
                  {`${Math.round(pct)}%`}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300 md:grid-cols-4">
        {segments.map((segment) => (
          <div key={segment.key} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${segment.color}`} />
            <span>{segment.key}: {segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* props: { items, ready } */
const ActivitySidebar = memo(function ActivitySidebar({ items, ready }) {
  const iconByType = {
    new_ticket: '🎫',
    ticket_resolved: '✅',
    sla_breach: '🔴'
  };

  return (
    <aside
      aria-live="polite"
      className={`h-full rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20 transition-all duration-300 ${ready ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-100">Recent Activity</h3>
      <div className="h-[540px] space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No live events yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-slate-900/60 p-2 md:flex md:flex-col md:items-center md:justify-center lg:block">
              <p className="text-center text-[11px] text-slate-300 md:text-base lg:text-xs">
                <span className="mr-1">{iconByType[item.type] || '•'}</span>
                {formatRelativeTime(item.timestamp)}
              </p>
              <p className="mt-1 hidden text-xs text-slate-200 lg:block">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
});

/* props: { toasts } */
const ToastStack = memo(function ToastStack({ toasts, onToastDismiss }) {
  const handleToastDismiss = useCallback((event) => {
    const { toastId } = event.currentTarget.dataset;
    if (toastId) {
      onToastDismiss(toastId);
    }
  }, [onToastDismiss]);

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 top-4 z-50 flex w-[340px] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-3 py-2 text-sm shadow-lg shadow-black/30 transition-all duration-200 ${
            toast.type === 'sla_breach'
              ? 'border-red-500/50 bg-red-500/20 text-red-100'
              : toast.type === 'ticket_resolved'
                ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-100'
                : 'border-cyan-500/50 bg-cyan-500/20 text-cyan-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span>{toast.message}</span>
            <button
              type="button"
              data-toast-id={toast.id}
              onClick={handleToastDismiss}
              aria-label={`Dismiss notification: ${toast.message}`}
              className="pointer-events-auto rounded px-1 text-xs opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

/* props: { ticket, nowMs, isBreached, isNew, isResolving, onResolve } */
const TicketRow = memo(function TicketRow({
  ticket,
  nowMs,
  isBreached,
  isNew,
  isResolving,
  onResolve,
  isExpanded,
  onToggleExpand,
  onCollapse
}) {
  const severity = normalizeSeverity(ticket.severity);
  const status = normalizeStatus(ticket.status);
  const countdown = formatCountdown(ticket.sla_deadline, nowMs);
  const department = getDepartmentMeta(ticket.category);
  const handleResolveClick = useCallback(() => {
    onResolve(ticket.id, 'user');
  }, [onResolve, ticket.id]);
  const handleResolveButtonClick = useCallback((event) => {
    event.stopPropagation();
    handleResolveClick();
  }, [handleResolveClick]);
  const handleToggleDetails = useCallback(() => {
    onToggleExpand(ticket.id);
  }, [onToggleExpand, ticket.id]);
  const handleToggleDetailsClick = useCallback((event) => {
    event.stopPropagation();
    handleToggleDetails();
  }, [handleToggleDetails]);
  const handleEvidenceClick = useCallback((event) => {
    event.stopPropagation();
  }, []);
  const handleRowKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onToggleExpand(ticket.id);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onCollapse(ticket.id);
    }
    if (event.key.toLowerCase() === 'r') {
      event.preventDefault();
      onResolve(ticket.id, 'user');
    }
  }, [onCollapse, onResolve, onToggleExpand, ticket.id]);
  const handleRowClick = useCallback(() => {
    onToggleExpand(ticket.id);
  }, [onToggleExpand, ticket.id]);

  return (
    <>
      <tr
        role="row"
        tabIndex={0}
        onKeyDown={handleRowKeyDown}
        onClick={handleRowClick}
        aria-label={`Ticket row ${ticket.ref}`}
        className={`border-b border-white/5 transition-all duration-200 ease-in-out hover:bg-slate-800/40 ${
          isBreached || countdown.urgent ? 'animate-pulse border-l-2 border-l-red-500/70' : ''
        } ${isNew ? 'bg-yellow-200/15' : ''}`}
        style={isNew ? { animation: 'rowSlide 300ms ease-out, rowFlash 2s ease-in-out' } : undefined}
      >
        <td role="gridcell" className="px-3 py-3 font-mono text-xs text-cyan-200">{ticket.ref}</td>
        <td role="gridcell" className="px-3 py-3 text-sm font-semibold text-slate-100">
          <div className="flex items-center gap-2">
            <span>{displayCategory(ticket.category)}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${department.badgeClass}`}>
              {department.label}
            </span>
          </div>
        </td>
        <td role="gridcell" className="hidden px-3 py-3 text-sm text-slate-300 lg:table-cell">{displayWard(ticket)}</td>
        <td role="gridcell" className="px-3 py-3">
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${SEVERITY_CLASS_MAP[severity]}`}>
            Severity {severity}
          </span>
        </td>
        <td role="gridcell" className="px-3 py-3">
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${STATUS_CLASS_MAP[status]}`}>
            Status {status}
          </span>
        </td>
        <td
          role="gridcell"
          aria-label={`SLA countdown ${countdown.label}`}
          className={`px-3 py-3 font-mono text-xs ${countdown.tone}`}
        >
          SLA {countdown.label}
        </td>
        <td role="gridcell" className="hidden px-3 py-3 font-mono text-xs text-slate-300 lg:table-cell">{ticket.phone || maskPhone('')}</td>
        <td role="gridcell" className="px-3 py-3 text-center">
          {ticket.evidence_url ? (
            <a
              href={ticket.evidence_url}
              target="_blank"
              rel="noreferrer"
              onClick={handleEvidenceClick}
              aria-label={`Open evidence for ticket ${ticket.ref}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/40 text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title="Open evidence"
            >
              ↗
            </a>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </td>
        <td role="gridcell" className="px-3 py-3">
          <div className="flex flex-col gap-1 md:flex-row">
            <button
              type="button"
              onClick={handleResolveButtonClick}
              disabled={isResolving || status === 'resolved'}
              aria-label={`Resolve ticket ${ticket.ref}`}
              className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-sm transition-all duration-200 hover:bg-emerald-500/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResolving ? 'Resolving…' : status === 'resolved' ? 'Resolved' : 'Resolve'}
            </button>
            <button
              type="button"
              onClick={handleToggleDetailsClick}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ticket ${ticket.ref}`}
              className="rounded-md border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 lg:hidden"
            >
              {isExpanded ? 'Hide' : 'Details'}
            </button>
          </div>
        </td>
      </tr>
      {isExpanded ? (
        <tr role="row" className="bg-slate-900/40">
          <td role="gridcell" colSpan={9} className="px-3 py-2 text-xs text-slate-300">
            <div className="flex flex-wrap gap-4">
              <span><span className="text-slate-500">Ward:</span> {displayWard(ticket)}</span>
              <span><span className="text-slate-500">Phone:</span> {ticket.phone || maskPhone('')}</span>
            </div>
            <p className="mt-2 text-xs italic text-slate-400">AI Summary: {displaySummary(ticket)}</p>
          </td>
        </tr>
      ) : null}
    </>
  );
});

const MobileTicketCard = memo(function MobileTicketCard({
  ticket,
  nowMs,
  isBreached,
  isNew,
  isResolving,
  onResolve
}) {
  const severity = normalizeSeverity(ticket.severity);
  const status = normalizeStatus(ticket.status);
  const countdown = formatCountdown(ticket.sla_deadline, nowMs);
  const department = getDepartmentMeta(ticket.category);
  const handleResolveClick = useCallback(() => {
    onResolve(ticket.id, 'user');
  }, [onResolve, ticket.id]);

  return (
    <div
      className={`rounded-xl border border-white/10 bg-slate-900/60 p-3 shadow-sm ${
        isBreached || countdown.urgent ? 'animate-pulse border-red-500/60' : ''
      } ${isNew ? 'bg-yellow-200/10' : ''}`}
      style={isNew ? { animation: 'rowSlide 300ms ease-out, rowFlash 2s ease-in-out' } : undefined}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-xs text-cyan-200">{ticket.ref}</p>
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${SEVERITY_CLASS_MAP[severity]}`}>
          {severity}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-slate-100">{displayCategory(ticket.category)}</p>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${department.badgeClass}`}>
          {department.label}
        </span>
      </div>
      <p className="mt-1 text-xs italic text-slate-400">AI Summary: {displaySummary(ticket)}</p>
      <p className="mt-1 text-xs text-slate-400">Ward: {displayWard(ticket)}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className={`font-mono text-xs ${countdown.tone}`}>{countdown.label}</p>
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${STATUS_CLASS_MAP[status]}`}>
          {status}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleResolveClick}
          disabled={isResolving || status === 'resolved'}
          aria-label={`Resolve ticket ${ticket.ref}`}
          className="w-full rounded-md border border-emerald-500/40 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
        >
          {isResolving ? 'Resolving…' : status === 'resolved' ? 'Resolved' : 'Resolve'}
        </button>
        {ticket.evidence_url ? (
          <a
            href={ticket.evidence_url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open evidence for ticket ${ticket.ref}`}
            className="inline-flex w-full items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Evidence
          </a>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-md border border-slate-600/40 bg-slate-700/20 px-3 py-2 text-xs text-slate-500">
            No Evidence
          </span>
        )}
      </div>
    </div>
  );
});

export default function Dashboard() {
  const [tickets, setTickets] = useState(DEMO_TICKETS);
  const [resolvingTicketIds, setResolvingTicketIds] = useState({});
  const [stats, setStats] = useState({ total_open: 0, total_closed: 0, breach_risk: 0 });
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [operatorName, setOperatorName] = useState('Operator');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [clock, setClock] = useState(new Date());

  const socketRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSidebarReady(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((item) => item.id !== toastId));
  }, []);

  const handleUnauthorized = useCallback(() => {
    setAuthToken('');
    setOperatorName('Operator');
    setSocketLive(false);
    setError('');
  }, []);

  const addActivity = useCallback((type, message, ticket) => {
    setActivity((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        ticketRef: ticket?.ref || '',
        timestamp: new Date().toISOString()
      },
      ...prev
    ].slice(0, 20));
    if (!isActivityDrawerOpen) {
      setActivityUnread((prev) => prev + 1);
    }
  }, [isActivityDrawerOpen]);

  const addToast = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, [dismissToast]);

  const mergeTicket = useCallback((incoming) => {
    const normalized = normalizeTicket({
      ...incoming,
      created_at: incoming.created_at || new Date().toISOString()
    });
    setTickets((prev) => [normalized, ...prev.filter((item) => item.id !== normalized.id)].slice(0, 200));
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${authToken}`
    };
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    return response;
  }, [authToken, handleUnauthorized]);

  const fetchData = useCallback(async (conditional = false) => {
    if (!authToken) {
      return;
    }
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/tickets`, { headers }),
        fetch(`${API}/api/stats`, { headers })
      ]);
      if (ticketsRes.status === 401) { setAuthToken(''); return; }
      const nextTickets = await ticketsRes.json();
      const nextStats = await statsRes.json();
      setTickets(
        Array.isArray(nextTickets)
          ? nextTickets.map((ticket) => normalizeTicket(ticket))
          : []
      );
      setStats(nextStats || {});
    } catch (err) {
      setError('System Uplink Interrupted');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (DEMO_MODE) {
        setTickets([
            { id: 101, ref: 'GRV-A8D2K9', category: 'Pothole', ward_id: 1, severity: 'HIGH', status: 'open' },
            { id: 102, ref: 'GRV-M4Q7L1', category: 'Water', ward_id: 3, severity: 'MEDIUM', status: 'in_progress' }
        ]);
        setLoading(false);
    };
    if (authToken) fetchData();
  }, [authToken, fetchData]);

  useEffect(() => {
    if (DEMO_MODE) return undefined;
    if (!authToken) return undefined;
    if (socketLive) return undefined;

    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [authToken, fetchData, socketLive]);

  const handleResolve = useCallback(async (ticketId, triggerSource = 'system') => {
    setResolvingTicketIds((previous) => ({
      ...previous,
      [ticketId]: true
    }));

    try {
      const response = await authFetch(`${API}/api/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to resolve ticket');
      }
      const updated = await response.json();
      setTickets((previous) =>
        previous.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updated, status: normalizeStatus(updated.status || 'resolved') } : ticket))
      );
      addActivity('ticket_resolved', `Ticket resolved: ${updated.ref}`, updated);
      addToast('ticket_resolved', `✅ Ticket resolved: ${updated.ref}`);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        return;
      }
      if (triggerSource === 'user') {
        addToast('sla_breach', '⚠ Could not resolve ticket. Please retry.');
      }
    } finally {
      setResolvingTicketIds((previous) => ({
        ...previous,
        [ticketId]: false
      }));
    }
  }, [addActivity, addToast, authFetch]);

  const baseMetrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => normalizeStatus(ticket.status) === 'open').length;
    const today = new Date().toDateString();
    const resolvedToday = tickets.filter(
      (ticket) =>
        normalizeStatus(ticket.status) === 'resolved' &&
        new Date(ticket.created_at || Date.now()).toDateString() === today
    ).length;
    return { total, open, resolvedToday };
  }, [tickets]);

  const breachedMetric = useMemo(() => {
    return Math.max(
      tickets.filter((ticket) => formatCountdown(ticket.sla_deadline, nowMs).label.startsWith('BREACHED')).length,
      stats.breach_risk ?? 0,
      breachTicketIds.length
    );
  }, [tickets, nowMs, stats.breach_risk, breachTicketIds.length]);

  const metrics = useMemo(() => ({
    ...baseMetrics,
    breached: breachedMetric
  }), [baseMetrics, breachedMetric]);

  const categoryBreakdown = useMemo(() => {
    const palette = ['#00d4ff', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa', '#14b8a6', '#64748b'];
    const map = new Map();
    tickets.forEach((ticket) => {
      const key = displayCategory(ticket.category);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count], index) => ({
      name,
      count,
      color: palette[index % palette.length]
    }));
  }, [tickets]);

  const resolutionAnalytics = useMemo(() => {
    const total = tickets.length;
    const resolvedTickets = tickets.filter((ticket) => normalizeStatus(ticket.status) === 'resolved');
    const resolved = resolvedTickets.length;
    const resolutionRate = total === 0 ? 0 : Math.round((resolved / total) * 100);
    const resolvedWithTimestamp = resolvedTickets.filter((ticket) => Boolean(ticket.resolved_at));
    const averageResolutionHours = resolvedWithTimestamp.length === 0
      ? 0
      : resolvedWithTimestamp.reduce((sum, ticket) => {
        const created = new Date(ticket.created_at || Date.now()).getTime();
        const closed = new Date(ticket.resolved_at).getTime();
        const durationHours = Math.max(0, (closed - created) / 3600000);
        return sum + durationHours;
      }, 0) / resolvedWithTimestamp.length;
    return {
      total,
      resolved,
      resolutionRate,
      averageResolutionHours
    };
  }, [tickets]);

  const wardPerformance = useMemo(() => {
    const wardMap = new Map();
    tickets.forEach((ticket) => {
      const ward = displayWard(ticket);
      const status = normalizeStatus(ticket.status);
      const breached = formatCountdown(ticket.sla_deadline, nowMs).label.startsWith('BREACHED');
      const current = wardMap.get(ward) || {
        ward,
        open: 0,
        resolved: 0,
        breached: 0
      };
      if (status === 'resolved') {
        current.resolved += 1;
      } else {
        current.open += 1;
      }
      if (breached) {
        current.breached += 1;
      }
      wardMap.set(ward, current);
    });
    const rows = Array.from(wardMap.values()).sort((a, b) => b.open - a.open);
    const maxOpen = rows.length > 0 ? rows[0].open : 0;
    return {
      rows,
      maxOpen
    };
  }, [tickets, nowMs]);

  useEffect(() => {
    if (!kpiPrevRef.current) {
      kpiPrevRef.current = metrics;
      return;
    }
    setTrends({
      total: metrics.total - kpiPrevRef.current.total,
      open: metrics.open - kpiPrevRef.current.open,
      breached: metrics.breached - kpiPrevRef.current.breached,
      resolvedToday: metrics.resolvedToday - kpiPrevRef.current.resolvedToday
    });
    kpiPrevRef.current = metrics;
  }, [metrics]);

  const severityCounts = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        acc[normalizeSeverity(ticket.severity)] += 1;
        return acc;
      },
      { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    );
  }, [tickets]);

  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchInput(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearch(value);
    }, 300);
  }, []);

  const handleStatusFilterChange = useCallback((event) => {
    setStatusFilter(event.target.value);
  }, []);

  const handleSeverityFilterChange = useCallback((event) => {
    setSeverityFilter(event.target.value);
  }, []);

  const handleWardFilterChange = useCallback((event) => {
    setWardFilter(event.target.value);
  }, []);

  const wards = useMemo(() => {
    return [...new Set(tickets.map((ticket) => displayWard(ticket)))];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const status = normalizeStatus(ticket.status);
      const severity = normalizeSeverity(ticket.severity);
      const ward = displayWard(ticket);
      const passStatus = statusFilter === 'all' || status === statusFilter;
      const passSeverity = severityFilter === 'all' || severity === severityFilter;
      const passWard = wardFilter === 'all' || ward === wardFilter;
      const passSearch =
        !query ||
        String(ticket.ref || '').toLowerCase().includes(query) ||
        String(ticket.category || '').toLowerCase().includes(query);
      return passStatus && passSeverity && passWard && passSearch;
    });
  }, [tickets, search, statusFilter, severityFilter, wardFilter]);

  useEffect(() => {
    setVisibleCount(50);
  }, [search, statusFilter, severityFilter, wardFilter]);

  const visibleTickets = useMemo(() => {
    return filteredTickets.slice(0, visibleCount);
  }, [filteredTickets, visibleCount]);

  const canLoadMore = filteredTickets.length > visibleCount;
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 50);
  }, []);
  const openActivityDrawer = useCallback(() => {
    setIsActivityDrawerOpen(true);
  }, []);
  const closeActivityDrawer = useCallback(() => {
    setIsActivityDrawerOpen(false);
  }, []);
  const handleLogout = useCallback(() => {
    setAuthToken('');
    setOperatorName('Operator');
    setSocketLive(false);
    setLoginPassword('');
    setLoginError('');
  }, []);
  const toggleRowExpand = useCallback((ticketId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  }, []);
  const collapseRow = useCallback((ticketId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [ticketId]: false
    }));
  }, []);
  const handleLoginUsernameChange = useCallback((event) => {
    setLoginUsername(event.target.value);
  }, []);
  const handleLoginPasswordChange = useCallback((event) => {
    setLoginPassword(event.target.value);
  }, []);
  const handleLoginSubmit = useCallback(async (event) => {
    event.preventDefault();
    setLoginSubmitting(true);
    setLoginError('');
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (!res.ok) throw new Error('Invalid Credentials');
      const data = await res.json();
      setAuthToken(data.token);
      setOperatorName(decodeJwtUsername(data.token));
      setLoginPassword('');
      setError('');
    } catch (error) {
      setLoginError('Login failed. Check credentials.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      setOperatorName('Operator');
      return;
    }
    setOperatorName(decodeJwtUsername(authToken));
  }, [authToken]);

  useEffect(() => {
    if (isActivityDrawerOpen) {
      setActivityUnread(0);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const passSearch = !search || t.ref.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const passStatus = statusFilter === 'all' || t.status === statusFilter;
      const passSeverity = severityFilter === 'all' || t.severity === severityFilter;
      return passSearch && passStatus && passSeverity;
    });
  }, [tickets, search, statusFilter, severityFilter]);

  if (!authToken && !DEMO_MODE) {
    return (
      <div className="min-h-screen bg-[#F6F1EA] flex items-center justify-center p-6 selection:bg-[#121212] selection:text-[#F6F1EA] relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-50 z-0"></div>
        <div className="arch-lines">
            <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
                <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#121212" strokeWidth="0.5"></line>
                <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#121212" strokeWidth="0.5"></line>
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#121212" strokeWidth="0.5" strokeDasharray="4 8"></line>
            </svg>
        </div>

        <div className="z-10 w-full max-w-sm">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-4 mb-8">
                     <div className="h-[1px] w-8 bg-[#B76E79]"></div>
                     <span className="text-[0.6rem] font-bold tracking-[0.3em] text-[#121212] uppercase">Institutional Access</span>
                     <div className="h-[1px] w-8 bg-[#B76E79]"></div>
                </div>
                <h1 className="text-4xl font-serif text-[#121212] mb-2">ResolveOS</h1>
                <p className="text-xs uppercase tracking-widest text-[#121212]/50">Secure Command Terminal</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="luxury-card p-10 space-y-8">
                <div className="space-y-6">
                    <div className="relative">
                        <label className="text-[0.6rem] font-bold uppercase tracking-widest text-[#B76E79] mb-2 block">Operator ID</label>
                        <input
                           type="text"
                           value={loginUsername}
                           onChange={e => setLoginUsername(e.target.value)}
                           className="w-full bg-transparent border-b border-[#121212]/10 py-3 text-sm focus:border-[#B76E79] outline-none transition-colors"
                           placeholder="Enter Username"
                           required
                        />
                    </div>
                    <div className="relative">
                        <label className="text-[0.6rem] font-bold uppercase tracking-widest text-[#B76E79] mb-2 block">Secure Key</label>
                        <input
                           type="password"
                           value={loginPassword}
                           onChange={e => setLoginPassword(e.target.value)}
                           className="w-full bg-transparent border-b border-[#121212]/10 py-3 text-sm focus:border-[#B76E79] outline-none transition-colors"
                           placeholder="••••••••"
                           required
                        />
                    </div>
                </div>

                {loginError && <p className="text-[0.65rem] text-red-800 font-medium uppercase tracking-wider">{loginError}</p>}

                <button
                    disabled={loginSubmitting}
                    className="w-full bg-[#121212] text-[#F6F1EA] py-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] hover:bg-[#B76E79] transition-all rounded-sm shadow-xl"
                >
                    {loginSubmitting ? 'Verifying Uplink...' : 'Initialize Terminal'}
                </button>
            </form>

            <div className="mt-12 text-center">
                 <p className="text-[0.6rem] text-[#121212]/30 uppercase tracking-[0.1em] leading-relaxed">
                    By accessing this terminal, you agree to comply with the JanSamvaad Data Privacy & Governance Protocol. <br/>
                    All actions are cryptographically logged.
                 </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-5 text-slate-100"
      style={{ backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @keyframes rowFlash { 0% { background-color: rgba(250, 204, 21, 0.35); } 100% { background-color: transparent; } }
        @keyframes rowSlide { 0% { transform: translateY(-12px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes kpiIn { 0% { transform: translateY(8px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      `}</style>

      <ToastStack toasts={toasts} onToastDismiss={dismissToast} />

      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111827] p-4 shadow-xl shadow-black/30 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">🗣️</div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Voice-First Civic Governance</p>
              <h1 className="text-2xl font-bold text-white">JanSamvaad ResolveOS</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
              socketLive ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200' : 'border-rose-500/50 bg-rose-500/20 text-rose-200'
            }`}>
              <span className={`h-2 w-2 rounded-full ${socketLive ? 'animate-pulse bg-emerald-300' : 'bg-rose-300'}`} />
              {socketLive ? 'LIVE' : 'OFFLINE'}
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
              <span className="mr-2 font-semibold text-slate-100">Clock</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatClock(clock)}</span>
            </div>
            <div className="rounded-lg border border-cyan-500/40 bg-slate-900/70 p-2 text-center">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=tel:+15706308042"
                alt="Twilio live demo number QR"
                className="mx-auto h-12 w-12 rounded"
              />
              <p className="mt-1 text-[10px] text-cyan-200">📞 Scan to call live demo</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-200">{getInitials(operatorName)}</div>
              <p className="hidden text-sm text-slate-200 md:block">{operatorName || 'Operator'}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded border border-slate-500/40 bg-slate-500/10 px-2 py-1 text-xs font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <KPICard title="Total Tickets" value={metrics.total} trend={trends.total} accent="text-cyan-300" delayMs={0} />
          <KPICard title="Open" value={metrics.open} trend={trends.open} accent="text-blue-300" delayMs={100} />
          <KPICard title="SLA Breached" value={metrics.breached} trend={trends.breached} accent="text-red-300" delayMs={200} />
          <KPICard title="Resolved Today" value={metrics.resolvedToday} trend={trends.resolvedToday} accent="text-emerald-300" delayMs={300} />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20">
            <h3 className="mb-3 text-sm font-semibold text-slate-100">Category Breakdown</h3>
            <div className="flex items-center gap-4">
              <div
                className="h-44 w-44 rounded-full"
                style={{
                  background: categoryBreakdown.length > 0
                    ? `conic-gradient(${categoryBreakdown.map((item, index, arr) => {
                      const previous = arr.slice(0, index).reduce((sum, node) => sum + node.count, 0);
                      const total = arr.reduce((sum, node) => sum + node.count, 0) || 1;
                      const start = (previous / total) * 100;
                      const end = ((previous + item.count) / total) * 100;
                      return `${item.color} ${start}% ${end}%`;
                    }).join(', ')})`
                    : '#1f2937'
                }}
              />
              <div className="space-y-2">
                {categoryBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20">
            <h3 className="mb-3 text-sm font-semibold text-slate-100">Resolution Rate</h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <p className="text-slate-400">Total Tickets</p>
                <p className="mt-1 text-xl font-semibold text-cyan-300">{resolutionAnalytics.total}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <p className="text-slate-400">Resolved</p>
                <p className="mt-1 text-xl font-semibold text-emerald-300">{resolutionAnalytics.resolved}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-emerald-300">{resolutionAnalytics.resolutionRate}%</p>
              <p className="mt-1 text-xs text-slate-400">Average resolution time: {resolutionAnalytics.averageResolutionHours.toFixed(1)} hours</p>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, resolutionAnalytics.resolutionRate))}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-lg shadow-black/20">
          <h3 className="mb-3 text-sm font-semibold text-slate-100">Ward Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-300">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-3 py-2">Ward</th>
                  <th className="px-3 py-2">Open Tickets</th>
                  <th className="px-3 py-2">Resolved</th>
                  <th className="px-3 py-2">SLA Breached</th>
                </tr>
              </thead>
              <tbody>
                {wardPerformance.rows.map((ward) => (
                  <tr key={ward.ward} className={`border-t border-white/5 ${wardPerformance.maxOpen > 0 && ward.open === wardPerformance.maxOpen ? 'bg-red-500/10' : ''}`}>
                    <td className="px-3 py-2">{ward.ward}</td>
                    <td className={`px-3 py-2 font-semibold ${wardPerformance.maxOpen > 0 && ward.open === wardPerformance.maxOpen ? 'text-red-300' : 'text-slate-200'}`}>{ward.open}</td>
                    <td className="px-3 py-2 text-emerald-300">{ward.resolved}</td>
                    <td className="px-3 py-2 text-rose-300">{ward.breached}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <SeverityBar tickets={tickets} counts={severityCounts} />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_96px] lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-xl shadow-black/30">
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-lg font-semibold text-white">Live Ticket Feed</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <input
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search ref/category"
                  className="rounded-md border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500/70 focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="rounded-md border border-white/10 bg-slate-900/70 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/70 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={severityFilter}
                  onChange={handleSeverityFilterChange}
                  className="rounded-md border border-white/10 bg-slate-900/70 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/70 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <option value="all">All Severity</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                <select
                  value={wardFilter}
                  onChange={handleWardFilterChange}
                  className="rounded-md border border-white/10 bg-slate-900/70 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/70 focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <option value="all">All Wards</option>
                  {wards.map((ward) => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid h-64 place-items-center text-sm text-slate-400">Loading dashboard data...</div>
            ) : error ? (
              <div className="grid h-64 place-items-center text-sm text-rose-300">{error}</div>
            ) : filteredTickets.length === 0 ? (
              <div className="grid h-64 place-items-center text-sm text-slate-400">No tickets match current filters.</div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {visibleTickets.map((ticket) => (
                    <MobileTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      nowMs={nowMs}
                      isBreached={breachTicketIds.includes(ticket.id)}
                      isNew={newTicketIds.includes(ticket.id)}
                      isResolving={Boolean(resolvingTicketIds[ticket.id])}
                      onResolve={handleResolve}
                    />
                  ))}
                  {canLoadMore ? (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="w-full rounded-md border border-white/10 bg-slate-800/70 px-3 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Load more
                    </button>
                  ) : null}
                </div>
                <div className="hidden overflow-auto md:block">
                <table role="grid" className="min-w-full text-left">
                  <thead className="sticky top-0 z-10 bg-[#0e1528] text-xs uppercase tracking-wide text-slate-400">
                    <tr role="row">
                      <th aria-sort="none" className="px-3 py-2">Ref</th>
                      <th aria-sort="none" className="px-3 py-2">Category</th>
                      <th aria-sort="none" className="hidden px-3 py-2 lg:table-cell">Ward</th>
                      <th aria-sort="none" className="px-3 py-2">Severity</th>
                      <th aria-sort="none" className="px-3 py-2">Status</th>
                      <th aria-sort="none" className="px-3 py-2">SLA Countdown</th>
                      <th aria-sort="none" className="hidden px-3 py-2 lg:table-cell">Phone</th>
                      <th className="px-3 py-2 text-center">Evidence</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTickets.map((ticket) => (
                      <TicketRow
                        key={ticket.id}
                        ticket={ticket}
                        nowMs={nowMs}
                        isBreached={breachTicketIds.includes(ticket.id)}
                        isNew={newTicketIds.includes(ticket.id)}
                        isResolving={Boolean(resolvingTicketIds[ticket.id])}
                        onResolve={handleResolve}
                        isExpanded={Boolean(expandedRows[ticket.id])}
                        onToggleExpand={toggleRowExpand}
                        onCollapse={collapseRow}
                      />
                    ))}
                  </tbody>
                </table>
                {canLoadMore ? (
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="rounded-md border border-white/10 bg-slate-800/70 px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:bg-slate-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                      Load more
                    </button>
                  </div>
                ) : null}
              </div>
              </>
            )}
          </div>

          <div aria-live="polite" className="hidden md:block">
            <ActivitySidebar items={activity} ready={sidebarReady} />
          </div>
        </section>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 h-24 flex items-center border-b border-[#121212]/5 bg-[#F6F1EA]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-[#121212] rounded-full flex items-center justify-center text-[#B76E79] group-hover:scale-110 transition-transform">
              <iconify-icon icon="solar:shield-check-bold" width="20" height="20"></iconify-icon>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-normal tracking-tight text-[#121212] uppercase">JanSamvaad <span className="font-light opacity-70">ResolveOS</span></span>
              <span className="text-[0.6rem] font-bold text-[#B76E79] uppercase tracking-[0.3em]">Elite Governance</span>
            </div>
          </a>
          
          <div className="hidden md:flex items-center gap-12">
            <div className="text-center">
              <p className="text-[0.6rem] font-bold text-[#121212]/40 uppercase tracking-widest mb-1">System Time</p>
              <p className="text-xs font-serif italic text-[#121212]">{formatClock(clock)}</p>
            </div>
            <div className="h-10 w-px bg-[#121212]/10"></div>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#121212]">Uplink Active</span>
            </div>
          </div>

          <button onClick={() => setAuthToken('')} className="bg-[#121212] text-[#F6F1EA] text-xs font-medium tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-[#B76E79] transition-all">
            Secure Out
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto z-10 relative">
          
          {/* Stats Bar */}
          <div className="grid md:grid-cols-3 gap-12 mb-24">
            <div className="luxury-card p-10 flex flex-col items-center">
               <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#B76E79] uppercase mb-4">Awaiting Action</span>
               <span className="text-6xl font-serif text-[#121212]">{stats.open || 0}</span>
            </div>
            <div className="luxury-card p-10 flex flex-col items-center bg-[#D4C4A8]/40 border-[#B76E79]/20">
               <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#121212] uppercase mb-4">Resolved Today</span>
               <span className="text-6xl font-serif text-[#121212]">{stats.closed || 0}</span>
            </div>
            <div className="luxury-card p-10 flex flex-col items-center">
               <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#B76E79] uppercase mb-4">SLA Risk</span>
               <span className="text-6xl font-serif text-red-800">{stats.breach_risk || 0}</span>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[#B76E79] font-bold text-[0.65rem] tracking-[0.2em] uppercase mb-4 block">Operational Queue</span>
              <h2 className="text-5xl md:text-6xl font-serif text-[#121212] tracking-tight">Active Ledger</h2>
              <p className="text-lg text-[#121212]/60 mt-4 font-light italic">Filtered intelligence from ward boundary signal monitors.</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <input 
                type="text" 
                placeholder="Search Ledger..." 
                value={searchInput}
                onChange={e => { setSearchInput(e.target.value); setSearch(e.target.value); }}
                className="bg-white/40 border border-[#121212]/10 px-6 py-4 rounded-sm text-xs font-medium uppercase tracking-widest focus:border-[#B76E79] outline-none transition-all placeholder:text-[#121212]/30"
              />
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white/40 border border-[#121212]/10 px-6 py-4 rounded-sm text-xs font-bold uppercase tracking-widest focus:border-[#B76E79] outline-none"
              >
                <option value="all">All Channels</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="luxury-card overflow-hidden shadow-2xl border-[#121212]/5">
            <table className="w-full text-left">
              <thead className="bg-[#121212] text-[#F6F1EA]">
                <tr>
                  <th className="px-8 py-6 text-[0.65rem] font-bold tracking-[0.2em] uppercase">Ref ID</th>
                  <th className="px-8 py-6 text-[0.65rem] font-bold tracking-[0.2em] uppercase">Intelligence Intake</th>
                  <th className="px-8 py-6 text-[0.65rem] font-bold tracking-[0.2em] uppercase">Ward Assignment</th>
                  <th className="px-8 py-6 text-[0.65rem] font-bold tracking-[0.2em] uppercase text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121212]/5 bg-white/20">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-[#F6F1EA] transition-colors duration-500 group">
                    <td className="px-8 py-10 font-serif italic text-2xl text-[#121212] group-hover:text-[#B76E79] transition-colors">{ticket.ref}</td>
                    <td className="px-8 py-10">
                      <div className="flex items-center gap-3">
                         <span className={`w-2 h-2 rounded-full ${ticket.severity === 'HIGH' ? 'bg-red-500' : 'bg-[#121212]/30'}`}></span>
                         <span className="text-xs font-bold uppercase tracking-widest text-[#121212]/60">{ticket.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-10">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#121212]">{ticket.ward_name || `Ward ${ticket.ward_id}`}</span>
                        <span className="text-[0.6rem] font-bold text-[#B76E79] uppercase tracking-widest mt-1">Verified Location</span>
                      </div>
                    </td>
                    <td className="px-8 py-10 text-right">
                       <button 
                        onClick={() => handleResolve(ticket.id)}
                        disabled={ticket.status === 'resolved' || resolvingTicketIds[ticket.id]}
                        className={`px-8 py-3 rounded-sm text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all shadow-sm ${
                            ticket.status === 'resolved' 
                            ? 'bg-green-100/50 text-green-800' 
                            : 'bg-[#121212] text-white hover:bg-[#B76E79]'
                        }`}
                       >
                         {resolvingTicketIds[ticket.id] ? 'Archiving...' : ticket.status === 'resolved' ? 'Archive Sealed' : 'Resolve Request'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
                <div className="px-8 py-32 text-center">
                    <p className="font-serif italic text-3xl text-[#121212]/20">Awaiting Signal Synchronization...</p>
                </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#121212] text-[#F6F1EA] pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col">
            <span className="text-xl font-serif tracking-tight">JanSamvaad ResolveOS</span>
            <span className="text-[0.6rem] font-bold text-[#B76E79] uppercase tracking-[0.3em] mt-1">Bharat Infrastructure</span>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold text-[#F6F1EA]/40 uppercase tracking-widest mb-3">Intake Signal</span>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest">Global Uplink Node</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold text-[#F6F1EA]/40 uppercase tracking-widest mb-3">Protocol</span>
                <span className="text-[0.6rem] font-bold uppercase tracking-widest text-emerald-400">Verified Secure</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 border-t border-white/5 pt-10 text-center md:text-left">
           <p className="text-[0.6rem] text-[#F6F1EA]/40 uppercase tracking-widest">© 2024 INDIA INNOVATES. RESILIENT SYSTEMS.</p>
        </div>
      </footer>
    </div>
  );
}

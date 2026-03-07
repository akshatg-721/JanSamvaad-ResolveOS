import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

function maskPhone(phone) {
  if (!phone) {
    return 'N/A';
  }

  const normalized = String(phone);
  if (normalized.length < 4) {
    return normalized;
  }

  const prefix = normalized.startsWith('+91') ? '+91' : normalized.slice(0, 2);
  const suffix = normalized.slice(-4);
  return `${prefix}******${suffix}`;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([
    {
      id: 101,
      ref: 'JS-A8D2K9',
      category: 'Pothole',
      severity: 'High',
      phone: maskPhone('+919812349921'),
      status: 'open'
    },
    {
      id: 102,
      ref: 'JS-M4Q7L1',
      category: 'Water',
      severity: 'Medium',
      phone: maskPhone('+917600118245'),
      status: 'open'
    },
    {
      id: 103,
      ref: 'JS-T9N3B5',
      category: 'Sanitation',
      severity: 'Medium',
      phone: maskPhone('+919990332211'),
      status: 'open'
    },
    {
      id: 104,
      ref: 'JS-R2H6C8',
      category: 'Electricity',
      severity: 'High',
      phone: maskPhone('+918287654310'),
      status: 'closed',
      evidence_url: 'https://resolveos.local/evidence/demo-js-r2h6c8'
    },
    {
      id: 105,
      ref: 'JS-P1V5X4',
      category: 'Water',
      severity: 'Low',
      phone: maskPhone('+917742220019'),
      status: 'open'
    }
  ]);
  const [resolvingTicketIds, setResolvingTicketIds] = useState({});
  const [stats, setStats] = useState({
    total_open: 12,
    total_closed: 85,
    breach_risk: 2
  });

  useEffect(() => {
    if (DEMO_MODE) return undefined;

    const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    async function fetchData() {
      try {
        const [ticketsRes, statsRes] = await Promise.all([
          fetch(`${API}/api/tickets`),
          fetch(`${API}/api/stats`)
        ]);
        const nextTickets = await ticketsRes.json();
        const nextStats = await statsRes.json();
        setTickets(nextTickets);
        setStats(nextStats);
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);

    const socket = io(API);
    socket.on('new_ticket', (ticket) => {
      setTickets((prev) => [ticket, ...prev].slice(0, 50));
    });
    socket.on('ticket_resolved', (ticket) => {
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? ticket : t)));
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  async function handleResolve(ticketId) {
    setResolvingTicketIds((previous) => ({
      ...previous,
      [ticketId]: true
    }));

    setTickets((previous) =>
      previous.map((ticket) => {
        if (ticket.id !== ticketId || ticket.status === 'closed') {
          return ticket;
        }

        return {
          ...ticket,
          status: 'closed',
          evidence_url: ticket.evidence_url || `https://resolveos.local/evidence/${ticket.ref}`
        };
      })
    );

    setStats((previous) => ({
      total_open: Math.max(0, previous.total_open - 1),
      total_closed: previous.total_closed + 1,
      breach_risk: Math.max(0, previous.breach_risk - 1)
    }));

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    setResolvingTicketIds((previous) => ({
      ...previous,
      [ticketId]: false
    }));
  }

  const slaHitRate = useMemo(() => {
    if (stats.slaHitRate) {
      return stats.slaHitRate;
    }

    const openCount = stats.open ?? stats.total_open ?? 0;
    const closedCount = stats.closed ?? stats.total_closed ?? 0;
    const totalHandled = openCount + closedCount;
    if (totalHandled === 0) {
      return '100%';
    }

    const hitRate = ((closedCount / totalHandled) * 100).toFixed(1);
    return `${hitRate}%`;
  }, [stats.closed, stats.open, stats.slaHitRate, stats.total_closed, stats.total_open]);

  const openCount = stats.open ?? stats.total_open ?? 0;
  const closedCount = stats.closed ?? stats.total_closed ?? 0;
  const breachRisk = stats.breach_risk ?? 0;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">JanSamvaad ResolveOS</h1>
          <div className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            SLA Hit Rate: {slaHitRate}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Open</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{openCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Closed</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{closedCount}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Breach Risk</p>
            <p
              className={`mt-2 text-3xl font-bold ${
                breachRisk > 0 ? 'text-red-600' : 'text-slate-900'
              }`}
            >
              {breachRisk}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex h-96 items-center justify-center rounded-xl bg-slate-200 text-lg font-semibold text-slate-700 shadow-sm">
            Leaflet Ward Heatmap Loading...
          </div>

          <div className="h-96 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-900">Live Feed</h2>
            </div>
            <div className="h-[calc(24rem-57px)] overflow-y-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Severity</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-slate-500" colSpan={5}>
                        No tickets yet.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id || ticket.ref}>
                        <td className="px-4 py-3 font-medium text-slate-900">{ticket.ref}</td>
                        <td className="px-4 py-3 text-slate-700">{ticket.category || 'Other'}</td>
                        <td className="px-4 py-3 text-slate-700">{ticket.severity || 'Medium'}</td>
                        <td className="px-4 py-3 text-slate-700">{ticket.phone || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {ticket.status === 'open' ? (
                            <button
                              type="button"
                              onClick={() => handleResolve(ticket.id)}
                              disabled={Boolean(resolvingTicketIds[ticket.id])}
                              className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {resolvingTicketIds[ticket.id] ? 'Resolving...' : 'Resolve'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-slate-400">Closed</span>
                              {ticket.evidence_url ? (
                                <QRCodeSVG value={ticket.evidence_url} size={46} />
                              ) : null}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

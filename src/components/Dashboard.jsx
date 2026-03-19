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

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [resolvingTicketIds, setResolvingTicketIds] = useState({});
  const [stats, setStats] = useState({ total_open: 0, total_closed: 0, breach_risk: 0 });
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState('');
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

  const fetchData = useCallback(async () => {
    if (!authToken && !DEMO_MODE) return;
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/tickets`, { headers }),
        fetch(`${API}/api/stats`, { headers })
      ]);
      if (ticketsRes.status === 401) { setAuthToken(''); return; }
      const nextTickets = await ticketsRes.json();
      const nextStats = await statsRes.json();
      setTickets(Array.isArray(nextTickets) ? nextTickets : []);
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setLoginError('Authentication Failed. Check Institutional Credentials.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleResolve = async (ticketId) => {
    setResolvingTicketIds(prev => ({ ...prev, [ticketId]: true }));
    try {
      await fetch(`${API}/api/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      fetchData();
    } finally {
      setResolvingTicketIds(prev => ({ ...prev, [ticketId]: false }));
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
    <div className="selection:bg-[#121212] selection:text-[#F6F1EA] relative overflow-x-hidden text-lg min-h-screen bg-[#F6F1EA]">
      <div className="absolute inset-0 bg-grain pointer-events-none z-0 mix-blend-overlay opacity-50"></div>
      
      {/* Geometric Background */}
      <div className="arch-lines">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#121212" strokeWidth="0.5"></line>
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#121212" strokeWidth="0.5"></line>
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#121212" strokeWidth="0.5" strokeDasharray="4 8"></line>
          <line x1="0" y1="800" x2="1440" y2="400" stroke="#B76E79" strokeWidth="0.5" opacity="0.5"></line>
        </svg>
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

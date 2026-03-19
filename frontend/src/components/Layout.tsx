import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../api/client';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  QrCode,
  Bell,
  User,
  History,
  FileText,
  BookOpen,
  Menu,
  X,
  Search
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Operations',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/gis',       label: 'Ward Map',     icon: <MapIcon size={20} /> },
      { path: '/activity',  label: 'Activity',icon: <History size={20} /> },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { path: '/analytics', label: 'Analytics',    icon: <BarChart3 size={20} /> },
      { path: '/reports',   label: 'Reports',      icon: <FileText size={20} /> },
      { path: '/ledger',    label: 'Ledger',       icon: <BookOpen size={20} /> },
    ]
  }
];

const SECONDARY_NAV = [
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  { path: '#help',     label: 'Support',     icon: <HelpCircle size={20} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleExit = () => {
    clearToken();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden text-[var(--ink)] font-sans selection:bg-[var(--blue)] selection:text-white">
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[45] lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 lg:relative lg:flex flex-col border-r border-[var(--border)] bg-[#050505] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${collapsed ? 'lg:w-20' : 'lg:w-72'}
          ${mobileMenuOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--blue)] to-[#1E40AF] flex items-center justify-center text-white font-bold shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              JS
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold tracking-tight font-display">JanSamvaad</span>
                <span className="text-[10px] text-[var(--ink-4)] font-mono uppercase tracking-[0.2em]">ResolveOS</span>
              </div>
            )}
          </div>
          <button 
            className="lg:hidden text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Search Mock */}
        {(!collapsed || mobileMenuOpen) && (
          <div className="px-4 mb-6">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] group-focus-within:text-[var(--blue)] transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..."
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-3 text-[12px] placeholder-[var(--ink-5)] outline-none focus:border-[var(--blue)] transition-all"
              />
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-8 scrollbar-hide">
          {NAV_GROUPS.map(group => (
            <div key={group.title} className="space-y-1">
              {(!collapsed || mobileMenuOpen) && (
                <div className="px-3 text-[10px] font-bold text-[var(--ink-5)] tracking-[0.15em] mb-3 uppercase">
                  {group.title}
                </div>
              )}
              {group.items.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 h-10 rounded-xl transition-all duration-200 group relative ${
                      active 
                        ? 'bg-[var(--surface-raised)] text-[var(--ink)] shadow-lg' 
                        : 'text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--surface)]'
                     } ${(collapsed && !mobileMenuOpen) ? 'justify-center px-0' : ''}`}
                  >
                    {active && <div className="absolute left-0 w-1 h-4 bg-[var(--blue)] rounded-full shadow-[0_0_10px_var(--blue)]" />}
                    <span className={`transition-colors ${active ? 'text-[var(--blue)]' : 'group-hover:text-[var(--ink-2)]'}`}>
                      {item.icon}
                    </span>
                    {(!collapsed || mobileMenuOpen) && (
                      <span className="text-[13px] font-medium tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="p-4 mt-auto space-y-2 shrink-0">
          {SECONDARY_NAV.map(item => (
             <button
                key={item.path}
                onClick={() => item.path.startsWith('/') ? navigate(item.path) : null}
                className={`w-full flex items-center gap-3 px-4 h-10 rounded-xl text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-all ${(collapsed && !mobileMenuOpen) ? 'justify-center px-0' : ''}`}
              >
                {item.icon}
                {(!collapsed || mobileMenuOpen) && <span className="text-[13px] font-medium tracking-wide">{item.label}</span>}
             </button>
          ))}
          
          <div className="pt-4 border-t border-[var(--border)]">
             <div className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${collapsed && !mobileMenuOpen ? 'justify-center' : 'hover:bg-[var(--surface)]'}`}>
               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#111] to-[#222] border border-[var(--border)] flex items-center justify-center shrink-0">
                 <User size={16} className="text-[var(--ink-3)]" />
               </div>
               {(!collapsed || mobileMenuOpen) && (
                 <div className="flex-1 min-w-0">
                   <p className="text-[12px] font-semibold truncate leading-none">Operator #01</p>
                   <p className="text-[10px] text-[var(--ink-4)] mt-1 truncate">op-01@jansamvaad.gov</p>
                 </div>
               )}
             </div>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-3 px-4 h-10 rounded-xl text-[var(--ink-5)] hover:text-[var(--ink)] transition-all ${collapsed ? 'justify-center px-0' : ''}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="text-[12px] font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-[64px] bg-[var(--bg)]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-2 text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex flex-col">
              <h2 className="text-[14px] font-bold font-display tracking-tight">Operation Dashboard</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_8px_var(--green)]"></span>
                <span className="text-[10px] text-[var(--ink-4)] uppercase tracking-widest font-bold">System Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             {/* Demo Banner Refined */}
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded-full">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--bg)]" />)}
               </div>
               <span className="text-[11px] text-[var(--ink-2)] font-medium">12 Active Operators</span>
               <div className="w-[1px] h-3 bg-[var(--border)]" />
               <span className="text-[11px] text-[var(--blue)] font-bold font-mono">+1 555-0123</span>
               <button onClick={() => navigate('/qr')} className="text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors ml-1">
                 <QrCode size={14} />
               </button>
             </div>

             <div className="flex flex-col items-end px-4 border-l border-[var(--border)]">
               <span className="text-[15px] font-bold font-mono tabular-nums leading-none tracking-tight">{time}</span>
               <span className="text-[9px] text-[var(--ink-4)] uppercase font-bold tracking-widest mt-1">IST (Delhi)</span>
             </div>

             <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
               <button className="p-2 text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--red)] border-2 border-[var(--bg)] rounded-full" />
               </button>
               <button 
                 onClick={handleExit}
                 className="flex items-center gap-2 px-4 py-2 bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--ink-2)] rounded-full text-[12px] font-bold transition-all active:scale-95"
               >
                 <LogOut size={14} />
                 <span>Exit</span>
               </button>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-[var(--bg)] custom-scrollbar px-8 pb-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}


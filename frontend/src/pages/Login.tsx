import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getToken } from '../api/client';
import LoadingScreen from '../components/LoadingScreen';
import { Fingerprint, Terminal, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId]  = useState('');
  const [accessKey, setAccessKey]    = useState('');
  const [loading, setLoading]        = useState(false);
  const [booting, setBooting]        = useState(false);
  const [error, setError]            = useState('');
  const [time, setTime]              = useState('');

  // If already authenticated, skip to dashboard
  useEffect(() => {
    if (getToken()) navigate('/dashboard');
  }, [navigate]);

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId.trim() || !accessKey.trim()) {
      setError('Credentials incomplete.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(operatorId.trim(), accessKey);
      setBooting(true); // Trigger the boot animation
    } catch {
      setError('Authentication failed. Invalid ID or Access Key.');
    } finally {
      setLoading(false);
    }
  };

  if (booting) {
    return <LoadingScreen onComplete={() => navigate('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center relative overflow-hidden font-sans selection:bg-[var(--blue)] selection:text-white">
      
      {/* Structural Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--ink) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Header Info */}
      <div className="absolute top-8 left-8 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[var(--blue)]">
          <Terminal size={12} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Municipal Command & Control</span>
        </div>
        <span className="text-[9px] text-[var(--ink-4)] font-mono uppercase tracking-widest leading-none">Terminal Build JS-99.2</span>
      </div>

      <div className="absolute top-8 right-8 text-right flex flex-col gap-1">
        <span className="text-[14px] font-mono font-bold text-[var(--ink)] tabular-nums">{time}</span>
        <span className="text-[9px] text-[var(--ink-4)] font-bold uppercase tracking-widest leading-none">New Delhi IST</span>
      </div>

      {/* Login Form */}
      <form onSubmit={submit} className="w-full max-w-[400px] p-8 space-y-8 relative z-10 animate-fade-in">
        
        {/* Branding */}
        <div>
          <h1 className="text-4xl font-bold font-serif italic text-[var(--ink)] leading-tight mb-2 tracking-tighter">
            JanSamvaad<br />ResolveOS
          </h1>
          <p className="text-[11px] text-[var(--ink-3)] font-medium leading-relaxed max-w-[32ch]">
            Secured operator bridge for municipal grievance lifecycle management.
          </p>
        </div>

        <div className="space-y-5">
          {/* Operator ID */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-[var(--ink-4)] uppercase tracking-[0.15em] block ml-1">
              Operator Identifier
            </label>
            <div className="relative group">
              <input
                type="text"
                value={operatorId}
                onChange={e => setOperatorId(e.target.value)}
                placeholder="Ex: OP-01"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[13px] font-mono outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]/20 transition-all rounded-[var(--radius)]"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Access Key */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-[var(--ink-4)] uppercase tracking-[0.15em] block ml-1">
              Secure Access Key
            </label>
            <div className="relative group">
              <input
                type="password"
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-[13px] font-mono outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)]/20 transition-all rounded-[var(--radius)]"
                autoComplete="current-password"
              />
              <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-4)] opacity-50 group-hover:opacity-100 transition-opacity" size={18} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--red)] bg-[var(--red-bg)] border border-[var(--red-border)] p-2 rounded animate-shake">
              <ShieldCheck size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-[var(--radius)] font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
            loading 
            ? 'bg-[var(--surface-raised)] text-[var(--ink-4)] cursor-not-allowed' 
            : 'bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--ink-2)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] shadow-lg'
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-[var(--bg)]/20 border-t-[var(--bg)] rounded-full animate-spin" />
          ) : (
            <>
              Initialize Protocol
              <ChevronRight size={14} className="mt-0.5" />
            </>
          )}
        </button>

        {/* Security Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] opacity-30 group cursor-default">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-widest">Encyption Standard</span>
            <span className="text-[10px] font-mono text-[var(--ink)]">AES_256_GCM</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-widest text-right">Uplink Status</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--green)]">
              <div className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" />
              SECURE_LINK_OK
            </div>
          </div>
        </div>
      </form>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-10">
         <div className="w-8 h-8 rounded bg-[var(--ink)] flex items-center justify-center text-[var(--bg)] font-bold">JS</div>
         <span className="text-[9px] font-bold uppercase tracking-widest">2026 Innovation India</span>
      </div>
    </div>
  );
}

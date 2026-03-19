import { useEffect, useState } from 'react';

const BOOT_LOGS = [
  'INITIALIZING JanSamvaad ResolveOS KERNEL...',
  'CONNECTING TO MUNICIPAL DATA UPLINK...',
  'AUTHENTICATING OPERATOR CREDENTIALS...',
  'SYNCING WARD MAP DATA (DELHI-NDMC)...',
  'LOADING LIVE TICKETS FROM PERSISTENCE...',
  'ENABLING AI TRANSCRIPTION ENGINE...',
  'SYSTEM READY. BOOTING DASHBOARD...'
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < BOOT_LOGS.length) {
        setLogs(prev => [...prev.slice(-4), BOOT_LOGS[currentLog]]);
        setProgress(((currentLog + 1) / BOOT_LOGS.length) * 100);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[var(--bg)] flex flex-col items-center justify-center font-mono overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-6">
        
        {/* Branding */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-[var(--blue)] rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-[0_0_30px_rgba(37,99,235,0.3)] animate-pulse">
            JS
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-[var(--ink)]">JanSamvaad</h1>
            <p className="text-[10px] text-[var(--ink-4)] tracking-[0.3em] font-bold uppercase mt-1">ResolveOS Intelligence</p>
          </div>
        </div>

        {/* Pseudo-Terminal Logs */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-4 h-32 flex flex-col justify-end gap-1.5 shadow-inner">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-[9px] leading-tight transition-all duration-300">
              <span className="text-[var(--blue)] font-bold shrink-0">[{new Date().toLocaleTimeString('en-GB', { hour12: false })}]</span>
              <span className={i === logs.length - 1 ? 'text-[var(--ink)]' : 'text-[var(--ink-4)]'}>{log}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[9px] text-[var(--ink-4)] font-bold uppercase tracking-widest">System Load</span>
            <span className="text-[11px] font-bold text-[var(--ink-2)]">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-[var(--surface)] border border-[var(--border)] rounded-full overflow-hidden">
             <div 
               className="h-full bg-[var(--blue)] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
               style={{ width: `${progress}%` }}
             />
          </div>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 text-[8px] text-[var(--ink-4)] opacity-20 uppercase tracking-widest">
        NDMC Deployment // Secure Uplink 01
      </div>
      <div className="absolute bottom-8 right-8 text-[8px] text-[var(--ink-4)] opacity-20 uppercase tracking-widest">
        Property of Indian Innovates // 2026
      </div>
    </div>
  );
}

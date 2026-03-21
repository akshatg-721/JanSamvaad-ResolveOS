"use client";
import Link from "next/link";

interface PillNavProps {
  backHref?: string;
  links: [string, string][];
}

export function PillNav({ links }: PillNavProps) {
  return (
    <div className="flex justify-center px-4 pt-8 sticky top-4 z-50" style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}>
      <nav className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 mr-2">
          <span className="font-mono text-[9px] tracking-tighter text-[#FDF3DB] uppercase whitespace-nowrap">← JS / <span className="text-[#A3C9AA]">ResolveOS</span></span>
        </Link>
        {links.map(([l, h]) => (
          <Link key={h} href={h} className="hidden md:block text-[11px] font-medium tracking-wide text-[#8E8A80] uppercase hover:text-[#C2BCB0] px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200">{l}</Link>
        ))}
        <Link href="/demo" className="ml-2 text-[11px] font-bold tracking-wide uppercase bg-[#A3C9AA] hover:bg-[#A3C9AA]/90 text-black px-5 py-2.5 rounded-full transition-all duration-200">
          Demo →
        </Link>
      </nav>
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 p-8 md:p-20 bg-[#020202] border-t border-white/5">
      <Link href="/" className="font-mono text-[9px] tracking-tighter text-[#A3C9AA] uppercase">← Back to Home</Link>
      <div className="text-[#8E8A80] text-sm font-light">BML Munjal University · India Innovates 2026</div>
    </footer>
  );
}

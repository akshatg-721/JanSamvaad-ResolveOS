"use client";
import Link from "next/link";
import { PillNav, PageFooter } from "@/components/page-nav";

const serifStyle = { fontFamily: "var(--font-serif), Georgia, serif" };
const bodyStyle  = { fontFamily: "var(--font-display), system-ui, sans-serif" };

const stack = [
  { num: "01", title: "Voice Intake", tag: "Twilio IVR",
    items: ["Any Indian language or dialect", "Zero smartphone or internet needed", "IVR audio → transcription pipeline", "Hinglish, Tamil, Bengali, Marathi"] },
  { num: "02", title: "AI Classification", tag: "Gemini 2.5 Flash",
    items: ["Category extraction in < 3s", "Urgency scoring (1–10)", "Geo-location from verbal context", "Frustration / sentiment analysis"] },
  { num: "03", title: "Data Persistence", tag: "PostgreSQL",
    items: ["Auto-updating triggers", "SLA deadline columns", "SHA-256 hashed evidence URLs", "Citizen feedback rating storage"] },
  { num: "04", title: "Live Dashboard", tag: "Next.js 15 + Socket.IO",
    items: ["Real-time WebSocket ticket push", "Leaflet.js GIS heatmap", "SLA breach prediction alerts", "glassmorphism UI components"] },
];

export default function SolutionPage() {
  return (
    <div className="bg-[#050505] text-[#F8F5F0] overflow-x-hidden antialiased" style={bodyStyle}>

      <PillNav links={[["The Problem", "/problem"], ["Team", "/about"], ["Compliance", "/compliance"]]} />

      {/* Hero — tighter padding + radial glow */}
      <section className="relative px-8 py-16 md:px-20 md:py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[40rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,201,170,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-8">Technical Architecture</div>
          <h1 style={serifStyle} className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] tracking-tight text-[#F8F5F0] max-w-4xl">
            The ResolveOS<br />
            <em className="italic text-[#8E8A80] font-light">tech stack.</em>
          </h1>
          <p className="mt-10 text-lg font-normal text-[#C2BCB0] leading-[1.9] max-w-2xl">
            Not a prototype. A production-grade civic intelligence system built on battle-tested infrastructure, designed to scale to 25,000+ municipalities.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <div className="px-8 py-8 md:px-20 border-b border-white/5 bg-[#0a0a0a] overflow-x-auto">
        <div className="font-mono text-[10px] tracking-[.2rem] text-[#8E8A80] uppercase mb-8">Data Pipeline</div>
        <div className="flex items-center gap-4 min-w-max">
          {["Voice Call", "Transcribe", "AI Extract", "Geo-Tag", "DB Store", "Live Push"].map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className="px-5 py-3 border border-white/8 hover:border-[#A3C9AA]/30 transition-colors duration-500">
                <div className="font-mono text-[9px] text-[#A3C9AA] tracking-widest mb-1">{String(i + 1).padStart(2, "0")}</div>
                <div style={serifStyle} className="text-lg font-light text-[#F8F5F0]">{s}</div>
              </div>
              {i < 5 && <span className="font-mono text-[#8E8A80] text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Stack grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
        {stack.map((s, i) => (
          <div key={s.num} className={`relative p-12 md:p-16 border-b md:border-b-0 border-white/5 ${i % 2 === 0 ? 'md:border-r' : ''} hover:bg-white/[0.02] transition-colors duration-700 overflow-hidden`}>
            {/* Subtle corner glow */}
            <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at bottom right, rgba(163,201,170,0.06) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[10px] tracking-widest text-[#8E8A80]">{s.num}</div>
                <div className="font-mono text-[9px] tracking-widest uppercase bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 text-[#A3C9AA] px-3 py-1 rounded-full">{s.tag}</div>
              </div>
              <h2 style={serifStyle} className="text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-[1.1] tracking-tight text-[#FDF3DB] mb-8">{s.title}</h2>
              <div className="flex flex-col gap-3">
                {s.items.map((item) => (
                  <div key={item} className="flex items-center gap-4 text-sm font-normal text-[#C2BCB0]">
                    <div className="w-1 h-1 bg-[#A3C9AA] shrink-0 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-8 py-16 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <h2 style={serifStyle} className="text-[clamp(2rem,3.5vw,3rem)] font-light tracking-tight text-[#F8F5F0]">
          See it running <em className="italic text-[#A3C9AA]">live.</em>
        </h2>
        <Link href="/demo" className="text-[11px] font-bold tracking-widest uppercase border border-[#A3C9AA]/30 text-[#A3C9AA] hover:bg-[#A3C9AA]/10 px-8 py-4 rounded-full transition-all duration-300">
          Launch Demo →
        </Link>
      </div>

      <PageFooter />
    </div>
  );
}

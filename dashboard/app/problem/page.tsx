"use client";
import Link from "next/link";
import { PillNav, PageFooter } from "@/components/page-nav";

const serifStyle = { fontFamily: "var(--font-serif), Georgia, serif" };
const bodyStyle  = { fontFamily: "var(--font-display), system-ui, sans-serif" };

const barriers = [
  "16% of India has zero internet access — they cannot use any digital portal",
  "All major portals are English-only. Less than 10% of India reads English fluently",
  "Mobile grievance apps require smartphones — 600M Indians use feature phones",
  "No status tracking after filing — citizens don't know if anyone read their complaint",
  "Average response time is 12 days — citizens lose trust and stop trying",
  "Field officers have no mobile interface — updates require desktop logins",
];

export default function ProblemPage() {
  return (
    <div className="bg-[#050505] text-[#F8F5F0] overflow-x-hidden antialiased" style={bodyStyle}>

      <PillNav links={[["Solution", "/solution"], ["Team", "/about"], ["Compliance", "/compliance"]]} />

      {/* Hero — tighter padding, radial glow behind heading */}
      <section className="relative px-8 py-16 md:px-20 md:py-28 border-b border-white/5 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[40rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,201,170,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-8">The Problem Statement</div>
          <h1 style={serifStyle} className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] tracking-tight text-[#F8F5F0] max-w-4xl">
            India has a voice.<br />
            <em className="italic text-[#8E8A80] font-light">No one is listening.</em>
          </h1>
          <p className="mt-10 text-lg font-normal text-[#C2BCB0] leading-[1.9] max-w-2xl">
            400 million civic grievances go unregistered every year. Not because citizens don't care — but because every system designed to hear them has been built for someone else.
          </p>
        </div>
      </section>

      {/* Stats with citations */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/5">
        {[
          { v: "400M+", l: "Unheard Complaints Annually", src: "Lokpal Annual Report 2022–23" },
          { v: "67%",   l: "Filed Tickets Ignored >30 Days", src: "NITI Aayog Grievance Study 2023" },
          { v: "₹2.4T", l: "Lost Productivity / Year", src: "World Bank India Governance Report" },
          { v: "12 Days",l: "Average Response Time", src: "Centralised Public Grievance Portal (CPGRAMS)" },
        ].map((s) => (
          <div key={s.l} className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-700">
            <div style={serifStyle} className="text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-none tracking-tight text-[#FDF3DB] mb-4">{s.v}</div>
            <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] uppercase leading-[1.6] mb-3">{s.l}</div>
            <div className="font-mono text-[8px] tracking-wider text-[#A3C9AA]/60 leading-tight">Source: {s.src}</div>
          </div>
        ))}
      </div>

      {/* Barriers */}
      <div className="relative px-8 py-20 md:px-20 md:py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(163,201,170,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-10">Root Causes</div>
          <h2 style={serifStyle} className="text-[clamp(2.5rem,4vw,3.5rem)] font-light leading-[1.1] tracking-tight text-[#F8F5F0] mb-12">
            Why every existing<br />
            <em className="italic text-[#8E8A80]">system has failed.</em>
          </h2>
          <div className="flex flex-col max-w-3xl">
            {barriers.map((b, i) => (
              <div key={b} className="flex gap-8 py-7 border-b border-white/5 first:border-t relative group cursor-default hover:pl-6 transition-all duration-700">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#A3C9AA] to-transparent scale-y-0 origin-center transition-transform duration-700 group-hover:scale-y-100" />
                <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] pt-1 w-8 shrink-0 group-hover:text-[#A3C9AA] transition-colors">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-base font-normal text-[#C2BCB0] leading-relaxed">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-16 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 style={serifStyle} className="text-[clamp(2rem,3.5vw,3rem)] font-light tracking-tight text-[#F8F5F0]">We built the answer.</h2>
          <p className="mt-3 text-base font-normal text-[#8E8A80]">Voice-first. AI-powered. Citizen-verified.</p>
        </div>
        <Link href="/solution" className="text-[11px] font-bold tracking-widest uppercase border border-[#A3C9AA]/30 text-[#A3C9AA] hover:bg-[#A3C9AA]/10 px-8 py-4 rounded-full transition-all duration-300">
          See the Solution →
        </Link>
      </div>

      <PageFooter />
    </div>
  );
}

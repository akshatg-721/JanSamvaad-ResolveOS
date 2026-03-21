"use client";
import Link from "next/link";
import { PillNav, PageFooter } from "@/components/page-nav";

const serifStyle = { fontFamily: "var(--font-serif), Georgia, serif" };
const bodyStyle  = { fontFamily: "var(--font-display), system-ui, sans-serif" };

const matrix = [
  ["Citizen Phone Numbers", "Masked — format +91-XXXXX-XX### enforced at API layer"],
  ["Voice Recordings",      "Transcribed by Twilio then permanently deleted"],
  ["Complaint Text",        "Stored encrypted at rest in PostgreSQL"],
  ["Resolution Evidence",   "SHA-256 hashed URL reference only"],
  ["Operator Sessions",     "JWT tokens with 24h expiry"],
  ["Consent Records",       "Immutable TIMESTAMPTZ log in call_consents table"],
];

const regs = ["DPDP Act 2023", "IT Act 2000", "TRAI DND", "CPGRAMS"];

export default function CompliancePage() {
  return (
    <div className="bg-[#050505] text-[#F8F5F0] overflow-x-hidden antialiased" style={bodyStyle}>

      <PillNav links={[["The Problem", "/problem"], ["Solution", "/solution"], ["Team", "/about"]]} />

      {/* Hero — tighter + radial glow + regulation badges */}
      <section className="relative px-8 py-16 md:px-20 md:py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[40rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,201,170,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          {/* Regulation badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            {regs.map((r) => (
              <span key={r} className="font-mono text-[9px] tracking-widest uppercase bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 text-[#A3C9AA] px-3 py-1.5 rounded-full">{r}</span>
            ))}
          </div>
          <h1 style={serifStyle} className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] tracking-tight text-[#F8F5F0] max-w-4xl">
            Trust is not a feature.<br />
            <em className="italic text-[#8E8A80] font-light">It is the foundation.</em>
          </h1>
          <p className="mt-10 text-lg font-normal text-[#C2BCB0] leading-[1.9] max-w-2xl">
            Civic data is the most sensitive data that exists. JanSamvaad is built with government-grade privacy compliance from the first line of code — not as an afterthought.
          </p>
        </div>
      </section>

      {/* Pillars with subtle background variation */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
        {[
          { num: "01", title: "TRAI DND Compliance",      tag: "Regulation",       desc: "Every outbound call passes through the Do-Not-Disturb registry scrub before dialling. Citizens who have opted out are never contacted." },
          { num: "02", title: "Explicit Consent Logging", tag: "Data Governance",  desc: "Every call interaction generates a digitally signed consent record in our call_consents table with TIMESTAMPTZ. Fully auditable and DPDP Act 2023 compliant." },
          { num: "03", title: "Phone Number Masking",     tag: "Privacy",          desc: "Phone numbers are never displayed in full to operators. +91-XXXXX-XX789 format is enforced at the API layer — not just the UI." },
          { num: "04", title: "JWT + SHA-256 Auth",       tag: "Security",         desc: "All sessions use short-lived JWTs. Evidence URLs are SHA-256 hashed on upload. Resolution tokens are cryptographically random and single-use." },
        ].map((p, i) => (
          <div key={p.num} className={`relative p-12 md:p-16 border-b md:border-b-0 border-white/5 ${i % 2 === 0 ? 'md:border-r' : ''} hover:bg-white/[0.02] transition-colors duration-700 overflow-hidden`}>
            <div className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none opacity-60"
              style={{ background: "radial-gradient(ellipse at bottom left, rgba(163,201,170,0.06) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="font-mono text-[10px] tracking-widest text-[#8E8A80]">{p.num}</div>
                <div className="font-mono text-[9px] tracking-widest uppercase bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 text-[#A3C9AA] px-3 py-1 rounded-full">{p.tag}</div>
              </div>
              <h2 style={serifStyle} className="text-[clamp(1.8rem,2.5vw,2.2rem)] font-light leading-[1.1] tracking-tight text-[#FDF3DB] mb-5">{p.title}</h2>
              <p className="text-sm font-normal text-[#C2BCB0] leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Matrix */}
      <div className="relative px-8 py-20 md:px-20 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-80 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(163,201,170,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-10">Data Handling Matrix</div>
          <h2 style={serifStyle} className="text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.1] tracking-tight text-[#F8F5F0] mb-12">
            What we collect.<br />
            <em className="italic text-[#8E8A80]">What we do with it.</em>
          </h2>
          <div className="max-w-3xl border border-white/8">
            <div className="grid grid-cols-2 bg-white/[0.03] px-8 py-4 border-b border-white/8">
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#8E8A80]">Data Type</span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-[#8E8A80]">Our Action</span>
            </div>
            {matrix.map(([label, action], i) => (
              <div key={label} className={`grid grid-cols-2 px-8 py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                <span className="text-sm font-normal text-[#C2BCB0]">{label}</span>
                <span className="text-sm font-medium text-[#A3C9AA]">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-16 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <h2 style={serifStyle} className="text-[clamp(2rem,3.5vw,3rem)] font-light tracking-tight text-[#F8F5F0]">
          Compliant by design.<br />
          <em className="italic text-[#A3C9AA]">Trustworthy by default.</em>
        </h2>
        <Link href="/demo" className="text-[11px] font-bold tracking-widest uppercase border border-[#A3C9AA]/30 text-[#A3C9AA] hover:bg-[#A3C9AA]/10 px-8 py-4 rounded-full transition-all duration-300">
          Launch Demo →
        </Link>
      </div>

      <PageFooter />
    </div>
  );
}

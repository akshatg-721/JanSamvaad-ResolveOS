"use client";
import Link from "next/link";
import { PillNav, PageFooter } from "@/components/page-nav";

const serifStyle = { fontFamily: "var(--font-serif), Georgia, serif" };
const bodyStyle  = { fontFamily: "var(--font-display), system-ui, sans-serif" };

const team = [
  { name: "Akshat Goyal",    role: "Team Lead & Full Stack Developer", desc: "System architecture, end-to-end integration, and project leadership.", initial: "AG" },
  { name: "Harsheet Dwivedi",role: "AI & Backend Engineer",            desc: "Gemini AI pipeline, Node.js/Express backend, and database design.",   initial: "HD" },
  { name: "Pranav Agarwaal", role: "Frontend & UI Engineer",           desc: "Next.js dashboard, component design, and GIS map integration.",        initial: "PA" },
  { name: "Aditya Jain",     role: "Research & Deployment Engineer",   desc: "Market research, compliance analysis, and cloud deployment.",          initial: "AJ" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#050505] text-[#F8F5F0] overflow-x-hidden antialiased" style={bodyStyle}>

      <PillNav links={[["Problem", "/problem"], ["Solution", "/solution"], ["Compliance", "/compliance"]]} />

      {/* Hero — tighter padding + radial glow */}
      <section className="relative px-8 py-16 md:px-20 md:py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[40rem] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,201,170,0.07) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-8">Our Mission</div>
          <h1 style={serifStyle} className="text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.05] tracking-tight text-[#F8F5F0] max-w-4xl">
            Citizenship<br />
            <em className="italic text-[#8E8A80] font-light">transformed.</em>
          </h1>
          <p className="mt-10 text-lg font-normal text-[#C2BCB0] leading-[1.9] max-w-2xl">
            We are engineers from <span style={serifStyle} className="text-[#FDF3DB] font-light text-xl not-italic">BML Munjal University</span> who believe governance technology should serve the people at the margins — not those who can already afford a smartphone and speak English.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <div className="px-8 py-20 md:px-20 border-b border-white/5">
        <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-14">The Team</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {team.map((m) => (
            <div key={m.name} className="group p-10 border border-white/8 hover:border-[#A3C9AA]/25 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A3C9AA]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(ellipse at bottom right, rgba(163,201,170,0.08) 0%, transparent 70%)" }} />
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 flex items-center justify-center shrink-0 group-hover:bg-[#A3C9AA]/15 transition-colors duration-500">
                  <span className="font-mono text-xs text-[#A3C9AA] font-bold tracking-widest">{m.initial}</span>
                </div>
                <div>
                  <div style={serifStyle} className="text-2xl font-light text-[#FDF3DB] mb-2">{m.name}</div>
                  <div className="font-mono text-[9px] tracking-widest text-[#A3C9AA] uppercase mb-3">{m.role}</div>
                  <p className="text-sm font-normal text-[#8E8A80] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-5 max-w-xl">
          <div className="w-px h-10 bg-[#A3C9AA]/30" />
          <div>
            <div className="font-mono text-[9px] tracking-widest text-[#8E8A80] uppercase mb-1">Institution</div>
            <div style={serifStyle} className="text-xl font-light text-[#C2BCB0]">BML Munjal University, Gurugram</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-white/5">
        {[
          { num: "01", title: "Citizen-First",      desc: "Every decision starts with: does this work for a farmer in rural Bihar who has never used the internet?" },
          { num: "02", title: "Clean Architecture", desc: "Production-grade logging, error boundaries, and schema migration governance from day one." },
          { num: "03", title: "Regional Reach",     desc: "Hinglish, Tamil, Bengali — the AI adapts to the citizen, not the other way around." },
          { num: "04", title: "Impact First",        desc: "We measure success by resolution rates, citizen satisfaction scores, and SLA breach reduction." },
        ].map((v, i) => (
          <div key={v.num} className={`p-12 md:p-16 border-b md:border-b-0 border-white/5 ${i % 2 === 0 ? 'md:border-r' : ''} hover:bg-white/[0.02] transition-colors duration-700`}>
            <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] mb-6">{v.num}</div>
            <h2 style={serifStyle} className="text-[clamp(1.8rem,2.5vw,2.2rem)] font-light leading-[1.1] tracking-tight text-[#FDF3DB] mb-5">{v.title}</h2>
            <p className="text-sm font-normal text-[#C2BCB0] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="relative px-8 py-20 md:px-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(163,201,170,0.05) 0%, transparent 70%)" }} />
        <p style={serifStyle} className="relative z-10 text-[clamp(1.8rem,3.5vw,3rem)] font-light leading-[1.4] tracking-tight text-[#F8F5F0] max-w-3xl mx-auto">
          "Built at BML Munjal University for India Innovates 2026 —{" "}
          <em className="italic text-[#A3C9AA]">one voice, one resolution at a time.</em>"
        </p>
        <div className="mt-10 relative z-10">
          <Link href="/demo" className="text-[11px] font-bold tracking-widest uppercase border border-[#A3C9AA]/30 text-[#A3C9AA] hover:bg-[#A3C9AA]/10 px-8 py-4 rounded-full transition-all duration-300">
            See What We Built →
          </Link>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

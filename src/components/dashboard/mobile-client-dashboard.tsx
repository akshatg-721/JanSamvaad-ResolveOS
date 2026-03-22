"use client";

import { ClipboardCheck, Headphones, LayoutGrid, Phone, RotateCcw } from "lucide-react";

export function MobileClientDashboard() {
  return (
    <div className="min-h-screen bg-[#070d22] text-white relative overflow-hidden pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(59,227,143,.12),transparent_38%)] pointer-events-none" />

      <header className="relative z-10 px-4 pt-4 flex items-center justify-between border-b border-white/10 pb-3">
        <h1 className="text-4xl font-semibold tracking-tight">JanSamvaad</h1>
        <div className="flex items-center gap-3">
          <button className="text-[#3be38f] text-lg">Language</button>
          <button className="rounded-full bg-[#38dd79] text-[#041022] font-semibold px-4 py-2 text-lg">
            Citizen Login
          </button>
        </div>
      </header>

      <main className="relative z-10 px-6 pt-10">
        <h2 className="text-8xl font-bold tracking-tight">RESOLVE</h2>
        <p className="text-3xl tracking-[0.25em] text-white/80 mt-4">SPEAK TO RESOLVE.</p>

        <button className="mt-12 mx-auto w-[86vw] max-w-[560px] aspect-square rounded-full bg-[#3be38f] text-[#041022] flex flex-col items-center justify-center shadow-[0_0_70px_rgba(59,227,143,.45)]">
          <Phone className="w-20 h-20" />
          <span className="mt-6 text-5xl font-semibold">Call to Register Complaint</span>
        </button>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-5">
            <RotateCcw className="w-7 h-7 text-white/65" />
            <p className="mt-4 text-lg text-white/70 tracking-wider">RECENT ACTIVITY</p>
            <p className="mt-2 text-4xl font-semibold">2 Resolved</p>
          </div>
          <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-5">
            <Headphones className="w-7 h-7 text-[#f8b5a0]" />
            <p className="mt-4 text-lg text-white/70 tracking-wider">SUPPORT</p>
            <p className="mt-2 text-4xl font-semibold">24/7 Helpline</p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-b border-white/10 py-8">
          <div className="w-16 h-16 rounded-full bg-white/10" />
          <div>
            <p className="text-2xl tracking-widest">BUILT FOR BHARAT 🇮🇳</p>
            <p className="text-white/60 text-lg">Ministry of Electronics & IT</p>
          </div>
        </div>

        <footer className="mt-8 text-center text-white/45 text-xl space-y-3">
          <p>© 2024 Digital India | Ministry of Electronics & IT</p>
          <div className="flex justify-center gap-8">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 z-20 rounded-3xl border border-white/10 bg-[#0b142e]/95 backdrop-blur-xl p-3 grid grid-cols-3 gap-2">
        <button className="h-16 rounded-2xl text-white/60 flex flex-col items-center justify-center">
          <Phone className="w-5 h-5" />
          <span className="text-xs mt-1">CALL</span>
        </button>
        <button className="h-16 rounded-2xl text-white/60 flex flex-col items-center justify-center">
          <ClipboardCheck className="w-5 h-5" />
          <span className="text-xs mt-1">STATUS</span>
        </button>
        <button className="h-16 rounded-2xl bg-[rgba(59,227,143,.18)] text-[#3be38f] ring-1 ring-[#3be38f]/40 shadow-[0_0_25px_rgba(59,227,143,.25)] flex flex-col items-center justify-center">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-xs mt-1 font-semibold">DASHBOARD</span>
        </button>
      </nav>
    </div>
  );
}

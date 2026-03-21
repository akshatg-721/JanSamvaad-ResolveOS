"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/problem", label: "The Problem" },
  { href: "/solution", label: "Solution" },
  { href: "/about", label: "Team" },
  { href: "/compliance", label: "Compliance" },
];

export function CyberNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
      {/* Neon top line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300">
            <span className="font-black text-black text-sm">JS</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-white text-sm tracking-tight">JanSamvaad</span>
            <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">ResolveOS</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                pathname === l.href
                  ? "text-accent bg-accent/10 border border-accent/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-black font-black text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300 active:scale-95"
          >
            Launch Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden text-white/60" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-2xl px-4 py-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/demo"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-black font-black text-sm mt-2"
          >
            Launch Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </nav>
  );
}

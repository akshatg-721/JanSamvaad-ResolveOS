"use client";

import { Bell, MapPin } from "lucide-react";
import type { Section } from "@/lib/types";

interface HeaderProps {
  activeSection: Section;
}

const labels: Record<Section, string> = {
  overview: "Operator Dashboard",
  gis: "Incident Map",
  ledger: "Tickets",
  activity: "Agents",
  analytics: "Analytics",
  settings: "Settings",
};

export function Header({ activeSection }: HeaderProps) {
  return (
    <header className="h-20 border-b border-white/10 bg-[#060d22]/85 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold uppercase tracking-wide text-white">{labels[activeSection]}</h1>
          <span className="hidden lg:flex items-center gap-2 text-white/55">
            <MapPin className="w-4 h-4 text-[#3be38f]" />
            New Delhi, Sector 4
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-white/70 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#3be38f]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-semibold leading-none">Arjun Sharma</p>
              <p className="text-white/45 text-xs mt-1">Tier-2 Resolver</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-[linear-gradient(140deg,#3be38f,#0ea5e9)] ring-2 ring-white/20" />
          </div>
        </div>
      </div>
    </header>
  );
}

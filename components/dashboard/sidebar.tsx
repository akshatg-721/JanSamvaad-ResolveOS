"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Users,
  Settings,
  Map as MapIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "ledger", label: "Tickets", icon: Ticket },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "activity", label: "Agents", icon: Users },
  { id: "gis", label: "Map", icon: MapIcon },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-[#0a1023] transition-all duration-300",
        "bg-[linear-gradient(180deg,#0f1834_0%,#0a1023_35%,#081129_100%)]",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="h-20 border-b border-white/10 flex items-center px-5">
        {collapsed ? (
          <div className="w-full text-center font-bold text-[#3be38f] text-xl">J</div>
        ) : (
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#3be38f]">JanSamvaad</h2>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45 mt-1">ResolveOS Operator</p>
          </div>
        )}
      </div>

      <nav className="px-3 pt-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full h-12 rounded-xl px-3 flex items-center gap-3 transition-all relative",
                active
                  ? "bg-[linear-gradient(90deg,rgba(59,227,143,.26),rgba(59,227,143,.08))] text-[#3be38f]"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {active && (
                <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l bg-[#3be38f]" />
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="absolute left-3 right-3 bottom-20">
          <button className="w-full h-12 rounded-full bg-[#38dd79] hover:bg-[#3be38f] text-[#081129] font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      )}

      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute bottom-4 left-3 right-3 h-10 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        {!collapsed && <span className="text-xs">Collapse</span>}
      </button>
    </aside>
  );
}

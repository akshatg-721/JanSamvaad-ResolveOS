"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, CheckCircle2, AlertCircle, Timer } from "lucide-react";

const grievances = [
  {
    citizen: "Amit Kumar",
    category: "Sanitation",
    status: "open",
    time: "12 mins ago",
    ref: "JS-108",
  },
  {
    citizen: "Priya Singh",
    category: "Water Supply",
    status: "in-progress",
    time: "45 mins ago",
    ref: "JS-107",
  },
  {
    citizen: "Rajesh Chen",
    category: "Street Lighting",
    status: "resolved",
    time: "2 hours ago",
    ref: "JS-105",
  },
  {
    citizen: "Sanjay Gupta",
    category: "Road Damage",
    status: "open",
    time: "4 hours ago",
    ref: "JS-104",
  },
  {
    citizen: "Meera Bai",
    category: "Drainage",
    status: "resolved",
    time: "1 day ago",
    ref: "JS-102",
  },
];

const statusConfig = {
  open: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Open",
  },
  "in-progress": {
    icon: Timer,
    color: "text-warning",
    bg: "bg-warning/10",
    label: "In Progress",
  },
  resolved: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    label: "Resolved",
  },
};

export function RecentGrievances() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent Grievances</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Live feed of reported issues</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium transition-colors group">
          View Ledger
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="space-y-1">
        {grievances.map((g, index) => {
          const status = statusConfig[g.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={g.ref}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2",
                index % 2 === 0 ? "bg-secondary/20" : "bg-transparent",
                "hover:bg-accent/5 hover:translate-x-1"
              )}
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300 shadow-inner">
                  {g.ref.split('-')[1]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">{g.category}</p>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">{g.citizen} • {g.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-widest">{g.ref}</span>
                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm", status.bg, status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

      <div className="space-y-3">
        {grievances.map((g, index) => {
          const status = statusConfig[g.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={g.ref}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${(index + 3) * 100}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-accent group-hover:bg-accent/10 transition-all duration-200 font-mono">
                  {g.ref.split('-')[1]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{g.category}</p>
                  <p className="text-xs text-muted-foreground">{g.citizen} • {g.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-muted-foreground">{g.ref}</span>
                <div className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", status.bg, status.color)}>
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

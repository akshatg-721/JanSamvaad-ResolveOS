"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className="group relative bg-card border border-border rounded-xl p-5 hover:border-accent/50 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay * 100}ms`, animationFillMode: "both" }}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">
            {title}
          </span>
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-extrabold text-foreground tracking-tighter">
            {value}
          </span>
          <div className="flex flex-col items-start mb-1">
            <div
              className={cn(
                "flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest",
                changeType === "positive" && "text-emerald-400",
                changeType === "negative" && "text-rose-400",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
              {changeType === "negative" && (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{change}</span>
            </div>
            <span className="text-[9px] text-muted-foreground/60 uppercase font-medium tracking-tight">
              24h Change
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Trophy, TrendingUp, CheckCircle } from "lucide-react";

const officers = [
  { name: "Pratham Shaurya", resolved: 48, rating: "4.9", change: "+12%", rank: 1 },
  { name: "Macmilan Cyril", resolved: 42, rating: "4.8", change: "+8%", rank: 2 },
  { name: "Sarah Chen", resolved: 39, rating: "4.7", change: "+15%", rank: 3 },
  { name: "Mike Johnson", resolved: 35, rating: "4.6", change: "+5%", rank: 4 },
  { name: "Lisa Park", resolved: 31, rating: "4.5", change: "+2%", rank: 5 },
];

export function OfficerPerformance() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Top Officers</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Performance by resolution rate</p>
        </div>
        <div className="flex items-center gap-1 text-warning">
          <Trophy className="w-5 h-5 shadow-[0_0_10px_rgba(var(--warning),0.5)]" />
        </div>
      </div>

      <div className="space-y-3">
        {officers.map((officer, index) => (
          <div
            key={officer.name}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-right-2"
            style={{ animationDelay: `${(index + 4) * 100}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-bold text-accent-foreground">
                  {officer.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {officer.rank <= 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning text-[10px] font-bold flex items-center justify-center text-background shadow-lg">
                    {officer.rank}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{officer.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-success" />
                  {officer.resolved} resolved
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-foreground">★ {officer.rating}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-success uppercase">
                <TrendingUp className="w-3 h-3" />
                {officer.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

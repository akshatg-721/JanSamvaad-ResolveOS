"use client";

import { useState, useEffect } from "react";

const stages = [
  { name: "Resolved", value: 45, count: 577, color: "bg-chart-2" },
  { name: "In Progress", value: 28, count: 359, color: "bg-accent" },
  { name: "Open", value: 18, count: 231, color: "bg-chart-1" },
  { name: "Pending", value: 9, count: 115, color: "bg-secondary" },
];

export function GrievanceStatusDistribution() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Status Distribution</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Current state of reported tickets</p>
      </div>

      <div className="space-y-5">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{stage.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{stage.count} tickets</span>
                <span className="text-sm font-bold text-foreground">{stage.value}%</span>
              </div>
            </div>
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className={`h-full ${stage.color} rounded-full shadow-[0_0_8px_rgba(var(--accent),0.2)] transition-all duration-1000 ease-out`}
                style={{
                  width: isLoaded ? `${stage.value}%` : "0%",
                  transitionDelay: `${index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Resolution Efficiency</span>
          <span className="text-xl font-bold text-success">92.4%</span>
        </div>
      </div>
    </div>
  );
}

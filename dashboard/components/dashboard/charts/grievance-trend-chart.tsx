"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", reported: 186, resolved: 140 },
  { month: "Feb", reported: 205, resolved: 160 },
  { month: "Mar", reported: 237, resolved: 190 },
  { month: "Apr", reported: 273, resolved: 210 },
  { month: "May", reported: 209, resolved: 180 },
  { month: "Jun", reported: 314, resolved: 250 },
  { month: "Jul", reported: 352, resolved: 290 },
  { month: "Aug", reported: 389, resolved: 310 },
  { month: "Sep", reported: 421, resolved: 360 },
  { month: "Oct", reported: 458, resolved: 400 },
  { month: "Nov", reported: 492, resolved: 440 },
  { month: "Dec", reported: 547, resolved: 510 },
];

export function GrievanceTrendChart() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[380px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Grievance Trends</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Monthly reported vs resolved tickets</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Reported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Resolved</span>
          </div>
        </div>
      </div>

      <div className={`h-[280px] transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="reportedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 220)" stopOpacity={1} />
                <stop offset="100%" stopColor="oklch(0.7 0.18 220)" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.18 145)" stopOpacity={1} />
                <stop offset="100%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.65 0 0)", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => `${value}`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.12 0.005 260)",
                border: "1px solid oklch(0.22 0.005 260)",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)"
              }}
              labelStyle={{ color: "oklch(0.95 0 0)", fontWeight: 700 }}
              itemStyle={{ textTransform: "capitalize", fontWeight: 500 }}
            />
            <Bar
              dataKey="reported"
              fill="url(#reportedGradient)"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
            <Bar
              dataKey="resolved"
              fill="url(#resolvedGradient)"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

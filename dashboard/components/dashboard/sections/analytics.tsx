"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GrievanceTrendChart } from "@/components/dashboard/charts/grievance-trend-chart";
import { GrievanceStatusDistribution } from "@/components/dashboard/charts/status-distribution";
import { BarChart3, TrendingUp, PieChart, Info, ShieldAlert } from "lucide-react";

export function AnalyticsSection() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Governance Intelligence</h2>
          <p className="text-muted-foreground mt-1">Advanced data modeling for neighborhood-level grievance patterns.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             Live Sync: Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resolution Trajectory</CardTitle>
                <CardDescription>Performance of civic departments over time</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <GrievanceTrendChart />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inflow Mapping</CardTitle>
                <CardDescription>Grievance volume by density</CardDescription>
              </div>
              <PieChart className="w-5 h-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
             <GrievanceStatusDistribution />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Avg Resolution Time", value: "4.2 Hours", change: "-12%", icon: BarChart3 },
          { label: "Citizen Satisfaction", value: "92%", change: "+5%", icon: TrendingUp },
          { label: "Active Deployments", value: "24 Units", change: "Stable", icon: Info },
        ].map((item, i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <item.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{item.value}</span>
                <span className={`text-xs font-bold ${item.change.startsWith("+") ? "text-green-500" : item.change.startsWith("-") ? "text-red-500" : "text-muted-foreground"}`}>
                  {item.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

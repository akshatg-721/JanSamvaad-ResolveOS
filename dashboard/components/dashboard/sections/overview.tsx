"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { GrievanceTrendChart } from "@/components/dashboard/charts/grievance-trend-chart";
import { GrievanceStatusDistribution } from "@/components/dashboard/charts/status-distribution";
import { RecentGrievances } from "@/components/dashboard/recent-grievances";
import { OfficerPerformance } from "@/components/dashboard/officer-performance";
import { Clock, TrendingUp, Users, Target } from "lucide-react";

export function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Grievances"
          value="1,284"
          change="+8.2%"
          changeType="positive"
          icon={Users}
          delay={0}
        />
        <MetricCard
          title="Resolution Rate"
          value="94.2%"
          change="+1.5%"
          changeType="positive"
          icon={TrendingUp}
          delay={1}
        />
        <MetricCard
          title="Active Cases"
          value="142"
          change="-12"
          changeType="positive"
          icon={Target}
          delay={2}
        />
        <MetricCard
          title="Avg. Resolve Time"
          value="4.2h"
          change="-0.5h"
          changeType="positive"
          icon={Clock}
          delay={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrievanceTrendChart />
        </div>
        <GrievanceStatusDistribution />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentGrievances />
        <OfficerPerformance />
      </div>
    </div>
  );
}

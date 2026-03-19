"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Info, ShieldAlert, Clock, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePie, Pie, LineChart, Line
} from 'recharts';

export function AnalyticsSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiFetch<any>("/api/analytics");
        setData(res);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-muted-foreground uppercase tracking-widest text-xs">Processing Intelligence...</div>;
  if (!data) return <div className="h-96 flex items-center justify-center text-red-400">Failed to load analytics engine.</div>;

  const stats = [
    { label: "SLA Compliance", value: `${data.slaPerformance?.[3]?.onTime || 92}%`, icon: CheckCircle2, color: "text-green-500" },
    { label: "Avg Resolution", value: `${data.wardStats?.[0]?.avgResolutionHrs || 4.2}h`, icon: Clock, color: "text-accent" },
    { label: "Citizen Satisfaction", value: `${data.wardStats?.[0]?.citizenSatisfaction || 85}%`, icon: TrendingUp, color: "text-blue-400" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Governance Intelligence</h2>
          <p className="text-muted-foreground mt-1">Advanced data modeling for neighborhood-level grievance patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <Card key={i} className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Ward-Level Performance</CardTitle>
            <CardDescription>SLA Compliance Rate by Ward</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.wardStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="ward" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                <Bar dataKey="slaRate" fill="var(--accent)">
                  {data.wardStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.slaRate < 80 ? '#ef4444' : 'var(--accent)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Category Density</CardTitle>
            <CardDescription>Total grievances by classification</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
               <RePie>
                 <Pie
                   data={data.categoryTrend}
                   dataKey="count"
                   nameKey="cat"
                   cx="50%"
                   cy="50%"
                   outerRadius={80}
                   label={{ fontSize: 10, fill: '#fff' }}
                 >
                   {data.categoryTrend.map((entry: any, index: number) => (
                     <Cell key={`cell-${index}`} fill={entry.color || 'var(--accent)'} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
               </RePie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, UserPlus, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const activities = [
  { id: 1, type: "call", user: "Harsheet Dwivedi", action: "processed Voice Complaint", time: "2 mins ago", detail: "Sanitation issue in Ward 4", status: "success" },
  { id: 2, type: "ticket", user: "System", action: "flagged Breach Risk", time: "15 mins ago", detail: "JS-902 reaching SLA deadline", status: "warning" },
  { id: 3, type: "resolution", user: "Pratham Shaurya", action: "resolved Grievance", time: "1 hour ago", detail: "JS-844 Water leakage fixed", status: "success" },
  { id: 4, type: "assignment", user: "Admin", action: "assigned Officer", time: "2 hours ago", detail: "JS-101 assigned to Macmilan Cyril", status: "neutral" },
  { id: 5, type: "system", user: "System", action: "synced with GIS", time: "4 hours ago", detail: "Ward 2 boundary update", status: "neutral" },
];

const getIcon = (type: string) => {
  switch (type) {
    case "call": return <Phone className="w-4 h-4" />;
    case "ticket": return <AlertTriangle className="w-4 h-4" />;
    case "resolution": return <CheckCircle2 className="w-4 h-4" />;
    case "assignment": return <UserPlus className="w-4 h-4" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
};

export function ActivitySection() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">System Activity</h2>
          <p className="text-muted-foreground mt-1">Real-time log of administrative and operational events.</p>
        </div>
        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 flex gap-2 py-1 px-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Live Monitoring
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activities.map((activity, index) => (
          <Card key={activity.id} className="bg-slate-900/40 backdrop-blur-md border-white/5 hover:border-blue-500/30 transition-all shadow-none overflow-hidden group rounded-2xl">
            <CardContent className="p-4 flex items-center gap-5">
              <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                activity.status === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                activity.status === "warning" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-0.5">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-black text-xs text-slate-100 uppercase tracking-tight">{activity.user}</span>
                    <span className="text-xs text-slate-500 font-medium truncate">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold uppercase tracking-widest shrink-0">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-300 truncate tracking-tight">{activity.detail}</p>
              </div>
            </CardContent>
            {/* Gradient highlight on hover */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>
        ))}
      </div>
    </div>
  );
}

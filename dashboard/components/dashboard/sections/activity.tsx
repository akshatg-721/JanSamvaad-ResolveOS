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
          <Card key={activity.id} className="bg-card/40 backdrop-blur-sm border-border hover:border-accent/40 transition-colors shadow-none overflow-hidden group">
            <CardContent className="p-4 flex items-start gap-4">
              <div className={`mt-1 p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                activity.status === "success" ? "bg-green-500/10 text-green-500" :
                activity.status === "warning" ? "bg-red-500/10 text-red-500" :
                "bg-blue-500/10 text-blue-500"
              }`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{activity.user}</span>
                    <span className="text-sm text-muted-foreground">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground/80">{activity.detail}</p>
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

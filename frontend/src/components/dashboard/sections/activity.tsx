import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Phone,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { getDashboardActivity } from "@/lib/api/dashboard";
import type { DashboardActivityDTO } from "@/lib/contracts/dashboard";

function getIcon(type: DashboardActivityDTO["type"]) {
  switch (type) {
    case "voice":
      return <Phone className="h-4 w-4" />;
    case "escalation":
    case "alert":
      return <AlertTriangle className="h-4 w-4" />;
    case "verify":
      return <CheckCircle2 className="h-4 w-4" />;
    case "sms":
      return <MessageSquare className="h-4 w-4" />;
    case "ai":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <UserPlus className="h-4 w-4" />;
  }
}

function getTone(type: DashboardActivityDTO["type"]) {
  if (type === "verify") return "success" as const;
  if (type === "escalation" || type === "alert") return "warning" as const;
  if (type === "voice" || type === "ai") return "info" as const;
  return "neutral" as const;
}

export function ActivitySection() {
  const [activities, setActivities] = useState<DashboardActivityDTO[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getDashboardActivity();
        if (!mounted) return;
        setActivities(res.slice(0, 15));
      } catch {
        if (!mounted) return;
        setActivities([]);
      }
    };

    load();
    const timer = setInterval(load, 15000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const rows = useMemo(() => activities, [activities]);

  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-6 duration-500 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">System Activity</h2>
          <p className="mt-1 text-muted-foreground">
            Live feed from voice intake, SLA checks, and resolution verification.
          </p>
        </div>
        <Badge
          variant="outline"
          className="flex gap-2 border-accent/20 bg-accent/10 px-3 py-1 text-accent"
        >
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Live Monitoring
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rows.length === 0 ? (
          <Card className="border-white/5 bg-slate-900/40">
            <CardContent className="p-6 text-sm text-slate-400">No activity yet.</CardContent>
          </Card>
        ) : (
          rows.map((activity) => {
            const tone = getTone(activity.type);
            return (
              <Card
                key={activity.id}
                className="group relative overflow-hidden rounded-2xl border-white/5 bg-slate-900/40 shadow-none transition-all hover:border-blue-500/30"
              >
                <CardContent className="flex items-center gap-5 p-4">
                  <div
                    className={`flex shrink-0 items-center justify-center rounded-2xl border p-3 shadow-inner ${
                      tone === "success"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : tone === "warning"
                          ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                          : tone === "info"
                            ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {getIcon(activity.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center justify-between gap-4">
                      <div className="truncate text-xs font-black uppercase tracking-tight text-slate-100">
                        {activity.type.replace("_", " ")}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <p className="truncate text-sm font-semibold tracking-tight text-slate-300">
                      {activity.message}
                    </p>
                  </div>
                </CardContent>

                <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

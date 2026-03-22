import { Badge } from '@/components/ui/badge';
import { Severity } from '@prisma/client';

export function PriorityBadge({ severity }: { severity: Severity }) {
  const colors: Record<Severity, string> = {
    LOW: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    HIGH: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    CRITICAL: "bg-red-600/10 text-red-600 hover:bg-red-600/20 font-bold border-red-200 animate-pulse",
  };

  return (
    <Badge variant="outline" className={colors[severity]}>
      {severity} Priority
    </Badge>
  );
}

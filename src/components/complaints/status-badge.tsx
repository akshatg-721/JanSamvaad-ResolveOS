import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] || status;
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <Badge variant="outline" className={cn(colorClass, 'font-medium', className)}>
      {label}
    </Badge>
  );
}

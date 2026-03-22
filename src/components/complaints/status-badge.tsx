import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';

export function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  return <Badge className={color}>{label}</Badge>;
}
import { Badge } from '@/components/ui/badge';
import { COMPLAINT_STATUS, STATUS_LABELS } from '@/constants/complaint.constants';

export function StatusBadge({ status }: { status: COMPLAINT_STATUS }) {
  const variantMap: Record<COMPLAINT_STATUS, "default" | "secondary" | "destructive" | "outline"> = {
    [COMPLAINT_STATUS.PENDING]: "secondary",
    [COMPLAINT_STATUS.ACKNOWLEDGED]: "default",
    [COMPLAINT_STATUS.IN_PROGRESS]: "default",
    [COMPLAINT_STATUS.RESOLVED]: "default",
    [COMPLAINT_STATUS.REJECTED]: "destructive",
    [COMPLAINT_STATUS.CLOSED]: "outline",
  };

  const colors: Record<COMPLAINT_STATUS, string> = {
    [COMPLAINT_STATUS.PENDING]: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20",
    [COMPLAINT_STATUS.ACKNOWLEDGED]: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20",
    [COMPLAINT_STATUS.IN_PROGRESS]: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-500/20",
    [COMPLAINT_STATUS.RESOLVED]: "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
    [COMPLAINT_STATUS.REJECTED]: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
    [COMPLAINT_STATUS.CLOSED]: "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 border-gray-500/20",
  };

  return (
    <Badge variant={variantMap[status]} className={colors[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

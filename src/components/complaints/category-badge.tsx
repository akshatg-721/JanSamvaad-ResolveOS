import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS } from '@/lib/constants';

const CATEGORY_COLORS: Record<string, string> = {
  ROADS: 'bg-slate-100 text-slate-700',
  WATER: 'bg-blue-100 text-blue-700',
  ELECTRICITY: 'bg-yellow-100 text-yellow-700',
  SANITATION: 'bg-emerald-100 text-emerald-700',
  PUBLIC_SAFETY: 'bg-red-100 text-red-700',
  TRANSPORTATION: 'bg-indigo-100 text-indigo-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge className={CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER}>
      {CATEGORY_LABELS[category] || category}
    </Badge>
  );
}
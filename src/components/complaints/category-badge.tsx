import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const label = CATEGORY_LABELS[category] || category;
  const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';

  return (
    <Badge variant="outline" className={cn(colorClass, 'font-medium', className)}>
      {label}
    </Badge>
  );
}

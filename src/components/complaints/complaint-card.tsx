'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { CategoryBadge } from './category-badge';
import { MapPin, Calendar, ThumbsUp, ArrowRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    location?: Record<string, unknown> | null;
    createdAt: string;
    user?: { name: string };
    attachments?: Array<{ thumbnailUrl?: string; url?: string }>;
    _count?: { upvotes: number };
  };
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const locationAddress = typeof complaint.location?.address === 'string' ? complaint.location.address : undefined;

  return (
    <Link href={`/dashboard/complaints/${complaint.id}`}>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden h-full">
        {complaint.attachments && complaint.attachments.length > 0 && complaint.attachments[0]?.thumbnailUrl && (
          <div className="h-40 overflow-hidden">
            <img
              src={complaint.attachments[0].thumbnailUrl || complaint.attachments[0].url}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {complaint.title}
            </h3>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <StatusBadge status={complaint.status} />
            <CategoryBadge category={complaint.category} />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {truncate(complaint.description, 120)}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              {locationAddress && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {truncate(locationAddress, 20)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(complaint.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{complaint._count?.upvotes || 0}</span>
            </div>
          </div>

          {complaint.user && (
            <p className="text-xs text-gray-400 mt-3 pt-3 border-t">
              by {complaint.user.name}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

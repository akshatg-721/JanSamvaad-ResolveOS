import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Complaint, User } from '@prisma/client';
import { MapPin, Clock, MessageSquare, ThumbsUp } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint & { 
    user?: User; 
    _count?: { comments: number; upvotes: number; attachments: number } 
  };
  onClick?: () => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  return (
    <Card 
      className="group hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <StatusBadge status={complaint.status as any} />
            <PriorityBadge severity={complaint.severity} />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {complaint.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {complaint.description}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{complaint.address}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-3 flex justify-between items-center border-t bg-muted/20">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{complaint._count?.upvotes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{complaint._count?.comments || 0}</span>
          </div>
        </div>
        
        <div className="text-xs font-medium">
          {complaint.category.replace('_', ' ')}
        </div>
      </CardFooter>
    </Card>
  );
}

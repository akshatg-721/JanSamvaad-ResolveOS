'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { requireFrontendAuth } from '@/lib/auth/client';
import { toggleUpvote } from '@/lib/api/complaints';

interface UpvoteButtonProps {
  complaintId: string;
  initialCount: number;
  initialUpvoted: boolean;
}

export function UpvoteButton({ complaintId, initialCount, initialUpvoted }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!requireFrontendAuth()) {
      toast.error('Please login to upvote');
      return;
    }

    setLoading(true);
    try {
      const result = await toggleUpvote(complaintId);
      setUpvoted(result.upvoted);
      setCount(result.count);
      toast.success(result.upvoted ? 'Upvoted!' : 'Removed upvote');
    } catch (_error) {
      toast.error('Failed to upvote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={upvoted ? 'default' : 'outline'}
      className={cn(
        'gap-2 transition-all',
        upvoted && 'bg-blue-600 hover:bg-blue-700'
      )}
      onClick={handleUpvote}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ThumbsUp className={cn('h-4 w-4', upvoted && 'fill-current')} />
      )}
      <span>{upvoted ? 'Upvoted' : 'Upvote'}</span>
      <Badge variant={upvoted ? 'secondary' : 'outline'} className="ml-1">
        {count}
      </Badge>
    </Button>
  );
}


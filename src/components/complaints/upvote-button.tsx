'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface UpvoteButtonProps {
  complaintId: string;
  initialCount: number;
  initialUpvoted: boolean;
}

export function UpvoteButton({ complaintId, initialCount, initialUpvoted }: UpvoteButtonProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(initialCount);
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!session) {
      toast.error('Please login to upvote');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/complaints/${complaintId}/upvote`, {
        method: 'POST',
      });

      const result = await response.json();
      if (result.success) {
        setUpvoted(result.data.upvoted);
        setCount(result.data.count);
        toast.success(result.data.upvoted ? 'Upvoted!' : 'Removed upvote');
      } else {
        toast.error(result.error || 'Failed');
      }
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

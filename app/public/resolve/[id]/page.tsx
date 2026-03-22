"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitTicketResolutionFeedback } from "@/lib/api/complaints";

export default function PublicResolvePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const token = searchParams.get("token");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setErrorMsg("Please select a rating");
      return;
    }

    setStatus('submitting');
    try {
      await submitTicketResolutionFeedback(id, {
        token,
        rating,
        text: comment,
      });
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to submit resolution');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-zinc-400">Your feedback has been recorded and the grievance is officially resolved.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center pb-2">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30">
            <CheckCircle2 className="w-6 h-6 text-accent" />
          </div>
          <CardTitle className="text-xl text-white">Verify Resolution</CardTitle>
          <CardDescription className="text-zinc-500">How was your experience with JanSamvaad?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-95"
              >
                <Star 
                  className={`w-8 h-8 ${rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 pl-1">Comments</label>
            <textarea
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Tell us more about the resolution..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button 
            className="w-full h-12 bg-accent hover:bg-accent/80 text-white font-bold uppercase tracking-widest"
            onClick={handleSubmit}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Feedback"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


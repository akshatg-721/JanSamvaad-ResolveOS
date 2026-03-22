"use client";

import React, { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { submitTicketResolutionFeedback } from "@/lib/api/complaints";

export default function ResolvePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await submitTicketResolutionFeedback(String(id), {
        token,
        rating,
        text: feedback,
      });
      setResolved(true);
    } catch (err) {
      console.error("Resolution failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (resolved) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
        {/* Grid */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm w-full animate-in zoom-in-95 duration-500 space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-3">Verified!</h1>
            <p className="text-white/50 font-medium text-sm leading-relaxed">
              Your grievance is officially resolved. Thank you for helping build a better city.
            </p>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/20 pt-4 border-t border-white/5">
            Verified by JanSamvaad ResolveOS Protocol
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-bold text-sm transition-all"
          >
            Back to JanSamvaad
          </button>
        </div>
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Backgrounds */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-accent/4 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Grievance Resolution
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">
            Was it{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Fixed?</span>
          </h1>
          <p className="text-white/40 text-sm font-medium">
            You're resolving ticket{" "}
            <span className="text-white font-mono font-black">#{id}</span>
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
          {/* Neon top border */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          {/* Stars */}
          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 text-center">Rate the Resolution</div>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-200 transform hover:scale-125 active:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors duration-200 ${
                      (hover || rating) >= star
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                        : "text-white/10 fill-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <div className="text-center mt-3 text-accent text-sm font-black tracking-wide">
                {ratingLabels[hover || rating]}
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="mb-6 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Additional Comments <span className="text-white/20">(Optional)</span>
            </label>
            <Textarea
              placeholder="How was your experience?"
              className="bg-white/5 border-white/10 rounded-2xl min-h-[110px] text-white placeholder:text-white/20 focus:border-accent/50 focus:ring-0 resize-none font-medium text-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className={`w-full relative group overflow-hidden font-black text-base py-4 rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
              rating === 0
                ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                : "bg-accent hover:bg-accent/90 text-black shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            }`}
          >
            <div className={`absolute inset-0 bg-white/20 translate-y-full ${rating > 0 ? 'group-hover:translate-y-0' : ''} transition-transform duration-300 ease-out`} />
            <span className="relative flex items-center gap-2">
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  SUBMIT FEEDBACK
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>

        {/* Footer badge */}
        <div className="mt-6 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3 text-accent/50" />
            Verified by JanSamvaad ResolveOS Protocol
          </p>
        </div>
      </div>
    </div>
  );
}


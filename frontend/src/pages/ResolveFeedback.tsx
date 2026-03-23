import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Star } from "lucide-react";
import { submitTicketResolutionFeedback } from "@/lib/api/complaints";

export default function ResolveFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!id || rating === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitTicketResolutionFeedback(String(id), {
        token,
        rating,
        text: feedback,
      });
      setResolved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resolution verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (resolved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] p-6 font-sans text-white">
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/5 blur-[100px]" />

        <div className="animate-in zoom-in-95 relative z-10 w-full max-w-sm space-y-6 text-center duration-500">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-accent/20 bg-accent/10 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="h-12 w-12 text-accent" />
          </div>
          <div>
            <h1 className="mb-3 text-4xl font-black tracking-tight">Verified!</h1>
            <p className="text-sm font-medium leading-relaxed text-white/50">
              Your grievance is officially resolved. Thank you for helping build a better city.
            </p>
          </div>
          <div className="border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/20">
            Verified by JanSamvaad ResolveOS Protocol
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white/70 transition-all hover:bg-white/10"
          >
            Back to JanSamvaad
          </button>
        </div>
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] p-6 font-sans text-white">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="pointer-events-none fixed left-1/2 top-[-10%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/4 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Grievance Resolution
          </div>
          <h1 className="mb-3 text-5xl font-black tracking-tight">
            Was it{" "}
            <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
              Fixed?
            </span>
          </h1>
          <p className="text-sm font-medium text-white/40">
            You're resolving ticket <span className="font-mono font-black text-white">#{id || "N/A"}</span>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

          <div className="mb-8">
            <div className="mb-4 text-center text-[10px] font-black uppercase tracking-widest text-white/30">
              Rate the Resolution
            </div>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-200 hover:scale-125 active:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-colors duration-200 ${
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                        : "fill-transparent text-white/10"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <div className="mt-3 text-center text-sm font-black tracking-wide text-accent">
                {ratingLabels[hover || rating]}
              </div>
            )}
          </div>

          <div className="mb-6 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Additional Comments <span className="text-white/20">(Optional)</span>
            </label>
            <Textarea
              placeholder="How was your experience?"
              className="min-h-[110px] resize-none rounded-2xl border-white/10 bg-white/5 text-sm font-medium text-white placeholder:text-white/20 focus:border-accent/50 focus:ring-0"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || !id}
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-base font-black transition-all duration-300 active:scale-[0.98] ${
              rating === 0 || !id
                ? "cursor-not-allowed border border-white/5 bg-white/5 text-white/20"
                : "bg-accent text-black shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:bg-accent/90 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
            }`}
          >
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative flex items-center gap-2">
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  SUBMIT FEEDBACK
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/20">
            <ShieldCheck className="h-3 w-3 text-accent/50" />
            Verified by JanSamvaad ResolveOS Protocol
          </p>
        </div>
      </div>
    </div>
  );
}

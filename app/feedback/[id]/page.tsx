"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Star, ShieldCheck, CheckCircle2, Loader2, Send } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

function safeUiErrorMessage(err: unknown, fallback: string): string {
  const msg = (err as { message?: string })?.message?.trim() || "";
  if (!msg) return fallback;
  if (msg.includes("<") || msg.toLowerCase().includes("doctype html")) return fallback;
  return msg;
}

export default function FeedbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ticketId = params.id as string;
  const token = searchParams.get("token");

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState("");
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setErrorMessage("Please provide a star rating.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await apiFetch(`/api/tickets/${ticketId}/resolve`, {
        method: "POST",
        body: JSON.stringify({ token, rating, text: feedback }),
      });
      setStatus("success");
    } catch (err: unknown) {
      setErrorMessage(safeUiErrorMessage(err, "Failed to submit feedback. The token may be invalid or expired."));
      setStatus("error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
          <p>A secure resolution token is required to access this page. Please scan the exact QR code provided by the operator.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-white">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Ticket Resolved</h1>
          <p className="text-white/60 max-w-sm mx-auto">
            Thank you for verifying the resolution of this grievance. Your feedback has been securely recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-bl from-accent/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-blue-500/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="JanSamvaad Logo" className="h-12 w-auto mx-auto object-contain mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          <h1 className="text-2xl font-bold text-white mb-2">Resolve Grievance</h1>
          <p className="text-white/60">Ticket ID: <span className="text-accent font-mono font-bold tracking-wider">{ticketId}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-semibold mb-6 text-center">
              {errorMessage}
            </div>
          )}

          <div className="mb-8 flex flex-col items-center">
            <label className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Rate Resolution</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      (hoveredStar ? star <= hoveredStar : star <= rating) 
                        ? "fill-accent text-accent drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]" 
                        : "text-white/20"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-sm font-bold text-white/80 uppercase tracking-wider ml-1" htmlFor="feedback">
              Experience Details
            </label>
            <textarea
              id="feedback"
              rows={4}
              placeholder="Tell us how the operator handled your issue..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 outline-none focus:border-accent focus:bg-white/10 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full relative group overflow-hidden bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-4 rounded-2xl transition-all active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="relative flex items-center justify-center gap-2">
              {status === "submitting" ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  SUBMIT & CLOSE TICKET
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </div>
          </button>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-accent" />
              Secure Feedback Portal
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCircle2, Lock, ArrowRight, Loader2, Zap } from "lucide-react";
import { login } from "@/lib/api-client";

function safeUiErrorMessage(err: unknown, fallback: string): string {
  const msg = (err as { message?: string })?.message?.trim() || "";
  if (!msg) return fallback;
  if (msg.includes("<") || msg.toLowerCase().includes("doctype html")) return fallback;
  return msg;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [operatorId, setOperatorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(operatorId, password);
      router.push("/demo");
    } catch (err: unknown) {
      setError(safeUiErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Abstract Design Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[60%] bg-gradient-to-br from-accent/20 to-purple-500/10 blur-[130px] rounded-[100%] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[50%] bg-gradient-to-tr from-blue-500/10 to-accent/15 blur-[120px] rounded-[100%]" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-[480px] z-10 relative">
        <div className="text-center mb-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <img src="/logo.png" alt="JanSamvaad Logo" className="w-[320px] max-w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]" />
        </div>

        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {/* Neon Top Border */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
          
          {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-semibold mb-6 flex items-center justify-center">
               {error}
             </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/80 uppercase tracking-wider ml-1" htmlFor="operatorId">
                Operator ID
              </label>
              <div className="relative group">
                <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
                <input
                  id="operatorId"
                  type="text"
                  placeholder="e.g. operator"
                  required
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-accent focus:bg-white/10 transition-all font-mono text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-white/80 uppercase tracking-wider" htmlFor="password">
                  Security Key
                </label>
                <button type="button" className="text-xs text-accent font-bold hover:underline">
                  FORGOT?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-accent focus:bg-white/10 transition-all text-lg tracking-[0.2em]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-4 rounded-2xl transition-all active:scale-[0.98] mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    AUTHENTICATE
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-white/40 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              End-to-End Encrypted Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

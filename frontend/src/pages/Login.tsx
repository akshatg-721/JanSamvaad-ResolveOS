import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, UserCircle2, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { login, requireFrontendAuth } from "@/lib/auth/client";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

function safeUiErrorMessage(err: unknown, fallback: string): string {
  const msg = (err as { message?: string })?.message?.trim() || "";
  if (!msg) return fallback;
  if (msg.includes("<") || msg.toLowerCase().includes("doctype html")) return fallback;
  if (msg === "CredentialsSignin") return "Invalid operator ID or security key.";
  if (msg.toLowerCase().includes("locked")) return "Account is temporarily locked. Please try again later.";
  return msg;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [operatorId, setOperatorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  useEffect(() => {
    if (requireFrontendAuth()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (lockedUntil && now < lockedUntil) {
      const secondsLeft = Math.ceil((lockedUntil - now) / 1000);
      setError(`Too many failed attempts. Retry in ${secondsLeft}s.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ username: operatorId, email: operatorId, password });
      setFailedAttempts(0);
      setLockedUntil(null);
      const callbackUrl = searchParams.get("callbackUrl");
      navigate(callbackUrl || "/dashboard", { replace: true });
    } catch (err: unknown) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setError("Too many failed attempts. Please wait 60 seconds and try again.");
      } else {
        setError(safeUiErrorMessage(err, "Login failed. Please check your credentials."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] p-4 font-sans">
      <div
        className="absolute left-[-10%] top-[-15%] h-[60%] w-[50%] animate-pulse rounded-[100%] bg-gradient-to-br from-accent/20 to-purple-500/10 blur-[130px]"
        style={{ animationDuration: "8s" }}
      />
      <div className="absolute bottom-[-15%] right-[-10%] h-[50%] w-[60%] rounded-[100%] bg-gradient-to-tr from-blue-500/10 to-accent/15 blur-[120px]" />

      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="animate-in slide-in-from-bottom-8 mb-12 flex flex-col items-center duration-700 fade-in">
          <img
            src="/logo.png"
            alt="JanSamvaad Logo"
            className="h-auto w-[320px] max-w-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          />
        </div>

        <div className="animate-in slide-in-from-bottom-12 delay-200 duration-1000 fade-in relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur-2xl">
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

          {error && (
            <div className="mb-6 flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-semibold text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-bold uppercase tracking-wider text-white/80" htmlFor="operatorId">
                Operator ID
              </label>
              <div className="group relative">
                <UserCircle2 className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent" />
                <Input
                  id="operatorId"
                  type="text"
                  placeholder="e.g. admin"
                  required
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="h-14 w-full rounded-2xl border-white/10 bg-white/5 pl-12 pr-4 text-lg text-white placeholder:text-white/20 transition-all focus:border-accent focus:bg-white/10 focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-white/80" htmlFor="password">
                  Security Key
                </label>
              </div>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 w-full rounded-2xl border-white/10 bg-white/5 pl-12 pr-4 text-lg tracking-[0.2em] text-white placeholder:text-white/20 transition-all focus:border-accent focus:bg-white/10 focus-visible:ring-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (!!lockedUntil && Date.now() < lockedUntil)}
              className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-accent py-4 text-lg font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]"
            >
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    AUTHENTICATE
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Secure Government Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

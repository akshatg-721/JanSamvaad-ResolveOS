"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const TICKER_ITEMS = [
  { label: "Voice Accuracy", value: "98.4%", positive: true },
  { label: "Avg. Resolution", value: "12h", positive: true },
  { label: "SLA Breach Risk", value: "1.2%", positive: false },
  { label: "Active Tickets", value: "2,847", positive: true },
  { label: "Citizen Satisfaction", value: "4.7 / 5", positive: true },
  { label: "Intake Latency", value: "< 60s", positive: true },
  { label: "Multilingual Accuracy", value: "94.1%", positive: true },
  { label: "Duplicate Detection", value: "99.3%", positive: true },
];

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("show");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const VERT = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;
    const FRAG = `
      precision highp float;
      uniform vec2 u_res; uniform float u_time; uniform float u_scroll;
      void main(){
        vec2 uv=(gl_FragCoord.xy-.5*u_res)/min(u_res.x,u_res.y);
        float t=u_time*.10;
        vec2 focus=vec2(0.,mix(.1,-.5,u_scroll));
        vec2 d=uv-focus; float r=length(d); float a=atan(d.y,d.x);
        float w1=sin(a*2.+t)*cos(a*1.5-t*1.2);
        float w2=sin(r*4.-t*2.);
        float core=exp(-r*3.8);
        float b1=smoothstep(.85,1.,sin(a+t*1.5));
        float b2=smoothstep(.85,1.,cos(a*2.-t));
        float intensity=max(0.,(core*1.2)+(w1*.12)+(w2*.08)+(b1*.2)+(b2*.15));
        vec3 bg=vec3(.02,.02,.02);
        vec3 c1=vec3(.05,.18,.10); vec3 c2=vec3(.10,.42,.22); vec3 c3=vec3(.20,.80,.45);
        vec3 col=mix(bg,c1,smoothstep(0.,.2,intensity));
        col=mix(col,c2,smoothstep(.2,.6,intensity));
        col=mix(col,c3,smoothstep(.6,1.2,intensity));
        col*=smoothstep(1.5,0.,r);
        gl_FragColor=vec4(col,1.);
      }
    `;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let scrollVal = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize(); window.addEventListener("resize", resize);
    const onScroll = () => {
      const h = canvas.parentElement?.offsetHeight || window.innerHeight;
      scrollVal = Math.min(1, window.scrollY / h);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const start = performance.now();
    let raf: number;
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uScroll, scrollVal);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div
      className="bg-[#050505] text-[#F8F5F0] overflow-x-hidden antialiased selection:bg-[#A3C9AA]/25"
      style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes cinematicUp { from{opacity:0;transform:translateY(2rem)} to{opacity:1;transform:translateY(0)} }
        @keyframes focusIn { from{opacity:0;transform:scale(.98);filter:blur(10px)} to{opacity:1;transform:scale(1);filter:blur(0)} }
        @keyframes scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulse-slow { 0%,100%{opacity:1} 50%{opacity:.3} }
        .reveal { opacity:0; transform:translateY(2.5rem); filter:blur(8px); transition:all 1.6s cubic-bezier(.16,1,.3,1); }
        .reveal.show { opacity:1; transform:translateY(0); filter:blur(0); }
        .serif { font-family: var(--font-serif), Georgia, serif; }
      `}</style>

      {/* Cinematic overlays */}
      <div className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 z-[1] pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 40%, rgba(5,5,5,0.95) 120%)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── HERO ── */}
        <section className="relative flex flex-col justify-between h-screen min-h-[45rem] overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />

          {/* Floating pill nav — Space Grotesk */}
          <div className="relative z-20 flex justify-center px-4 pt-8">
            <nav className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#A3C9AA]/10 border border-[#A3C9AA]/20 mr-2">
                <span className="font-mono text-[9px] tracking-tighter text-[#FDF3DB] uppercase whitespace-nowrap">JS / <span className="text-[#A3C9AA]">ResolveOS</span></span>
              </Link>
              {[["Problem", "/problem"], ["Solution", "/solution"], ["Team", "/about"], ["Compliance", "/compliance"]].map(([l, h]) => (
                <Link key={h} href={h} className="hidden md:block text-[11px] font-medium tracking-wide text-[#8E8A80] uppercase hover:text-[#C2BCB0] px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-200">{l}</Link>
              ))}
              <Link href="/demo" className="ml-2 text-[11px] font-bold tracking-wide uppercase bg-[#A3C9AA] hover:bg-[#A3C9AA]/90 text-black px-5 py-2.5 rounded-full transition-all duration-200">
                Demo →
              </Link>
            </nav>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
            <div className="text-[11px] font-medium tracking-[.25rem] text-[#C2BCB0] uppercase mb-12 opacity-0 animate-[cinematicUp_1.5s_cubic-bezier(.16,1,.3,1)_.2s_forwards]">
              Next-Gen Civic Intelligence
            </div>
            {/* Big serif heading — Cormorant Garamond */}
            <h1 className="serif text-[clamp(3.5rem,8vw,7.5rem)] font-light leading-[1.05] tracking-tight opacity-0 blur-md animate-[focusIn_2s_cubic-bezier(.16,1,.3,1)_.5s_forwards] text-[#F8F5F0] drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
              Every voice
              <br />
              <em className="block font-light italic text-[#A3C9AA] tracking-tighter drop-shadow-[0_0_60px_rgba(163,201,170,0.2)]">resolved.</em>
            </h1>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#A3C9AA]/40 to-transparent my-14 opacity-0 animate-[cinematicUp_1.5s_cubic-bezier(.16,1,.3,1)_1.2s_forwards]" />
          </div>

          {/* Stats footer bar */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-white/5 bg-gradient-to-t from-black/90 to-transparent opacity-0 animate-[cinematicUp_1.5s_cubic-bezier(.16,1,.3,1)_1.5s_forwards]">
            {[
              { v: "98%", l: "Voice Accuracy" },
              { v: "< 60s", l: "Intake Speed" },
              { v: "12h", l: "Avg Resolution" },
              { v: "1.4B", l: "Citizens Reachable" },
            ].map((s) => (
              <div key={s.l} className="p-10 text-center border-r border-white/5 last:border-0 hover:bg-white/5 transition-colors duration-700">
                <div className="serif text-[clamp(1.8rem,3vw,2.8rem)] font-light text-[#FDF3DB] tracking-tight leading-none">{s.v}</div>
                <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] uppercase mt-4">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A3C9AA]/20 to-transparent z-10" />
        </section>

        {/* ── TICKER ── */}
        <div className="relative z-10 overflow-hidden border-y border-white/5 bg-[#080808] py-4">
          <div className="flex gap-20 whitespace-nowrap animate-[scroll_50s_linear_infinite] w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="font-mono text-[10px] tracking-widest text-[#C2BCB0] uppercase flex items-center gap-3">
                {item.label} <span className={item.positive ? "text-[#A3C9AA]" : "text-[#D18C8C]"}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATEMENT ── */}
        <div className="relative flex items-center justify-center px-8 py-40 md:py-64 border-b border-white/5 bg-[#050505] overflow-hidden reveal group">
          <div className="absolute inset-0 pointer-events-none z-0">
            <img src="https://images.unsplash.com/photo-1529688499929-e0e88d96b1f2?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover grayscale contrast-150 opacity-[0.12] mix-blend-luminosity transition-transform duration-[40s] group-hover:scale-110" alt="India city" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          </div>
          <p className="serif relative z-10 text-[clamp(2rem,4.5vw,4rem)] font-light leading-[1.35] text-center max-w-5xl tracking-tight">
            <span className="text-[#8E8A80]">India has 400 million unheard civic complaints every year.</span>
            <br /><br />
            JanSamvaad turns a phone call into{" "}
            <em className="not-italic font-light text-[#FDF3DB]">structured, actionable government intelligence.</em>
          </p>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 lg:gap-32 items-start p-8 py-32 md:p-20 md:py-48 border-b border-white/5 bg-gradient-to-b from-[#050505] to-[#080808]">
          <div className="reveal">
            <div className="font-mono text-[10px] tracking-[.2rem] text-[#A3C9AA] uppercase mb-12">The System</div>
            <h2 className="serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.1] tracking-tight mb-20 text-[#F8F5F0]">
              Five stages.<br />
              <em className="italic text-[#C2BCB0] font-light tracking-tighter">One resolution.</em>
            </h2>
            <div className="flex flex-col">
              {[
                ["01", "Voice Intake", "Citizen calls. IVR accepts any Indian language — Hindi, Hinglish, Tamil, Bengali. No app, no internet."],
                ["02", "AI Classification", "Gemini 2.5 Flash extracts category, urgency, location, and emotional intensity in under 3 seconds."],
                ["03", "Live Dispatch", "Geo-tagged ticket surfaces instantly on the operator's GIS map with an SLA countdown clock."],
                ["04", "Officer Resolution", "Field officer updates ticket. Evidence photo triggers SHA-256 hashed blockchain record."],
                ["05", "Citizen Verification", "QR code sent to citizen's phone. They scan, rate 1–5 stars. Ticket closes only when they confirm."],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-8 py-10 md:py-12 border-b border-white/5 first:border-t relative group transition-all duration-700 hover:pl-6 cursor-default">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#A3C9AA] to-transparent scale-y-0 origin-center transition-transform duration-700 group-hover:scale-y-100" />
                  <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] pt-1 w-8 shrink-0 transition-colors duration-500 group-hover:text-[#A3C9AA]">{num}</div>
                  <div>
                    <div className="serif text-2xl font-light mb-3 tracking-tight text-[#F8F5F0]">{title}</div>
                    <div className="text-sm font-normal text-[#C2BCB0] leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live telemetry panel */}
          <div className="reveal sticky top-24 bg-[#0c0c0c]/80 backdrop-blur-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(163,201,170,0.05)] overflow-hidden" style={{ transitionDelay: "0.2s" }}>
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.4) 2px,rgba(0,0,0,.4) 4px)" }} />
            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-black/90 relative z-10">
              <div className="font-mono text-[10px] tracking-[.2rem] text-[#F8F5F0] uppercase">Live Telemetry · ResolveOS</div>
              <div className="w-2 h-2 rounded-full bg-[#A3C9AA] shadow-[0_0_12px_#A3C9AA] animate-[pulse-slow_3s_infinite]" />
            </div>
            <div className="p-8 md:p-10 font-mono text-[10px] leading-[2.6] tracking-widest relative z-10 flex flex-col">
              {[
                ["09:14:02.1", "SYS", "VOICE CALL RECEIVED [+91-9XXXX-XX847]", "text-[#7A9BB8]"],
                ["09:14:02.3", "IVR", "LANGUAGE DETECT: HINDI → HINGLISH", "text-[#D4C3A3]"],
                ["09:14:07.8", "STT", "TRANSCRIPTION COMPLETE [3.1s]", "text-[#D4C3A3]"],
                ["09:14:08.2", "AI", `INTENT: WATER_SUPPLY // SEVERITY: HIGH`, "text-[#D4C3A3]"],
                ["09:14:08.5", "PASS", "LOCATION: WARD 4, DELHI NCR", "text-[#A3C9AA]"],
                ["09:14:08.6", "PASS", "DUPLICATE CHECK: CLEAR", "text-[#A3C9AA]"],
                ["09:14:09.0", "DB", "TICKET #2848 CREATED // SLA: 12H", "text-[#7A9BB8]"],
                ["09:14:09.1", "WS", "DASHBOARD PUSH → OPERATOR ONLINE", "text-[#A3C9AA]"],
              ].map(([time, tag, msg, tagColor]) => (
                <div key={time + tag} className="flex hover:bg-white/5 transition-colors duration-300 group px-2 -mx-2 rounded-sm">
                  <span className="text-[#C2BCB0] w-24 shrink-0">{time}</span>
                  <span className={`font-mono w-12 shrink-0 ${tagColor}`}>{tag}</span>
                  <span className="text-[#F8F5F0] group-hover:text-[#FDF3DB] transition-colors truncate">{msg}</span>
                </div>
              ))}
              <div className="flex hover:bg-white/5 transition-colors duration-300 group px-2 -mx-2 rounded-sm mt-4 items-center">
                <span className="text-[#C2BCB0] w-24 shrink-0">09:14:09.5</span>
                <span className="text-[#A3C9AA] font-mono w-12 shrink-0">MON</span>
                <span className="text-[#F8F5F0] group-hover:text-[#FDF3DB] transition-colors truncate">✓ TICKET TRACKING ACTIVE...</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CLOSING ── */}
        <div className="relative flex flex-col items-center justify-center text-center p-8 py-48 md:py-72 bg-[#050505] overflow-hidden reveal group">
          <div className="absolute inset-0 pointer-events-none z-0">
            <img src="https://images.unsplash.com/photo-1599493758267-c6c884c7071f?q=80&w=2940&auto=format&fit=crop" className="w-full h-full object-cover grayscale contrast-[1.3] opacity-[0.15] mix-blend-screen transition-transform duration-[40s] group-hover:scale-110" alt="India lights" />
            <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#050505]/50 to-[#050505]" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 serif text-[clamp(6rem,18vw,16rem)] font-light leading-none tracking-tighter text-[#A3C9AA] opacity-[0.04] z-[1]">12h</div>
          <div className="relative z-[2] flex flex-col items-center gap-8">
            <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] uppercase bg-black/40 px-4 py-2 border border-white/5 backdrop-blur-md">
              Average Resolution Time · Verified
            </div>
            <h2 className="serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.2] tracking-tight text-[#F8F5F0]">
              A grievance filed.<br />
              <em className="italic text-[#A3C9AA] font-light tracking-tighter">A city improved.</em>
            </h2>
            <Link href="/demo" className="mt-6 text-[11px] font-bold tracking-widest uppercase border border-[#A3C9AA]/40 text-[#A3C9AA] hover:bg-[#A3C9AA]/10 px-8 py-4 rounded-full transition-all duration-300">
              Launch Demo →
            </Link>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 p-8 md:p-20 bg-[#020202] relative z-10 border-t border-white/5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-tighter text-[#A3C9AA] uppercase">JanSamvaad ResolveOS</span>
            <span className="text-[#8E8A80] text-sm font-light">India Innovates 2026 · BML Munjal University</span>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-[#8E8A80] text-left md:text-right leading-[2.4] uppercase flex flex-col gap-2">
            <div><Link href="/problem" className="hover:text-[#C2BCB0] transition-colors">The Problem</Link></div>
            <div><Link href="/solution" className="hover:text-[#C2BCB0] transition-colors">Technical Stack</Link></div>
            <div><Link href="/compliance" className="hover:text-[#C2BCB0] transition-colors">Compliance</Link></div>
            <div><Link href="/about" className="hover:text-[#C2BCB0] transition-colors">Team</Link></div>
            <div><Link href="https://github.com/akshatg-721/JanSamvaad-ResolveOS" className="hover:text-[#C2BCB0] transition-colors">GitHub</Link></div>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BellDot, ChevronRight, LocateFixed, Search, Sparkles } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

type Ticket = {
  id: string;
  ref: string;
  category: string;
  priority: "URGENT" | "MEDIUM" | "LOW";
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  ward: string;
  lat: number;
  lng: number;
  summary: string;
};

const sampleTickets: Ticket[] = [
  { id: "1", ref: "#T-8902", category: "Water Leakage", priority: "URGENT", status: "IN_PROGRESS", ward: "Ward 12 (Central)", lat: 28.6139, lng: 77.209, summary: "Major leak reported near Vikas Marg intersection." },
  { id: "2", ref: "#T-9104", category: "Street Light Outage", priority: "MEDIUM", status: "NEW", ward: "Ward 04 (South)", lat: 28.6013, lng: 77.2241, summary: "Persistent outage across 3 poles in the same radius." },
  { id: "3", ref: "#T-8871", category: "Garbage Collection", priority: "LOW", status: "RESOLVED", ward: "Ward 21 (East)", lat: 28.6287, lng: 77.2376, summary: "Collection skipped for two days in lane cluster." },
  { id: "4", ref: "#T-9105", category: "Illegal Construction", priority: "URGENT", status: "NEW", ward: "Ward 12 (Central)", lat: 28.6182, lng: 77.2045, summary: "Unauthorized extension obstructing sewer access." },
];

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))] p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">{title}</p>
      <p className="text-5xl font-semibold mt-3 text-white">{value}</p>
      <p className="text-sm text-[#3be38f] mt-3">{sub}</p>
    </div>
  );
}

function MiniIncidentMap({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
      <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {tickets.map((ticket) => (
          <CircleMarker
            key={ticket.id}
            center={[ticket.lat, ticket.lng]}
            radius={ticket.priority === "URGENT" ? 12 : 8}
            pathOptions={{
              color: ticket.priority === "URGENT" ? "#ff4d4d" : "#3be38f",
              fillColor: ticket.priority === "URGENT" ? "#ff4d4d" : "#3be38f",
              fillOpacity: 0.55,
            }}
          >
            <Tooltip>{ticket.ref}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export function OverviewSection() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/complaints?limit=8");
        const body = await res.json();
        if (!mounted || !body?.success || !Array.isArray(body.data)) return;
        const mapped: Ticket[] = body.data.slice(0, 8).map((item: any, idx: number) => ({
          id: item.id,
          ref: `#T-${String(item.id).slice(-4)}`,
          category: String(item.category || "General").replaceAll("_", " "),
          priority: item.priority >= 2 ? "URGENT" : item.priority === 1 ? "MEDIUM" : "LOW",
          status: item.status === "RESOLVED" ? "RESOLVED" : item.status === "IN_PROGRESS" ? "IN_PROGRESS" : "NEW",
          ward: item.location?.address || `Ward ${idx + 1}`,
          lat: item.location?.lat || 28.6139 + idx * 0.005,
          lng: item.location?.lng || 77.209 + idx * 0.004,
          summary: item.description || "No summary",
        }));
        if (mapped.length > 0) setTickets(mapped);
      } catch {
        // Keep fallback data if API is unavailable.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = useMemo(
    () => tickets.filter((t) => t.status !== "RESOLVED").length,
    [tickets]
  );

  const focusTicket = tickets[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Tickets" value={String(activeCount)} sub="+12% today" />
        <StatCard title="Average Resolve" value="4.2h" sub="-0.5h vs yesterday" />
        <StatCard title="Citizen Satisfaction" value="92%" sub="Target range" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold tracking-wide text-white">Recent Tickets</h3>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white">
                <BellDot className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/[0.04] text-white/60 text-xs uppercase tracking-[0.15em]">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ward</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-4 text-white font-semibold">{ticket.ref}</td>
                    <td className="px-4 py-4 text-white/90">{ticket.category}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                          ticket.priority === "URGENT"
                            ? "bg-red-500/20 text-red-300 border border-red-400/30"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                            : "bg-white/10 text-white/70 border border-white/20"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ticket.status === "RESOLVED"
                              ? "bg-emerald-400"
                              : ticket.status === "IN_PROGRESS"
                              ? "bg-blue-400"
                              : "bg-[#3be38f]"
                          }`}
                        />
                        {ticket.status.replace("_", "-")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/80">{ticket.ward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h4 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3be38f]" />
              AI Resolution Summary
            </h4>
            <p className="mt-4 text-white/75 leading-relaxed text-sm">
              Ticket <span className="text-[#3be38f] font-semibold">{focusTicket?.ref}</span> indicates
              a persistent {focusTicket?.category?.toLowerCase()} cluster. Nearby complaints suggest
              infrastructure root-cause rather than isolated events.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Suggested Actions</p>
            {[
              "Dispatch Maintenance Crew",
              "Notify Ward Counselor",
              "Merge Related Tickets",
            ].map((action) => (
              <button
                key={action}
                className="w-full rounded-2xl bg-white/[0.04] border border-white/10 text-left px-4 py-3 hover:bg-white/[0.08] transition-colors flex items-center justify-between"
              >
                <span className="text-white/90 text-sm">{action}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Incident Location</p>
            <MiniIncidentMap tickets={tickets.slice(0, 5)} />
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <LocateFixed className="w-4 h-4 text-[#3be38f]" />
              28.6139° N, 77.2090° E
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { BellDot, ChevronRight, LocateFixed, Search, Sparkles } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getComplaints } from "@/lib/api/complaints";
import type { ComplaintDTO } from "@/lib/contracts/complaint";

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
  {
    id: "1",
    ref: "#T-8902",
    category: "Water Leakage",
    priority: "URGENT",
    status: "IN_PROGRESS",
    ward: "Ward 12 (Central)",
    lat: 28.6139,
    lng: 77.209,
    summary: "Major leak reported near Vikas Marg intersection.",
  },
  {
    id: "2",
    ref: "#T-9104",
    category: "Street Light Outage",
    priority: "MEDIUM",
    status: "NEW",
    ward: "Ward 04 (South)",
    lat: 28.6013,
    lng: 77.2241,
    summary: "Persistent outage across 3 poles in the same radius.",
  },
  {
    id: "3",
    ref: "#T-8871",
    category: "Garbage Collection",
    priority: "LOW",
    status: "RESOLVED",
    ward: "Ward 21 (East)",
    lat: 28.6287,
    lng: 77.2376,
    summary: "Collection skipped for two days in lane cluster.",
  },
  {
    id: "4",
    ref: "#T-9105",
    category: "Illegal Construction",
    priority: "URGENT",
    status: "NEW",
    ward: "Ward 12 (Central)",
    lat: 28.6182,
    lng: 77.2045,
    summary: "Unauthorized extension obstructing sewer access.",
  },
];

function toTicket(item: ComplaintDTO, idx: number): Ticket {
  const severity = String(item.severity).toUpperCase();
  const status = String(item.status).toUpperCase();
  return {
    id: item.id,
    ref: item.ref ? `#${item.ref.replace(/^#/, "")}` : `#T-${item.id.slice(-4)}`,
    category: item.category.replaceAll("_", " "),
    priority:
      severity === "CRITICAL" || severity === "HIGH" || item.priority >= 2
        ? "URGENT"
        : item.priority === 1
          ? "MEDIUM"
          : "LOW",
    status:
      status === "RESOLVED" || status === "CLOSED"
        ? "RESOLVED"
        : status === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "NEW",
    ward: item.location?.address || item.wardName || `Ward ${item.wardId ?? idx + 1}`,
    lat: item.location?.lat || 28.6139 + idx * 0.005,
    lng: item.location?.lng || 77.209 + idx * 0.004,
    summary: item.description || "No summary",
  };
}

function StatCard({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))] p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">{title}</p>
      <p className="mt-3 text-5xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-[#3be38f]">{sub}</p>
    </div>
  );
}

function MiniIncidentMap({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="h-64 overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
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
        const page = await getComplaints({ limit: 8 });
        if (!mounted || page.items.length === 0) return;
        const mapped = page.items.slice(0, 8).map((item, idx) => toTicket(item, idx));
        setTickets(mapped);
      } catch {
        // keep fallback data for offline resiliency
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Active Tickets" value={String(activeCount)} sub="+12% today" />
        <StatCard title="Average Resolve" value="4.2h" sub="-0.5h vs yesterday" />
        <StatCard title="Citizen Satisfaction" value="92%" sub="Target range" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-wide text-white">Recent Tickets</h3>
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white">
                <Search className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white">
                <BellDot className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.15em] text-white/60">
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
                    <td className="px-4 py-4 font-semibold text-white">{ticket.ref}</td>
                    <td className="px-4 py-4 text-white/90">{ticket.category}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                          ticket.priority === "URGENT"
                            ? "border-red-400/30 bg-red-500/20 text-red-300"
                            : ticket.priority === "MEDIUM"
                              ? "border-yellow-400/30 bg-yellow-500/20 text-yellow-300"
                              : "border-white/20 bg-white/10 text-white/70"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
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
            <h4 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <Sparkles className="h-5 w-5 text-[#3be38f]" />
              AI Resolution Summary
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Ticket <span className="font-semibold text-[#3be38f]">{focusTicket?.ref}</span> indicates
              a persistent {focusTicket?.category?.toLowerCase()} cluster. Nearby complaints suggest
              infrastructure root-cause rather than isolated events.
            </p>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Suggested Actions</p>
            {["Dispatch Maintenance Crew", "Notify Ward Counselor", "Merge Related Tickets"].map((action) => (
              <button
                key={action}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-colors hover:bg-white/[0.08]"
              >
                <span className="text-sm text-white/90">{action}</span>
                <ChevronRight className="h-4 w-4 text-white/50" />
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/40">Incident Location</p>
            <MiniIncidentMap tickets={tickets.slice(0, 5)} />
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <LocateFixed className="h-4 w-4 text-[#3be38f]" />
              28.6139 N, 77.2090 E
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

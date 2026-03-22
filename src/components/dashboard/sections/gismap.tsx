"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronRight, MapPin, Sparkles } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

type Incident = {
  id: string;
  ref: string;
  category: string;
  priority: "URGENT" | "MEDIUM" | "LOW";
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  ward: string;
  lat: number;
  lng: number;
};

const fallbackIncidents: Incident[] = [
  { id: "a", ref: "#T-9104", category: "Street Light", priority: "MEDIUM", status: "NEW", ward: "Ward 04 (South)", lat: 28.6139, lng: 77.209 },
  { id: "b", ref: "#T-9201", category: "Water Leakage", priority: "URGENT", status: "IN_PROGRESS", ward: "Ward 12 (Central)", lat: 28.621, lng: 77.217 },
  { id: "c", ref: "#T-9054", category: "Garbage", priority: "LOW", status: "RESOLVED", ward: "Ward 21 (East)", lat: 28.607, lng: 77.231 },
];

export function GisSection() {
  const [incidents, setIncidents] = useState<Incident[]>(fallbackIncidents);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Incident["status"]>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | Incident["priority"]>("ALL");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/complaints?limit=20");
        const body = await res.json();
        if (!mounted || !body?.success || !Array.isArray(body.data)) return;
        const mapped = body.data.map((item: any, idx: number) => ({
          id: item.id,
          ref: `#T-${String(item.id).slice(-4)}`,
          category: String(item.category || "General").replaceAll("_", " "),
          priority: item.priority >= 2 ? "URGENT" : item.priority === 1 ? "MEDIUM" : "LOW",
          status: item.status === "RESOLVED" ? "RESOLVED" : item.status === "IN_PROGRESS" ? "IN_PROGRESS" : "NEW",
          ward: item.location?.address || `Ward ${idx + 1}`,
          lat: item.location?.lat || 28.6139 + idx * 0.004,
          lng: item.location?.lng || 77.209 + idx * 0.004,
        })) as Incident[];
        if (mapped.length > 0) setIncidents(mapped);
      } catch {
        // keep fallback incidents
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleIncidents = useMemo(
    () =>
      incidents.filter(
        (item) =>
          (statusFilter === "ALL" || item.status === statusFilter) &&
          (priorityFilter === "ALL" || item.priority === priorityFilter)
      ),
    [incidents, priorityFilter, statusFilter]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
      <div className="rounded-3xl border border-white/10 overflow-hidden bg-[#0c132b] min-h-[680px]">
        <div className="h-full relative">
          <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ width: "100%", height: "680px" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {visibleIncidents.map((incident) => (
              <CircleMarker
                key={incident.id}
                center={[incident.lat, incident.lng]}
                radius={incident.priority === "URGENT" ? 12 : incident.priority === "MEDIUM" ? 9 : 7}
                pathOptions={{
                  color:
                    incident.priority === "URGENT"
                      ? "#ff5c5c"
                      : incident.priority === "MEDIUM"
                      ? "#ffb020"
                      : "#3be38f",
                  fillColor:
                    incident.priority === "URGENT"
                      ? "#ff5c5c"
                      : incident.priority === "MEDIUM"
                      ? "#ffb020"
                      : "#3be38f",
                  fillOpacity: 0.6,
                }}
              >
                <Tooltip>{incident.ref}</Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#3be38f]" />
            AI Resolution Summary
          </h3>
          <p className="text-sm text-white/75 mt-4 leading-relaxed">
            Detected cluster around central ward corridor. Cross-reference of repeated outages suggests transformer surge and line load imbalance.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 mb-3">Filters</p>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl bg-white/5 border border-white/10 h-10 px-3 text-sm text-white"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In-Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="rounded-xl bg-white/5 border border-white/10 h-10 px-3 text-sm text-white"
            >
              <option value="ALL">All Priority</option>
              <option value="URGENT">Urgent</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Suggested Actions</p>
          {["Dispatch Maintenance Crew", "Notify Ward Counselor", "Merge Related Tickets"].map((action) => (
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
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 mb-3">Incident Location</p>
          <div className="rounded-2xl border border-white/10 p-3 flex items-center gap-2 text-sm text-white/80">
            <MapPin className="w-4 h-4 text-[#3be38f]" />
            28.6139° N, 77.2090° E
          </div>
        </div>
      </div>
    </div>
  );
}

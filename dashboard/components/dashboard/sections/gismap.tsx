"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Map as MapIcon, 
  Layers, 
  Droplets, 
  Zap, 
  Trash2, 
  Construction, 
  HelpCircle,
  LocateFixed,
  Maximize2,
  Download,
  Filter,
  Search,
  RefreshCw,
  Flame,
  MapPin,
  Activity
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { apiFetch } from "@/lib/api-client";
import { io } from "socket.io-client";
import ReactDOMServer from "react-dom/server";

// Dynamically import Leaflet components with SSR: false
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import("react-leaflet").then((mod) => mod.ZoomControl), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

const categoryIcons: Record<string, { icon: React.ReactNode, color: string }> = {
  water: { icon: <Droplets className="w-4 h-4" />, color: "#3b82f6" },
  electricity: { icon: <Zap className="w-4 h-4" />, color: "#fbbf24" },
  sanitation: { icon: <Trash2 className="w-4 h-4" />, color: "#22c55e" },
  road: { icon: <Construction className="w-4 h-4" />, color: "#64748b" },
  other: { icon: <HelpCircle className="w-4 h-4" />, color: "#94a3b8" }
};

export function GisSection() {
  const [mounted, setMounted] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street'>('dark');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [layers, setLayers] = useState({
    incidents: true,
    heatmap: true,
    labels: true
  });

  const [showCctv, setShowCctv] = useState(true);
  const [showDelhiWards, setShowDelhiWards] = useState(true);
  const [showColonies, setShowColonies] = useState(false);
  const [delhiGeoData, setDelhiGeoData] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  const mapUrls = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<any[]>("/api/tickets");
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets for map:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchTickets();

    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });

    // Load Delhi layers
    fetch("/data/delhi-layers.json")
      .then(res => res.json())
      .then(data => setDelhiGeoData(data))
      .catch(err => console.error("Failed to load Delhi boundaries", err));

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000");
    socket.on("new_ticket", (newTicket) => {
      setTickets(prev => [newTicket, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (filterUrgency !== "all" && t.severity !== filterUrgency) return false;
      if (searchQuery && !t.ref.toLowerCase().includes(searchQuery.toLowerCase()) && !t.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [tickets, filterStatus, filterCategory, filterUrgency, searchQuery]);

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-8rem)] rounded-2xl border border-border bg-card/50 flex items-center justify-center animate-pulse">
        <MapIcon className="w-12 h-12 text-muted-foreground opacity-50" />
      </div>
    );
  }

  const getUrgencyColor = (severity: string) => {
    switch (String(severity).toLowerCase()) {
      case 'high': return '#ef4444'; // Red
      case 'medium': return '#f97316'; // Orange
      case 'low': return '#22c55e'; // Green
      default: return '#3b82f6'; // Blue
    }
  };

  const exportData = (format: 'csv' | 'geojson') => {
    if (format === 'csv') {
      const headers = ['Ref', 'Category', 'Severity', 'Status', 'Address', 'Lat', 'Lon'];
      const rows = filteredTickets.map(t => [t.ref, t.category, t.severity, t.status, t.geo_address, t.latitude, t.longitude]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "jansamvaad_tickets.csv");
      document.body.appendChild(link);
      link.click();
    } else {
      const geojson = {
        type: "FeatureCollection",
        features: filteredTickets.map(t => ({
          type: "Feature",
          properties: t,
          geometry: { type: "Point", coordinates: [t.longitude, t.latitude] }
        }))
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "tickets.geojson");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-border bg-[#0a0f18] shadow-2xl">
      
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        <div className="flex-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID or Category..." 
              className="bg-transparent border-none text-sm text-white focus:outline-none w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              className="bg-transparent text-xs text-white border-none focus:outline-none cursor-pointer"
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
            >
              <option value="all" className="bg-zinc-900">All Urgency</option>
              <option value="High" className="bg-zinc-900">High</option>
              <option value="Medium" className="bg-zinc-900">Medium</option>
              <option value="Low" className="bg-zinc-900">Low</option>
            </select>
          </div>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={fetchTickets} className="text-white hover:bg-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => exportData('csv')} className="text-white hover:bg-white/10 gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <div className="h-6 w-px bg-white/10" />
            {(['dark', 'satellite', 'street'] as const).map((style) => (
              <Button 
                key={style}
                size="sm"
                variant={mapStyle === style ? 'default' : 'ghost'}
                onClick={() => setMapStyle(style)}
                className={`text-[10px] uppercase font-bold tracking-tighter h-8 px-3 ${mapStyle === style ? 'bg-accent text-white' : 'text-white/60'}`}
              >
                {style}
              </Button>
            ))}
        </div>
      </div>

      {/* Side Info Panel */}
      <div className="absolute top-20 right-4 z-[1000] w-64 space-y-3">
        <Card className="bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="p-3 border-b border-border/50">
            <CardTitle className="text-[10px] font-bold flex items-center gap-2 text-white uppercase tracking-widest">
              <Layers className="w-3 h-3 text-accent" /> Intelligence Layers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/70 uppercase">Live Incidents</span>
              <Switch checked={layers.incidents} onCheckedChange={() => setLayers(l => ({...l, incidents: !l.incidents}))} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] text-white/70 uppercase">Heatmap Overlay</span>
               <Switch checked={layers.heatmap} onCheckedChange={() => setLayers(l => ({...l, heatmap: !l.heatmap}))} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] text-white/70 uppercase">Delhi Wards</span>
               <Switch checked={showDelhiWards} onCheckedChange={setShowDelhiWards} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] text-white/70 uppercase">Colonies</span>
               <Switch checked={showColonies} onCheckedChange={setShowColonies} />
            </div>
          </CardContent>
        </Card>

        <div className="bg-black/60 backdrop-blur-md border border-white/5 rounded-xl p-3 shadow-lg flex items-center gap-3">
           <Activity className="w-4 h-4 text-green-400 animate-pulse" />
           <div className="text-[10px] font-mono text-green-400/90 tracking-widest uppercase truncate">
              {filteredTickets.length} ACTIVE GRIEVANCES
           </div>
        </div>
      </div>

      <MapContainer
        center={[28.6139, 77.2090]} // New Delhi Center
        zoom={12}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer url={mapUrls[mapStyle]} />
        <ZoomControl position="bottomright" />

        {showDelhiWards && delhiGeoData && (
          <GeoJSON 
            data={delhiGeoData.features.filter((f: any) => f.properties.type === "ward")}
            style={() => ({ color: "#3b82f6", weight: 2, fillOpacity: 0.05 })}
          />
        )}

        {showColonies && delhiGeoData && (
          <GeoJSON 
            data={delhiGeoData.features.filter((f: any) => f.properties.type === "colony")}
            style={() => ({ color: "#ec4899", weight: 1, dashArray: "5, 5", fillOpacity: 0.1 })}
          />
        )}

        {layers.incidents && filteredTickets.map((t) => {
          if (!t.latitude || !t.longitude || !L) return null;
          
          const cat = (t.category || "other").toLowerCase();
          const iconData = categoryIcons[cat] || categoryIcons.other;
          
          const customIcon = L.divIcon({
            html: ReactDOMServer.renderToString(
              <div className="relative flex items-center justify-center p-2 rounded-full border-2 border-white shadow-xl backdrop-blur-md" 
                   style={{ backgroundColor: `${iconData.color}dd` }}>
                <div className="text-white">
                  {iconData.icon}
                </div>
              </div>
            ),
            className: "custom-div-icon",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
          });

          return (
            <Marker 
              key={t.id} 
              position={[t.latitude, t.longitude]}
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter" style={{ borderColor: getUrgencyColor(t.severity), color: getUrgencyColor(t.severity) }}>
                      {t.severity}
                    </Badge>
                    <span className="text-[9px] font-mono text-muted-foreground">{t.ref}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{t.category}</h4>
                  <p className="text-[10px] text-muted-foreground mb-2 italic line-clamp-2">"{t.summary || t.translated_text || 'No summary available'}"</p>
                  
                  <div className="space-y-1.5 border-t border-border/50 pt-2">
                    <div className="flex items-center gap-2 text-[9px]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{t.geo_address || 'Address unmapped'}</span>
                    </div>
                    {t.frustration_level && (
                      <div className="flex items-center gap-2 text-[9px]">
                        <Flame className="w-3 h-3 text-red-400" />
                        <span className="uppercase tracking-tight">Frustration: {t.frustration_level}</span>
                      </div>
                    )}
                    {t.weather_condition && (
                      <div className="flex items-center gap-2 text-[9px]">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <span>{t.weather_condition} • {t.temperature}°C</span>
                      </div>
                    )}
                  </div>

                  <Button size="sm" className="w-full mt-3 h-7 text-[10px] uppercase tracking-widest bg-accent hover:bg-accent/80">
                    Dispatch Resolve
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        }) }
      </MapContainer>
    </div>
  );
}

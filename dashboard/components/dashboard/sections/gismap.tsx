"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Map as MapIcon, 
  Layers, 
  Flame, 
  Droplets, 
  Zap, 
  ShieldAlert, 
  Video, 
  Plane, 
  RadioTower,
  Activity,
  MapPin,
  AlertTriangle,
  Radar,
  Car
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet wrappers to avoid SSR window errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

// Simulated Ward Boundaries for Delhi (Major Parts of Delhi Map)
const localWardsGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Delhi NCR Boundary", "risk": "Medium" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.838, 28.534], // South West
          [76.845, 28.840], // North West
          [77.165, 28.890], // North
          [77.340, 28.730], // North East
          [77.345, 28.530], // South East
          [77.120, 28.380], // South
          [76.838, 28.534]  // Close
        ]]
      }
    }
  ]
};

export function GisSection() {
  const [mounted, setMounted] = useState(false);
  const [indiaGeoJson, setIndiaGeoJson] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street' | 'terrain'>('satellite');

  const mapUrls = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    terrain: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  };

  // HUD Layer States
  const [layers, setLayers] = useState({
    nationalBorders: true,
    wardBorders: true,
    incidents: true,
    heatmap: true,
    cctv: true,
    drones: true,
    fleet: true,
  });

  useEffect(() => {
    setMounted(true);

    // Fetch official India boundaries (so when zooming out, the whole map is visible)
    fetch("https://raw.githubusercontent.com/geohacker/india/master/country/india.geojson")
      .then((res) => res.json())
      .then((data) => setIndiaGeoJson(data))
      .catch((err) => console.error("Could not load India boundaries", err));
  }, []);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-8rem)] rounded-2xl border border-border bg-card/50 flex items-center justify-center animate-pulse">
        <MapIcon className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
      </div>
    );
  }

  let L: any;
  if (typeof window !== "undefined") {
    L = require("leaflet");
  }

  // Custom Icons
  const createIcon = (svgWrapper: string) => {
    if (!L) return null;
    return L.divIcon({
      html: svgWrapper,
      className: "custom-leaflet-icon",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  const fireIcon = createIcon(`<div class="w-9 h-9 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></div>`);
  const waterIcon = createIcon(`<div class="w-9 h-9 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.5)]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div>`);
  const infrastructureIcon = createIcon(`<div class="w-9 h-9 bg-orange-500/20 border border-orange-500 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.5)]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>`);
  const cctvIcon = createIcon(`<div class="w-8 h-8 bg-zinc-800 border-2 border-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>`);
  const droneIcon = createIcon(`<div class="w-8 h-8 bg-zinc-900 border border-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-bounce"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-1.6-.4-3.2.2-3.8 1.4-.6 1.2 0 2.8 1.4 3.8L11 13l-3.5 3.5-4.2-.7C2 15.6 1 16 1 17c0 1 1.6 1.4 3.8.3L9 15.2l3.5-3.5L17.8 19.2c1.2 1.4 2.8 2 3.8 1.4 1-.6 1.6-2.2 1.4-3.8l-.7-4.2z"/></svg></div>`);
  const fleetIcon = createIcon(`<div class="w-8 h-8 bg-zinc-800 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.6)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div>`);

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-700">
      
      {/* COMMAND CENTER HUD (Heads Up Display) */}
      <div className="absolute top-4 right-4 z-[1000] w-80 animate-in slide-in-from-right-8 duration-500">
        <Card className="bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
              <Layers className="w-5 h-5 text-accent" />
              INTELLIGENCE LAYERS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-accent/20"><MapIcon className="w-4 h-4 text-accent" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">National Borders</div>
              </div>
              <Switch checked={layers.nationalBorders} onCheckedChange={() => toggleLayer('nationalBorders')} className="data-[state=checked]:bg-accent" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-accent/20"><MapPin className="w-4 h-4 text-accent" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">Delhi Ward Borders</div>
              </div>
              <Switch checked={layers.wardBorders} onCheckedChange={() => toggleLayer('wardBorders')} className="data-[state=checked]:bg-accent" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-red-500/20"><ShieldAlert className="w-4 h-4 text-red-500" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">Live Grievances</div>
              </div>
              <Switch checked={layers.incidents} onCheckedChange={() => toggleLayer('incidents')} className="data-[state=checked]:bg-red-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-orange-500/20"><Radar className="w-4 h-4 text-orange-500" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">Risk Heatmaps</div>
              </div>
              <Switch checked={layers.heatmap} onCheckedChange={() => toggleLayer('heatmap')} className="data-[state=checked]:bg-orange-500" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-indigo-500/20"><Video className="w-4 h-4 text-indigo-500" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">CCTV Nodes</div>
              </div>
              <Switch checked={layers.cctv} onCheckedChange={() => toggleLayer('cctv')} className="data-[state=checked]:bg-indigo-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-green-500/20"><Plane className="w-4 h-4 text-green-500" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">Sentinel Drones</div>
              </div>
              <Switch checked={layers.drones} onCheckedChange={() => toggleLayer('drones')} className="data-[state=checked]:bg-green-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-cyan-500/20"><Car className="w-4 h-4 text-cyan-500" /></div>
                <div className="text-xs font-semibold text-white/90 uppercase">QRT Fleet GPS</div>
              </div>
              <Switch checked={layers.fleet} onCheckedChange={() => toggleLayer('fleet')} className="data-[state=checked]:bg-cyan-500" />
            </div>

          </CardContent>
        </Card>

        {/* Live Feed Ticker */}
        <div className="mt-4 bg-black/60 backdrop-blur-md border border-white/5 rounded-xl p-3 flex items-center gap-3 shadow-lg">
           <Activity className="w-5 h-5 text-green-400 animate-pulse" />
           <div className="text-xs font-mono text-green-400/90 tracking-widest uppercase">
              System Online • Local Grid Active
           </div>
        </div>
      </div>

      {/* MAP TEXTURE STRIP */}
      <div className="absolute bottom-6 left-6 z-[1000] flex gap-2 animate-in slide-in-from-bottom-8 duration-700">
        {(['dark', 'satellite', 'street', 'terrain'] as const).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-lg border ${
              mapStyle === style 
                ? 'bg-accent/90 text-white border-accent shadow-[0_0_20px_rgba(var(--accent),0.6)]' 
                : 'bg-black/80 text-white/80 border-white/10 hover:bg-black hover:text-white'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      <MapContainer
        center={[28.668, 77.092]} // Locked initially to Delhi (Paschim Vihar)
        zoom={12}
        minZoom={4} // Allow zooming out to full India
        className="w-full h-full z-0 font-sans bg-[#0a0f18]"
        zoomControl={false}
      >
        <TileLayer
          url={mapUrls[mapStyle]}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> / ESRI / OSM'
        />

        {/* National Borders Layer */}
        {layers.nationalBorders && indiaGeoJson && (
          <GeoJSON 
            data={indiaGeoJson} 
            key="national"
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              weight: 2,
              fillColor: 'rgba(255, 255, 255, 0)',
              fillOpacity: 0,
              dashArray: '4 4'
            }} 
          />
        )}

        {/* Delhi Targeted Wards GeoJSON (Paschim Vihar) */}
        {layers.wardBorders && (
          <GeoJSON 
            data={localWardsGeoJson as any} 
            key="wards"
            style={(feature) => ({
              color: 'rgba(59, 130, 246, 1)',
              weight: 3,
              fillColor: 'transparent',
              fillOpacity: 0,
              dashArray: '5 5'
            })}
            onEachFeature={(feature, layer) => {
               layer.bindPopup(`<strong>${feature.properties?.name}</strong><br/>Risk Level: ${feature.properties?.risk}`);
            }}
          />
        )}

        {/* Localized Paschim Vihar Incidents */}
        {layers.incidents && infrastructureIcon && (
          <Marker position={[28.665, 77.095]} icon={infrastructureIcon}>
            <Popup className="custom-popup">
              <div className="font-sans">
                <h3 className="font-bold text-orange-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Broken Road / Pothole</h3>
                <p className="text-sm mt-1">Outer Ring Road, Paschim Vihar</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">ID: JS-801 • High Traffic Impact</p>
              </div>
            </Popup>
          </Marker>
        )}

        {layers.incidents && waterIcon && (
          <Marker position={[28.672, 77.089]} icon={waterIcon}>
            <Popup className="custom-popup">
              <div className="font-sans">
                 <h3 className="font-bold text-blue-500 flex items-center gap-2"><Droplets className="w-4 h-4" /> Severe Pipe Leak</h3>
                 <p className="text-sm mt-1">Block A-2, Paschim Vihar</p>
                 <p className="text-xs text-muted-foreground mt-2 font-mono">ID: JS-802 • Water Logging</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {layers.incidents && fireIcon && (
          <Marker position={[28.661, 77.086]} icon={fireIcon}>
            <Popup className="custom-popup">
              <div className="font-sans">
                 <h3 className="font-bold text-red-500 flex items-center gap-2"><Flame className="w-4 h-4" /> Open Wire Sparking</h3>
                 <p className="text-sm mt-1">Near Metro Station, Paschim Vihar</p>
                 <p className="text-xs text-muted-foreground mt-2 font-mono">ID: JS-803 • Critical Hazard</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* CCTV & Drone Tracking Nodes in Delhi */}
        {layers.cctv && cctvIcon && (
          <>
            <Marker position={[28.668, 77.092]} icon={cctvIcon}>
              <Popup><strong>Node PV-01</strong><br/>Paschim Vihar Main Crossing</Popup>
            </Marker>
            <Marker position={[28.675, 77.100]} icon={cctvIcon}>
              <Popup><strong>Node PV-02</strong><br/>Rohtak Road Viewport</Popup>
            </Marker>
          </>
        )}

        {layers.drones && droneIcon && (
           <Marker position={[28.669, 77.085]} icon={droneIcon}>
              <Popup><strong>Drone Alpha-7</strong><br/>Paschim Vihar Airspace Patrol</Popup>
           </Marker>
        )}

        {/* Heatmap Zones */}
        {layers.heatmap && (
          <>
            <Circle center={[28.69, 77.12]} radius={4000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, dashArray: '5 5' }}>
               <Popup><strong>Critical Risk Zone</strong><br/>High volume of pending infrastructure complaints</Popup>
            </Circle>
            <Circle center={[28.61, 77.21]} radius={5000} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1 }}>
               <Popup><strong>Alert Zone</strong><br/>VIP Movement Protocol Active</Popup>
            </Circle>
          </>
        )}

        {/* QRT Fleet GPS Trackers */}
        {layers.fleet && fleetIcon && (
          <>
            <Marker position={[28.655, 77.080]} icon={fleetIcon}>
              <Popup><strong>QRT Unit 4</strong><br/>En-route to Paschim Vihar Alert</Popup>
            </Marker>
            <Marker position={[28.685, 77.130]} icon={fleetIcon}>
              <Popup><strong>QRT Unit 7</strong><br/>Patrol Mode Active</Popup>
            </Marker>
          </>
        )}

      </MapContainer>
    </div>
  );
}

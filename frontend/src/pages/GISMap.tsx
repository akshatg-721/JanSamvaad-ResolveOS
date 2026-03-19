import { useEffect, useRef, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api/client';
import { Grievance, Severity, ApiTicket, mapTicket } from '../types';
import { 
  Search, 
  Filter, 
  CloudSun, 
  BarChart3, 
  Ruler, 
  Download, 
  Maximize2,
  ChevronRight,
  ChevronLeft,
  X,
  Map as MapIcon,
  Layers,
  Zap
} from 'lucide-react';

/* ── severity colours ── */
const SEV: Record<Severity, { pin: string; ring: string; label: string }> = {
  CRITICAL: { pin: '#ef4444', ring: 'rgba(239,68,68,0.3)',  label: 'Critical' },
  HIGH:     { pin: '#f97316', ring: 'rgba(249,115,22,0.3)',  label: 'High' },
  MEDIUM:   { pin: '#f59e0b', ring: 'rgba(245,158,11,0.3)', label: 'Medium' },
  LOW:      { pin: '#94a3b8', ring: 'rgba(148,163,184,0.2)', label: 'Low' },
};

const CAT_ICONS: Record<string, string> = {
  'Sanitation':      '🗑',
  'Water Supply':    '💧',
  'Street Lighting': '💡',
  'Road Damage':     '🚧',
  'Drainage':        '🌊',
  'Noise Pollution': '🔊',
  'Encroachment':    '⚠',
  'Park Maintenance':'🌳',
  'Electricity':     '⚡',
  'Public Safety':   '🚨',
  'Tree Hazard':     '🌲',
  'Stray Animals':   '🐕',
};

const WARDS = [
  { id: 'w1', name: 'Connaught Place', ward: 'Ward 1', coords: [[28.610,77.200],[28.610,77.230],[28.630,77.230],[28.630,77.200],[28.610,77.200]] as [number,number][] },
  { id: 'w2', name: 'Minto Road',      ward: 'Ward 2', coords: [[28.630,77.200],[28.630,77.230],[28.650,77.230],[28.650,77.200],[28.630,77.200]] as [number,number][] },
  { id: 'w3', name: 'Bengali Market',  ward: 'Ward 3', coords: [[28.610,77.230],[28.610,77.260],[28.630,77.260],[28.630,77.230],[28.610,77.230]] as [number,number][] },
  { id: 'w4', name: 'Gole Market',     ward: 'Ward 4', coords: [[28.610,77.170],[28.610,77.200],[28.630,77.200],[28.630,77.170],[28.610,77.170]] as [number,number][] },
  { id: 'w5', name: 'Chanakyapuri',    ward: 'Ward 5', coords: [[28.580,77.170],[28.580,77.200],[28.610,77.200],[28.610,77.170],[28.580,77.170]] as [number,number][] },
];

type MapLayer = 'standard' | 'satellite' | 'dark' | 'terrain';
type ActiveTool = 'none' | 'search' | 'filter' | 'weather' | 'stats' | 'measure' | 'export';

const TILE_URLS: Record<MapLayer, { url: string; attr: string; label: string }> = {
  standard:  { url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',  attr: '© OpenStreetMap © CARTO', label: 'Light' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '© Esri', label: 'Satellite' },
  dark:      { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',   attr: '© OpenStreetMap © CARTO', label: 'Dark' },
  terrain:   { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                attr: '© OpenTopoMap', label: 'Terrain' },
};

interface WeatherData {
  temp: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

function weatherDesc(code: number): { label: string; icon: string } {
  if (code === 0)          return { label: 'Clear sky',    icon: '☀' };
  if (code <= 2)           return { label: 'Partly cloudy',icon: '⛅' };
  if (code <= 3)           return { label: 'Overcast',     icon: '☁' };
  if (code <= 48)          return { label: 'Foggy',        icon: '🌫' };
  if (code <= 67)          return { label: 'Rainy',        icon: '🌧' };
  if (code <= 77)          return { label: 'Snow',         icon: '❄' };
  if (code <= 82)          return { label: 'Rain showers', icon: '🌦' };
  if (code <= 99)          return { label: 'Thunderstorm', icon: '⛈' };
  return { label: 'Unknown', icon: '—' };
}

/* ── Refined tool button ── */
function ToolBtn({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title?: string; children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center transition-all duration-200 border-b border-[var(--border)] first:rounded-t-2xl last:rounded-b-2xl last:border-b-0 ${
        active 
          ? 'bg-[var(--blue)] text-white' 
          : 'bg-[#0A0A0A] text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--surface)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function GISMap() {
  const mapRef        = useRef<HTMLDivElement>(null);
  const mapInst       = useRef<any>(null);
  const tileRef       = useRef<any>(null);
  const markerGroup   = useRef<any>(null);
  const wardGroup     = useRef<any>(null);
  const heatLayer     = useRef<any>(null);
  const measureLayer  = useRef<any>(null);
  const geocodeMarker = useRef<any>(null);

  const [selected,      setSelected]      = useState<string | null>(null);
  const [activeTool,    setActiveTool]    = useState<ActiveTool>('none');
  const [mapLayer,      setMapLayer]      = useState<MapLayer>('dark');
  const [showWards,     setShowWards]     = useState(true);
  const [showHeat,      setShowHeat]      = useState(false);
  const [showMarkers,   setShowMarkers]   = useState(true);
  const [filterSev,     setFilterSev]     = useState<Severity[]>(['CRITICAL','HIGH','MEDIUM','LOW']);
  const [filterStatus,  setFilterStatus]  = useState<string[]>(['OPEN','IN-PROGRESS','RESOLVED']);
  const [filterCat,     setFilterCat]     = useState<string[]>([]);
  const [mapReady,      setMapReady]      = useState(false);
  const [zoom,          setZoom]          = useState(11);
  const [coords,        setCoords]        = useState({ lat: 28.630, lng: 77.150 });
  const [measuring,     setMeasuring]     = useState(false);
  const [measurePts,    setMeasurePts]    = useState<[number,number][]>([]);
  const [measureDist,   setMeasureDist]   = useState(0);
  const [weather,       setWeather]       = useState<WeatherData | null>(null);
  const [weatherLoading,setWeatherLoading]= useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rightPanel,    setRightPanel]    = useState<'tickets' | 'wards'>('tickets');
  const [panelOpen,     setPanelOpen]     = useState(true);

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [wardStats, setWardStats] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<ApiTicket[]>('/api/tickets'),
      apiFetch<any>('/api/analytics')
    ]).then(([ticketsRes, attrRes]) => {
      if (ticketsRes) setGrievances(ticketsRes.map(mapTicket));
      if (attrRes) setWardStats(attrRes.wardStats || []);
    }).catch(err => console.error('Failed to load map data', err));
  }, []);

  /* filtered grievances */
  const filtered = grievances.filter(g => {
    if (!filterSev.includes(g.severity)) return false;
    if (!filterStatus.includes(g.status)) return false;
    if (filterCat.length > 0 && !filterCat.includes(g.category)) return false;
    return true;
  });

  const selectedGr = grievances.find(g => g.refId === selected);

  /* ── init map ── */
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [28.630, 77.150], zoom: 11,
        zoomControl: false, attributionControl: false,
      });

      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tile = TILE_URLS[mapLayer];
      tileRef.current = L.tileLayer(tile.url, { attribution: tile.attr, subdomains: 'abcd', maxZoom: 20 }).addTo(map);

      wardGroup.current   = L.layerGroup().addTo(map);
      markerGroup.current = L.layerGroup().addTo(map);

      map.on('mousemove', (e: any) => setCoords({ lat: +e.latlng.lat.toFixed(5), lng: +e.latlng.lng.toFixed(5) }));
      map.on('zoom',      () => setZoom(map.getZoom()));

      mapInst.current = map;
      setMapReady(true);
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── swap tile layer ── */
  useEffect(() => {
    if (!mapReady) return;
    (async () => {
      const L = (await import('leaflet')).default;
      if (tileRef.current) mapInst.current.removeLayer(tileRef.current);
      const t = TILE_URLS[mapLayer];
      tileRef.current = L.tileLayer(t.url, { attribution: t.attr, subdomains: 'abcd', maxZoom: 20 });
      tileRef.current.addTo(mapInst.current);
      tileRef.current.setZIndex(0);
    })();
  }, [mapLayer, mapReady]);

  /* ── draw wards ── */
  useEffect(() => {
    if (!mapReady) return;
    (async () => {
      const L = (await import('leaflet')).default;
      wardGroup.current.clearLayers();
      if (!showWards) return;
      const isDark = mapLayer === 'dark';
      WARDS.forEach(w => {
        const wStat = wardStats.find(s => s.ward === w.ward);
        const critCount = wStat?.critical || 0;
        const fillColor = critCount >= 2 ? '#C53030' : critCount === 1 ? '#C05621' : isDark ? '#6B8CFF' : '#3A3A8C';
        L.polygon(w.coords, {
          color: isDark ? '#AAB4FF' : '#3A3A8C',
          weight: 1.5,
          fillColor,
          fillOpacity: critCount > 0 ? 0.07 : 0.03,
          dashArray: '6 4',
        })
          .bindTooltip(
            `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;padding:8px 10px;color:${isDark ? '#FFF' : '#18181A'};min-width:140px">
              <div style="font-weight:500;margin-bottom:4px">${w.ward} · ${w.name}</div>
              <div style="color:${isDark ? '#AAA' : '#8A8580'};font-size:9px">
                ${wStat ? `Open: ${wStat.open} · Resolved: ${wStat.resolved} · Critical: ${wStat.critical}` : 'No data'}
              </div>
            </div>`,
            { permanent: false, sticky: true, className: 'ward-tooltip' }
          )
          .addTo(wardGroup.current);

        // ward label
        const center: [number,number] = [
          (w.coords[0][0] + w.coords[2][0]) / 2,
          (w.coords[0][1] + w.coords[2][1]) / 2,
        ];
        L.marker(center, {
          icon: L.divIcon({
            html: `<div style="font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:${isDark ? '#AAB4FF' : '#3A3A8C'};letter-spacing:0.08em;pointer-events:none;text-align:center;white-space:nowrap">${w.ward}</div>`,
            className: '',
            iconAnchor: [30, 8],
          }),
          interactive: false,
        }).addTo(wardGroup.current);
      });
    })();
  }, [showWards, mapLayer, mapReady]);

  /* ── draw markers ── */
  useEffect(() => {
    if (!mapReady) return;
    (async () => {
      const L = (await import('leaflet')).default;
      markerGroup.current.clearLayers();
      if (!showMarkers) return;

      filtered.forEach(g => {
        const c    = SEV[g.severity];
        const pulse = g.severity === 'CRITICAL';
        const size  = g.severity === 'CRITICAL' ? 20 : g.severity === 'HIGH' ? 16 : g.severity === 'MEDIUM' ? 13 : 11;
        const emoji = CAT_ICONS[g.category] || '📍';
        const isDark = mapLayer === 'dark';

        const html = `
          <div style="position:relative;width:${size+12}px;height:${size+12}px;display:flex;align-items:center;justify-content:center">
            ${pulse ? `
              <div style="position:absolute;width:${size+16}px;height:${size+16}px;border-radius:50%;background:${c.ring};animation:pulse-ring 2s ease-out infinite;top:50%;left:50%;transform:translate(-50%,-50%)"></div>
              <div style="position:absolute;width:${size+8}px;height:${size+8}px;border-radius:50%;background:${c.ring};animation:pulse-ring 2s ease-out 0.5s infinite;top:50%;left:50%;transform:translate(-50%,-50%)"></div>
            ` : ''}
            <div style="
              width:${size}px;height:${size}px;border-radius:50%;
              background:${g.status === 'RESOLVED' ? '#718096' : c.pin};
              border:2px solid rgba(255,255,255,0.95);
              box-shadow:0 2px 8px ${c.ring},0 0 0 1px ${g.status === 'RESOLVED' ? '#71809666' : c.pin + '66'};
              display:flex;align-items:center;justify-content:center;
              font-size:${Math.round(size*0.45)}px;cursor:pointer;
              position:relative;z-index:2;
              opacity:${g.status === 'RESOLVED' ? '0.6' : '1'};
            ">${size >= 14 ? emoji : ''}</div>
          </div>`;

        const icon = L.divIcon({
          html, className: '',
          iconSize: [size+12, size+12],
          iconAnchor: [(size+12)/2, (size+12)/2],
        });

        const popupContent = `
          <div style="font-family:'JetBrains Mono',monospace;padding:14px 16px;min-width:220px;background:${isDark ? '#1E1E2E' : '#F2F0EC'};color:${isDark ? '#E2E8F0' : '#18181A'}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
              <span style="font-style:italic;font-family:'Instrument Serif',serif;font-size:16px">${g.refId}</span>
              <span style="font-size:9px;padding:2px 6px;background:${c.pin}22;color:${c.pin};border:1px solid ${c.pin}44;letter-spacing:0.08em">${g.severity}</span>
            </div>
            <div style="font-size:11px;font-weight:500;margin-bottom:6px;color:${isDark ? '#E2E8F0' : '#18181A'}">${g.category}</div>
            <div style="font-size:10px;color:${isDark ? '#9AA5B1' : '#8A8580'};margin-bottom:8px;line-height:1.5">${g.description.substring(0,90)}…</div>
            <div style="display:flex;gap:8px;font-size:9px;color:${isDark ? '#9AA5B1' : '#8A8580'}">
              <span>${g.ward}</span>
              <span>·</span>
              <span style="color:${g.slaSeconds < 3600 ? '#C53030' : isDark ? '#9AA5B1' : '#8A8580'}">SLA ${g.slaTimer}</span>
              <span>·</span>
              <span>${g.status}</span>
            </div>
          </div>`;

        L.marker(g.coordinates, { icon })
          .bindPopup(popupContent, { maxWidth: 260 })
          .on('click', () => setSelected(g.refId))
          .addTo(markerGroup.current);
      });
    })();
  }, [filtered, showMarkers, mapLayer, mapReady]);

  /* ── heat layer ── */
  useEffect(() => {
    if (!mapReady) return;
    (async () => {
      if (heatLayer.current) {
        mapInst.current.removeLayer(heatLayer.current);
        heatLayer.current = null;
      }
      if (!showHeat) return;
      try {
        await import('leaflet.heat');
        const L = (await import('leaflet')).default;
        const pts = filtered.map(g => [
          g.coordinates[0], g.coordinates[1],
          g.severity === 'CRITICAL' ? 1.0 : g.severity === 'HIGH' ? 0.7 : g.severity === 'MEDIUM' ? 0.45 : 0.2,
        ]);
        heatLayer.current = (L as any).heatLayer(pts, {
          radius: 40, blur: 25, maxZoom: 14,
          gradient: { 0.2: '#4575b4', 0.4: '#91bfdb', 0.6: '#fee090', 0.8: '#fc8d59', 1.0: '#d73027' },
        }).addTo(mapInst.current);
      } catch { /* leaflet.heat not available */ }
    })();
  }, [showHeat, filtered, mapReady]);

  /* ── measure tool ── */
  const handleMapClickMeasure = useCallback((e: any) => {
    if (!measuring) return;
    const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
    setMeasurePts(prev => {
      const next = [...prev, pt];
      if (next.length >= 2 && mapInst.current) {
        import('leaflet').then(({ default: L }) => {
          if (measureLayer.current) mapInst.current.removeLayer(measureLayer.current);
          measureLayer.current = L.polyline(next, { color: '#3A3A8C', weight: 2, dashArray: '6 4' }).addTo(mapInst.current);
          // calc distance
          let dist = 0;
          for (let i = 1; i < next.length; i++) {
            dist += mapInst.current.distance(next[i-1], next[i]);
          }
          setMeasureDist(dist);
        });
      }
      return next;
    });
  }, [measuring]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapInst.current;
    if (measuring) {
      map.on('click', handleMapClickMeasure);
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.off('click', handleMapClickMeasure);
      map.getContainer().style.cursor = '';
      if (measureLayer.current) { map.removeLayer(measureLayer.current); measureLayer.current = null; }
      setMeasurePts([]);
      setMeasureDist(0);
    }
    return () => map.off('click', handleMapClickMeasure);
  }, [measuring, mapReady, handleMapClickMeasure]);

  /* ── fetch weather (Open-Meteo — free, no API key) ── */
  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=28.63&longitude=77.22&current_weather=true'
      );
      const data = await res.json();
      if (data.current_weather) setWeather(data.current_weather);
    } catch { /* network error */ }
    setWeatherLoading(false);
  };

  useEffect(() => {
    if (activeTool === 'weather' && !weather) fetchWeather();
  }, [activeTool]);

  /* ── geocode search (Nominatim — free) ── */
  const handleGeoSearch = async (q: string) => {
    if (q.length < 3) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Delhi, India')}&format=json&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: GeoResult[] = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
    setSearchLoading(false);
  };

  const flyToResult = async (r: GeoResult) => {
    if (!mapInst.current) return;
    const L = (await import('leaflet')).default;
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    mapInst.current.flyTo([lat, lng], 15, { duration: 1.2 });
    if (geocodeMarker.current) mapInst.current.removeLayer(geocodeMarker.current);
    geocodeMarker.current = L.marker([lat, lng], {
      icon: L.divIcon({
        html: `<div style="width:12px;height:12px;border-radius:50%;background:#3A3A8C;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        className: '', iconAnchor: [6, 6],
      }),
    }).bindPopup(`<div style="font-family:'JetBrains Mono',monospace;padding:10px;font-size:10px;max-width:200px">${r.display_name}</div>`)
      .addTo(mapInst.current).openPopup();
    setSearchResults([]);
    setSearchQuery('');
  };

  const toggleTool = (t: ActiveTool) => setActiveTool(prev => prev === t ? 'none' : t);

  const zoomToGrievance = (refId: string) => {
    const g = grievances.find(x => x.refId === refId);
    if (g && mapInst.current) {
      mapInst.current.flyTo(g.coordinates, 16, { duration: 1 });
      setSelected(refId);
    }
  };

  const exportCSV = () => {
    const rows = [
      ['Ref ID','Category','Severity','Ward','Status','SLA Timer','Created At','Assigned To','Description'],
      ...filtered.map(g => [g.refId, g.category, g.severity, g.ward, g.status, g.slaTimer, g.createdAt, g.assignedTo, `"${g.description}"`]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'gis_grievances.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const isDark = mapLayer === 'dark';
  const panelBorder = 'rgba(255,255,255,0.06)';
  const wdesc = weather ? weatherDesc(weather.weathercode) : null;

  return (
    <Layout>
      <div className="relative h-full flex overflow-hidden bg-[#030303]">

        {/* ── Top Bar ── */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 p-1.5 glass rounded-2xl border-[var(--border-hi)] pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-1 border-r border-[rgba(255,255,255,0.1)] pr-3 mr-1">
              {(Object.keys(TILE_URLS) as MapLayer[]).map(k => (
                <button 
                  key={k} 
                  onClick={() => setMapLayer(k)} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    mapLayer === k 
                      ? 'bg-[var(--blue)] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-white/5'
                  }`}
                >
                  {TILE_URLS[k].label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pr-2">
              {[
                { label: 'Wards',   val: showWards,   set: setShowWards, icon: <Layers size={14}/> },
                { label: 'Feeds', val: showMarkers, set: setShowMarkers, icon: <MapIcon size={14}/> },
                { label: 'Heat',    val: showHeat,    set: setShowHeat, icon: <Zap size={14}/> },
              ].map(item => (
                <button 
                  key={item.label} 
                  onClick={() => item.set(!item.val)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    item.val 
                      ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                      : 'bg-transparent border-transparent text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Summary Stats Floating */}
             <div className="hidden lg:flex items-center gap-6 px-6 py-3 glass rounded-2xl border-[var(--border-hi)] pointer-events-auto">
                {(['CRITICAL','HIGH','MEDIUM','LOW'] as Severity[]).map(s => {
                  const cnt = filtered.filter(g => g.severity === s).length;
                  if (!cnt) return null;
                  return (
                    <div key={s} className="flex items-center gap-2 group cursor-default">
                      <div className="w-2 h-2 rounded-full shadow-lg" style={{ background: SEV[s].pin, boxShadow: `0 0 10px ${SEV[s].ring}` }} />
                      <span className="text-[11px] font-bold font-mono text-[var(--ink-2)] group-hover:text-white transition-colors">{cnt} {s}</span>
                    </div>
                  );
                })}
             </div>

             <button 
               onClick={() => setPanelOpen(p => !p)} 
               className="p-3 glass rounded-2xl border-[var(--border-hi)] text-[var(--ink-4)] hover:text-white transition-all pointer-events-auto shadow-2xl active:scale-95"
             >
               {panelOpen ? <ChevronRight size={20} /> : <Maximize2 size={20} />}
             </button>
          </div>
        </div>

        {/* ── Left Toolbar ── */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[400] flex flex-col glass rounded-2xl border-[var(--border-hi)] overflow-hidden shadow-2xl">
          <ToolBtn title="Search Location" onClick={() => toggleTool('search')}  active={activeTool==='search'}>
            <Search size={20} />
          </ToolBtn>
          <ToolBtn title="Filter Grievances" onClick={() => toggleTool('filter')} active={activeTool==='filter'}>
            <Filter size={20} />
          </ToolBtn>
          <ToolBtn title="Weather Overlay" onClick={() => toggleTool('weather')} active={activeTool==='weather'}>
            <CloudSun size={20} />
          </ToolBtn>
          <ToolBtn title="Ward Intelligence" onClick={() => toggleTool('stats')} active={activeTool==='stats'}>
            <BarChart3 size={20} />
          </ToolBtn>
          <ToolBtn title="Spatial Measure" onClick={() => { toggleTool('measure'); setMeasuring(t => !t); }} active={measuring}>
            <Ruler size={20} />
          </ToolBtn>
          <ToolBtn title="Export Operations" onClick={exportCSV}>
            <Download size={20} />
          </ToolBtn>
        </div>

        {/* ── Tool Panels (Left) ── */}
        {activeTool !== 'none' && (
          <div className="absolute left-20 top-1/2 -translate-y-1/2 z-[500] w-[320px] glass rounded-3xl border-[var(--border-hi)] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-in-right">
            {/* ── SEARCH ── */}
            {activeTool === 'search' && (
              <div className="p-6">
                <header className="flex items-center justify-between mb-6">
                  <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--ink-4)]">Geo-Intelligence</h3>
                  <button onClick={() => setActiveTool('none')} className="text-[var(--ink-4)] hover:text-white"><X size={16}/></button>
                </header>
                <div className="relative group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-4)] group-focus-within:text-[var(--blue)] transition-colors" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); handleGeoSearch(e.target.value); }}
                    placeholder="Search coordinates or address..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[13px] placeholder-[var(--ink-5)] outline-none focus:border-[var(--blue)] focus:bg-white/10 transition-all font-medium"
                  />
                  {searchLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/10 border-t-[var(--blue)] rounded-full animate-spin" />
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {searchResults.map((r, i) => (
                      <button 
                        key={i} 
                        onClick={() => flyToResult(r)} 
                        className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-all group"
                      >
                        <p className="text-[12px] font-bold text-[var(--ink-2)] group-hover:text-white transition-colors line-clamp-2">{r.display_name}</p>
                        <p className="text-[10px] font-mono text-[var(--ink-4)] mt-1">{parseFloat(r.lat).toFixed(4)}, {parseFloat(r.lon).toFixed(4)}</p>
                      </button>
                    ))}
                  </div>
                )}
                {/* quick jumps */}
                <div className="mt-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-5)] mb-4">Strategic Sectors</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {WARDS.map(w => (
                      <button 
                        key={w.id} 
                        onClick={() => {
                          const c = w.coords;
                          const lat = (c[0][0] + c[2][0]) / 2;
                          const lng = (c[0][1] + c[2][1]) / 2;
                          mapInst.current?.flyTo([lat, lng], 14, { duration: 0.9 });
                        }} 
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                      >
                        <span className="text-[12px] font-bold text-[var(--ink-2)] group-hover:text-white">{w.name}</span>
                        <span className="text-[10px] font-mono text-[var(--ink-4)]">{w.ward}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── FILTER ── */}
            {activeTool === 'filter' && (
              <div style={{ padding: '12px' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: panelMuted, marginBottom: '10px' }}>FILTER MARKERS</div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginBottom: '6px', letterSpacing: '0.08em' }}>SEVERITY</div>
                  {(['CRITICAL','HIGH','MEDIUM','LOW'] as Severity[]).map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                      <input type="checkbox" checked={filterSev.includes(s)}
                        onChange={e => setFilterSev(p => e.target.checked ? [...p, s] : p.filter(x => x !== s))}
                        style={{ accentColor: SEV[s].pin }}
                      />
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SEV[s].pin, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText }}>{s}</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginLeft: 'auto' }}>
                        {grievances.filter(g => g.severity === s).length}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: '10px', marginBottom: '10px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginBottom: '6px', letterSpacing: '0.08em' }}>STATUS</div>
                  {['OPEN','IN-PROGRESS','RESOLVED'].map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', cursor: 'pointer' }}>
                      <input type="checkbox" checked={filterStatus.includes(s)}
                        onChange={e => setFilterStatus(p => e.target.checked ? [...p, s] : p.filter(x => x !== s))}
                      />
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText }}>{s}</span>
                    </label>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: '10px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginBottom: '6px', letterSpacing: '0.08em' }}>CATEGORY</div>
                  {Object.keys(CAT_ICONS).map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '3px 0', cursor: 'pointer' }}>
                      <input type="checkbox" checked={filterCat.includes(cat)}
                        onChange={e => setFilterCat(p => e.target.checked ? [...p, cat] : p.filter(x => x !== cat))}
                      />
                      <span style={{ fontSize: '11px' }}>{CAT_ICONS[cat]}</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText }}>{cat}</span>
                    </label>
                  ))}
                  {filterCat.length > 0 && (
                    <button onClick={() => setFilterCat([])} style={{
                      marginTop: '6px', fontFamily: 'var(--f-mono)', fontSize: '9px',
                      color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer',
                    }}>Clear category filter</button>
                  )}
                </div>
              </div>
            )}

            {/* ── WEATHER ── */}
            {activeTool === 'weather' && (
              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: panelMuted }}>LIVE WEATHER · NEW DELHI</div>
                  <button onClick={fetchWeather} style={{ background: 'none', border: 'none', cursor: 'pointer', color: panelMuted, fontSize: '11px' }}>↻</button>
                </div>
                {weatherLoading ? (
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelMuted }}>Fetching…</div>
                ) : weather && wdesc ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '36px' }}>{wdesc.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--f-serif)', fontSize: '28px', fontStyle: 'italic', color: panelText, lineHeight: 1 }}>{Math.round(weather.temp)}°</div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginTop: '2px' }}>{wdesc.label}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { label: 'Wind Speed',  value: `${weather.windspeed} km/h` },
                        { label: 'Conditions',  value: wdesc.label },
                        { label: 'Location',    value: 'New Delhi' },
                        { label: 'Updated',     value: weather.time?.slice(11,16) || 'Live' },
                      ].map(item => (
                        <div key={item.label} style={{ padding: '8px', background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg)', border: `1px solid ${panelBorder}` }}>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted, marginBottom: '3px', letterSpacing: '0.08em' }}>{item.label.toUpperCase()}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: panelText }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '12px', padding: '8px', background: isDark ? 'rgba(197,48,48,0.1)' : 'var(--red-bg)', border: `1px solid ${isDark ? 'rgba(197,48,48,0.3)' : 'var(--red-border)'}` }}>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--red)', marginBottom: '3px' }}>WEATHER IMPACT</div>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelMuted }}>
                        {weather.weathercode >= 61 ? 'Heavy rain may worsen drainage & sanitation grievances' :
                         weather.weathercode >= 3 ? 'Overcast conditions — no significant impact' :
                         'Clear conditions — normal operations'}
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted, textAlign: 'center' }}>
                      Data: Open-Meteo API (free, no key)
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelMuted }}>No data. Check connection.</div>
                )}
              </div>
            )}

            {/* ── STATS ── */}
            {activeTool === 'stats' && (
              <div style={{ padding: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: panelMuted, marginBottom: '10px' }}>WARD STATISTICS</div>
                {wardStats.map(w => {
                  const total = w.open + w.resolved + w.inProgress;
                  const resolvedPct = total ? Math.round(w.resolved / total * 100) : 0;
                  return (
                    <div key={w.ward} style={{ marginBottom: '10px', padding: '10px', background: isDark ? 'rgba(255,255,255,0.03)' : 'var(--bg)', border: `1px solid ${panelBorder}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', fontWeight: 500, color: panelText }}>{w.ward}</span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginLeft: '5px' }}>{w.name}</span>
                        </div>
                        {w.critical > 0 && (
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--red)', background: isDark ? 'rgba(197,48,48,0.15)' : 'var(--red-bg)', padding: '2px 5px' }}>
                            {w.critical} CRITICAL
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        {[
                          { label: 'Open', val: w.open, color: 'var(--orange)' },
                          { label: 'Active', val: w.inProgress, color: 'var(--amber)' },
                          { label: 'Done', val: w.resolved, color: 'var(--green)' },
                        ].map(item => (
                          <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--f-serif)', fontSize: '15px', fontStyle: 'italic', color: item.color }}>{item.val}</div>
                            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: '3px', background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-raised)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${resolvedPct}%`, background: 'var(--green)', transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>Avg: {w.avgResolutionHrs}h resolution</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--green)' }}>{resolvedPct}% resolved</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── MEASURE ── */}
            {activeTool === 'measure' && (
              <div style={{ padding: '14px' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', color: panelMuted, marginBottom: '10px' }}>DISTANCE MEASUREMENT</div>
                <div style={{
                  padding: '10px', marginBottom: '10px',
                  background: measuring ? (isDark ? 'rgba(58,58,140,0.15)' : 'var(--blue-bg)') : (isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg)'),
                  border: `1px solid ${measuring ? 'var(--blue)' : panelBorder}`,
                }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: measuring ? 'var(--blue)' : panelMuted }}>
                    {measuring ? '● ACTIVE — click map to add points' : '○ Inactive'}
                  </div>
                </div>
                {measurePts.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted, marginBottom: '5px', letterSpacing: '0.08em' }}>POINTS ({measurePts.length})</div>
                    {measurePts.map((p, i) => (
                      <div key={i} style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, padding: '2px 0' }}>
                        {i + 1}. {p[0].toFixed(4)}, {p[1].toFixed(4)}
                      </div>
                    ))}
                  </div>
                )}
                {measureDist > 0 && (
                  <div style={{ padding: '10px', background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg)', border: `1px solid ${panelBorder}` }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, marginBottom: '3px' }}>TOTAL DISTANCE</div>
                    <div style={{ fontFamily: 'var(--f-serif)', fontSize: '22px', fontStyle: 'italic', color: panelText }}>
                      {measureDist >= 1000 ? `${(measureDist/1000).toFixed(2)} km` : `${Math.round(measureDist)} m`}
                    </div>
                  </div>
                )}
                <button onClick={() => { setMeasuring(false); setMeasurePts([]); setMeasureDist(0); setActiveTool('none'); }}
                  style={{ marginTop: '10px', width: '100%', padding: '7px', background: 'none', border: `1px solid ${panelBorder}`, color: panelMuted, fontFamily: 'var(--f-mono)', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.08em' }}>
                  CLEAR & EXIT
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── MAP ── */}
        <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        {/* ── measure cursor hint ── */}
        {measuring && (
          <div style={{
            position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
            zIndex: 500, background: isDark ? 'rgba(15,15,26,0.9)' : 'rgba(242,240,236,0.9)',
            border: `1px solid ${panelBorder}`, padding: '6px 14px',
            fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText,
            backdropFilter: 'blur(8px)', pointerEvents: 'none',
          }}>
            Click to add measurement points · {measurePts.length} points
            {measureDist > 0 && ` · ${measureDist >= 1000 ? `${(measureDist/1000).toFixed(2)} km` : `${Math.round(measureDist)} m`}`}
          </div>
        )}

        {/* ── right panel ── */}
        {panelOpen && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px',
            zIndex: 300, borderLeft: `1px solid ${panelBorder}`,
            background: isDark ? 'rgba(12,12,22,0.96)' : 'rgba(242,240,236,0.96)',
            backdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* panel header */}
            <div style={{
              height: '40px', display: 'flex', alignItems: 'center',
              borderBottom: `1px solid ${panelBorder}`,
              flexShrink: 0,
            }}>
              {[
                { key: 'tickets', label: 'ACTIVE TICKETS' },
                { key: 'wards',   label: 'WARDS' },
              ].map(tab => (
                <button key={tab.key} onClick={() => setRightPanel(tab.key as typeof rightPanel)} style={{
                  flex: 1, height: '100%', background: 'transparent',
                  border: 'none', borderBottom: rightPanel === tab.key ? `2px solid ${panelText}` : '2px solid transparent',
                  color: rightPanel === tab.key ? panelText : panelMuted,
                  fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}>{tab.label}</button>
              ))}
            </div>

            {/* tickets tab */}
            {rightPanel === 'tickets' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted, padding: '4px 4px 8px', letterSpacing: '0.1em' }}>
                  {filtered.length} GRIEVANCE{filtered.length !== 1 ? 'S' : ''} · SORTED BY SEVERITY
                </div>
                {[...filtered]
                  .sort((a, b) => {
                    const order: Record<Severity, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                    return order[a.severity] - order[b.severity];
                  })
                  .map(g => {
                    const c = SEV[g.severity];
                    const isSelected = selected === g.refId;
                    const isCritical = g.severity === 'CRITICAL';
                    return (
                      <div
                        key={g.id}
                        onClick={() => zoomToGrievance(g.refId)}
                        style={{
                          padding: '10px', marginBottom: '4px', cursor: 'pointer',
                          background: isSelected ? (isDark ? 'rgba(255,255,255,0.08)' : 'var(--bg-raised)') : 'transparent',
                          border: `1px solid ${isSelected ? panelBorder : 'transparent'}`,
                          borderLeft: `3px solid ${isCritical && g.status !== 'RESOLVED' ? c.pin : g.status === 'RESOLVED' ? 'var(--green)' : c.pin}`,
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg)';
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <span style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', color: panelText }}>{g.refId}</span>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {isCritical && g.status !== 'RESOLVED' && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.pin, animation: 'blink 1.5s ease infinite' }} />
                            )}
                            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: c.pin, background: c.ring, padding: '2px 5px', letterSpacing: '0.06em' }}>
                              {g.severity}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '10px' }}>{CAT_ICONS[g.category]}</span>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText }}>{g.category}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted }}>{g.wardName}</span>
                          <span style={{
                            fontFamily: 'var(--f-mono)', fontSize: '9px',
                            color: g.slaSeconds < 3600 ? 'var(--red)' : g.slaSeconds < 7200 ? 'var(--orange)' : panelMuted,
                            fontWeight: g.slaSeconds < 3600 ? 500 : 400,
                          }}>
                            {g.status === 'RESOLVED' ? '✓ RESOLVED' : g.slaTimer}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* wards tab */}
            {rightPanel === 'wards' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {wardStats.map(w => {
                  const total = w.open + w.resolved + w.inProgress;
                  const resolvedPct = total ? Math.round(w.resolved / total * 100) : 0;
                  return (
                    <div key={w.ward} style={{ padding: '10px', marginBottom: '4px', background: isDark ? 'rgba(255,255,255,0.03)' : 'var(--bg)', border: `1px solid ${panelBorder}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', fontWeight: 500, color: panelText }}>{w.name}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>{w.ward}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', color: resolvedPct >= 70 ? 'var(--green)' : resolvedPct >= 40 ? 'var(--amber)' : 'var(--red)' }}>
                            {resolvedPct}%
                          </div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>resolved</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0', height: '4px', marginBottom: '6px' }}>
                        {[
                          { val: w.open,        color: 'var(--red)' },
                          { val: w.inProgress,  color: 'var(--amber)' },
                          { val: w.resolved,    color: 'var(--green)' },
                        ].map((seg, i) => (
                          <div key={i} style={{ flex: seg.val, background: seg.val ? seg.color : 'transparent', opacity: 0.7 }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {[
                          { label: 'Open',     val: w.open,        color: 'var(--red)' },
                          { label: 'Active',   val: w.inProgress,  color: 'var(--amber)' },
                          { label: 'Done',     val: w.resolved,    color: 'var(--green)' },
                          { label: 'Critical', val: w.critical,    color: 'var(--red)' },
                        ].map(item => (
                          <div key={item.label} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', color: item.color }}>{item.val}</div>
                            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: '6px', borderTop: `1px solid ${panelBorder}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>Avg resolution: {w.avgResolutionHrs}h</span>
                        <span style={{ fontFamily: 'var(--f-mono)', fontSize: '8px', color: panelMuted }}>Satisfaction: {w.citizenSatisfaction}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* selected ticket detail bar */}
            {selectedGr && (
              <div style={{
                borderTop: `1px solid ${panelBorder}`, padding: '12px',
                background: isDark ? 'rgba(197,48,48,0.08)' : 'var(--red-bg)',
                animation: 'slide-up 0.2s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', color: panelText }}>{selectedGr.refId}</div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: panelMuted, fontSize: '14px' }}>✕</button>
                </div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: panelText, marginBottom: '4px' }}>{selectedGr.category} · {selectedGr.wardName}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted, lineHeight: 1.5, marginBottom: '8px' }}>
                  {selectedGr.description.substring(0, 100)}…
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => mapInst.current?.flyTo(selectedGr.coordinates, 17, { duration: 0.8 })} style={{
                    flex: 1, padding: '6px', background: panelText === '#E2E8F0' ? 'rgba(255,255,255,0.1)' : 'var(--ink)',
                    color: panelText === '#E2E8F0' ? '#E2E8F0' : 'var(--bg)',
                    border: 'none', fontFamily: 'var(--f-mono)', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.08em',
                  }}>ZOOM IN ↗</button>
                  <button onClick={() => setSelected(null)} style={{
                    flex: 1, padding: '6px', background: 'transparent',
                    border: `1px solid ${panelBorder}`, color: panelMuted,
                    fontFamily: 'var(--f-mono)', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.08em',
                  }}>DISMISS</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── coordinate bar ── */}
        <div style={{
          position: 'absolute', bottom: 10, left: panelOpen ? '50%' : '50%',
          transform: 'translateX(-50%)',
          zIndex: 400,
          display: 'flex', alignItems: 'center', gap: '16px',
          background: isDark ? 'rgba(12,12,22,0.85)' : 'rgba(242,240,236,0.85)',
          border: `1px solid ${panelBorder}`,
          backdropFilter: 'blur(8px)',
          padding: '5px 14px',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted }}>
            {coords.lat.toFixed(4)}° N · {coords.lng.toFixed(4)}° E
          </span>
          <div style={{ width: '1px', height: '10px', background: panelBorder }} />
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted }}>Z{zoom}</span>
          <div style={{ width: '1px', height: '10px', background: panelBorder }} />
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: panelMuted }}>{filtered.length} markers</span>
          {measuring && (
            <>
              <div style={{ width: '1px', height: '10px', background: panelBorder }} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--blue)', animation: 'blink 1.5s ease infinite' }}>MEASURING</span>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

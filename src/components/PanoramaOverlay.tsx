import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { MapPin, X, Navigation, ChevronRight } from "lucide-react";

// NOTE: Panorama textures should be max 4096×2048px for web performance.

export interface TourHotspot {
  yaw: number;
  pitch: number;
  label: string;
  targetId: number;
}

export interface PanoramaOverlayProps {
  panoramaUrl: string;
  title: string;
  location?: string;
  hotspots?: TourHotspot[];
  onNavigate?: (targetId: number) => void;
  onClose: () => void;
}

/* ─── inner WebGL viewer ─────────────────────────────────────────────── */
function PanoramaViewer({
  panoramaUrl,
  hotspots,
  onReady,
  onNavigate,
}: {
  panoramaUrl: string;
  hotspots?: TourHotspot[];
  onReady: () => void;
  onNavigate?: (targetId: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const markerDefs = (hotspots ?? []).map((h) => ({
      id: `hotspot-${h.targetId}`,
      position: { yaw: h.yaw, pitch: h.pitch },
      html: `<div class="psv-tour-dot">
               <div class="psv-tour-inner"></div>
             </div>`,
      tooltip: {
        content: `<span style="font-weight:700;font-size:13px;color:#fff;">${h.label}</span>`,
        position: "top center",
      },
      data: { targetId: h.targetId },
    }));

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: panoramaUrl,
      defaultYaw: 0,
      defaultPitch: 0,
      defaultZoomLvl: 50,
      navbar: ["zoom", "fullscreen"],
      plugins: markerDefs.length
        ? [[MarkersPlugin, { markers: markerDefs }] as any]
        : [],
    });

    viewer.addEventListener("ready", onReady, { once: true });

    if (markerDefs.length && onNavigate) {
      const mp = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
      if (mp) {
        mp.addEventListener("select-marker", (e: any) => {
          const id: number = e.marker?.data?.targetId ?? parseInt(e.marker?.id?.replace("hotspot-", "") ?? "NaN", 10);
          if (!isNaN(id)) onNavigate(id);
        });
      }
    }

    return () => { viewer.destroy(); };
  }, [panoramaUrl]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <style>{`
        .psv-tour-dot {
          width: 42px; height: 42px;
          border-radius: 50%;
          border: 2.5px solid rgba(30,144,255,0.9);
          background: rgba(30,144,255,0.20);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          animation: tourDotPulse 1.8s ease-out infinite;
          box-shadow: 0 0 0 0 rgba(30,144,255,0.6);
        }
        .psv-tour-inner {
          width: 14px; height: 14px; border-radius: 50%;
          background: linear-gradient(135deg,#1E90FF,#00C8FF);
          box-shadow: 0 0 10px rgba(30,144,255,0.95);
        }
        @keyframes tourDotPulse {
          0%   { box-shadow: 0 0 0 0 rgba(30,144,255,0.70); }
          70%  { box-shadow: 0 0 0 16px rgba(30,144,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(30,144,255,0); }
        }
        .psv-tooltip {
          background: rgba(4,13,33,0.92) !important;
          border: 1px solid rgba(30,144,255,0.38) !important;
          border-radius: 10px !important;
          backdrop-filter: blur(12px) !important;
          padding: 5px 12px !important;
        }
        .psv-tooltip-arrow { display: none !important; }
      `}</style>
    </div>
  );
}

/* ─── overlay shell (portal) ─────────────────────────────────────────── */
export default function PanoramaOverlay({
  panoramaUrl, title, location, hotspots, onNavigate, onClose,
}: PanoramaOverlayProps) {
  const [loaded, setLoaded] = useState(false);
  const [showHint, setShowHint] = useState(() => !sessionStorage.getItem("psv_hint_shown"));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (showHint && loaded) {
      sessionStorage.setItem("psv_hint_shown", "1");
      const t = setTimeout(() => setShowHint(false), 3500);
      return () => clearTimeout(t);
    }
  }, [showHint, loaded]);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const hasHotspots = (hotspots ?? []).length > 0;

  const overlay = (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", animation:"psvFadeIn 0.4s ease forwards" }}>
      <style>{`
        @keyframes psvFadeIn  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes psvSpin    { to{transform:rotate(360deg)} }
        @keyframes psvHint    { 0%,100%{opacity:.80} 50%{opacity:1} }
      `}</style>

      {/* ── loading spinner ── */}
      {!loaded && (
        <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(4,13,33,0.96)", pointerEvents:"none" }}>
          <div style={{ width:52, height:52, borderRadius:"50%", border:"3px solid rgba(30,144,255,0.15)", borderTop:"3px solid #1E90FF", animation:"psvSpin 0.9s linear infinite", marginBottom:16 }}/>
          <p style={{ color:"rgba(120,195,255,0.65)", fontSize:13, letterSpacing:"0.06em" }}>Loading 360° panorama…</p>
        </div>
      )}

      {/* ── top header bar ── */}
      <div style={{ position:"fixed", top:0, left:0, right:64, padding:"13px 20px", background:"linear-gradient(to bottom, rgba(4,13,33,0.92) 0%, transparent 100%)", backdropFilter:"blur(14px)", zIndex:10002, display:"flex", alignItems:"center", gap:10, pointerEvents:"none" }}>
        <div style={{ background:"linear-gradient(135deg,#1E90FF,#00C8FF)", borderRadius:999, padding:"2px 9px", fontSize:10, fontWeight:700, color:"#fff", letterSpacing:"0.08em", flexShrink:0 }}>
          360°
        </div>
        <span style={{ color:"#fff", fontWeight:700, fontSize:15, textShadow:"0 1px 8px rgba(0,0,0,0.8)" }}>{title}</span>
        {location && (
          <span style={{ display:"flex", alignItems:"center", gap:4, color:"rgba(125,211,252,0.85)", fontSize:13 }}>
            <MapPin style={{ width:12, height:12 }}/>{location}
          </span>
        )}
        {hasHotspots && loaded && (
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, background:"rgba(29,78,216,0.50)", border:"1px solid rgba(30,144,255,0.38)", borderRadius:20, padding:"3px 10px", flexShrink:0, pointerEvents:"none" }}>
            <Navigation style={{ width:10, height:10, color:"#60a5fa" }}/>
            <span style={{ fontSize:10, fontWeight:700, color:"#93c5fd", letterSpacing:"0.07em" }}>VIRTUAL TOUR · {hotspots!.length} STOPS</span>
          </div>
        )}
      </div>

      {/* ── close button ── */}
      <button onClick={onClose}
        style={{ position:"fixed", top:10, right:12, width:48, height:48, background:"rgba(5,15,50,0.80)", border:"1px solid rgba(120,195,255,0.28)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:10003, boxShadow:"0 0 20px rgba(37,99,235,0.25)", transition:"transform 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
        <X style={{ width:20, height:20, color:"#fff" }}/>
      </button>

      {/* ── drag hint ── */}
      {showHint && loaded && (
        <div style={{ position:"fixed", bottom: hasHotspots ? 116 : 80, left:"50%", transform:"translateX(-50%)", background:"rgba(4,13,33,0.82)", backdropFilter:"blur(14px)", border:"1px solid rgba(120,195,255,0.22)", borderRadius:999, padding:"8px 18px", color:"rgba(190,230,255,0.90)", fontSize:13, fontWeight:500, zIndex:10003, whiteSpace:"nowrap", animation:"psvHint 1.5s ease-in-out infinite", pointerEvents:"none" }}>
          {isMobile
            ? "Drag to explore · Pinch to zoom · Tap dots to tour"
            : "Drag to look around · Click glowing dots to fly to next location"}
        </div>
      )}

      {/* ── virtual tour bottom strip ── */}
      {hasHotspots && loaded && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:10002, background:"linear-gradient(to top, rgba(4,13,33,0.96) 0%, rgba(4,13,33,0.72) 65%, transparent 100%)", backdropFilter:"blur(14px)", padding:"14px 24px 18px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:2, flexShrink:0 }}>
            <span style={{ fontSize:9, fontWeight:800, color:"rgba(120,195,255,0.50)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Continue Tour</span>
            <div style={{ width:32, height:1.5, background:"linear-gradient(90deg,#1E90FF,transparent)", borderRadius:2 }}/>
          </div>
          <div style={{ display:"flex", gap:10, overflowX:"auto", flex:1, paddingBottom:2, scrollbarWidth:"none" }}>
            {hotspots!.map((h) => (
              <button key={h.targetId} onClick={() => onNavigate?.(h.targetId)}
                style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(10,28,90,0.72)", border:"1px solid rgba(30,144,255,0.38)", borderRadius:14, padding:"9px 16px", cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap", flexShrink:0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(29,78,216,0.78)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96,165,250,0.70)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,28,90,0.72)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(30,144,255,0.38)"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1E90FF,#00C8FF)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 14px rgba(30,144,255,0.65)" }}>
                  <span style={{ fontSize:8, fontWeight:900, color:"#fff", letterSpacing:"0.04em" }}>360°</span>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#f0f8ff", margin:0, lineHeight:1.2 }}>{h.label}</p>
                  <p style={{ fontSize:10, color:"rgba(125,211,252,0.68)", margin:"1px 0 0", lineHeight:1 }}>Tap to visit →</p>
                </div>
                <ChevronRight style={{ width:14, height:14, color:"rgba(96,165,250,0.65)", marginLeft:2 }}/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── actual panorama viewer ── */}
      <PanoramaViewer
        panoramaUrl={panoramaUrl}
        hotspots={hotspots}
        onReady={() => setLoaded(true)}
        onNavigate={onNavigate}
      />
    </div>
  );

  return ReactDOM.createPortal(overlay, document.body);
}

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Viewer } from "@photo-sphere-viewer/core";
import { MapPin, X } from "lucide-react";

// NOTE: Panorama textures should be max 4096×2048px for web performance.
// The MarkersPlugin stub below is reserved for Phase 2 virtual-tour hotspots.
//
// Phase 2 — MarkersPlugin stub:
// import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
// Each GalleryItem may include:
//   hotspots?: { yaw: number; pitch: number; label: string; link: number }[]
// When present, markers appear as glowing dots the user can click to navigate
// between 360° cards, creating a virtual tour.

interface PanoramaOverlayProps {
  panoramaUrl: string;
  title: string;
  location?: string;
  onClose: () => void;
}

function PanoramaViewer({
  panoramaUrl,
  onReady,
}: {
  panoramaUrl: string;
  onReady: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: panoramaUrl,
      defaultYaw: 0,
      defaultPitch: 0,
      defaultZoomLvl: 50,
      navbar: ["zoom", "fullscreen"],
    });

    viewer.addEventListener("ready", onReady, { once: true });

    return () => {
      viewer.destroy();
    };
  }, [panoramaUrl]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}

export default function PanoramaOverlay({
  panoramaUrl,
  title,
  location,
  onClose,
}: PanoramaOverlayProps) {
  const [loaded, setLoaded] = useState(false);
  const [showHint, setShowHint] = useState(
    () => !sessionStorage.getItem("psv_hint_shown")
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (showHint && loaded) {
      sessionStorage.setItem("psv_hint_shown", "1");
      const t = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showHint, loaded]);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const overlay = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        animation: "psvFadeIn 0.4s ease forwards",
      }}
    >
      <style>{`
        @keyframes psvFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes psvSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes psvPulseHint {
          0%, 100% { opacity: 0.80; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Loading spinner */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(4,13,33,0.96)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "3px solid rgba(30,144,255,0.15)",
              borderTop: "3px solid #1E90FF",
              animation: "psvSpin 0.9s linear infinite",
              marginBottom: 16,
            }}
          />
          <p
            style={{
              color: "rgba(120,195,255,0.65)",
              fontSize: 13,
              letterSpacing: "0.06em",
            }}
          >
            Loading 360° panorama…
          </p>
        </div>
      )}

      {/* Location header — top-left */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 64,
          padding: "14px 20px",
          background:
            "linear-gradient(to bottom, rgba(4,13,33,0.90) 0%, transparent 100%)",
          backdropFilter: "blur(12px)",
          zIndex: 10002,
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1E90FF, #00C8FF)",
            borderRadius: 999,
            padding: "2px 9px",
            fontSize: 10,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.08em",
            flexShrink: 0,
          }}
        >
          360°
        </div>
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          }}
        >
          {title}
        </span>
        {location && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "rgba(125,211,252,0.85)",
              fontSize: 13,
            }}
          >
            <MapPin style={{ width: 12, height: 12 }} />
            {location}
          </span>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 10,
          right: 12,
          width: 48,
          height: 48,
          background: "rgba(5,15,50,0.80)",
          border: "1px solid rgba(120,195,255,0.28)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10003,
          boxShadow: "0 0 20px rgba(37,99,235,0.25)",
          transition: "transform 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <X style={{ width: 20, height: 20, color: "#fff" }} />
      </button>

      {/* Drag-hint tooltip */}
      {showHint && loaded && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(4,13,33,0.82)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(120,195,255,0.22)",
            borderRadius: 999,
            padding: "8px 18px",
            color: "rgba(190,230,255,0.90)",
            fontSize: 13,
            fontWeight: 500,
            zIndex: 10003,
            whiteSpace: "nowrap",
            animation: "psvPulseHint 1.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          {isMobile
            ? "Drag to explore · Pinch to zoom"
            : "Click and drag to look around"}
        </div>
      )}

      {/* Panorama viewer (fills entire screen) */}
      <PanoramaViewer
        panoramaUrl={panoramaUrl}
        onReady={() => setLoaded(true)}
      />
    </div>
  );

  return ReactDOM.createPortal(overlay, document.body);
}

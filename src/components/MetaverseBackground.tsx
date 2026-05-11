import { useEffect, useRef, useState, useCallback } from "react";

interface MetaverseBackgroundProps {
  paused?: boolean;
}

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

/* ── CSS-only fallback (no WebGL) ──────────────────────────────────── */
function CSSParallaxBackground({ paused }: { paused: boolean }) {
  const bgRef      = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const pausedRef  = useRef(paused);
  const currentX   = useRef(0);
  const currentY   = useRef(0);
  const targetX    = useRef(0);
  const targetY    = useRef(0);
  const ticking    = useRef(false);
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdle     = useRef(true);
  const driftAngle = useRef(0);

  const reducedMotion = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);
    if (pausedRef.current || reducedMotion || !bgRef.current) return;

    if (isIdle.current) {
      driftAngle.current += 0.0006;
      targetX.current = Math.sin(driftAngle.current) * 30;
      targetY.current = Math.cos(driftAngle.current * 0.65) * 12;
    }

    currentX.current += (targetX.current - currentX.current) * 0.04;
    currentY.current += (targetY.current - currentY.current) * 0.04;

    bgRef.current.style.transform =
      `translate(${currentX.current}px, ${currentY.current}px) scale(1.18)`;
  }, [reducedMotion]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        if (window.innerWidth < 768) return;
        const nx = e.clientX / window.innerWidth  - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        targetX.current = nx * -40;
        targetY.current = ny * -18;
        isIdle.current = false;
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => { isIdle.current = true; }, 4000);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [reducedMotion]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <div
        ref={bgRef}
        style={{
          position:"absolute",
          inset:"-10%",
          backgroundImage:"url('/panoramas/background.jpg')",
          backgroundSize:"cover",
          backgroundPosition:"center",
          filter: reducedMotion ? "blur(6px) brightness(0.40)" : "brightness(0.45) saturate(1.2)",
          willChange:"transform",
          transform:"scale(1.18)",
        }}
      />
    </div>
  );
}

/* ── PSV-powered background (WebGL 2 required) ─────────────────────── */
function PSVBackground({ paused }: { paused: boolean }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const viewerRef     = useRef<any>(null);
  const rafRef        = useRef<number>(0);
  const pausedRef     = useRef(paused);
  const currentYaw    = useRef(0);
  const currentPitch  = useRef(0);
  const targetYaw     = useRef(0);
  const targetPitch   = useRef(0);
  const idleTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdle        = useRef(true);
  const ticking       = useRef(false);
  const isMobile      = useRef(window.innerWidth < 768);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const animate = useCallback(() => {
    rafRef.current = requestAnimationFrame(animate);
    if (pausedRef.current || !viewerRef.current || reducedMotion) return;
    if (isIdle.current) targetYaw.current += 0.0003;
    currentYaw.current   += (targetYaw.current   - currentYaw.current)   * 0.04;
    currentPitch.current += (targetPitch.current - currentPitch.current) * 0.04;
    try { viewerRef.current.rotate({ yaw: currentYaw.current, pitch: currentPitch.current }); } catch {}
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    let viewer: any = null;
    const initDelay = setTimeout(async () => {
      if (!containerRef.current) return;
      try {
        const { Viewer } = await import("@photo-sphere-viewer/core");
        viewer = new Viewer({
          container: containerRef.current,
          panorama: "/panoramas/background.jpg",
          defaultYaw: 0,
          defaultPitch: 0,
          defaultZoomLvl: 0,
          minFov: 75,
          maxFov: 75,
          fisheye: false,
          navbar: false,
          loadingTxt: "",
          touchmoveTwoFingers: false,
          mousemove: false,
          mousewheel: false,
          keyboard: { onlyWhenFocused: true },
          moveSpeed: 0,
        } as any);

        viewerRef.current = viewer;

        viewer.addEventListener("ready", () => {
          const r = (viewer as any).renderer?.renderer;
          if (r) r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

          if (containerRef.current) {
            const s = document.createElement("style");
            s.textContent = `
              .psv-loader, .psv-navbar, .psv-tooltip,
              .psv-panel, .psv-notification, .psv-overlay,
              .psv-progress-bar, .psv-loader-text { display: none !important; }
              .psv-container { background: transparent !important; }
            `;
            containerRef.current.appendChild(s);
          }
        });

        rafRef.current = requestAnimationFrame(animate);
      } catch (err) {
        console.warn("[MetaverseBackground] PSV init failed:", err);
      }
    }, 200);

    return () => {
      clearTimeout(initDelay);
      cancelAnimationFrame(rafRef.current);
      if (viewer) { try { viewer.destroy(); } catch {} }
      viewerRef.current = null;
    };
  }, [animate, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        isMobile.current = window.innerWidth < 768;
        if (isMobile.current) return;
        const nx = e.clientX / window.innerWidth  - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        targetYaw.current   = nx * 0.8;
        targetPitch.current = ny * -0.3;
        isIdle.current = false;
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => { isIdle.current = true; }, 4000);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!isMobile.current || reducedMotion) return;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      targetYaw.current   = ((e.gamma ?? 0) / 90) * 0.8;
      targetPitch.current = (((e.beta  ?? 0) - 45) / 90) * -0.3;
    };
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"url('/panoramas/background.jpg')",
        backgroundSize:"cover", backgroundPosition:"center",
        filter:"blur(8px) brightness(0.5)",
      }}/>
    );
  }

  return (
    <div ref={containerRef}
      style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}
    />
  );
}

/* ── Public component — auto-selects implementation ────────────────── */
export default function MetaverseBackground({ paused = false }: MetaverseBackgroundProps) {
  const [useWebGL] = useState(() => typeof window !== "undefined" && hasWebGL2());

  if (!useWebGL) {
    return <CSSParallaxBackground paused={paused} />;
  }
  return <PSVBackground paused={paused} />;
}

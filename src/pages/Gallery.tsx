import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  MapPin, X, ChevronLeft, ChevronRight, Upload, Search,
  Home, ChevronRight as CRight, Heart, Share2, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── types ──────────────────────────────────────────────────────────── */
interface GalleryItem {
  id: number; type: string; url: string; title: string;
  location?: string; photographer?: string; tags?: string[];
  category?: string; likes?: number; description?: string;
  aspect?: "portrait" | "landscape";
}

/* ─── static data ────────────────────────────────────────────────────── */
const STATIC_GALLERY: GalleryItem[] = [
  { id:1, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=90",
    title:"High Atlas Mountains", location:"Imlil, Morocco",
    photographer:"Sarah M.", tags:["mountain","landscape"], category:"mountain", likes:128,
    description:"Breathtaking peaks rising above the clouds over the High Atlas range." },
  { id:2, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=90",
    title:"Sahara Desert", location:"Merzouga, Morocco",
    photographer:"Ahmed K.", tags:["desert","sahara"], category:"desert", likes:95,
    description:"Golden hour illuminating the endless dunes of the Sahara." },
  { id:3, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1548696056-01a4a7b4e9e7?w=800&q=90",
    title:"Blue Streets", location:"Chefchaouen, Morocco",
    photographer:"Layla S.", tags:["city","blue"], category:"cultural", likes:210,
    description:"The iconic blue-washed alleyways of Morocco's mountain city." },
  { id:4, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1553603229-5b0e7b6a3b3e?w=800&q=90",
    title:"Aït Ben Haddou", location:"Ouarzazate, Morocco",
    photographer:"Omar L.", tags:["ksar","history"], category:"cultural", likes:74,
    description:"Ancient fortified village glowing at the edge of the desert." },
  { id:5, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=90",
    title:"Desert Sunset", location:"Erg Chebbi, Morocco",
    photographer:"Youssef A.", tags:["desert","sunset"], category:"desert", likes:61,
    description:"A camel caravan silhouetted against the burning horizon." },
  { id:6, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1585016495481-91613a0a5c8f?w=800&q=90",
    title:"Local Culture", location:"Marrakech, Morocco",
    photographer:"Fatima R.", tags:["culture","people"], category:"cultural", likes:43,
    description:"Vibrant colours and traditions alive in the ancient medina." },
  { id:7, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1500463959177-e0869687b1f7?w=800&q=90",
    title:"Todra Gorge", location:"Tinghir, Morocco",
    photographer:"Hassan M.", tags:["gorge","adventure"], category:"adventure", likes:88,
    description:"Towering limestone walls carving through the heart of the Atlas." },
  { id:8, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1552665945-afd7c01898f9?w=800&q=90",
    title:"Fes Medina", location:"Fès, Morocco",
    photographer:"Nadia H.", tags:["architecture","medina"], category:"cultural", likes:56,
    description:"Labyrinthine streets of the world's largest living medieval city." },
];

/* ─── slot positions (% of scene width / height) ────────────────────── */
const SLOTS = [
  { tx:  0,  ty:  0,  tz:    0, ry:   0, rx:  0, scale:1.22, blur:false, zi:20 }, // center
  { tx:-36,  ty:-13, tz: -140, ry:  24, rx: -5, scale:0.77, blur:false, zi:13 }, // top-left
  { tx:-46,  ty: 21, tz: -200, ry:  30, rx:  7, scale:0.68, blur:false, zi:12 }, // bot-left
  { tx: 36,  ty:-15, tz: -120, ry: -20, rx: -5, scale:0.81, blur:false, zi:13 }, // top-right
  { tx: 46,  ty: 21, tz: -180, ry: -28, rx:  7, scale:0.70, blur:false, zi:12 }, // bot-right
  { tx:-70,  ty:  2, tz: -310, ry:  44, rx:  0, scale:0.44, blur:true,  zi: 2 }, // far-left
  { tx: 70,  ty:  4, tz: -290, ry: -44, rx:  0, scale:0.41, blur:true,  zi: 2 }, // far-right
];
const SCENE_H = 680;
const PERSP   = 1100;

const CATEGORIES = [
  { id:"all", label:"All" }, { id:"mountain", label:"Mountains" },
  { id:"desert", label:"Desert" }, { id:"cultural", label:"Culture" },
  { id:"adventure", label:"Adventure" },
];

function cardDims(slot: typeof SLOTS[0], aspect?: "portrait"|"landscape") {
  const center = slot.tx === 0 && slot.ty === 0;
  const w = center ? 300 : slot.blur ? 168 : 238;
  const h = center
    ? (aspect === "landscape" ? 265 : 385)
    : slot.blur
      ? (aspect === "landscape" ? 195 : 245)
      : (aspect === "landscape" ? 222 : 308);
  return { w, h };
}

/* ─── CSS keyframes injected once ───────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes twinkle    { 0%,100%{opacity:.18} 50%{opacity:.85} }
  @keyframes twinkBright{ 0%,100%{opacity:.4;filter:blur(.5px)} 50%{opacity:1;filter:blur(0)} }
  @keyframes dashScroll { to { stroke-dashoffset:-24 } }
  @keyframes pulseRing  { 0%,100%{opacity:.06} 50%{opacity:.14} }
`;

/* ─── stable random seeds ────────────────────────────────────────────── */
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ─── star field ─────────────────────────────────────────────────────── */
function StarField() {
  const stars = useMemo(() => Array.from({ length:160 }, (_, i) => ({
    id: i,
    x: seededRand(i * 3.1) * 100,
    y: seededRand(i * 7.7) * 100,
    size: seededRand(i * 2.3) < 0.65 ? seededRand(i * 5.1) * 1.1 + 0.3 : seededRand(i * 9.9) * 2.6 + 1,
    bright: seededRand(i * 4.4) > 0.88,
    twinkle: seededRand(i * 6.6) > 0.55,
    dur: seededRand(i * 8.2) * 4 + 3,
    delay: seededRand(i * 1.9) * 7,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:1 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:s.size, height:s.size, borderRadius:"50%",
          background: s.bright
            ? "radial-gradient(circle, #d6eeff 0%, rgba(120,195,255,0.55) 60%, transparent 100%)"
            : "rgba(190,218,255,0.62)",
          boxShadow: s.bright ? `0 0 ${s.size*3.5}px rgba(120,195,255,0.55)` : "none",
          animation: s.twinkle
            ? `${s.bright ? "twinkBright" : "twinkle"} ${s.dur}s ${s.delay}s infinite ease-in-out`
            : "none",
        }} />
      ))}
    </div>
  );
}

/* ─── nebula drift blobs ─────────────────────────────────────────────── */
function NebulaBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:2 }}>
      {[
        { left:"-8%",  top:"15%",  w:"52%", h:"65%", bg:"radial-gradient(circle, rgba(29,78,216,0.065) 0%, rgba(0,40,140,0.03) 45%, transparent 70%)", ax:[-22,18,-22], ay:[-10,14,-10], dur:32 },
        { left:"55%",  top:"20%",  w:"48%", h:"60%", bg:"radial-gradient(circle, rgba(0,100,220,0.055) 0%, rgba(0,40,180,0.025) 50%, transparent 70%)", ax:[18,-12,18], ay:[12,-18,12], dur:38 },
        { left:"25%",  top:"-18%", w:"50%", h:"65%", bg:"radial-gradient(circle, rgba(96,140,255,0.04) 0%, transparent 70%)", ax:[0,0,0], ay:[0,0,0], dur:28, scl:[1,1.08,1] },
      ].map((b, i) => (
        <motion.div key={i}
          style={{
            position:"absolute", left:b.left, top:b.top, width:b.w, height:b.h,
            background:b.bg, filter:"blur(35px)",
          }}
          animate={{ x:b.ax, y:b.ay, scale:(b as any).scl ?? [1,1,1] }}
          transition={{ duration:b.dur, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── ambient particles ──────────────────────────────────────────────── */
const DUST = Array.from({ length:60 }, (_, i) => ({
  id:i, x:seededRand(i*3.3)*100, y:seededRand(i*5.5)*100,
  size: seededRand(i*7.7)*2.6+0.5,
  delay:seededRand(i*2.1)*5, dur:seededRand(i*4.4)*3.5+2.5,
  op:seededRand(i*6.6)*0.4+0.08,
}));

function AmbientDust() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex:3 }}>
      {DUST.map(d => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{
            left:`${d.x}%`, top:`${d.y}%`, width:d.size, height:d.size,
            background: d.size > 2
              ? "radial-gradient(circle, rgba(100,170,255,0.8), rgba(37,99,235,0.4))"
              : "rgba(170,210,255,0.7)",
          }}
          animate={{ opacity:[d.op, d.op*2.8, d.op], y:[0,-16,0] }}
          transition={{ duration:d.dur, delay:d.delay, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── SVG: orbital rings + connecting lines ──────────────────────────── */
function OrbitalSVG({ sceneW, slotAssignments }: {
  sceneW: number;
  slotAssignments: Array<{ slot: typeof SLOTS[0]; slotIdx: number }>;
}) {
  const cx = sceneW / 2;
  const cy = SCENE_H / 2;

  const endpoints = slotAssignments
    .filter(a => a.slotIdx > 0)
    .map(({ slot }) => {
      const f = PERSP / (PERSP - slot.tz);
      return {
        x: cx + (slot.tx / 100) * sceneW * 0.74 * f,
        y: cy + (slot.ty / 100) * SCENE_H * 0.74 * f,
        blur: slot.blur,
      };
    });

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={sceneW} height={SCENE_H}
      style={{ zIndex:16, overflow:"visible" }}
    >
      <defs>
        <filter id="svg-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="line-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="centerHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(37,99,235,0.22)"/>
          <stop offset="100%" stopColor="rgba(37,99,235,0)"/>
        </radialGradient>
      </defs>

      {/* center halo pulse */}
      <ellipse cx={cx} cy={cy} rx={80} ry={48}
        fill="url(#centerHalo)" style={{ animation:"pulseRing 4s infinite ease-in-out" }}/>

      {/* orbital rings */}
      <ellipse cx={cx} cy={cy} rx={sceneW*0.36} ry={SCENE_H*0.195}
        fill="none" stroke="rgba(37,99,235,0.07)" strokeWidth="1"
        strokeDasharray="6 14"
        style={{ animation:"dashScroll 18s linear infinite" }}/>
      <ellipse cx={cx} cy={cy} rx={sceneW*0.495} ry={SCENE_H*0.265}
        fill="none" stroke="rgba(0,120,255,0.042)" strokeWidth="1"
        strokeDasharray="4 18"
        style={{ animation:"dashScroll 26s linear infinite reverse" }}/>
      <ellipse cx={cx} cy={cy} rx={sceneW*0.25} ry={SCENE_H*0.135}
        fill="none" stroke="rgba(100,180,255,0.06)" strokeWidth="0.5"/>

      {/* connecting lines from center to each card */}
      {endpoints.map((ep, i) => (
        <g key={i} filter="url(#line-glow)">
          <line
            x1={cx} y1={cy} x2={ep.x} y2={ep.y}
            stroke={ep.blur ? "rgba(37,99,235,0.06)" : "rgba(60,150,255,0.18)"}
            strokeWidth={ep.blur ? 0.5 : 0.8}
            strokeDasharray="3 9"
            style={{ animation:`dashScroll ${12+i*3}s linear infinite` }}
          />
          <circle cx={ep.x} cy={ep.y} r={ep.blur ? 2 : 3.5}
            fill={ep.blur ? "rgba(60,150,255,0.15)" : "rgba(100,180,255,0.35)"}
            filter="url(#svg-glow)"/>
        </g>
      ))}

      {/* center node */}
      <circle cx={cx} cy={cy} r={5} fill="rgba(100,190,255,0.45)" filter="url(#svg-glow)"/>
      <circle cx={cx} cy={cy} r={12} fill="none" stroke="rgba(100,190,255,0.18)" strokeWidth="1"/>
    </svg>
  );
}

/* ─── volumetric center bloom ────────────────────────────────────────── */
function VolumetricBloom() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex:4 }}>
      {/* wide atmospheric bloom */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        transform:"translate(-50%,-50%)",
        width:"70%", height:"80%",
        background:"radial-gradient(ellipse, rgba(29,78,216,0.10) 0%, rgba(15,40,120,0.04) 45%, transparent 70%)",
        filter:"blur(20px)",
      }}/>
      {/* tight center glow */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        transform:"translate(-50%,-50%)",
        width:"28%", height:"35%",
        background:"radial-gradient(ellipse, rgba(59,130,246,0.16) 0%, rgba(37,99,235,0.06) 60%, transparent 100%)",
        filter:"blur(12px)",
      }}/>
    </div>
  );
}

/* ─── edge vignette / fog ────────────────────────────────────────────── */
function FogVignette() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex:30 }}>
      {/* left / right fog */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(4,13,33,0.55) 75%, rgba(4,13,33,0.85) 100%)",
      }}/>
      {/* bottom fade-in to page bg */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:120,
        background:"linear-gradient(to top, #040d21 0%, transparent 100%)",
      }}/>
      {/* top fade */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:80,
        background:"linear-gradient(to bottom, #040d21 0%, transparent 100%)",
      }}/>
    </div>
  );
}

/* ─── premium glass card ─────────────────────────────────────────────── */
interface CardProps {
  item: GalleryItem; slot: typeof SLOTS[0];
  sceneW: number; isCenter: boolean; isFlying: boolean;
  onClick: () => void;
}

function GlassCard({ item, slot, sceneW, isCenter, isFlying, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const { w, h } = cardDims(slot, item.aspect);

  const px = (slot.tx / 100) * sceneW;
  const py = (slot.ty / 100) * SCENE_H;

  /* ── layered bloom shadow ── */
  const shadow = isCenter
    ? [
        "inset 0 1px 0 rgba(255,255,255,0.13)",
        "inset 0 -1px 0 rgba(37,99,235,0.22)",
        "0 0 0 1px rgba(110,195,255,0.22)",
        "0 0 25px rgba(37,99,235,0.60)",
        "0 0 65px rgba(37,99,235,0.28)",
        "0 0 130px rgba(37,99,235,0.14)",
        "0 0 220px rgba(37,99,235,0.06)",
        "0 45px 110px rgba(0,0,0,0.80)",
      ].join(", ")
    : hovered
      ? [
          "inset 0 1px 0 rgba(255,255,255,0.1)",
          "0 0 0 1px rgba(110,195,255,0.28)",
          "0 0 22px rgba(37,99,235,0.52)",
          "0 0 55px rgba(37,99,235,0.24)",
          "0 0 100px rgba(37,99,235,0.10)",
          "0 25px 70px rgba(0,0,0,0.70)",
        ].join(", ")
      : slot.blur
        ? "0 0 10px rgba(37,99,235,0.10), 0 10px 30px rgba(0,0,0,0.50)"
        : [
            "inset 0 1px 0 rgba(255,255,255,0.07)",
            "0 0 0 1px rgba(80,140,255,0.14)",
            "0 0 14px rgba(37,99,235,0.18)",
            "0 12px 40px rgba(0,0,0,0.58)",
          ].join(", ");

  const borderCol = isCenter
    ? "rgba(120,200,255,0.40)"
    : hovered ? "rgba(120,200,255,0.48)" : "rgba(80,140,255,0.16)";

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left:"50%", top:"50%", marginLeft:-w/2, marginTop:-h/2,
        zIndex:slot.zi, transformStyle:"preserve-3d",
      }}
      animate={{
        x:px, y:py, z:slot.tz,
        rotateY:slot.ry, rotateX:slot.rx, scale:slot.scale,
        opacity: slot.blur ? 0.55 : 1,
        filter: slot.blur ? "blur(3px) brightness(0.6)" : "blur(0px) brightness(1)",
      }}
      transition={{
        type:"spring",
        stiffness: isFlying ? 155 : 195,
        damping:   isFlying ? 19  : 25,
        mass:      isFlying ? 1.4 : 1,
        opacity:  { duration:0.4 },
        filter:   { duration:0.5 },
      }}
      whileHover={!slot.blur ? {
        scale: slot.scale * (isCenter ? 1.04 : 1.08),
        z: slot.tz + 60,
        transition:{ duration:0.32, ease:"easeOut" },
      } : undefined}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* idle float */}
      <motion.div
        style={{ width:w, height:h }}
        animate={{ y: isCenter ? [0,-10,0] : slot.tx < 0 ? [0,-6,3,0] : [0,4,-6,0] }}
        transition={{
          duration: isCenter ? 4.0 : 4.5 + Math.abs(slot.tx)*0.03,
          repeat:Infinity, ease:"easeInOut",
          delay: Math.abs(slot.tx)*0.028,
        }}
      >
        {/* ── card shell ── */}
        <div style={{
          position:"relative", width:w, height:h, borderRadius:18, overflow:"visible",
          boxShadow: shadow,
          border:`1px solid ${borderCol}`,
          transition:"box-shadow 0.4s ease, border-color 0.4s ease",
        }}>
          {/* inner clip */}
          <div style={{ position:"absolute", inset:0, borderRadius:17, overflow:"hidden" }}>

            {/* image */}
            <img src={item.url} alt={item.title} style={{
              position:"absolute", inset:0, width:"100%", height:"100%",
              objectFit:"cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition:"transform 0.6s ease",
              filter:"brightness(0.82) saturate(1.18) contrast(1.06)",
            }}
            onError={e => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/${w}x${h}/0a1f5c/4a9eff?text=${encodeURIComponent(item.title)}`;
            }}
            />

            {/* dark glass base */}
            <div style={{
              position:"absolute", inset:0,
              background:"rgba(6,15,45,0.20)",
            }}/>

            {/* diagonal reflection sheen */}
            <div style={{
              position:"absolute", inset:0,
              background:"linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 30%, transparent 55%)",
            }}/>

            {/* top rim light */}
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:isCenter ? 60 : 40,
              background:"linear-gradient(to bottom, rgba(120,200,255,0.13) 0%, transparent 100%)",
            }}/>

            {/* bottom rim glow */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0, height:isCenter ? 70 : 50,
              background:"linear-gradient(to top, rgba(37,99,235,0.22) 0%, transparent 100%)",
            }}/>

            {/* scan lines holographic */}
            <div style={{
              position:"absolute", inset:0,
              background:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,170,255,0.014) 3px, rgba(100,170,255,0.014) 4px)",
              mixBlendMode:"overlay",
            }}/>

            {/* hover inner bloom */}
            {hovered && (
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{
                  position:"absolute", inset:0,
                  background:"radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.28) 0%, transparent 65%)",
                }}
              />
            )}

            {/* caption */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              padding: isCenter ? "14px 16px" : "9px 11px",
              background:"linear-gradient(to top, rgba(4,12,40,0.95) 0%, rgba(4,12,40,0.60) 60%, transparent 100%)",
              backdropFilter:"blur(6px)",
            }}>
              <p style={{
                fontWeight:700, color:"#f0f8ff", lineHeight:1.2,
                fontSize: isCenter ? 15 : slot.blur ? 10 : 12,
                textShadow:"0 1px 8px rgba(0,0,0,0.8)",
              }}>{item.title}</p>
              {item.location && (
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}>
                  <MapPin style={{ width:isCenter?11:9, height:isCenter?11:9, color:"#7dd3fc", flexShrink:0 }}/>
                  <span style={{ fontSize:isCenter?10:8.5, color:"rgba(125,211,252,0.80)", letterSpacing:"0.02em" }}>
                    {item.location}
                  </span>
                </div>
              )}
            </div>

            {/* FEATURED badge */}
            {isCenter && (
              <motion.div
                animate={{ opacity:[0.85,1,0.85] }}
                transition={{ duration:2.5, repeat:Infinity }}
                style={{
                  position:"absolute", top:12, right:12,
                  background:"rgba(29,78,216,0.75)",
                  backdropFilter:"blur(10px)",
                  borderRadius:20, padding:"4px 11px",
                  border:"1px solid rgba(120,195,255,0.40)",
                  fontSize:9, fontWeight:700, color:"#dbeafe",
                  letterSpacing:"0.08em",
                  boxShadow:"0 0 12px rgba(37,99,235,0.45)",
                }}>
                FEATURED
              </motion.div>
            )}

            {/* hover ring pulse on side cards */}
            {!isCenter && !slot.blur && hovered && (
              <motion.div
                style={{ position:"absolute", inset:0, borderRadius:17, pointerEvents:"none" }}
                animate={{ boxShadow:[
                  "inset 0 0 0 1.5px rgba(120,200,255,0.0)",
                  "inset 0 0 0 1.5px rgba(120,200,255,0.55)",
                  "inset 0 0 0 1.5px rgba(120,200,255,0.0)",
                ]}}
                transition={{ duration:1.4, repeat:Infinity }}
              />
            )}
          </div>

          {/* floor reflection — center card only */}
          {isCenter && (
            <div style={{
              position:"absolute", top:"100%", left:4, right:4, height:h*0.38,
              overflow:"hidden", borderRadius:"0 0 12px 12px", pointerEvents:"none",
            }}>
              <img src={item.url} alt="" style={{
                width:"100%", height:"100%", objectFit:"cover",
                transform:"scaleY(-1)",
                filter:"blur(4px) brightness(0.35) saturate(0.7)",
                maskImage:"linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
                WebkitMaskImage:"linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
              }}
              onError={e => { (e.target as HTMLImageElement).style.display="none"; }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── fullscreen modal ───────────────────────────────────────────────── */
function FullscreenModal({ item, onClose, onPrev, onNext }: {
  item: GalleryItem|null; onClose:()=>void; onPrev:()=>void; onNext:()=>void;
}) {
  useEffect(() => {
    const h = (e:KeyboardEvent) => {
      if (e.key==="Escape") onClose();
      if (e.key==="ArrowLeft") onPrev();
      if (e.key==="ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.38 }} onClick={onClose}
        >
          {/* blurred backdrop */}
          <div className="absolute inset-0"
            style={{ background:"rgba(2,7,22,0.94)", backdropFilter:"blur(24px)" }}/>

          {/* floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({length:22},(_,i) => (
              <motion.div key={i} className="absolute rounded-full"
                style={{
                  left:`${seededRand(i*3.3)*100}%`,
                  top:`${seededRand(i*7.7)*100}%`,
                  width:seededRand(i*5.5)*3+1,
                  height:seededRand(i*5.5)*3+1,
                  background:"rgba(120,200,255,0.35)",
                }}
                animate={{ opacity:[0.12,0.65,0.12], y:[0,-22,0] }}
                transition={{ duration:seededRand(i*2.2)*3+2.5, repeat:Infinity, delay:seededRand(i*4.4)*3 }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 flex items-center gap-5 px-4 max-w-4xl w-full"
            initial={{ scale:0.80, y:40, opacity:0 }}
            animate={{ scale:1, y:0, opacity:1 }}
            exit={{ scale:0.88, y:22, opacity:0 }}
            transition={{ duration:0.52, ease:[0.16,1,0.3,1] }}
            onClick={e => e.stopPropagation()}
          >
            {[{icon:ChevronLeft, fn:onPrev},{icon:ChevronRight, fn:onNext}].map(({ icon:Icon, fn }, side) => (
              <button key={side} onClick={fn}
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background:"rgba(12,36,90,0.70)", backdropFilter:"blur(12px)",
                  border:"1px solid rgba(120,195,255,0.28)",
                  boxShadow:"0 0 20px rgba(37,99,235,0.20)",
                  order: side === 1 ? 3 : 1,
                }}>
                <Icon className="w-5 h-5 text-white"/>
              </button>
            ))}

            <div className="flex-1 rounded-2xl overflow-hidden" style={{
              order:2,
              background:"rgba(5,15,50,0.75)",
              border:"1px solid rgba(120,195,255,0.22)",
              boxShadow:"0 0 90px rgba(37,99,235,0.30), 0 50px 110px rgba(0,0,0,0.75)",
              backdropFilter:"blur(20px)",
            }}>
              <div className="relative" style={{ maxHeight:"58vh" }}>
                <img src={item.url} alt={item.title}
                  className="w-full object-cover" style={{ maxHeight:"58vh",
                    filter:"brightness(0.92) saturate(1.1)" }}
                  onError={e => { (e.target as HTMLImageElement).src =
                    `https://placehold.co/800x540/0a1f5c/4a9eff?text=${encodeURIComponent(item.title)}`; }}
                />
                {/* scan line overlay */}
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none",
                  background:"repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,170,255,0.01) 3px, rgba(100,170,255,0.01) 4px)",
                }}/>
                <button onClick={onClose}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background:"rgba(5,15,50,0.85)",
                    border:"1px solid rgba(120,195,255,0.30)",
                    boxShadow:"0 0 14px rgba(37,99,235,0.30)",
                  }}>
                  <X className="w-4 h-4 text-white"/>
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1.5"
                      style={{ textShadow:"0 0 20px rgba(59,130,246,0.4)" }}>
                      {item.title}
                    </h2>
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-sky-300 text-sm mb-2">
                        <MapPin className="w-3.5 h-3.5"/>{item.location}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-white/55 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {[Heart, Share2, Download].map((Icon, i) => (
                      <button key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{
                          border:"1px solid rgba(120,195,255,0.20)",
                          background:"rgba(29,78,216,0.18)",
                        }}>
                        <Icon className="w-4 h-4 text-sky-300"/>
                      </button>
                    ))}
                  </div>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-0.5 rounded-full text-sky-200/75"
                        style={{ background:"rgba(37,99,235,0.16)", border:"1px solid rgba(37,99,235,0.28)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── main gallery page ──────────────────────────────────────────────── */
export default function Gallery() {
  const [category,     setCategory]     = useState("all");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState<GalleryItem|null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [scrollY,      setScrollY]      = useState(0);
  const [centerIdx,    setCenterIdx]    = useState(0);
  const [flyingFrom,   setFlyingFrom]   = useState<number|null>(null);
  const [sceneW,       setSceneW]       = useState(1200);
  const [mouseIdle,    setMouseIdle]    = useState(true);

  const sceneRef    = useRef<HTMLDivElement>(null);
  const isDragging  = useRef(false);
  const lastMouse   = useRef({ x:0, y:0 });
  const idleTimer   = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* spring scene rotation */
  const rotX  = useMotionValue(0);
  const rotY  = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness:50, damping:16 });
  const sRotY = useSpring(rotY, { stiffness:50, damping:16 });

  /* idle drift — slow sinusoidal oscillation when no mouse activity */
  useEffect(() => {
    if (!mouseIdle) return;
    let raf: number;
    let t = 0;
    const drift = () => {
      t += 0.006;
      rotY.set(Math.sin(t) * 7);
      rotX.set(Math.cos(t * 0.65) * 3.5);
      raf = requestAnimationFrame(drift);
    };
    raf = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(raf);
  }, [mouseIdle, rotX, rotY]);

  /* measure scene width */
  useEffect(() => {
    const upd = () => setSceneW(sceneRef.current?.clientWidth ?? 1200);
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  /* fetch real media */
  useEffect(() => {
    fetch("/api/admin/media", { credentials:"include" })
      .then(r => r.ok ? r.json() : null)
      .then((data:unknown) => {
        if (!data) return;
        const raw = data as Record<string, unknown>;
        const items = Array.isArray(data) ? data : (Array.isArray(raw["data"]) ? raw["data"] : []) as Record<string, unknown>[];
        if (items.length >= 3) {
          setGalleryItems(items.map((it, i) => ({
            id:          (it["id"] as number) ?? i,
            type:        String(it["fileType"] ?? "").startsWith("video") ? "video" : "photo",
            url:         String(it["fileUrl"] ?? it["url"] ?? STATIC_GALLERY[i % STATIC_GALLERY.length].url),
            title:       String(it["altText"] || it["fileName"] || STATIC_GALLERY[i % STATIC_GALLERY.length].title),
            location:    STATIC_GALLERY[i % STATIC_GALLERY.length].location,
            photographer:STATIC_GALLERY[i % STATIC_GALLERY.length].photographer,
            tags:        STATIC_GALLERY[i % STATIC_GALLERY.length].tags,
            category:    STATIC_GALLERY[i % STATIC_GALLERY.length].category,
            likes:       STATIC_GALLERY[i % STATIC_GALLERY.length].likes,
            description: STATIC_GALLERY[i % STATIC_GALLERY.length].description,
            aspect:      STATIC_GALLERY[i % STATIC_GALLERY.length].aspect,
          })));
        }
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* filtered list */
  const filtered = galleryItems.filter(it => {
    const mc = category === "all" || it.category === category;
    const ms = !search ||
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      (it.location?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return mc && ms;
  });

  useEffect(() => { setCenterIdx(0); }, [category, search]);

  /* mouse / drag scene interaction */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    /* reset idle timer */
    setMouseIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setMouseIdle(true), 3500);

    if (!sceneRef.current) return;
    if (!isDragging.current) {
      const r = sceneRef.current.getBoundingClientRect();
      rotY.set(((e.clientX - r.left - r.width/2)  / r.width)  * 15);
      rotX.set(-((e.clientY - r.top  - r.height/2) / r.height) * 8);
      return;
    }
    rotY.set(rotY.get() + (e.clientX - lastMouse.current.x) * 0.21);
    rotX.set(rotX.get() - (e.clientY - lastMouse.current.y) * 0.13);
    lastMouse.current = { x:e.clientX, y:e.clientY };
  }, [rotX, rotY]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x:e.clientX, y:e.clientY };
  };
  const onMouseUp    = () => { isDragging.current = false; };
  const onMouseLeave = () => {
    isDragging.current = false;
    setMouseIdle(true);
  };

  /* carousel click */
  function handleCardClick(slotIdx: number) {
    if (slotIdx === 0) {
      setSelected(filtered[centerIdx]);
    } else {
      setFlyingFrom(slotIdx);
      setCenterIdx((centerIdx + slotIdx) % filtered.length);
      setTimeout(() => setFlyingFrom(null), 950);
    }
  }

  function goNext() {
    setFlyingFrom(1);
    setCenterIdx((centerIdx + 1) % filtered.length);
    setTimeout(() => setFlyingFrom(null), 950);
  }
  function goPrev() {
    setFlyingFrom(filtered.length - 1);
    setCenterIdx((centerIdx - 1 + filtered.length) % filtered.length);
    setTimeout(() => setFlyingFrom(null), 950);
  }

  /* item-to-slot mapping (item.id is React key — persists across re-renders) */
  const n = Math.min(SLOTS.length, filtered.length);
  const slotAssignments = Array.from({ length:n }, (_, i) => ({
    slot:    SLOTS[i],
    item:    filtered[(centerIdx + i) % filtered.length],
    slotIdx: i,
  }));

  /* modal nav */
  const closeItem = () => setSelected(null);
  const prevItem  = () => {
    if (!selected) return;
    const idx = filtered.findIndex(x => x.id === selected.id);
    setSelected(filtered[(idx - 1 + filtered.length) % filtered.length]);
  };
  const nextItem  = () => {
    if (!selected) return;
    const idx = filtered.findIndex(x => x.id === selected.id);
    setSelected(filtered[(idx + 1) % filtered.length]);
  };

  return (
    <div className="min-h-screen" style={{ background:"#040d21" }}>
      {/* inject CSS keyframes */}
      <style>{GLOBAL_CSS}</style>

      <Header/>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop:"10rem", paddingBottom:"3.5rem" }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:"url('/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png')",
            transform:`translateY(${scrollY*0.28}px)`,
            filter:"brightness(0.38) saturate(1.2)",
          }}/>
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(180deg, rgba(4,13,33,0.45) 0%, rgba(4,13,33,0.88) 100%)" }}/>
        <div className="relative container mx-auto px-6">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)" }}>
                  <Home className="w-3.5 h-3.5"/> Home
                </Link>
              </li>
              <CRight className="w-4 h-4 text-white/35"/>
              <li>
                <span className="text-white font-semibold px-3 py-1.5 rounded-full"
                  style={{ background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.20)" }}>
                  Gallery
                </span>
              </li>
            </ol>
          </nav>
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            style={{ textShadow:"0 0 70px rgba(59,130,246,0.42)" }}
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75 }}>
            Gallery
          </motion.h1>
          <motion.p className="text-lg text-white/68 max-w-xl leading-relaxed"
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.75, delay:0.15 }}>
            Explore stunning moments captured across Morocco — from mountain peaks to desert dunes.
          </motion.p>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────────────── */}
      <section className="py-7" style={{ background:"rgba(4,13,33,0.97)", borderBottom:"1px solid rgba(37,99,235,0.10)" }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/50"/>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search locations, titles…"
                className="pl-10 pr-4 py-2.5 rounded-full text-sm text-white/90 placeholder-white/25 outline-none w-60"
                style={{
                  background:"rgba(10,30,80,0.55)",
                  border:"1px solid rgba(100,160,255,0.18)",
                  backdropFilter:"blur(14px)",
                }}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: category === cat.id
                      ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                      : "rgba(10,30,80,0.45)",
                    border: category === cat.id
                      ? "1px solid rgba(120,195,255,0.50)"
                      : "1px solid rgba(100,160,255,0.13)",
                    color: category === cat.id ? "#fff" : "rgba(120,195,255,0.68)",
                    boxShadow: category === cat.id
                      ? "0 0 22px rgba(37,99,235,0.35), 0 0 6px rgba(37,99,235,0.5)"
                      : "none",
                    backdropFilter:"blur(10px)",
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-sm" style={{ color:"rgba(120,195,255,0.42)" }}>{filtered.length} photos</span>
          </div>
        </div>
      </section>

      {/* ── IMMERSIVE 3-D SCENE ───────────────────────────────────── */}
      <section className="relative select-none overflow-hidden"
        style={{ background:"linear-gradient(180deg,#040d21 0%,#071739 48%,#040d21 100%)", minHeight:SCENE_H+100 }}>

        {/* layered background environment */}
        <StarField/>
        <NebulaBlobs/>
        <AmbientDust/>
        <VolumetricBloom/>

        {/* nav arrows */}
        {[{dir:"left", fn:goPrev, Icon:ChevronLeft}, {dir:"right", fn:goNext, Icon:ChevronRight}].map(({dir,fn,Icon}) => (
          <button key={dir}
            onClick={fn}
            className={`absolute ${dir}-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all group hover:scale-110`}
            style={{
              background:"rgba(10,30,80,0.60)",
              border:"1px solid rgba(100,170,255,0.22)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 0 20px rgba(37,99,235,0.18)",
            }}>
            <Icon className="w-5 h-5 text-white/65 group-hover:text-white transition-colors"/>
          </button>
        ))}

        {/* 3-D perspective container */}
        <div ref={sceneRef} className="relative w-full"
          style={{
            height:SCENE_H, perspective:`${PERSP}px`,
            perspectiveOrigin:"50% 47%",
            cursor: isDragging.current ? "grabbing" : "grab",
          }}
          onMouseMove={onMouseMove} onMouseDown={onMouseDown}
          onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
        >
          {/* SVG orbital rings + connecting lines (behind cards) */}
          <OrbitalSVG sceneW={sceneW} slotAssignments={slotAssignments}/>

          {/* rotatable scene (mouse spring + idle drift via rotX/rotY) */}
          <motion.div className="absolute inset-0"
            style={{ rotateX:sRotX, rotateY:sRotY, transformStyle:"preserve-3d" }}>
            {slotAssignments.map(({ slot, item, slotIdx }) => (
              <GlassCard
                key={item.id}
                item={item} slot={slot} sceneW={sceneW}
                isCenter={slotIdx === 0}
                isFlying={flyingFrom === slotIdx}
                onClick={() => handleCardClick(slotIdx)}
              />
            ))}
          </motion.div>
        </div>

        {/* dot progress indicators */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {filtered.slice(0, Math.min(filtered.length, 12)).map((_, i) => (
            <button key={i}
              onClick={() => { setFlyingFrom(0); setCenterIdx(i); setTimeout(()=>setFlyingFrom(null),950); }}
              className="transition-all duration-400 rounded-full"
              style={{
                width: i === centerIdx ? 22 : 6, height:6,
                background: i === centerIdx
                  ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                  : "rgba(120,190,255,0.25)",
                boxShadow: i === centerIdx ? "0 0 10px rgba(59,130,246,0.6)" : "none",
              }}
            />
          ))}
        </div>

        {/* hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 px-5 py-2 rounded-full text-xs whitespace-nowrap z-20"
          style={{
            background:"rgba(4,13,33,0.65)",
            border:"1px solid rgba(100,160,255,0.10)",
            backdropFilter:"blur(14px)",
            color:"rgba(120,195,255,0.48)",
          }}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.2 }}>
          <span className="flex items-center gap-1.5"><span style={{ color:"#60a5fa" }}>⟵⟶</span> Drag to rotate</span>
          <span className="w-px h-3" style={{ background:"rgba(100,160,255,0.18)" }}/>
          <span className="flex items-center gap-1.5"><span style={{ color:"#60a5fa" }}>↗</span> Click to fly center</span>
          <span className="w-px h-3" style={{ background:"rgba(100,160,255,0.18)" }}/>
          <span className="flex items-center gap-1.5"><span style={{ color:"#60a5fa" }}>⊙</span> Center to open</span>
        </motion.div>

        <FogVignette/>
      </section>

      {/* ── UPLOAD PORTAL ────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,#040d21 0%,#071540 50%,#040d21 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background:"radial-gradient(ellipse at 50% 50%, rgba(29,78,216,0.07) 0%, transparent 65%)",
        }}/>
        <div className="container mx-auto px-6 text-center relative">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ textShadow:"0 0 45px rgba(59,130,246,0.38)" }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            Share Your Journey With The World
          </motion.h2>
          <p style={{ color:"rgba(120,195,255,0.52)" }} className="mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Upload your Moroccan adventure photos and inspire our growing community of explorers.
          </p>
          <motion.div
            className="relative max-w-md mx-auto rounded-3xl p-10 cursor-pointer"
            style={{
              background:"rgba(10,30,80,0.30)",
              border:"1.5px dashed rgba(100,170,255,0.22)",
              backdropFilter:"blur(18px)",
            }}
            whileHover={{
              borderColor:"rgba(100,170,255,0.50)",
              boxShadow:"0 0 70px rgba(37,99,235,0.22), 0 0 140px rgba(37,99,235,0.10)",
            }}>
            <motion.div
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full"
              style={{ background:"radial-gradient(circle,#60a5fa,#1d4ed8)",
                boxShadow:"0 0 12px rgba(96,165,250,0.7)" }}
              animate={{ scale:[1,1.6,1], opacity:[0.7,1,0.7] }}
              transition={{ duration:2.2, repeat:Infinity }}
            />
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background:"linear-gradient(135deg,rgba(29,78,216,0.35),rgba(10,30,80,0.65))",
                border:"1px solid rgba(120,195,255,0.28)",
                boxShadow:"0 0 35px rgba(37,99,235,0.22)",
              }}
              animate={{ y:[0,-8,0] }}
              transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
              <Upload className="w-8 h-8 text-sky-300"/>
            </motion.div>
            <p className="text-white font-semibold mb-1">Drop your photos here</p>
            <p className="text-sm mb-6" style={{ color:"rgba(120,195,255,0.45)" }}>
              JPG, PNG, MP4 · Max 50 MB
            </p>
            <button
              className="px-7 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
              style={{
                background:"linear-gradient(135deg,#1d4ed8,#2563eb)",
                boxShadow:"0 0 24px rgba(29,78,216,0.50), 0 0 6px rgba(37,99,235,0.7)",
                border:"1px solid rgba(120,195,255,0.30)",
              }}>
              Browse Files
            </button>
          </motion.div>
        </div>
      </section>

      <FullscreenModal item={selected} onClose={closeItem} onPrev={prevItem} onNext={nextItem}/>
      <Footer/>
    </div>
  );
}

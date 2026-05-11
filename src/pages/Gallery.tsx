import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  MapPin, X, ChevronLeft, ChevronRight, Upload, Search,
  Home, ChevronRight as CRight, Heart, Share2, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── types ─────────────────────────────────────────────────────────── */
interface GalleryItem {
  id: number; type: string; url: string; title: string;
  location?: string; photographer?: string; tags?: string[];
  category?: string; likes?: number; description?: string;
  aspect?: "portrait" | "landscape";
}

/* ─── data ───────────────────────────────────────────────────────────── */
const STATIC_GALLERY: GalleryItem[] = [
  { id:1, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80",
    title:"High Atlas Mountains", location:"Imlil, Morocco",
    photographer:"Sarah M.", tags:["mountain","landscape"], category:"mountain", likes:128,
    description:"Breathtaking peaks rising above the clouds over the High Atlas range." },
  { id:2, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80",
    title:"Sahara Desert", location:"Merzouga, Morocco",
    photographer:"Ahmed K.", tags:["desert","sahara"], category:"desert", likes:95,
    description:"Golden hour illuminating the endless dunes of the Sahara." },
  { id:3, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1548696056-01a4a7b4e9e7?w=700&q=80",
    title:"Blue Streets", location:"Chefchaouen, Morocco",
    photographer:"Layla S.", tags:["city","blue"], category:"cultural", likes:210,
    description:"The iconic blue-washed alleyways of Morocco's mountain city." },
  { id:4, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1553603229-5b0e7b6a3b3e?w=700&q=80",
    title:"Aït Ben Haddou", location:"Ouarzazate, Morocco",
    photographer:"Omar L.", tags:["ksar","history"], category:"cultural", likes:74,
    description:"Ancient fortified village glowing at the edge of the desert." },
  { id:5, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=700&q=80",
    title:"Desert Sunset", location:"Erg Chebbi, Morocco",
    photographer:"Youssef A.", tags:["desert","sunset"], category:"desert", likes:61,
    description:"A camel caravan silhouetted against the burning horizon." },
  { id:6, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1585016495481-91613a0a5c8f?w=700&q=80",
    title:"Local Culture", location:"Marrakech, Morocco",
    photographer:"Fatima R.", tags:["culture","people"], category:"cultural", likes:43,
    description:"Vibrant colours and traditions alive in the ancient medina." },
  { id:7, type:"photo", aspect:"landscape",
    url:"https://images.unsplash.com/photo-1500463959177-e0869687b1f7?w=700&q=80",
    title:"Todra Gorge", location:"Tinghir, Morocco",
    photographer:"Hassan M.", tags:["gorge","adventure"], category:"adventure", likes:88,
    description:"Towering limestone walls carving through the heart of the Atlas." },
  { id:8, type:"photo", aspect:"portrait",
    url:"https://images.unsplash.com/photo-1552665945-afd7c01898f9?w=700&q=80",
    title:"Fes Medina", location:"Fès, Morocco",
    photographer:"Nadia H.", tags:["architecture","medina"], category:"cultural", likes:56,
    description:"Labyrinthine streets of the world's largest living medieval city." },
];

/* ─── slot layout (% of scene width / height) ───────────────────────── */
const SLOTS = [
  { tx:  0,   ty:  0,  tz:    0, ry:   0, rx:  0, scale: 1.18, blur: false, zi: 20 }, // center
  { tx:-38,   ty:-12,  tz: -130, ry:  22, rx: -4, scale: 0.76, blur: false, zi: 12 }, // top-left
  { tx:-48,   ty: 20,  tz: -190, ry:  28, rx:  6, scale: 0.68, blur: false, zi: 11 }, // bottom-left
  { tx: 38,   ty:-14,  tz: -110, ry: -18, rx: -4, scale: 0.80, blur: false, zi: 12 }, // top-right
  { tx: 48,   ty: 20,  tz: -170, ry: -26, rx:  6, scale: 0.70, blur: false, zi: 11 }, // bottom-right
  { tx:-72,   ty:  2,  tz: -300, ry:  42, rx:  0, scale: 0.45, blur: true,  zi:  2 }, // far-left
  { tx: 72,   ty:  5,  tz: -280, ry: -42, rx:  0, scale: 0.42, blur: true,  zi:  2 }, // far-right
];
const SCENE_H = 640;

const CATEGORIES = [
  { id:"all", label:"All" }, { id:"mountain", label:"Mountains" },
  { id:"desert", label:"Desert" }, { id:"cultural", label:"Culture" },
  { id:"adventure", label:"Adventure" },
];

/* ─── card dimensions ───────────────────────────────────────────────── */
function cardDims(slot: typeof SLOTS[0], aspect?: "portrait"|"landscape") {
  const isCenter = slot.tx === 0 && slot.ty === 0;
  const w = isCenter ? 290 : slot.blur ? 170 : 235;
  const h = isCenter
    ? (aspect === "landscape" ? 260 : 370)
    : slot.blur
      ? (aspect === "landscape" ? 200 : 250)
      : (aspect === "landscape" ? 220 : 300);
  return { w, h };
}

/* ─── particles ─────────────────────────────────────────────────────── */
const DOTS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 2.4 + 0.5,
  delay: Math.random() * 4, dur: Math.random() * 3 + 2.2,
  op: Math.random() * 0.45 + 0.1,
}));

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {DOTS.map(d => (
        <motion.div key={d.id} className="absolute rounded-full"
          style={{
            left:`${d.x}%`, top:`${d.y}%`, width:d.size, height:d.size,
            background: d.size>2 ? "radial-gradient(circle,#4a9eff,#0055cc)" : "rgba(147,197,253,0.75)",
          }}
          animate={{ opacity:[d.op, d.op*2.4, d.op], y:[0,-13,0] }}
          transition={{ duration:d.dur, delay:d.delay, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[230px] rounded-full border border-blue-500/10 rotate-[14deg]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[290px] rounded-full border border-blue-400/6 rotate-[-7deg]" />
    </div>
  );
}

/* ─── glass card ────────────────────────────────────────────────────── */
interface CardProps {
  item: GalleryItem;
  slot: typeof SLOTS[0];
  sceneW: number;
  isCenter: boolean;
  isFlying: boolean;
  onClick: () => void;
}

function GlassCard({ item, slot, sceneW, isCenter, isFlying, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const { w, h } = cardDims(slot, item.aspect);

  /* convert % slot positions to pixels relative to scene center */
  const px = (slot.tx / 100) * sceneW;
  const py = (slot.ty / 100) * SCENE_H;

  const glowColor = isCenter
    ? "0 0 50px rgba(59,130,246,0.45), 0 0 100px rgba(37,99,235,0.2), 0 30px 80px rgba(0,0,0,0.65)"
    : hovered
      ? "0 0 35px rgba(59,130,246,0.4), 0 20px 60px rgba(0,0,0,0.6)"
      : "0 0 14px rgba(59,130,246,0.12), 0 14px 40px rgba(0,0,0,0.55)";

  return (
    <motion.div
      key={item.id}
      className="absolute cursor-pointer"
      style={{
        left: "50%", top: "50%",
        marginLeft: -w / 2, marginTop: -h / 2,
        zIndex: slot.zi,
        transformStyle: "preserve-3d",
      }}
      /* animate to the slot's computed pixel position — this is the carousel magic */
      animate={{
        x: px, y: py, z: slot.tz,
        rotateY: slot.ry, rotateX: slot.rx,
        scale: slot.scale,
        opacity: slot.blur ? 0.6 : 1,
        filter: slot.blur ? "blur(2.5px) brightness(0.65)" : "blur(0px) brightness(1)",
      }}
      transition={{
        type: "spring",
        stiffness: isFlying ? 160 : 200,
        damping: isFlying ? 20 : 26,
        mass: isFlying ? 1.3 : 1,
        opacity: { duration: 0.4 },
        filter: { duration: 0.5 },
      }}
      whileHover={!slot.blur ? {
        scale: slot.scale * (isCenter ? 1.04 : 1.08),
        z: slot.tz + 55,
        transition: { duration: 0.3, ease: "easeOut" },
      } : undefined}
      /* idle float */
      onAnimationComplete={() => {}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* idle floating */}
      <motion.div
        style={{ width: w, height: h }}
        animate={{ y: isCenter ? [0,-9,0] : slot.tx < 0 ? [0,-5,3,0] : [0,4,-5,0] }}
        transition={{
          duration: isCenter ? 3.8 : 4.2 + Math.abs(slot.tx)*0.03,
          repeat: Infinity, ease: "easeInOut",
          delay: Math.abs(slot.tx)*0.025,
        }}
      >
        <div style={{
          width: w, height: h, borderRadius: 16, overflow: "hidden", position: "relative",
          boxShadow: glowColor,
          border: isCenter
            ? "1px solid rgba(147,197,253,0.42)"
            : hovered
              ? "1px solid rgba(147,197,253,0.55)"
              : "1px solid rgba(99,157,255,0.18)",
          transition: "box-shadow 0.35s ease, border 0.35s ease",
        }}>
          <img src={item.url} alt={item.title}
            style={{
              position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
              transform: hovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.55s ease",
              filter: "brightness(0.84) saturate(1.12)",
            }}
            onError={e => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/${w}x${h}/0f2b6b/4a9eff?text=${encodeURIComponent(item.title)}`;
            }}
          />

          {/* glass sheen */}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(135deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0) 55%,rgba(0,0,0,0.22) 100%)",
          }}/>

          {/* hover glow overlay */}
          {hovered && (
            <div style={{
              position:"absolute", inset:0, pointerEvents:"none",
              background:"linear-gradient(135deg,rgba(59,130,246,0.18) 0%,transparent 55%)",
            }}/>
          )}

          {/* "click to fly" ring pulse on side cards */}
          {!isCenter && !slot.blur && (
            <motion.div
              style={{
                position:"absolute", inset:0, borderRadius:16,
                border:"2px solid rgba(147,197,253,0.0)",
                pointerEvents:"none",
              }}
              animate={hovered ? {
                border:["2px solid rgba(147,197,253,0.0)","2px solid rgba(147,197,253,0.6)","2px solid rgba(147,197,253,0.0)"],
              } : {}}
              transition={{ duration:1.2, repeat:Infinity }}
            />
          )}

          {/* caption bar */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            padding: isCenter ? "12px 14px" : "8px 10px",
            background:"linear-gradient(to top,rgba(7,23,57,0.93) 0%,rgba(7,23,57,0.55) 65%,transparent 100%)",
            backdropFilter:"blur(4px)",
          }}>
            <p style={{
              fontWeight:700, color:"#fff", lineHeight:1.25,
              fontSize: isCenter ? 15 : slot.blur ? 10 : 12,
            }}>{item.title}</p>
            {item.location && (
              <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                <MapPin style={{ width: isCenter?11:9, height: isCenter?11:9, color:"#93c5fd", flexShrink:0 }}/>
                <span style={{ fontSize: isCenter?11:9, color:"rgba(147,197,253,0.75)" }}>{item.location}</span>
              </div>
            )}
          </div>

          {/* center badge */}
          {isCenter && (
            <div style={{
              position:"absolute", top:10, right:10,
              background:"rgba(37,99,235,0.7)", backdropFilter:"blur(8px)",
              borderRadius:20, padding:"3px 10px",
              border:"1px solid rgba(147,197,253,0.35)",
              fontSize:10, fontWeight:600, color:"#e0ecff",
              letterSpacing:"0.04em",
            }}>
              FEATURED
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── fullscreen modal ───────────────────────────────────────────────── */
function FullscreenModal({ item, onClose, onPrev, onNext }: {
  item: GalleryItem | null; onClose:()=>void; onPrev:()=>void; onNext:()=>void;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
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
          transition={{ duration:0.35 }}
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{
            background:"rgba(4,12,35,0.93)", backdropFilter:"blur(22px)",
          }}/>
          {/* ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({length:18},(_,i)=>(
              <motion.div key={i} className="absolute rounded-full"
                style={{
                  left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
                  width:Math.random()*3+1, height:Math.random()*3+1,
                  background:"rgba(147,197,253,0.35)",
                }}
                animate={{ opacity:[0.15,0.7,0.15], y:[0,-18,0] }}
                transition={{ duration:Math.random()*3+2, repeat:Infinity, delay:Math.random()*2 }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 flex items-center gap-5 px-4 max-w-4xl w-full"
            initial={{ scale:0.82, y:35, opacity:0 }}
            animate={{ scale:1, y:0, opacity:1 }}
            exit={{ scale:0.9, y:20, opacity:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* prev */}
            <button onClick={onPrev}
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background:"rgba(15,43,107,0.65)", border:"1px solid rgba(147,197,253,0.28)", backdropFilter:"blur(10px)" }}>
              <ChevronLeft className="w-5 h-5 text-white"/>
            </button>

            <div className="flex-1 rounded-2xl overflow-hidden" style={{
              background:"rgba(7,23,57,0.72)", border:"1px solid rgba(147,197,253,0.22)",
              boxShadow:"0 0 80px rgba(37,99,235,0.3), 0 40px 100px rgba(0,0,0,0.7)",
              backdropFilter:"blur(18px)",
            }}>
              <div className="relative" style={{ maxHeight:"60vh" }}>
                <img src={item.url} alt={item.title}
                  className="w-full object-cover" style={{ maxHeight:"60vh" }}
                  onError={e => { (e.target as HTMLImageElement).src =
                    `https://placehold.co/800x550/0f2b6b/4a9eff?text=${encodeURIComponent(item.title)}`; }}
                />
                <button onClick={onClose}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background:"rgba(7,23,57,0.8)", border:"1px solid rgba(147,197,253,0.28)" }}>
                  <X className="w-4 h-4 text-white"/>
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{item.title}</h2>
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-blue-300 text-sm">
                        <MapPin className="w-3.5 h-3.5"/>{item.location}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-white/55 text-sm mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {[Heart, Share2, Download].map((Icon, i) => (
                      <button key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                        style={{ border:"1px solid rgba(147,197,253,0.18)" }}>
                        <Icon className="w-4 h-4 text-blue-300"/>
                      </button>
                    ))}
                  </div>
                </div>
                {item.tags && item.tags.length>0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-0.5 rounded-full text-blue-200/75"
                        style={{ background:"rgba(59,130,246,0.14)", border:"1px solid rgba(59,130,246,0.22)" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* next */}
            <button onClick={onNext}
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background:"rgba(15,43,107,0.65)", border:"1px solid rgba(147,197,253,0.28)", backdropFilter:"blur(10px)" }}>
              <ChevronRight className="w-5 h-5 text-white"/>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── main page ──────────────────────────────────────────────────────── */
export default function Gallery() {
  const [category, setCategory]         = useState("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<GalleryItem|null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [scrollY, setScrollY]           = useState(0);
  const [centerIdx, setCenterIdx]       = useState(0);   // which filtered item is at center slot
  const [flyingFrom, setFlyingFrom]     = useState<number|null>(null); // slot index being clicked
  const [sceneW, setSceneW]             = useState(1200);
  const sceneRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse  = useRef({ x:0, y:0 });

  /* spring scene rotation (passive tilt on mouse move) */
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness:55, damping:17 });
  const sRotY = useSpring(rotY, { stiffness:55, damping:17 });

  /* measure scene width */
  useEffect(() => {
    const update = () => setSceneW(sceneRef.current?.clientWidth ?? 1200);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* fetch real media */
  useEffect(() => {
    fetch("/api/admin/media", { credentials:"include" })
      .then(r => r.ok ? r.json() : null)
      .then((data:any) => {
        if (!data) return;
        const items:any[] = Array.isArray(data) ? data : (data.data ?? []);
        if (items.length >= 3) {
          setGalleryItems(items.map((it,i) => ({
            id: it.id ?? i,
            type: it.fileType?.startsWith("video") ? "video" : "photo",
            url: it.fileUrl ?? it.url ?? STATIC_GALLERY[i % STATIC_GALLERY.length].url,
            title: it.altText || it.fileName || STATIC_GALLERY[i % STATIC_GALLERY.length].title,
            location: STATIC_GALLERY[i % STATIC_GALLERY.length].location,
            photographer: STATIC_GALLERY[i % STATIC_GALLERY.length].photographer,
            tags: STATIC_GALLERY[i % STATIC_GALLERY.length].tags,
            category: STATIC_GALLERY[i % STATIC_GALLERY.length].category,
            likes: STATIC_GALLERY[i % STATIC_GALLERY.length].likes,
            description: STATIC_GALLERY[i % STATIC_GALLERY.length].description,
            aspect: STATIC_GALLERY[i % STATIC_GALLERY.length].aspect,
          })));
        }
      }).catch(()=>{});
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* filtered list */
  const filtered = galleryItems.filter(it => {
    const mc = category==="all" || it.category===category;
    const ms = !search || it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.location?.toLowerCase().includes(search.toLowerCase()) || false;
    return mc && ms;
  });

  /* reset center when filter changes */
  useEffect(() => { setCenterIdx(0); }, [category, search]);

  /* scene mouse handlers */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sceneRef.current) return;
    if (!isDragging.current) {
      const rect = sceneRef.current.getBoundingClientRect();
      rotY.set(((e.clientX - rect.left - rect.width/2) / rect.width) * 16);
      rotX.set(-((e.clientY - rect.top - rect.height/2) / rect.height) * 9);
      return;
    }
    rotY.set(rotY.get() + (e.clientX - lastMouse.current.x) * 0.22);
    rotX.set(rotX.get() - (e.clientY - lastMouse.current.y) * 0.14);
    lastMouse.current = { x:e.clientX, y:e.clientY };
  }, [rotX, rotY]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x:e.clientX, y:e.clientY };
  };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseLeave = () => {
    isDragging.current = false;
    rotX.set(0); rotY.set(0);
  };

  /* ── carousel click handler ── */
  function handleCardClick(slotIdx: number) {
    if (slotIdx === 0) {
      /* center card → open fullscreen */
      setSelected(filtered[centerIdx]);
    } else {
      /* side card → fly to center */
      setFlyingFrom(slotIdx);
      setCenterIdx((centerIdx + slotIdx) % filtered.length);
      /* clear flying state after spring settles */
      setTimeout(() => setFlyingFrom(null), 900);
    }
  }

  /* prev / next navigation */
  function goNext() {
    setFlyingFrom(1);
    setCenterIdx((centerIdx + 1) % filtered.length);
    setTimeout(() => setFlyingFrom(null), 900);
  }
  function goPrev() {
    setFlyingFrom(filtered.length - 1);
    setCenterIdx((centerIdx - 1 + filtered.length) % filtered.length);
    setTimeout(() => setFlyingFrom(null), 900);
  }

  /* map each slot to an item — item.id used as React key so DOM node persists across re-renders */
  const n = Math.min(SLOTS.length, filtered.length);
  const slotAssignments = Array.from({ length: n }, (_, i) => ({
    slot: SLOTS[i],
    item: filtered[(centerIdx + i) % filtered.length],
    slotIdx: i,
  }));

  /* modal navigation */
  const openItem  = (it: GalleryItem) => setSelected(it);
  const closeItem = () => setSelected(null);
  const prevItem  = () => {
    if (!selected) return;
    const idx = filtered.findIndex(i => i.id===selected.id);
    setSelected(filtered[(idx-1+filtered.length)%filtered.length]);
  };
  const nextItem  = () => {
    if (!selected) return;
    const idx = filtered.findIndex(i => i.id===selected.id);
    setSelected(filtered[(idx+1)%filtered.length]);
  };

  return (
    <div className="min-h-screen" style={{ background:"#071739" }}>
      <Header/>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingTop:"10rem", paddingBottom:"3.5rem" }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:"url('/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png')",
            transform:`translateY(${scrollY*0.28}px)`,
            filter:"brightness(0.44) saturate(1.3)",
          }}/>
        <div className="absolute inset-0"
          style={{ background:"linear-gradient(180deg,rgba(7,23,57,0.5) 0%,rgba(7,23,57,0.82) 100%)" }}/>
        <div className="relative container mx-auto px-6">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)" }}>
                  <Home className="w-3.5 h-3.5"/> Home
                </Link>
              </li>
              <CRight className="w-4 h-4 text-white/40"/>
              <li>
                <span className="text-white font-semibold px-3 py-1.5 rounded-full"
                  style={{ background:"rgba(255,255,255,0.11)", border:"1px solid rgba(255,255,255,0.22)" }}>
                  Gallery
                </span>
              </li>
            </ol>
          </nav>
          <motion.h1 className="text-5xl md:text-7xl font-bold text-white mb-4"
            style={{ textShadow:"0 0 60px rgba(59,130,246,0.38)" }}
            initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            Gallery
          </motion.h1>
          <motion.p className="text-lg text-white/72 max-w-xl leading-relaxed"
            initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.15 }}>
            Explore stunning moments captured across Morocco — from mountain peaks to desert dunes.
          </motion.p>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────────────────── */}
      <section className="py-7" style={{ background:"rgba(7,23,57,0.96)" }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/55"/>
              <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search locations, titles…"
                className="pl-10 pr-4 py-2.5 rounded-full text-sm text-white/90 placeholder-white/28 outline-none w-60"
                style={{ background:"rgba(15,43,107,0.5)", border:"1px solid rgba(147,197,253,0.18)", backdropFilter:"blur(12px)" }}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={()=>setCategory(cat.id)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: category===cat.id ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "rgba(15,43,107,0.4)",
                    border: category===cat.id ? "1px solid rgba(147,197,253,0.48)" : "1px solid rgba(147,197,253,0.13)",
                    color: category===cat.id ? "#fff" : "rgba(147,197,253,0.68)",
                    boxShadow: category===cat.id ? "0 0 20px rgba(59,130,246,0.28)" : "none",
                    backdropFilter:"blur(10px)",
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-blue-300/45">{filtered.length} photos</span>
          </div>
        </div>
      </section>

      {/* ── 3-D CAROUSEL SCENE ───────────────────────────────────────── */}
      <section className="relative select-none overflow-hidden"
        style={{ background:"linear-gradient(180deg,#071739 0%,#0a1f5c 48%,#071739 100%)", minHeight:SCENE_H+60 }}>
        <Particles/>

        {/* center glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,rgba(37,99,235,0.13) 0%,transparent 70%)" }}/>

        {/* ── nav arrows ── */}
        <button onClick={goPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all group"
          style={{ background:"rgba(15,43,107,0.55)", border:"1px solid rgba(147,197,253,0.22)", backdropFilter:"blur(10px)" }}>
          <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"/>
        </button>
        <button onClick={goNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all group"
          style={{ background:"rgba(15,43,107,0.55)", border:"1px solid rgba(147,197,253,0.22)", backdropFilter:"blur(10px)" }}>
          <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"/>
        </button>

        {/* ── 3-D scene ── */}
        <div ref={sceneRef} className="relative w-full"
          style={{
            height: SCENE_H,
            perspective: "1100px",
            perspectiveOrigin: "50% 48%",
            cursor: isDragging.current ? "grabbing" : "grab",
          }}
          onMouseMove={onMouseMove} onMouseDown={onMouseDown}
          onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
        >
          <motion.div className="absolute inset-0"
            style={{ rotateX:sRotX, rotateY:sRotY, transformStyle:"preserve-3d" }}>
            {/*
              KEY INSIGHT: each card's React key is item.id (NOT slotIdx).
              When centerIdx changes, items swap slots but their DOM nodes persist,
              so Framer Motion spring-animates each card from its old slot to the new one.
            */}
            {slotAssignments.map(({ slot, item, slotIdx }) => (
              <GlassCard
                key={item.id}
                item={item}
                slot={slot}
                sceneW={sceneW}
                isCenter={slotIdx===0}
                isFlying={flyingFrom===slotIdx}
                onClick={() => handleCardClick(slotIdx)}
              />
            ))}
          </motion.div>
        </div>

        {/* dot indicators */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {filtered.slice(0, Math.min(filtered.length, 12)).map((_, i) => (
            <button key={i}
              onClick={() => { setFlyingFrom(0); setCenterIdx(i); setTimeout(()=>setFlyingFrom(null),900); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i===centerIdx ? 20 : 6, height:6,
                background: i===centerIdx ? "#3b82f6" : "rgba(147,197,253,0.3)",
              }}
            />
          ))}
        </div>

        {/* hint bar */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 px-5 py-2 rounded-full text-xs whitespace-nowrap"
          style={{
            background:"rgba(7,23,57,0.62)", border:"1px solid rgba(147,197,253,0.12)",
            backdropFilter:"blur(12px)", color:"rgba(147,197,253,0.55)",
          }}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}>
          <span className="flex items-center gap-1.5"><span className="text-blue-400">⟵⟶</span> Drag to rotate</span>
          <span className="w-px h-3 bg-blue-400/20"/>
          <span className="flex items-center gap-1.5"><span className="text-blue-400">↗</span> Click card to fly</span>
          <span className="w-px h-3 bg-blue-400/20"/>
          <span className="flex items-center gap-1.5"><span className="text-blue-400">⊙</span> Center to open</span>
        </motion.div>
      </section>

      {/* ── UPLOAD PORTAL ─────────────────────────────────────────────── */}
      <section className="py-20"
        style={{ background:"linear-gradient(180deg,#071739 0%,#0a1553 50%,#071739 100%)" }}>
        <div className="container mx-auto px-6 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ textShadow:"0 0 40px rgba(59,130,246,0.32)" }}
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            Share Your Journey With The World
          </motion.h2>
          <p className="text-blue-200/55 mb-10 max-w-md mx-auto">
            Upload your Moroccan adventure photos and inspire our growing community of explorers.
          </p>
          <motion.div className="relative max-w-md mx-auto rounded-3xl p-10 cursor-pointer"
            style={{
              background:"rgba(15,43,107,0.32)", border:"2px dashed rgba(147,197,253,0.22)",
              backdropFilter:"blur(16px)",
            }}
            whileHover={{ borderColor:"rgba(147,197,253,0.52)", boxShadow:"0 0 60px rgba(59,130,246,0.22)" }}>
            <motion.div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ background:"radial-gradient(circle,#60a5fa,#2563eb)" }}
              animate={{ scale:[1,1.5,1], opacity:[0.8,1,0.8] }}
              transition={{ duration:2, repeat:Infinity }}/>
            <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background:"linear-gradient(135deg,rgba(37,99,235,0.3),rgba(15,43,107,0.6))",
                border:"1px solid rgba(147,197,253,0.28)",
                boxShadow:"0 0 30px rgba(59,130,246,0.18)",
              }}
              animate={{ y:[0,-7,0] }} transition={{ duration:2.6, repeat:Infinity, ease:"easeInOut" }}>
              <Upload className="w-8 h-8 text-blue-300"/>
            </motion.div>
            <p className="text-white font-semibold mb-1">Drop your photos here</p>
            <p className="text-blue-200/45 text-sm mb-5">JPG, PNG, MP4 · Max 50 MB</p>
            <button className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{
                background:"linear-gradient(135deg,#1d4ed8,#2563eb)",
                boxShadow:"0 0 20px rgba(37,99,235,0.38)",
                border:"1px solid rgba(147,197,253,0.28)",
              }}>
              Browse Files
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FULLSCREEN MODAL ─────────────────────────────────────────── */}
      <FullscreenModal item={selected} onClose={closeItem} onPrev={prevItem} onNext={nextItem}/>

      <Footer/>
    </div>
  );
}

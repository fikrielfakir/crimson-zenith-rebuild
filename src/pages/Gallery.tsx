import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  MapPin, X, ChevronLeft, ChevronRight, Upload, Search,
  Home, ChevronRight as CRight, Heart, Share2, Download
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── types ─────────────────────────────────────────────────────────────── */
interface GalleryItem {
  id: number;
  type: string;
  url: string;
  title: string;
  location?: string;
  photographer?: string;
  tags?: string[];
  category?: string;
  likes?: number;
  description?: string;
  aspect?: "portrait" | "landscape";
}

/* ─── static data ────────────────────────────────────────────────────────── */
const STATIC_GALLERY: GalleryItem[] = [
  {
    id: 1, type: "photo", aspect: "portrait",
    url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=700&q=80",
    title: "High Atlas Mountains", location: "Imlil, Morocco",
    photographer: "Sarah M.", tags: ["mountain", "landscape"], category: "mountain", likes: 128,
    description: "Breathtaking peaks rising above the clouds over the High Atlas range."
  },
  {
    id: 2, type: "photo", aspect: "landscape",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=80",
    title: "Sahara Desert", location: "Merzouga, Morocco",
    photographer: "Ahmed K.", tags: ["desert", "sahara"], category: "desert", likes: 95,
    description: "Golden hour illuminating the endless dunes of the Sahara."
  },
  {
    id: 3, type: "photo", aspect: "portrait",
    url: "https://images.unsplash.com/photo-1548696056-01a4a7b4e9e7?w=700&q=80",
    title: "Blue Streets", location: "Chefchaouen, Morocco",
    photographer: "Layla S.", tags: ["city", "blue", "architecture"], category: "cultural", likes: 210,
    description: "The iconic blue-washed alleyways of Morocco's mountain city."
  },
  {
    id: 4, type: "photo", aspect: "landscape",
    url: "https://images.unsplash.com/photo-1553603229-5b0e7b6a3b3e?w=700&q=80",
    title: "Aït Ben Haddou", location: "Ouarzazate, Morocco",
    photographer: "Omar L.", tags: ["ksar", "history", "architecture"], category: "cultural", likes: 74,
    description: "Ancient fortified village glowing at the edge of the desert."
  },
  {
    id: 5, type: "photo", aspect: "landscape",
    url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=700&q=80",
    title: "Desert Sunset", location: "Erg Chebbi, Morocco",
    photographer: "Youssef A.", tags: ["desert", "sunset"], category: "desert", likes: 61,
    description: "A camel caravan silhouetted against the burning horizon."
  },
  {
    id: 6, type: "photo", aspect: "portrait",
    url: "https://images.unsplash.com/photo-1585016495481-91613a0a5c8f?w=700&q=80",
    title: "Local Culture", location: "Marrakech, Morocco",
    photographer: "Fatima R.", tags: ["culture", "people"], category: "cultural", likes: 43,
    description: "Vibrant colours and traditions alive in the ancient medina."
  },
  {
    id: 7, type: "photo", aspect: "landscape",
    url: "https://images.unsplash.com/photo-1500463959177-e0869687b1f7?w=700&q=80",
    title: "Todra Gorge", location: "Tinghir, Morocco",
    photographer: "Hassan M.", tags: ["gorge", "rock", "adventure"], category: "adventure", likes: 88,
    description: "Towering limestone walls carving through the heart of the Atlas."
  },
  {
    id: 8, type: "photo", aspect: "portrait",
    url: "https://images.unsplash.com/photo-1552665945-afd7c01898f9?w=700&q=80",
    title: "Fes Medina", location: "Fès, Morocco",
    photographer: "Nadia H.", tags: ["architecture", "medina", "city"], category: "cultural", likes: 56,
    description: "Labyrinthine streets of the world's largest living medieval city."
  },
];

/* 3-D position slots for the scene */
const SLOTS = [
  { tx: 0,    ty: 0,   tz: 0,    ry: 0,   rx: 0,  scale: 1.18, blur: false }, // center hero
  { tx: -42,  ty: -14, tz: -130, ry: 22,  rx: -4, scale: 0.76, blur: false }, // top-left
  { tx: -52,  ty: 20,  tz: -190, ry: 28,  rx:  6, scale: 0.69, blur: false }, // bottom-left
  { tx:  42,  ty: -16, tz: -110, ry: -18, rx: -4, scale: 0.80, blur: false }, // top-right
  { tx:  50,  ty: 20,  tz: -170, ry: -26, rx:  6, scale: 0.71, blur: false }, // bottom-right
  { tx: -74,  ty:  2,  tz: -320, ry:  42, rx:  0, scale: 0.46, blur: true  }, // far-left
  { tx:  74,  ty:  5,  tz: -300, ry: -42, rx:  0, scale: 0.43, blur: true  }, // far-right
];

const CATEGORIES = [
  { id: "all",       label: "All" },
  { id: "mountain",  label: "Mountains" },
  { id: "desert",    label: "Desert" },
  { id: "cultural",  label: "Culture" },
  { id: "adventure", label: "Adventure" },
];

/* ─── particles ─────────────────────────────────────────────────────────── */
function Particles() {
  const dots = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 2,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: d.size > 2
              ? "radial-gradient(circle, #4a9eff, #0066cc)"
              : "rgba(147, 197, 253, 0.8)",
          }}
          animate={{ opacity: [d.opacity, d.opacity * 2.5, d.opacity], y: [0, -14, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* orbital rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[220px] rounded-full border border-blue-500/10 rotate-[15deg]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[280px] rounded-full border border-blue-400/6 rotate-[-8deg]" />
    </div>
  );
}

/* ─── glass card ─────────────────────────────────────────────────────────── */
function GlassCard({
  item, slot, isCenter, onClick,
}: {
  item: GalleryItem; slot: typeof SLOTS[0]; isCenter?: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const cardW = isCenter ? 300 : slot.scale < 0.55 ? 180 : 240;
  const cardH = isCenter
    ? (item.aspect === "portrait" ? 380 : 290)
    : slot.scale < 0.55 ? 220 : item.aspect === "portrait" ? 305 : 230;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `calc(50% + ${slot.tx}%)`,
        top:  `calc(50% + ${slot.ty}%)`,
        translateX: "-50%",
        translateY: "-50%",
        translateZ: slot.tz,
        rotateY: slot.ry,
        rotateX: slot.rx,
        scale: slot.scale,
        zIndex: isCenter ? 20 : slot.blur ? 1 : 10,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: slot.scale * (isCenter ? 1.04 : 1.07),
        translateZ: slot.tz + 50,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      animate={{
        y: isCenter
          ? [0, -8, 0]
          : slot.tx < 0
            ? [0, -5, 3, 0]
            : [0, 4, -5, 0],
      }}
      transition={{
        y: {
          duration: isCenter ? 3.5 : 4 + Math.abs(slot.tx) * 0.03,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.abs(slot.tx) * 0.02,
        },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      <motion.div
        style={{
          width: cardW,
          height: cardH,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          filter: slot.blur ? "blur(2.5px) brightness(0.7)" : "none",
          boxShadow: hovered
            ? "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(37,99,235,0.25), 0 30px 80px rgba(0,0,0,0.6)"
            : isCenter
              ? "0 0 25px rgba(59,130,246,0.3), 0 20px 60px rgba(0,0,0,0.7)"
              : "0 0 15px rgba(59,130,246,0.15), 0 15px 40px rgba(0,0,0,0.6)",
          border: hovered
            ? "1px solid rgba(147,197,253,0.6)"
            : isCenter
              ? "1px solid rgba(147,197,253,0.35)"
              : "1px solid rgba(99,157,255,0.2)",
          transition: "box-shadow 0.35s ease, border 0.35s ease",
        }}
      >
        {/* background image */}
        <img
          src={item.url}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.5s ease",
            filter: "brightness(0.85) saturate(1.1)",
          }}
          onError={e => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/${cardW}x${cardH}/0f2b6b/4a9eff?text=${encodeURIComponent(item.title)}`;
          }}
        />

        {/* glass overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* glow on hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 60%)",
            }}
          />
        )}

        {/* caption */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3"
          style={{
            background: "linear-gradient(to top, rgba(7,23,57,0.92) 0%, rgba(7,23,57,0.6) 60%, transparent 100%)",
            backdropFilter: "blur(4px)",
          }}
        >
          <p
            className="font-bold text-white leading-tight"
            style={{ fontSize: isCenter ? 15 : 12 }}
          >
            {item.title}
          </p>
          {item.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin style={{ width: isCenter ? 11 : 9, height: isCenter ? 11 : 9 }} className="text-blue-300 shrink-0" />
              <span style={{ fontSize: isCenter ? 11 : 9 }} className="text-blue-200/80">
                {item.location}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── fullscreen modal ───────────────────────────────────────────────────── */
function FullscreenModal({ item, onClose, onPrev, onNext }: {
  item: GalleryItem | null; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          {/* depth fog */}
          <div className="absolute inset-0" style={{ background: "rgba(4,12,35,0.93)", backdropFilter: "blur(20px)" }} />

          {/* particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  background: "rgba(147,197,253,0.4)",
                }}
                animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -20, 0] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>

          <motion.div
            className="relative z-10 flex items-center gap-6 px-6 max-w-5xl w-full"
            initial={{ scale: 0.85, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* prev */}
            <button
              onClick={onPrev}
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(15,43,107,0.6)", border: "1px solid rgba(147,197,253,0.3)", backdropFilter: "blur(10px)" }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* image + info */}
            <div
              className="flex-1 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(7,23,57,0.7)",
                border: "1px solid rgba(147,197,253,0.25)",
                boxShadow: "0 0 80px rgba(37,99,235,0.3), 0 40px 100px rgba(0,0,0,0.7)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="relative" style={{ maxHeight: "65vh" }}>
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "65vh" }}
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/800x600/0f2b6b/4a9eff?text=${encodeURIComponent(item.title)}`;
                  }}
                />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: "rgba(7,23,57,0.8)", border: "1px solid rgba(147,197,253,0.3)" }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{item.title}</h2>
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-blue-300 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {[Heart, Share2, Download].map((Icon, i) => (
                      <button
                        key={i}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-blue-500/20"
                        style={{ border: "1px solid rgba(147,197,253,0.2)" }}
                      >
                        <Icon className="w-4 h-4 text-blue-300" />
                      </button>
                    ))}
                  </div>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full text-blue-200/80"
                        style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* next */}
            <button
              onClick={onNext}
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(15,43,107,0.6)", border: "1px solid rgba(147,197,253,0.3)", backdropFilter: "blur(10px)" }}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── main page ──────────────────────────────────────────────────────────── */
export default function Gallery() {
  const [category, setCategory]         = useState("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [scrollY, setScrollY]           = useState(0);
  const sceneRef                        = useRef<HTMLDivElement>(null);
  const isDragging                      = useRef(false);
  const lastMouse                       = useRef({ x: 0, y: 0 });

  /* spring-driven scene rotation */
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 60, damping: 18 });
  const sRotY = useSpring(rotY, { stiffness: 60, damping: 18 });

  /* fetch real media if available */
  useEffect(() => {
    fetch("/api/admin/media", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then((data: any) => {
        if (!data) return;
        const items: any[] = Array.isArray(data) ? data : (data.data ?? []);
        if (items.length >= 3) {
          setGalleryItems(
            items.map((it, i) => ({
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
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  /* scroll parallax */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* mouse/touch scene rotation */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sceneRef.current) return;
    if (!isDragging.current) {
      /* gentle passive tilt based on mouse position */
      const rect = sceneRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rotY.set(((e.clientX - cx) / rect.width) * 18);
      rotX.set(-((e.clientY - cy) / rect.height) * 10);
      return;
    }
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    rotY.set(rotY.get() + dx * 0.25);
    rotX.set(rotX.get() - dy * 0.15);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [rotX, rotY]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => { isDragging.current = false; };
  const onMouseLeave = () => {
    isDragging.current = false;
    rotX.set(0); rotY.set(0);
  };

  /* filtered items → first 7 go to 3D scene, rest to grid */
  const filtered = galleryItems.filter(it => {
    const matchCat  = category === "all" || it.category === category;
    const matchSearch = !search || it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.location?.toLowerCase().includes(search.toLowerCase()) || false;
    return matchCat && matchSearch;
  });

  const sceneItems = filtered.slice(0, SLOTS.length);
  const gridItems  = filtered.slice(SLOTS.length);

  /* modal navigation */
  const openItem = (item: GalleryItem) => setSelected(item);
  const closeItem = () => setSelected(null);
  const prevItem = () => {
    if (!selected) return;
    const idx = filtered.findIndex(i => i.id === selected.id);
    setSelected(filtered[(idx - 1 + filtered.length) % filtered.length]);
  };
  const nextItem = () => {
    if (!selected) return;
    const idx = filtered.findIndex(i => i.id === selected.id);
    setSelected(filtered[(idx + 1) % filtered.length]);
  };

  return (
    <div className="min-h-screen" style={{ background: "#071739" }}>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: "10rem", paddingBottom: "4rem" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/attached_assets/generated_images/Chefchaouen_blue_streets_272376ab.png')",
            transform: `translateY(${scrollY * 0.28}px)`,
            filter: "brightness(0.45) saturate(1.3)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,23,57,0.5) 0%, rgba(7,23,57,0.8) 100%)" }} />

        <div className="relative container mx-auto px-6">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
              </li>
              <CRight className="w-4 h-4 text-white/40" />
              <li>
                <span className="text-white font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  Gallery
                </span>
              </li>
            </ol>
          </nav>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            style={{ textShadow: "0 0 60px rgba(59,130,246,0.4)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
            Gallery
          </motion.h1>
          <motion.p
            className="text-lg text-white/75 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          >
            Explore stunning moments captured across Morocco — from mountain peaks to desert dunes.
          </motion.p>
        </div>
      </section>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <section className="py-8" style={{ background: "rgba(7,23,57,0.95)" }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search locations, titles…"
                className="pl-10 pr-4 py-2.5 rounded-full text-sm text-white/90 placeholder-white/30 outline-none w-64"
                style={{
                  background: "rgba(15,43,107,0.5)",
                  border: "1px solid rgba(147,197,253,0.2)",
                  backdropFilter: "blur(12px)",
                }}
              />
            </div>

            {/* category pills */}
            <div className="flex gap-2 flex-wrap justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
                  style={{
                    background: category === cat.id
                      ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                      : "rgba(15,43,107,0.4)",
                    border: category === cat.id
                      ? "1px solid rgba(147,197,253,0.5)"
                      : "1px solid rgba(147,197,253,0.15)",
                    color: category === cat.id ? "#fff" : "rgba(147,197,253,0.7)",
                    boxShadow: category === cat.id
                      ? "0 0 20px rgba(59,130,246,0.3)"
                      : "none",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-sm text-blue-300/50">{filtered.length} photos</span>
          </div>
        </div>
      </section>

      {/* ── 3-D SCENE ─────────────────────────────────────────────────── */}
      <section
        className="relative select-none overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #071739 0%, #0a1f5c 45%, #071739 100%)",
          minHeight: "680px",
        }}
      >
        <Particles />

        {/* ambient glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

        {/* scene */}
        <div
          ref={sceneRef}
          className="relative w-full"
          style={{ height: 640, perspective: "1200px", perspectiveOrigin: "50% 48%", cursor: isDragging.current ? "grabbing" : "grab" }}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          <motion.div
            className="absolute inset-0"
            style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: "preserve-3d" }}
          >
            {sceneItems.map((item, i) => (
              <GlassCard
                key={item.id}
                item={item}
                slot={SLOTS[i]}
                isCenter={i === 0}
                onClick={() => openItem(item)}
              />
            ))}
          </motion.div>
        </div>

        {/* hint bar */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-2.5 rounded-full text-xs"
          style={{
            background: "rgba(7,23,57,0.65)",
            border: "1px solid rgba(147,197,253,0.15)",
            backdropFilter: "blur(12px)",
            color: "rgba(147,197,253,0.6)",
          }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400">⟵⟶</span> Drag to rotate
          </span>
          <span className="w-px h-3 bg-blue-400/20" />
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400">⊙</span> Scroll to move
          </span>
          <span className="w-px h-3 bg-blue-400/20" />
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400">↗</span> Click to open
          </span>
        </motion.div>
      </section>

      {/* ── OVERFLOW GRID ─────────────────────────────────────────────── */}
      {gridItems.length > 0 && (
        <section className="py-16" style={{ background: "#071739" }}>
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8" style={{ textShadow: "0 0 30px rgba(59,130,246,0.3)" }}>
              More Moments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gridItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="cursor-pointer rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(99,157,255,0.15)",
                    background: "rgba(15,43,107,0.3)",
                    aspectRatio: item.aspect === "portrait" ? "3/4" : "4/3",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                  onClick={() => openItem(item)}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      style={{ filter: "brightness(0.85) saturate(1.1)" }}
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          `https://placehold.co/400x300/0f2b6b/4a9eff?text=${encodeURIComponent(item.title)}`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(7,23,57,0.9) 0%, transparent 100%)" }}>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      {item.location && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-blue-300" />
                          <span className="text-blue-200/70 text-xs">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UPLOAD PORTAL ─────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #071739 0%, #0a1553 50%, #071739 100%)" }}>
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-3"
            style={{ textShadow: "0 0 40px rgba(59,130,246,0.35)" }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Share Your Journey With The World
          </motion.h2>
          <p className="text-blue-200/60 mb-10 max-w-md mx-auto">
            Upload your Moroccan adventure photos and inspire our growing community of explorers.
          </p>

          <motion.div
            className="relative max-w-md mx-auto rounded-3xl p-10 cursor-pointer group"
            style={{
              background: "rgba(15,43,107,0.35)",
              border: "2px dashed rgba(147,197,253,0.25)",
              backdropFilter: "blur(16px)",
            }}
            whileHover={{
              borderColor: "rgba(147,197,253,0.55)",
              boxShadow: "0 0 60px rgba(59,130,246,0.25)",
            }}
          >
            {/* animated glow dot */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ background: "radial-gradient(circle, #60a5fa, #2563eb)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(15,43,107,0.6))",
                border: "1px solid rgba(147,197,253,0.3)",
                boxShadow: "0 0 30px rgba(59,130,246,0.2)",
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Upload className="w-8 h-8 text-blue-300" />
            </motion.div>

            <p className="text-white font-semibold mb-1">Drop your photos here</p>
            <p className="text-blue-200/50 text-sm mb-5">JPG, PNG, MP4 · Max 50 MB</p>

            <button
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                boxShadow: "0 0 20px rgba(37,99,235,0.4)",
                border: "1px solid rgba(147,197,253,0.3)",
              }}
            >
              Browse Files
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FULLSCREEN MODAL ──────────────────────────────────────────── */}
      <FullscreenModal item={selected} onClose={closeItem} onPrev={prevItem} onNext={nextItem} />

      <Footer />
    </div>
  );
}

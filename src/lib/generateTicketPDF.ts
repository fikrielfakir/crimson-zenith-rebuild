import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export interface TicketData {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  numberOfParticipants: number;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string | null;
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string | null;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const NAVY:   [number, number, number] = [11,  31,  94];
const GOLD:   [number, number, number] = [214, 185, 140];
const GOLD_T: [number, number, number] = [155, 120,  65];  // darker gold for text on white
const WHITE:  [number, number, number] = [250, 248, 245];  // #FAF8F5 warm off-white
const PURE_W: [number, number, number] = [255, 255, 255];
const BORDER: [number, number, number] = [218, 213, 204];  // warm grey border
const INK:    [number, number, number] = [11,  31,  94];   // navy for values
const MUTED:  [number, number, number] = [148, 144, 136];  // for footer

// ─── Geometry ─────────────────────────────────────────────────────────────────
const W      = 86;   // mm — portrait width
const H      = 188;  // mm — reduced height for tighter feel
const HEADER = 44;   // mm — compact navy stub
const PERF   = HEADER + 7;
const PAD    = 9;    // mm — strict left/right padding
const COL    = (W - PAD * 2) / 2;  // exact half-column width = 34mm
const LX     = PAD;           // left column x
const RX     = PAD + COL + 2; // right column x (small 2mm gutter)

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch('/logo-atj.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

async function buildQR(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 220, margin: 1,
    color: { dark: '#0B1F5E', light: '#FFFFFF' },
  });
}

function rr(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, s: string) {
  doc.roundedRect(x, y, w, h, r, r, s);
}

/** Tiny spaced uppercase label */
function lbl(doc: jsPDF, text: string, x: number, y: number, align: 'left' | 'center' = 'left') {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(...GOLD_T);
  doc.setCharSpace(1.4);
  doc.text(text, x, y, { align: align === 'center' ? 'center' : 'left' });
  doc.setCharSpace(0);
}

/** Fade header bottom into body background by stacking translucent slices */
function headerFade(doc: jsPDF) {
  const fadeH = 7;
  const steps = 14;
  const sh = fadeH / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const r = Math.round(NAVY[0] + (WHITE[0] - NAVY[0]) * t);
    const g = Math.round(NAVY[1] + (WHITE[1] - NAVY[1]) * t);
    const b = Math.round(NAVY[2] + (WHITE[2] - NAVY[2]) * t);
    doc.setFillColor(r, g, b);
    doc.rect(1.2, HEADER - 1 + i * sh, W - 2.4, sh + 0.1, 'F');
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  const [logo, qrImg] = await Promise.all([
    loadLogo(),
    buildQR(`${window.location.origin}/book/payment/success?ref=${data.bookingReference}`),
  ]);

  // ── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, 'F');

  // ── Outer border — single very thin ───────────────────────────────────────
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.28);
  rr(doc, 1.2, 1.2, W - 2.4, H - 2.4, 5, 'S');

  // ── Navy header — rounded top, fade at bottom ─────────────────────────────
  doc.setFillColor(...NAVY);
  rr(doc, 1.2, 1.2, W - 2.4, HEADER + 4, 5, 'F');
  doc.rect(1.2, HEADER - 4, W - 2.4, 8, 'F');  // square bottom corners
  headerFade(doc);                               // soft gradient into body

  // ── Logo ──────────────────────────────────────────────────────────────────
  const LS = 13, LY = 6;
  const LLX = W / 2 - LS / 2;
  if (logo) {
    doc.addImage(logo, 'PNG', LLX, LY, LS, LS);
  } else {
    doc.setFillColor(...GOLD);
    doc.circle(W / 2, LY + LS / 2, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text('TJ', W / 2, LY + LS / 2 + 2.2, { align: 'center' });
  }

  // ── EVENT TICKET ──────────────────────────────────────────────────────────
  const titleY = LY + LS + 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(0.6);
  doc.text('EVENT TICKET', W / 2, titleY, { align: 'center' });
  doc.setCharSpace(0);

  // ── CONFIRMED badge ───────────────────────────────────────────────────────
  const pillW = 34, pillH = 5.8, pillX = (W - pillW) / 2, pillY = titleY + 4.5;
  doc.setFillColor(...GOLD);
  rr(doc, pillX, pillY, pillW, pillH, 2.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(1.4);
  doc.text('CONFIRMED', W / 2, pillY + 3.9, { align: 'center' });
  doc.setCharSpace(0);

  // ── Perforation ───────────────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.circle(1.2, PERF, 4, 'F');
  doc.circle(W - 1.2, PERF, 4, 'F');

  const dLen = 1.8, dGap = 2.2;
  doc.setDrawColor(175, 168, 156);
  doc.setLineWidth(0.38);
  for (let x = 8; x < W - 8; x += dLen + dGap) {
    doc.line(x, PERF, Math.min(x + dLen, W - 8), PERF);
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  let cy = PERF + 8;

  // Event label + title (centered, large, dominant)
  lbl(doc, 'EVENT', W / 2, cy, 'center');
  cy += 4.8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(0);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - PAD * 2);
  for (let i = 0; i < Math.min(titleLines.length, 2); i++) {
    doc.text(titleLines[i], W / 2, cy, { align: 'center' });
    cy += 8;
  }
  cy += 1;

  // Slim gold accent
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(W / 2 - 7, cy, W / 2 + 7, cy);
  cy += 7;

  // Guest name — hero, largest body element
  lbl(doc, 'GUEST NAME', LX, cy);
  cy += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(0);
  doc.text(data.customerName, LX, cy);
  cy += 5;

  // Thin gold divider
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.18);
  doc.line(LX, cy, W - PAD, cy);
  cy += 6;

  // ── Info grid — strict equal 2-column ────────────────────────────────────
  const eventDate = new Date(data.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  const CW  = COL - 2;  // usable column width
  const VH  = 9.5;      // row height

  // Row 1: Date | Time
  lbl(doc, 'DATE', LX, cy);
  lbl(doc, 'TIME', RX, cy);
  cy += 4.5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...INK); doc.setCharSpace(0);
  doc.text(doc.splitTextToSize(fmtDate, CW)[0], LX, cy);
  doc.text(fmtTime, RX, cy);
  cy += VH;

  // Thin gold row divider
  doc.setDrawColor(...GOLD); doc.setLineWidth(0.15);
  doc.line(LX, cy - 1, W - PAD, cy - 1);

  // Row 2: Attendees | Amount
  cy += 2;
  lbl(doc, 'ATTENDEES', LX, cy);
  lbl(doc, 'TOTAL AMOUNT', RX, cy);
  cy += 4.5;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...INK); doc.setCharSpace(0);
  doc.text(`${data.numberOfParticipants} person${data.numberOfParticipants !== 1 ? 's' : ''}`, LX, cy);
  doc.text(`${Number(data.totalPrice).toFixed(2)} MAD`, RX, cy);
  cy += VH;

  // Location row (full-width, only if present)
  if (data.eventLocation) {
    doc.setDrawColor(...GOLD); doc.setLineWidth(0.15);
    doc.line(LX, cy - 1, W - PAD, cy - 1);
    cy += 2;
    lbl(doc, 'LOCATION', LX, cy);
    cy += 4.5;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...INK); doc.setCharSpace(0);
    doc.text(doc.splitTextToSize(data.eventLocation, W - PAD * 2)[0], LX, cy);
    cy += VH;
  }

  cy += 3;

  // ── Booking Reference — minimal gold border, no fill ─────────────────────
  const refH = 13;
  doc.setFillColor(...PURE_W);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  rr(doc, LX - 1, cy - 1, W - (LX - 1) * 2, refH, 2.5, 'FD');

  lbl(doc, 'BOOKING REFERENCE', W / 2, cy + 3.2, 'center');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(1.2);
  doc.text(data.bookingReference, W / 2, cy + 9.5, { align: 'center' });
  doc.setCharSpace(0);

  cy += refH + 5;

  // ── QR section — smaller, secondary, white card ───────────────────────────
  const qrSz = 24;
  const qrX  = W / 2 - qrSz / 2;
  const qrY  = cy;
  const fp   = 2.5;  // frame padding

  // White card, very thin border
  doc.setFillColor(...PURE_W);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.25);
  rr(doc, qrX - fp, qrY - fp, qrSz + fp * 2, qrSz + fp * 2 + 6, 2.5, 'FD');

  doc.addImage(qrImg, 'PNG', qrX, qrY, qrSz, qrSz);

  // "SCAN AT ENTRANCE" inside card
  lbl(doc, 'SCAN AT ENTRANCE', W / 2, qrY + qrSz + 4.5, 'center');

  cy += qrSz + fp * 2 + 9;

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(...MUTED);
  doc.setCharSpace(0.6);
  doc.text('PRESENT THIS TICKET AT THE EVENT ENTRANCE', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`ticket-${data.bookingReference}.pdf`);
}

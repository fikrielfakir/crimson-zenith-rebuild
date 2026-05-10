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

// ─── Palette ─────────────────────────────────────────────────────────────────
const NAVY_DEEP:  [number, number, number] = [7,   21,  58];
const NAVY_MID:   [number, number, number] = [11,  31,  94];
const NAVY_LIGHT: [number, number, number] = [18,  45, 118];
const GOLD:       [number, number, number] = [212, 178, 106];
const GOLD_DIM:   [number, number, number] = [160, 130,  72];
const WHITE:      [number, number, number] = [255, 255, 255];

// ─── Ticket geometry ─────────────────────────────────────────────────────────
const W      = 86;   // mm  — narrow portrait
const H      = 222;  // mm  — tall
const PERF_Y = 73;   // mm  — perforation / stub split
const NOTCH  = 5.8;  // mm  — radius of side notches

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function loadLogoBase64(): Promise<string | null> {
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
    color: { dark: '#070F2A', light: '#ffffff' },
  });
}

/** Simulate vertical gradient by stacking thin rectangles */
function drawGradient(doc: jsPDF, x: number, y: number, w: number, h: number,
  from: [number,number,number], to: [number,number,number], steps = 50) {
  const sh = h / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * sh, w, sh + 0.3, 'F');
  }
}

/** Blend two colours by ratio t (0–1) */
function blend(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/** 8-pointed Moroccan star at (cx, cy) with outer radius r, opacity-simulated via colour blend */
function drawStar(doc: jsPDF, cx: number, cy: number, r: number, opacity: number) {
  const pts = 8;
  const inner = r * 0.42;
  const col = blend(NAVY_MID, GOLD, opacity);
  doc.setDrawColor(...col);
  doc.setLineWidth(0.25);

  const verts: [number, number][] = [];
  for (let i = 0; i < pts * 2; i++) {
    const angle = (i * Math.PI / pts) - Math.PI / 2;
    const rad   = i % 2 === 0 ? r : inner;
    verts.push([cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad]);
  }
  for (let i = 0; i < verts.length; i++) {
    const [x1, y1] = verts[i];
    const [x2, y2] = verts[(i + 1) % verts.length];
    doc.line(x1, y1, x2, y2);
  }
  // inner circle
  doc.setDrawColor(...blend(NAVY_MID, GOLD, opacity * 0.6));
  doc.circle(cx, cy, inner * 0.6, 'S');
}

/** Draw the double gold outer + inner border */
function drawBorders(doc: jsPDF) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.roundedRect(1.8, 1.8, W - 3.6, H - 3.6, 4.5, 4.5, 'S');

  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.25);
  doc.roundedRect(3.5, 3.5, W - 7, H - 7, 3.2, 3.2, 'S');
}

/** Perforated tear line + side notch "holes" */
function drawPerforation(doc: jsPDF) {
  const y = PERF_Y;

  // Notch holes — dark circles bleeding off both edges
  doc.setFillColor(...NAVY_DEEP);
  doc.circle(-NOTCH * 0.1, y, NOTCH, 'F');
  doc.circle(W + NOTCH * 0.1, y, NOTCH, 'F');

  // Thin gold rules flanking the dashes
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.2);
  doc.line(NOTCH + 1.5, y - 1.8, W - NOTCH - 1.5, y - 1.8);
  doc.line(NOTCH + 1.5, y + 1.8, W - NOTCH - 1.5, y + 1.8);

  // Dashes
  const dashLen = 2.2, gap = 1.8;
  const x0 = NOTCH + 3, x1 = W - NOTCH - 3;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.55);
  for (let x = x0; x < x1; x += dashLen + gap) {
    doc.line(x, y, Math.min(x + dashLen, x1), y);
  }
}

/** Elegant label + value field */
function field(doc: jsPDF, label: string, value: string,
  x: number, y: number, maxW: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(...GOLD);
  doc.text(label, x, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...WHITE);
  const lines = doc.splitTextToSize(value || '—', maxW);
  doc.text(lines[0], x, y + 5.5);
}

/** Tiny decorative bar cluster (music-ticket style) */
function drawBars(doc: jsPDF, anchorX: number, anchorY: number, dir: 'L' | 'R') {
  const bars = [{ w: 1.8, h: 11 }, { w: 1.8, h: 7.5 }, { w: 1.8, h: 4.5 }];
  const gap = 3;
  doc.setFillColor(...GOLD);
  bars.forEach(({ w, h }, i) => {
    const bx = dir === 'L' ? anchorX - (i + 1) * gap : anchorX + i * gap;
    doc.roundedRect(bx, anchorY - h / 2, w, h, 0.55, 0.55, 'F');
  });
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  // ── Background ─────────────────────────────────────────────────────────────
  drawGradient(doc, 0, 0, W, H, NAVY_DEEP, NAVY_MID);

  // Slightly brighter top stub panel
  drawGradient(doc, 0, 0, W, PERF_Y, NAVY_MID, NAVY_LIGHT, 30);

  // ── Assets ─────────────────────────────────────────────────────────────────
  const [logo, qrImg] = await Promise.all([
    loadLogoBase64(),
    buildQR(`${window.location.origin}/book/payment/success?ref=${data.bookingReference}`),
  ]);

  // ── Double border ──────────────────────────────────────────────────────────
  drawBorders(doc);

  // ── Corner fan lines (top-right decoration) ────────────────────────────────
  [
    { sx: W - 5,  ex: W - 4, ey: 22, lw: 0.45 },
    { sx: W - 13, ex: W - 4, ey: 30, lw: 0.35 },
    { sx: W - 21, ex: W - 4, ey: 38, lw: 0.28 },
    { sx: W - 29, ex: W - 4, ey: 46, lw: 0.22 },
  ].forEach(({ sx, ex, ey, lw }) => {
    doc.setDrawColor(...GOLD_DIM);
    doc.setLineWidth(lw);
    doc.line(sx, 4, ex, ey);
  });

  // ── TOP STUB ──────────────────────────────────────────────────────────────

  // Logo
  const logoSz = 20, logoX = W / 2 - logoSz / 2, logoY = 8.5;
  if (logo) {
    doc.addImage(logo, 'PNG', logoX, logoY, logoSz, logoSz);
  } else {
    doc.setFillColor(...GOLD);
    doc.circle(W / 2, logoY + logoSz / 2, logoSz / 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY_DEEP);
    doc.text('TJ', W / 2, logoY + logoSz / 2 + 3.5, { align: 'center' });
  }

  // Brand name
  const brandY = logoY + logoSz + 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...WHITE);
  doc.text('THE JOURNEY', W / 2, brandY, { align: 'center' });

  // Flanking rules
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(7,       brandY - 1.8, 20,       brandY - 1.8);
  doc.line(W - 20, brandY - 1.8, W - 7,   brandY - 1.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...GOLD);
  doc.text('A  S  S  O  C  I  A  T  I  O  N', W / 2, brandY + 5, { align: 'center' });

  // Thin separator
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.22);
  doc.line(10, brandY + 8, W - 10, brandY + 8);

  // "EVENT TICKET" heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text('EVENT  TICKET', W / 2, brandY + 16, { align: 'center' });

  // Status pill
  const pillW = 46, pillH = 8, pillX = (W - pillW) / 2, pillY = brandY + 19;
  doc.setFillColor(...GOLD);
  doc.roundedRect(pillX, pillY, pillW, pillH, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(...NAVY_DEEP);
  doc.text('*   CONFIRMED   *', W / 2, pillY + 5.2, { align: 'center' });

  // ── Perforation ───────────────────────────────────────────────────────────
  drawPerforation(doc);

  // ── BOTTOM SECTION ────────────────────────────────────────────────────────
  const bot = PERF_Y + 5;

  // Moroccan star overlays (very subtle)
  drawStar(doc, 10,      bot + 12, 11, 0.13);
  drawStar(doc, W - 10,  bot + 14, 9,  0.11);
  drawStar(doc, W / 2,   H - 22,   8,  0.10);

  // Small architectural line corner (bottom-right)
  doc.setDrawColor(...blend(NAVY_MID, GOLD, 0.18));
  doc.setLineWidth(0.22);
  [8, 14, 20].forEach(off => {
    doc.line(W - 4, H - 4 - off, W - 4 - off, H - 4);
  });

  let cy = bot + 10;

  // Event sub-label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(...GOLD);
  doc.text('E  V  E  N  T', W / 2, cy, { align: 'center' });
  cy += 6;

  // Event title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(...WHITE);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - 14);
  const maxLines = Math.min(titleLines.length, 2);
  for (let i = 0; i < maxLines; i++) {
    doc.text(titleLines[i], W / 2, cy, { align: 'center' });
    cy += 7.5;
  }
  cy += 1;

  // Diamond divider
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.25);
  doc.line(8,      cy, W / 2 - 5, cy);
  doc.line(W / 2 + 5, cy, W - 8,  cy);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  const dX = W / 2, dY = cy;
  doc.line(dX - 3.5, dY, dX, dY - 2.2);
  doc.line(dX, dY - 2.2, dX + 3.5, dY);
  doc.line(dX + 3.5, dY, dX, dY + 2.2);
  doc.line(dX, dY + 2.2, dX - 3.5, dY);
  cy += 7;

  // Two-column info grid
  const c1 = 8, c2 = W / 2 + 3, cw = W / 2 - 13, rowH = 13.5;

  const eventDate = new Date(data.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Vertical column divider
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.2);
  doc.line(W / 2, cy - 1, W / 2, cy + rowH * 2 + 1);

  field(doc, 'GUEST NAME', data.customerName,          c1, cy, cw);
  field(doc, 'ATTENDEES',  `${data.numberOfParticipants} person${data.numberOfParticipants !== 1 ? 's' : ''}`, c2, cy, cw);
  cy += rowH;

  // Thin row divider
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.15);
  doc.line(8, cy - 1, W - 8, cy - 1);

  field(doc, 'DATE', fmtDate, c1, cy, cw);
  field(doc, 'TIME', fmtTime, c2, cy, cw);
  cy += rowH;

  // Row divider
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.15);
  doc.line(8, cy - 1, W - 8, cy - 1);

  // Full-width location
  if (data.eventLocation) {
    field(doc, 'LOCATION', data.eventLocation, c1, cy, W - 18);
    cy += rowH;
    doc.setDrawColor(...GOLD_DIM);
    doc.setLineWidth(0.15);
    doc.line(8, cy - 1, W - 8, cy - 1);
  }

  // Full-width amount
  field(doc, 'TOTAL AMOUNT', `${Number(data.totalPrice).toFixed(2)} MAD`, c1, cy, W - 18);
  cy += rowH;

  // Separator before stub-bottom area
  cy += 1;
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.25);
  doc.line(8, cy, W - 8, cy);
  cy += 5;

  // Booking reference
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(...GOLD);
  doc.text('BOOKING  REFERENCE', W / 2, cy, { align: 'center' });
  cy += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.text(data.bookingReference, W / 2, cy, { align: 'center' });
  cy += 5.5;

  // QR code
  const qrSz = 27;
  const qrX  = W / 2 - qrSz / 2;
  const qrY  = cy;

  // QR frame: white + gold border
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.55);
  doc.roundedRect(qrX - 3, qrY - 3, qrSz + 6, qrSz + 6, 2.2, 2.2, 'FD');
  doc.addImage(qrImg, 'PNG', qrX, qrY, qrSz, qrSz);

  // Bar decorations flanking QR
  drawBars(doc, qrX - 5,          qrY + qrSz / 2, 'L');
  drawBars(doc, qrX + qrSz + 5,   qrY + qrSz / 2, 'R');

  cy += qrSz + 7;

  // Footer rule
  doc.setDrawColor(...GOLD_DIM);
  doc.setLineWidth(0.25);
  doc.line(8, cy, W - 8, cy);
  cy += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(...GOLD);
  doc.text('PRESENT THIS TICKET AT THE EVENT ENTRANCE', W / 2, cy, { align: 'center' });

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`ticket-${data.bookingReference}.pdf`);
}

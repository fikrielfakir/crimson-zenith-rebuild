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
const NAVY:     [number, number, number] = [11,  31,  94];   // #0B1F5E
const GOLD:     [number, number, number] = [214, 185, 140];  // #D6B98C
const GOLD_TXT: [number, number, number] = [175, 145, 95];   // deeper gold for text on white
const WHITE:    [number, number, number] = [250, 249, 247];  // #FAF9F7
const BORDER:   [number, number, number] = [220, 218, 213];  // subtle warm border
const INK:      [number, number, number] = [18,  32,  80];   // deep navy for body values

// ─── Geometry ────────────────────────────────────────────────────────────────
const W       = 86;   // mm — portrait width
const H       = 215;  // mm — tall
const HEADER  = 64;   // mm — navy header height
const PERF_Y  = HEADER + 7; // perforation line y

// ─── Assets ──────────────────────────────────────────────────────────────────
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
    width: 260, margin: 1,
    color: { dark: '#0B1F5E', light: '#FAF9F7' },
  });
}

// ─── Drawing helpers ─────────────────────────────────────────────────────────
function rr(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, s: string) {
  doc.roundedRect(x, y, w, h, r, r, s);
}

function label(doc: jsPDF, text: string, x: number, y: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(...GOLD_TXT);
  doc.setCharSpace(1.6);
  doc.text(text, x, y);
  doc.setCharSpace(0);
}

function value(doc: jsPDF, text: string, x: number, y: number, maxW: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(text || '—', maxW);
  doc.text(lines[0], x, y);
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  // ── Load assets in parallel ─────────────────────────────────────────────────
  const [logo, qrImg] = await Promise.all([
    loadLogoBase64(),
    buildQR(`${window.location.origin}/book/payment/success?ref=${data.bookingReference}`),
  ]);

  // ── Warm white background ───────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, 'F');

  // ── Single thin outer border ────────────────────────────────────────────────
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.35);
  rr(doc, 1, 1, W - 2, H - 2, 4.5, 'S');

  // ── Navy header — rounded top, square bottom ────────────────────────────────
  doc.setFillColor(...NAVY);
  rr(doc, 1, 1, W - 2, HEADER + 4, 4.5, 'F');    // rounded all corners initially
  doc.rect(1, HEADER - 4, W - 2, 8, 'F');          // fill bottom of header to square it off

  // ── Logo ────────────────────────────────────────────────────────────────────
  const logoSz = 16, logoX = W / 2 - logoSz / 2, logoY = 8;
  if (logo) {
    doc.addImage(logo, 'PNG', logoX, logoY, logoSz, logoSz);
  } else {
    doc.setFillColor(...GOLD);
    doc.circle(W / 2, logoY + logoSz / 2, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text('TJ', W / 2, logoY + logoSz / 2 + 3, { align: 'center' });
  }

  // ── Brand ───────────────────────────────────────────────────────────────────
  const bY = logoY + logoSz + 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.8);
  doc.text('THE JOURNEY', W / 2, bY, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(3);
  doc.text('ASSOCIATION', W / 2, bY + 4.5, { align: 'center' });
  doc.setCharSpace(0);

  // ── "EVENT TICKET" ──────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.2);
  doc.text('EVENT TICKET', W / 2, bY + 12.5, { align: 'center' });
  doc.setCharSpace(0);

  // ── Status badge ────────────────────────────────────────────────────────────
  const pillW = 32, pillH = 6.2, pillX = (W - pillW) / 2, pillY = bY + 16.5;
  doc.setFillColor(...GOLD);
  rr(doc, pillX, pillY, pillW, pillH, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(1.6);
  doc.text('CONFIRMED', W / 2, pillY + 4.1, { align: 'center' });
  doc.setCharSpace(0);

  // ── Perforation ──────────────────────────────────────────────────────────────
  // White half-circles at edges
  doc.setFillColor(...WHITE);
  doc.circle(1, PERF_Y, 3.8, 'F');
  doc.circle(W - 1, PERF_Y, 3.8, 'F');

  // Dashed line
  const dLen = 1.6, dGap = 2, x0 = 6, x1 = W - 6;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.28);
  for (let x = x0; x < x1; x += dLen + dGap) {
    doc.line(x, PERF_Y, Math.min(x + dLen, x1), PERF_Y);
  }

  // ── Event title ──────────────────────────────────────────────────────────────
  let cy = PERF_Y + 10;

  label(doc, 'EVENT', W / 2, cy);
  // center the label text manually
  const eventLabelW = doc.getTextWidth('EVENT') + (5 * 1.6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(...GOLD_TXT);
  doc.setCharSpace(1.6);
  doc.text('EVENT', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);

  cy += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - 18);
  const maxTitleLines = Math.min(titleLines.length, 2);
  for (let i = 0; i < maxTitleLines; i++) {
    doc.text(titleLines[i], W / 2, cy, { align: 'center' });
    cy += 7;
  }
  cy += 2;

  // Slim gold accent line centered
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(W / 2 - 7, cy, W / 2 + 7, cy);
  cy += 9;

  // ── Info grid — simple two-column, NO dividers ────────────────────────────
  const eventDate = new Date(data.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  const LX  = 10;          // left column x
  const RX  = W / 2 + 4;  // right column x
  const CW  = W / 2 - 14; // column width
  const RH  = 13;          // row height

  // Row 1: Guest Name | Attendees
  label(doc, 'GUEST NAME', LX, cy);
  label(doc, 'ATTENDEES',  RX, cy);
  cy += 4.8;
  value(doc, data.customerName, LX, cy, CW);
  value(doc, `${data.numberOfParticipants} person${data.numberOfParticipants !== 1 ? 's' : ''}`, RX, cy, CW);
  cy += RH;

  // Row 2: Date | Time
  label(doc, 'DATE', LX, cy);
  label(doc, 'TIME', RX, cy);
  cy += 4.8;
  value(doc, fmtDate, LX, cy, CW);
  value(doc, fmtTime, RX, cy, CW);
  cy += RH;

  // Row 3: Location (full width, only if present)
  if (data.eventLocation) {
    label(doc, 'LOCATION', LX, cy);
    cy += 4.8;
    value(doc, data.eventLocation, LX, cy, W - 20);
    cy += RH;
  }

  // Row 4: Amount (full width)
  label(doc, 'TOTAL AMOUNT', LX, cy);
  cy += 4.8;
  value(doc, `${Number(data.totalPrice).toFixed(2)} MAD`, LX, cy, W - 20);
  cy += RH + 2;

  // ── Booking Reference ────────────────────────────────────────────────────────
  doc.setFillColor(237, 234, 228);
  rr(doc, 8, cy - 1.5, W - 16, 14.5, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.8);
  doc.setTextColor(...GOLD_TXT);
  doc.setCharSpace(1.6);
  doc.text('BOOKING REFERENCE', W / 2, cy + 3, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setCharSpace(1.2);
  doc.setTextColor(...NAVY);
  doc.text(data.bookingReference, W / 2, cy + 10, { align: 'center' });
  doc.setCharSpace(0);

  cy += 20;

  // ── QR code ──────────────────────────────────────────────────────────────────
  const qrSz = 28, qrX = W / 2 - qrSz / 2, qrY = cy;

  doc.setFillColor(...WHITE);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.28);
  rr(doc, qrX - 2.5, qrY - 2.5, qrSz + 5, qrSz + 5, 2.5, 'FD');
  doc.addImage(qrImg, 'PNG', qrX, qrY, qrSz, qrSz);

  cy += qrSz + 9;

  // ── Footer text ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(...GOLD_TXT);
  doc.setCharSpace(1);
  doc.text('PRESENT THIS TICKET AT THE EVENT ENTRANCE', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);

  // ── Save ──────────────────────────────────────────────────────────────────────
  doc.save(`ticket-${data.bookingReference}.pdf`);
}

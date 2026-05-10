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
const NAVY:    [number, number, number] = [11,  31,  94];   // #0B1F5E
const GOLD:    [number, number, number] = [214, 185, 140];  // #D6B98C warm gold fill
const GOLD_T:  [number, number, number] = [162, 130,  82];  // darker gold for text on white
const WHITE:   [number, number, number] = [250, 249, 247];  // #FAF9F7 warm white
const CREAM:   [number, number, number] = [244, 241, 235];  // soft cream for containers
const BORDER:  [number, number, number] = [210, 207, 200];  // subtle warm border
const INK:     [number, number, number] = [11,  31,  94];   // navy for all body values
const MUTED:   [number, number, number] = [130, 128, 124];  // muted grey for secondary text

// ─── Geometry ─────────────────────────────────────────────────────────────────
const W      = 86;   // mm — portrait width
const H      = 210;  // mm
const HEADER = 60;   // mm — navy stub height
const PERF   = HEADER + 8;

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
    width: 260, margin: 1,
    color: { dark: '#0B1F5E', light: '#FFFFFF' },
  });
}

function rr(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, s: string) {
  doc.roundedRect(x, y, w, h, r, r, s);
}

/** Small spaced uppercase label */
function lbl(doc: jsPDF, text: string, x: number, y: number, align: 'left' | 'center' = 'left') {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.8);
  doc.setTextColor(...GOLD_T);
  doc.setCharSpace(1.5);
  if (align === 'center') {
    doc.text(text, x, y, { align: 'center' });
  } else {
    doc.text(text, x, y);
  }
  doc.setCharSpace(0);
}

/** Large bold value — no letter spacing */
function val(doc: jsPDF, text: string, x: number, y: number, size: number, maxW: number, align: 'left' | 'center' = 'left') {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.setTextColor(...INK);
  doc.setCharSpace(0);
  const lines = doc.splitTextToSize(text || '—', maxW);
  if (align === 'center') {
    doc.text(lines[0], x, y, { align: 'center' });
  } else {
    doc.text(lines[0], x, y);
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

  // ── Outer border — single thin ────────────────────────────────────────────
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  rr(doc, 1.2, 1.2, W - 2.4, H - 2.4, 5, 'S');

  // ── Navy header — rounded top, flat bottom ────────────────────────────────
  doc.setFillColor(...NAVY);
  rr(doc, 1.2, 1.2, W - 2.4, HEADER + 5, 5, 'F');
  doc.rect(1.2, HEADER - 4, W - 2.4, 9, 'F');  // square off bottom

  // ── Logo ──────────────────────────────────────────────────────────────────
  const LS = 15, LX = W / 2 - LS / 2, LY = 7.5;
  if (logo) {
    doc.addImage(logo, 'PNG', LX, LY, LS, LS);
  } else {
    doc.setFillColor(...GOLD);
    doc.circle(W / 2, LY + LS / 2, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text('TJ', W / 2, LY + LS / 2 + 2.5, { align: 'center' });
  }

  // ── Brand text ────────────────────────────────────────────────────────────
  const bY = LY + LS + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.6);
  doc.text('THE JOURNEY', W / 2, bY, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(2.8);
  doc.text('ASSOCIATION', W / 2, bY + 4.2, { align: 'center' });
  doc.setCharSpace(0);

  // ── "EVENT TICKET" ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(0.8);
  doc.text('EVENT TICKET', W / 2, bY + 12, { align: 'center' });
  doc.setCharSpace(0);

  // ── CONFIRMED badge — wider, stronger ────────────────────────────────────
  const pillW = 36, pillH = 6.5, pillX = (W - pillW) / 2, pillY = bY + 16;
  doc.setFillColor(...GOLD);
  rr(doc, pillX, pillY, pillW, pillH, 3.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(1.4);
  doc.text('CONFIRMED', W / 2, pillY + 4.3, { align: 'center' });
  doc.setCharSpace(0);

  // ── Perforation — stronger, with proper notch circles ────────────────────
  // White notch circles — bigger, cleaner
  doc.setFillColor(...WHITE);
  doc.circle(1.2, PERF, 4.5, 'F');
  doc.circle(W - 1.2, PERF, 4.5, 'F');

  // Dashes — slightly darker, more visible
  const dLen = 2, dGap = 2.2, px0 = 8, px1 = W - 8;
  doc.setDrawColor(180, 175, 165);
  doc.setLineWidth(0.4);
  for (let x = px0; x < px1; x += dLen + dGap) {
    doc.line(x, PERF, Math.min(x + dLen, px1), PERF);
  }

  // ── Body starts ───────────────────────────────────────────────────────────
  let cy = PERF + 9;
  const PAD = 10; // left/right padding in mm

  // ── Event label + title (centered, hero treatment) ───────────────────────
  lbl(doc, 'EVENT', W / 2, cy, 'center');
  cy += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(0);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - PAD * 2);
  for (let i = 0; i < Math.min(titleLines.length, 2); i++) {
    doc.text(titleLines[i], W / 2, cy, { align: 'center' });
    cy += 7;
  }
  cy += 1;

  // Gold accent line
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.line(W / 2 - 8, cy, W / 2 + 8, cy);
  cy += 8;

  // ── Guest name — hero field ───────────────────────────────────────────────
  lbl(doc, 'GUEST NAME', PAD, cy);
  cy += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(0);
  doc.text(data.customerName, PAD, cy);
  cy += 8;

  // Thin separator
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.line(PAD, cy, W - PAD, cy);
  cy += 5;

  // ── Two-column grid (Date | Time, then Attendees | Amount) ───────────────
  const RX  = W / 2 + 3;
  const CW  = W / 2 - PAD - 3;

  const eventDate = new Date(data.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  // Row: Date | Time
  lbl(doc, 'DATE', PAD, cy);
  lbl(doc, 'TIME', RX, cy);
  cy += 4.5;
  val(doc, fmtDate, PAD, cy, 9, CW);
  val(doc, fmtTime, RX, cy, 9, CW);
  cy += 7;

  // Thin separator
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.line(PAD, cy, W - PAD, cy);
  cy += 5;

  // Row: Attendees | Amount
  lbl(doc, 'ATTENDEES', PAD, cy);
  lbl(doc, 'TOTAL AMOUNT', RX, cy);
  cy += 4.5;
  val(doc, `${data.numberOfParticipants} person${data.numberOfParticipants !== 1 ? 's' : ''}`, PAD, cy, 9, CW);
  val(doc, `${Number(data.totalPrice).toFixed(2)} MAD`, RX, cy, 9, CW);
  cy += 7;

  // Location (full width, only if present)
  if (data.eventLocation) {
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.2);
    doc.line(PAD, cy, W - PAD, cy);
    cy += 5;

    lbl(doc, 'LOCATION', PAD, cy);
    cy += 4.5;
    val(doc, data.eventLocation, PAD, cy, 9, W - PAD * 2);
    cy += 7;
  }

  cy += 2;

  // ── Booking Reference — cream pill ────────────────────────────────────────
  doc.setFillColor(...CREAM);
  rr(doc, PAD - 2, cy - 1, W - (PAD - 2) * 2, 15, 3, 'F');

  lbl(doc, 'BOOKING REFERENCE', W / 2, cy + 3.2, 'center');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.setCharSpace(1.2);
  doc.text(data.bookingReference, W / 2, cy + 10.5, { align: 'center' });
  doc.setCharSpace(0);

  cy += 20;

  // ── QR code — framed section with label ───────────────────────────────────
  const qrSz = 28, qrX = W / 2 - qrSz / 2, qrY = cy;
  const frameP = 3.5; // padding around QR
  const frameW = qrSz + frameP * 2;
  const frameH = qrSz + frameP * 2 + 7; // extra space for label below QR

  // Soft cream card for QR
  doc.setFillColor(...CREAM);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  rr(doc, W / 2 - frameW / 2, qrY - frameP, frameW, frameH, 3, 'FD');

  // QR image
  doc.addImage(qrImg, 'PNG', qrX, qrY, qrSz, qrSz);

  // "SCAN AT ENTRANCE" label inside the card, below QR
  lbl(doc, 'SCAN AT ENTRANCE', W / 2, qrY + qrSz + 5.5, 'center');

  cy += qrSz + frameP + 10;

  // ── Footer ────────────────────────────────────────────────────────────────
  cy += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setTextColor(...MUTED);
  doc.setCharSpace(0.8);
  doc.text('PRESENT THIS TICKET AT THE EVENT ENTRANCE', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save(`ticket-${data.bookingReference}.pdf`);
}

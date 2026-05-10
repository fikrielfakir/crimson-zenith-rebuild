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
const NAVY:  [number, number, number] = [11,  31,  94];   // #0B1F5E
const GOLD:  [number, number, number] = [214, 185, 140];  // #D6B98C
const GOLD_MID: [number, number, number] = [190, 158, 108]; // slightly deeper gold for text
const WHITE: [number, number, number] = [250, 249, 247];  // #FAF9F7
const MIST:  [number, number, number] = [228, 226, 222];  // subtle border/divider color
const INK:   [number, number, number] = [30,  40,  70];   // near-navy for body text

// ─── Ticket geometry ─────────────────────────────────────────────────────────
const W      = 86;    // mm — narrow portrait
const H      = 210;   // mm — tall
const HEADER = 62;    // mm — navy header height
const PERF_Y = HEADER + 8; // perforation y

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
    width: 240,
    margin: 1,
    color: { dark: '#0B1F5E', light: '#FAF9F7' },
  });
}

/** Rounded rectangle helper */
function rrect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, style: string) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  // ── Assets ─────────────────────────────────────────────────────────────────
  const [logo, qrImg] = await Promise.all([
    loadLogoBase64(),
    buildQR(`${window.location.origin}/book/payment/success?ref=${data.bookingReference}`),
  ]);

  // ── Warm white background ───────────────────────────────────────────────────
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, W, H, 'F');

  // ── Outer border — single, very thin, warm grey ────────────────────────────
  doc.setDrawColor(...MIST);
  doc.setLineWidth(0.4);
  rrect(doc, 1.2, 1.2, W - 2.4, H - 2.4, 4, 'S');

  // ── Navy header ─────────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  rrect(doc, 1.2, 1.2, W - 2.4, HEADER, 4, 'F');
  // square off the bottom corners of header
  doc.rect(1.2, HEADER - 4, W - 2.4, 4, 'F');

  // ── Logo ────────────────────────────────────────────────────────────────────
  const logoSz = 18;
  const logoX  = W / 2 - logoSz / 2;
  const logoY  = 9;
  if (logo) {
    doc.addImage(logo, 'PNG', logoX, logoY, logoSz, logoSz);
  } else {
    doc.setFillColor(...GOLD);
    doc.circle(W / 2, logoY + logoSz / 2, logoSz / 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text('TJ', W / 2, logoY + logoSz / 2 + 3, { align: 'center' });
  }

  // ── Brand name ──────────────────────────────────────────────────────────────
  const brandY = logoY + logoSz + 6.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(2.5);
  doc.text('THE JOURNEY', W / 2, brandY, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...GOLD);
  doc.setCharSpace(3.5);
  doc.text('ASSOCIATION', W / 2, brandY + 5, { align: 'center' });
  doc.setCharSpace(0);

  // ── "EVENT TICKET" label ────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setCharSpace(1.5);
  doc.text('EVENT TICKET', W / 2, brandY + 13.5, { align: 'center' });
  doc.setCharSpace(0);

  // ── Status badge — small gold pill ──────────────────────────────────────────
  const pillW = 34, pillH = 6.5;
  const pillX = (W - pillW) / 2;
  const pillY = brandY + 17;
  doc.setFillColor(...GOLD);
  rrect(doc, pillX, pillY, pillW, pillH, 3.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setCharSpace(1.8);
  doc.setTextColor(...NAVY);
  doc.text('CONFIRMED', W / 2, pillY + 4.3, { align: 'center' });
  doc.setCharSpace(0);

  // ── Perforation line — very subtle dashed ──────────────────────────────────
  const perfY = PERF_Y;

  // Notch cutouts (white circles at edges)
  doc.setFillColor(...WHITE);
  doc.circle(1.2, perfY, 3.6, 'F');
  doc.circle(W - 1.2, perfY, 3.6, 'F');

  // Single thin dashed line
  const dashLen = 1.8, gap = 2;
  const x0 = 6.5, x1 = W - 6.5;
  doc.setDrawColor(...MIST);
  doc.setLineWidth(0.3);
  for (let x = x0; x < x1; x += dashLen + gap) {
    doc.line(x, perfY, Math.min(x + dashLen, x1), perfY);
  }

  // ── White body ──────────────────────────────────────────────────────────────
  // (already white from background — nothing needed)

  // ── Event title section ─────────────────────────────────────────────────────
  let cy = perfY + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(...GOLD_MID);
  doc.setCharSpace(2);
  doc.text('EVENT', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);
  cy += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - 20);
  const maxLines = Math.min(titleLines.length, 2);
  for (let i = 0; i < maxLines; i++) {
    doc.text(titleLines[i], W / 2, cy, { align: 'center' });
    cy += 7;
  }
  cy += 4;

  // ── Thin gold accent line ───────────────────────────────────────────────────
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 8, cy, W / 2 + 8, cy);
  cy += 9;

  // ── Info fields — two-column, no dividers ───────────────────────────────────
  const eventDate = new Date(data.eventDate);
  const fmtDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  const fmtTime = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  type FieldDef = { label: string; value: string; full?: boolean };
  const fields: FieldDef[] = [
    { label: 'GUEST NAME',  value: data.customerName },
    { label: 'ATTENDEES',   value: `${data.numberOfParticipants} person${data.numberOfParticipants !== 1 ? 's' : ''}` },
    { label: 'DATE',        value: fmtDate },
    { label: 'TIME',        value: fmtTime },
    ...(data.eventLocation ? [{ label: 'LOCATION', value: data.eventLocation, full: true } as FieldDef] : []),
    { label: 'AMOUNT',      value: `${Number(data.totalPrice).toFixed(2)} MAD`, full: true },
  ];

  const lx = 10, rx = W / 2 + 4;
  const cw = W / 2 - 14;
  const rowH = 12;

  for (let i = 0; i < fields.length; i += 2) {
    const left = fields[i];
    const right = !left.full ? fields[i + 1] : null;

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(4.8);
    doc.setCharSpace(1.5);
    doc.setTextColor(...GOLD_MID);
    doc.text(left.label, lx, cy);
    if (right) doc.text(right.label, rx, cy);
    doc.setCharSpace(0);

    // Value
    cy += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    const leftLines = doc.splitTextToSize(left.value || '—', left.full ? W - 20 : cw);
    doc.text(leftLines[0], lx, cy);
    if (right) {
      const rightLines = doc.splitTextToSize(right.value || '—', cw);
      doc.text(rightLines[0], rx, cy);
      i += 1; // consumed right
    } else if (!left.full) {
      i -= 1; // no pair, don't skip extra
    }

    cy += rowH - 4.5;
  }

  cy += 4;

  // ── Booking Reference ───────────────────────────────────────────────────────
  // Subtle background pill
  doc.setFillColor(240, 238, 235);
  rrect(doc, 8, cy - 2, W - 16, 14, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.8);
  doc.setCharSpace(1.8);
  doc.setTextColor(...GOLD_MID);
  doc.text('BOOKING REFERENCE', W / 2, cy + 2.5, { align: 'center' });
  doc.setCharSpace(0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setCharSpace(1.5);
  doc.setTextColor(...NAVY);
  doc.text(data.bookingReference, W / 2, cy + 9, { align: 'center' });
  doc.setCharSpace(0);

  cy += 20;

  // ── QR Code ─────────────────────────────────────────────────────────────────
  const qrSz = 30;
  const qrX  = W / 2 - qrSz / 2;
  const qrY  = cy;

  // Very subtle white frame
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...MIST);
  doc.setLineWidth(0.3);
  rrect(doc, qrX - 2.5, qrY - 2.5, qrSz + 5, qrSz + 5, 2.5, 'FD');
  doc.addImage(qrImg, 'PNG', qrX, qrY, qrSz, qrSz);

  cy += qrSz + 8;

  // ── Footer ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(4.5);
  doc.setCharSpace(1.2);
  doc.setTextColor(...GOLD_MID);
  doc.text('PRESENT THIS TICKET AT THE EVENT ENTRANCE', W / 2, cy, { align: 'center' });
  doc.setCharSpace(0);

  // ── Save ────────────────────────────────────────────────────────────────────
  doc.save(`ticket-${data.bookingReference}.pdf`);
}

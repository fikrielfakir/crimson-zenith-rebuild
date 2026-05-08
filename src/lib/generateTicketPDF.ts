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

// Navy + gold brand colours
const NAVY  = [17, 31, 80]   as [number, number, number];
const GOLD  = [212, 178, 106] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const LIGHT = [248, 249, 252] as [number, number, number];
const GREY  = [100, 110, 130] as [number, number, number];

async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo-atj.png');
    if (!res.ok) throw new Error('logo not found');
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function buildQR(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 180,
    margin: 1,
    color: { dark: '#111f50', light: '#ffffff' },
  });
}

function drawDashedLine(doc: jsPDF, y: number) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  let x = 15;
  while (x < 195) {
    doc.line(x, y, Math.min(x + 5, 195), y);
    x += 8;
  }
}

function pill(doc: jsPDF, text: string, x: number, y: number, bg: [number, number, number], fg: [number, number, number]) {
  const w = doc.getTextWidth(text) + 8;
  doc.setFillColor(...bg);
  doc.roundedRect(x, y - 4.5, w, 7, 2, 2, 'F');
  doc.setTextColor(...fg);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(text, x + 4, y);
}

export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;

  // ── Header band ─────────────────────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 52, 'F');

  // Subtle gold top accent strip
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, W, 3, 'F');

  // Logo
  const logo = await loadLogoBase64();
  if (logo) {
    doc.addImage(logo, 'PNG', 14, 10, 28, 28);
  }

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text('THE JOURNEY ASSOCIATION', 48, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GOLD);
  doc.text('Official Event Ticket', 48, 30);

  // TICKET label (right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255, 0.15);
  doc.setTextColor(255, 255, 255);
  doc.text('TICKET', W - 14, 28, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GOLD);
  doc.text('ADMIT ONE', W - 14, 36, { align: 'right' });

  // ── Gold divider ─────────────────────────────────────────────────────────
  doc.setFillColor(...GOLD);
  doc.rect(0, 52, W, 1.5, 'F');

  // ── Main body ────────────────────────────────────────────────────────────
  doc.setFillColor(...LIGHT);
  doc.rect(0, 53.5, W, 155, 'F');

  // Event title block
  doc.setFillColor(...NAVY);
  doc.roundedRect(14, 62, W - 28, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...WHITE);
  const titleLines = doc.splitTextToSize(data.eventTitle, W - 48);
  doc.text(titleLines[0], W / 2, 76, { align: 'center' });

  // Reference badge
  doc.setFillColor(...GOLD);
  doc.roundedRect(14, 91, W - 28, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('BOOKING REFERENCE', W / 2, 97, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.bookingReference, W / 2, 103, { align: 'center' });

  // ── Two-column detail block ───────────────────────────────────────────────
  const col1X = 20;
  const col2X = 115;
  let y = 118;

  const row = (label: string, value: string, x: number, yPos: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text(label.toUpperCase(), x, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    const lines = doc.splitTextToSize(value || '—', 85);
    doc.text(lines[0], x, yPos + 6);
  };

  const eventDate = new Date(data.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });

  row('Event Date', formattedDate, col1X, y);
  row('Time', formattedTime, col2X, y);
  y += 18;

  row('Ticket Holder', data.customerName, col1X, y);
  row('Participants', `${data.numberOfParticipants} person${data.numberOfParticipants > 1 ? 's' : ''}`, col2X, y);
  y += 18;

  row('Email', data.customerEmail, col1X, y);
  if (data.customerPhone) row('Phone', data.customerPhone, col2X, y);
  y += 18;

  if (data.eventLocation) {
    row('Location', data.eventLocation, col1X, y);
    y += 18;
  }

  const payLabel = data.paymentMethod === 'cmi' ? 'Bank Card (CMI)' : data.paymentMethod === 'cash' ? 'Cash' : data.paymentMethod || '—';
  row('Payment Method', payLabel, col1X, y);
  row('Amount Paid', `${data.totalPrice.toFixed(2)} MAD`, col2X, y);
  y += 18;

  if (data.transactionId) {
    row('Transaction ID', data.transactionId, col1X, y);
    y += 18;
  }

  // ── Tear-off dashed line ─────────────────────────────────────────────────
  y += 4;
  drawDashedLine(doc, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text('✂  TEAR HERE', W / 2, y + 4, { align: 'center' });

  // ── Stub: QR code + status pills ─────────────────────────────────────────
  const stubY = y + 8;
  const qrData = await buildQR(
    `${window.location.origin}/book/payment/success?ref=${data.bookingReference}`
  );
  doc.addImage(qrData, 'PNG', 14, stubY, 36, 36);

  // Status pills
  let pillX = 56;
  const statusText = (data.paymentStatus || 'pending').toUpperCase();
  const statusBg: [number, number, number] = statusText === 'COMPLETED' ? [34, 197, 94] : [212, 178, 106];
  pill(doc, `PAYMENT: ${statusText}`, pillX, stubY + 9, statusBg, WHITE);
  pillX += doc.getTextWidth(`PAYMENT: ${statusText}`) + 14;
  pill(doc, 'OFFICIAL TICKET', pillX, stubY + 9, NAVY, GOLD);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  doc.text('Scan QR code to verify this ticket online', 56, stubY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('This ticket is your proof of booking. Please present it at the event entrance.', 56, stubY + 27, { maxWidth: 135 });

  // ── Footer band ──────────────────────────────────────────────────────────
  const footerY = stubY + 48;
  doc.setFillColor(...NAVY);
  doc.rect(0, footerY, W, 22, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, footerY + 22, W, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GOLD);
  doc.text('www.thejourneyassociation.ma', W / 2, footerY + 8, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text(
    `Ticket issued: ${new Date().toLocaleDateString('en-GB')} · Reference: ${data.bookingReference} · Non-transferable`,
    W / 2, footerY + 15, { align: 'center' }
  );

  doc.save(`ticket-${data.bookingReference}.pdf`);
}

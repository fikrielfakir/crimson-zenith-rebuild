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

const NAVY:      [number, number, number] = [10,  22,  60];
const NAVY2:     [number, number, number] = [16,  30,  82];
const GOLD:      [number, number, number] = [212, 178, 106];
const WHITE:     [number, number, number] = [255, 255, 255];
const DARK_TEXT: [number, number, number] = [18,  28,  65];
const DIVIDER:   [number, number, number] = [228, 230, 242];

const W = 165;
const H = 262;

async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo-atj.png');
    if (!res.ok) throw new Error('logo not found');
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function buildQR(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 220,
    margin: 1,
    color: { dark: '#0a163c', light: '#ffffff' },
  });
}

function drawTopRightDecoration(doc: jsPDF) {
  const curves = [
    { sx: W - 6,  sy: 0, ex: W, ey: 28, lw: 0.5 },
    { sx: W - 14, sy: 0, ex: W, ey: 36, lw: 0.4 },
    { sx: W - 22, sy: 0, ex: W, ey: 44, lw: 0.3 },
    { sx: W - 30, sy: 0, ex: W, ey: 52, lw: 0.25 },
    { sx: W - 38, sy: 0, ex: W, ey: 60, lw: 0.2 },
  ];
  curves.forEach(({ sx, sy, ex, ey, lw }) => {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(lw);
    doc.line(sx, sy, ex, ey);
  });
}

function drawBarDecoration(doc: jsPDF, startX: number, centerY: number, dir: 'left' | 'right') {
  const bars = [
    { offset: 0,  h: 14 },
    { offset: 4,  h: 10 },
    { offset: 8,  h:  7 },
    { offset: 12, h: 10 },
    { offset: 16, h: 14 },
  ];
  const bw = 2.2;
  doc.setFillColor(...GOLD);
  bars.forEach(({ offset, h }) => {
    const bx = dir === 'right' ? startX + offset : startX - offset - bw;
    doc.roundedRect(bx, centerY - h / 2, bw, h, 0.6, 0.6, 'F');
  });
}

export async function generateTicketPDF(data: TicketData): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: [W, H] });

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, H, 'F');

  drawTopRightDecoration(doc);

  const logo = await loadLogoBase64();
  const logoSize = 22;
  const logoX = W / 2 - logoSize / 2;
  const logoY = 8;
  if (logo) {
    doc.addImage(logo, 'PNG', logoX, logoY, logoSize, logoSize);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...WHITE);
  doc.text('THE JOURNEY', W / 2, logoY + logoSize + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text('Association', W / 2, logoY + logoSize + 10.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...WHITE);
  doc.text('Event Booking Confirmation', W / 2, logoY + logoSize + 20, { align: 'center' });

  const badgeW = 50;
  const badgeH = 8.5;
  const badgeX = (W - badgeW) / 2;
  const badgeY = logoY + logoSize + 24;
  doc.setFillColor(...GOLD);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 4, 4, 'F');

  const ckCX = badgeX + 7.5;
  const ckCY = badgeY + badgeH / 2;
  doc.setFillColor(...NAVY);
  doc.circle(ckCX, ckCY, 3.2, 'F');
  doc.setDrawColor(...WHITE);
  doc.setLineWidth(0.7);
  doc.line(ckCX - 1.5, ckCY,        ckCX - 0.2, ckCY + 1.4);
  doc.line(ckCX - 0.2, ckCY + 1.4,  ckCX + 1.8, ckCY - 1.4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...NAVY);
  doc.text('CONFIRMED', badgeX + badgeW / 2 + 2.5, badgeY + 5.6, { align: 'center' });

  const cardX  = 7;
  const cardY  = badgeY + 13;
  const cardW  = W - 14;
  const whiteH = 97;
  const darkH  = 54;

  doc.setFillColor(...WHITE);
  doc.roundedRect(cardX, cardY, cardW, whiteH + darkH, 5, 5, 'F');

  let cy = cardY + 10;
  const padL = cardX + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(...GOLD);
  doc.text('EVENT', padL, cy);
  cy += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...DARK_TEXT);
  const titleLines = doc.splitTextToSize(data.eventTitle, cardW - 18);
  doc.text(titleLines[0], padL, cy);
  cy += 8;

  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.3);
  doc.line(padL, cy, cardX + cardW - 10, cy);
  cy += 7;

  const eventDate   = new Date(data.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit',
  });
  const bookingDate = new Date().toLocaleDateString('en-GB');

  const col1X  = padL;
  const col2X  = cardX + cardW / 2 + 4;
  const midX   = cardX + cardW / 2;
  const rowH   = 16;

  const gridRow = (
    label1: string, val1: string,
    label2: string, val2: string,
    yPos: number,
  ) => {
    doc.setDrawColor(...DIVIDER);
    doc.setLineWidth(0.3);
    doc.line(midX, yPos - 3, midX, yPos + rowH - 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...GOLD);
    doc.text(label1, col1X, yPos);
    doc.text(label2, col2X, yPos);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DARK_TEXT);
    const v1 = doc.splitTextToSize(val1, midX - col1X - 4);
    const v2 = doc.splitTextToSize(val2, cardX + cardW - 10 - col2X);
    doc.text(v1[0], col1X, yPos + 6);
    doc.text(v2[0], col2X, yPos + 6);

    doc.setDrawColor(...DIVIDER);
    doc.line(padL, yPos + rowH - 4, cardX + cardW - 10, yPos + rowH - 4);
  };

  gridRow('GUEST NAME',   data.customerName,
          'ATTENDEES',    `${data.numberOfParticipants} person${data.numberOfParticipants > 1 ? 's' : ''}`,
          cy);
  cy += rowH;

  gridRow('DATE',         formattedDate,
          'TIME',         formattedTime,
          cy);
  cy += rowH;

  gridRow('TOTAL AMOUNT', `${data.totalPrice.toFixed(2)} MAD`,
          'BOOKING DATE', bookingDate,
          cy);

  const stubY = cardY + whiteH;
  doc.setFillColor(...NAVY2);
  doc.roundedRect(cardX, stubY - 4, cardW, darkH + 8, 5, 5, 'F');
  doc.rect(cardX, stubY - 4, cardW, 8, 'F');

  const tnLabelY = stubY + 5;
  const lineLen  = 28;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.35);
  doc.line(cardX + 10,           tnLabelY, cardX + 10 + lineLen,        tnLabelY);
  doc.line(cardX + cardW - 10 - lineLen, tnLabelY, cardX + cardW - 10, tnLabelY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...GOLD);
  doc.text('TICKET NUMBER', W / 2, tnLabelY + 0.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...WHITE);
  const refLines2 = doc.splitTextToSize(data.bookingReference, cardW - 20);
  doc.text(refLines2, W / 2, tnLabelY + 8, { align: 'center' });

  const qrSize = 26;
  const qrX    = W / 2 - qrSize / 2;
  const qrY    = tnLabelY + 13;
  const qrData = await buildQR(
    `${window.location.origin}/book/payment/success?ref=${data.bookingReference}`
  );
  doc.setFillColor(...WHITE);
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2, 2, 'F');
  doc.addImage(qrData, 'PNG', qrX, qrY, qrSize, qrSize);

  drawBarDecoration(doc, qrX - 8,               qrY + qrSize / 2, 'left');
  drawBarDecoration(doc, qrX + qrSize + 6 + 18, qrY + qrSize / 2, 'right');

  const footerY = H - 18;
  doc.setFillColor(...GOLD);
  doc.rect(0, footerY, W, 18, 'F');

  const iconCX = 14;
  const iconCY = footerY + 9;
  doc.setFillColor(...NAVY);
  doc.circle(iconCX, iconCY, 5.5, 'F');
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(iconCX,       iconCY - 3,  iconCX + 3,  iconCY);
  doc.line(iconCX + 3,  iconCY,       iconCX,       iconCY + 3);
  doc.line(iconCX,       iconCY + 3,  iconCX - 3,  iconCY);
  doc.line(iconCX - 3,  iconCY,       iconCX,       iconCY - 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('PRESENT THIS TICKET', 24, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('at the event entrance', 24, footerY + 14);

  doc.save(`ticket-${data.bookingReference}.pdf`);
}

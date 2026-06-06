import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

/**
 * Capture the rendered ticket DOM element as a high-resolution image and
 * embed it centred on an A4 PDF page, then trigger a browser download.
 *
 * @param data   Booking metadata (used only for the filename).
 * @param element  The HTMLElement to capture (the ticket card div).
 */
export async function generateTicketPDF(data: TicketData, element?: HTMLElement): Promise<void> {
  if (!element) {
    throw new Error('No ticket element provided for PDF capture.');
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgNaturalW = canvas.width;
  const imgNaturalH = canvas.height;

  // Fit the ticket on an A4 page with comfortable margins (90 mm wide)
  const A4_W = 210;
  const A4_H = 297;
  const TARGET_W = 90;
  const TARGET_H = (imgNaturalH / imgNaturalW) * TARGET_W;
  const marginX = (A4_W - TARGET_W) / 2;
  const marginY = Math.max(20, (A4_H - TARGET_H) / 2);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'PNG', marginX, marginY, TARGET_W, TARGET_H);
  pdf.save(`ticket-${data.bookingReference}.pdf`);
}

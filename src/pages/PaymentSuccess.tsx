import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Home, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jsPDF } from 'jspdf';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payments/cmi/status/${ref}`);
        if (res.ok) {
          const data = await res.json();
          setTicket(data);
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    // Poll briefly to allow the server callback to propagate
    const t = setTimeout(checkStatus, 1500);
    return () => clearTimeout(t);
  }, [ref]);

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFillColor(17, 31, 80);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('PAYMENT CONFIRMED', 105, 22, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(212, 178, 106);
    doc.text('THE JOURNEY ASSOCIATION', 105, 35, { align: 'center' });
    let y = 65;
    doc.setTextColor(17, 31, 80);
    doc.setFontSize(13);
    doc.text('Booking Reference:', 20, y);
    y += 10;
    doc.setFontSize(20);
    doc.setTextColor(212, 178, 106);
    doc.text(ref, 20, y);
    y += 20;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Payment Status: Completed`, 20, y); y += 10;
    doc.text(`Transaction ID: ${ticket?.transaction_id || 'N/A'}`, 20, y);
    doc.save(`receipt-${ref}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a]" style={{ paddingTop: '14rem', paddingBottom: '3rem' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-['Poppins'] font-bold text-white text-4xl mb-3">Payment Successful!</h1>
          <p className="text-white/80 font-['Inter'] text-lg">Your booking has been confirmed and your ticket is ready.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-lg">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4B26A] mx-auto mb-3" />
            <p className="text-gray-500 font-['Inter']">Verifying your payment…</p>
          </div>
        ) : (
          <Card className="border-2 border-green-200 rounded-3xl shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#D4B26A]" />
                <span className="font-['Poppins'] font-semibold text-[#111f50] text-lg">Booking Reference</span>
              </div>
              <p className="font-['Inter'] text-3xl font-bold text-[#D4B26A] tracking-widest">{ref || '—'}</p>

              {ticket && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1">
                  <p className="text-sm font-semibold text-green-800">Payment Status: <span className="capitalize">{ticket.payment_status}</span></p>
                  {ticket.transaction_id && (
                    <p className="text-xs text-green-700 font-mono">Transaction: {ticket.transaction_id}</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={downloadReceipt}
                  className="w-full bg-[#111f50] hover:bg-[#1a2d5a] text-white font-['Poppins'] font-semibold py-6 rounded-xl">
                  <Download className="w-5 h-5 mr-2" /> Download Receipt
                </Button>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full font-['Poppins'] font-semibold py-6 rounded-xl border-2">
                    <Home className="w-5 h-5 mr-2" /> Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}

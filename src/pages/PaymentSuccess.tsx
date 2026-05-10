import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Home, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateTicketPDF, TicketData } from '@/lib/generateTicketPDF';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }

    let attempts = 0;
    const MAX = 6;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/payments/cmi/status/${ref}`);
        if (res.ok) {
          const data = await res.json();
          setTicket(data);
          // Auto-download ticket once payment is confirmed
          if (data.payment_status === 'completed') {
            setLoading(false);
            triggerDownload(data);
            return;
          }
        }
      } catch { /* ignore */ }

      if (attempts < MAX) {
        setTimeout(poll, 2000);
      } else {
        setLoading(false);
      }
    };

    // Give CMI callback a moment to process
    const t = setTimeout(poll, 1800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const triggerDownload = async (data: any) => {
    setDownloading(true);
    try {
      const ticketData: TicketData = {
        bookingReference:     data.booking_reference,
        customerName:         data.customer_name,
        customerEmail:        data.customer_email,
        customerPhone:        data.customer_phone,
        numberOfParticipants: data.number_of_participants,
        eventTitle:           data.event_title || 'Event',
        eventDate:            data.event_date,
        eventLocation:        data.event_location,
        totalPrice:           Number(data.total_price),
        paymentMethod:        data.payment_method,
        paymentStatus:        data.payment_status,
        transactionId:        data.transaction_id,
      };
      await generateTicketPDF(ticketData);
    } catch (e) {
      console.error('Ticket generation failed', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = () => {
    if (ticket) triggerDownload(ticket);
  };

  const isPaid = ticket?.payment_status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <section
        className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a]"
        style={{ paddingTop: '14rem', paddingBottom: '3rem' }}
      >
        <div className="container mx-auto px-6 text-center">
          {loading ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#D4B26A]/20 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-[#D4B26A] animate-spin" />
              </div>
              <h1 className="font-['Poppins'] font-bold text-white text-4xl mb-3">
                Verifying Payment…
              </h1>
              <p className="text-white/80 font-['Inter'] text-lg">
                Please wait while we confirm your booking.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="font-['Poppins'] font-bold text-white text-4xl mb-3">
                Payment Successful!
              </h1>
              <p className="text-white/80 font-['Inter'] text-lg">
                Your booking is confirmed — your ticket is being prepared.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-lg flex-1">
        {loading ? null : (
          <div className="space-y-6">
            {/* Reference card */}
            <Card className="border-2 border-[#D4B26A]/40 rounded-3xl shadow-xl overflow-hidden">
              {/* Gold top accent */}
              <div className="h-2 bg-gradient-to-r from-[#D4B26A] to-[#C9A758]" />
              <CardContent className="p-8 space-y-6">
                {/* Booking ref */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#D4B26A]">
                    <FileText className="w-5 h-5" />
                    <span className="font-['Poppins'] font-semibold text-[#111f50] text-base">
                      Booking Reference
                    </span>
                  </div>
                  <p className="font-['Inter'] text-3xl font-bold text-[#D4B26A] tracking-widest">
                    {ref || '—'}
                  </p>
                </div>

                {/* Event details */}
                {ticket && (
                  <div className="bg-[#111f50]/5 border border-[#111f50]/10 rounded-2xl p-5 space-y-3">
                    <p className="font-['Poppins'] font-bold text-[#111f50] text-lg leading-tight">
                      {ticket.event_title || 'Your Event'}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm font-['Inter']">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Date</p>
                        <p className="text-[#111f50] font-semibold">
                          {new Date(ticket.event_date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Participants</p>
                        <p className="text-[#111f50] font-semibold">{ticket.number_of_participants}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Amount</p>
                        <p className="text-[#111f50] font-semibold">{Number(ticket.total_price).toFixed(2)} MAD</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {(ticket.payment_status || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {ticket.transaction_id && (
                      <p className="text-xs text-gray-400 font-mono pt-1 border-t border-gray-100">
                        TXN: {ticket.transaction_id}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {isPaid && (
                    <Button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full bg-gradient-to-r from-[#D4B26A] to-[#C9A758] hover:from-[#C9A758] hover:to-[#B89647] text-white font-['Poppins'] font-bold py-6 rounded-xl shadow-lg text-base"
                    >
                      {downloading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating ticket…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Download className="w-5 h-5" />
                          Download Event Ticket
                        </span>
                      )}
                    </Button>
                  )}

                  <Link to="/" className="block">
                    <Button
                      variant="outline"
                      className="w-full font-['Poppins'] font-semibold py-6 rounded-xl border-2 border-[#111f50]/20 text-base"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-gray-400 font-['Inter']">
              A confirmation email has been sent to{' '}
              <strong className="text-gray-600">{ticket?.customer_email || 'your email'}</strong>.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

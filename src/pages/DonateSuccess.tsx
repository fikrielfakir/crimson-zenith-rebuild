import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Heart, Home, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonateSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) { setLoading(false); return; }

    let attempts = 0;
    const MAX = 6;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/donations/cmi/status/${ref}`);
        if (res.ok) {
          const data = await res.json();
          setDonation(data);
          if (data.payment_status === 'completed') {
            setLoading(false);
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

    const t = setTimeout(poll, 1800);
    return () => clearTimeout(t);
  }, [ref]);

  const isPaid = donation?.payment_status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header forceOpaque />

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
                Verifying Donation…
              </h1>
              <p className="text-white/80 font-['Inter'] text-lg">
                Please wait while we confirm your payment.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="font-['Poppins'] font-bold text-white text-4xl mb-3">
                Thank You for Your Donation!
              </h1>
              <p className="text-white/80 font-['Inter'] text-lg">
                Your generosity helps us bring adventures to Morocco.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-lg flex-1">
        {!loading && (
          <div className="space-y-6">
            <Card className="border-2 border-[#D4B26A]/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#D4B26A] to-[#C9A758]" />
              <CardContent className="p-8 space-y-6">

                {/* Reference */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500 font-['Inter'] uppercase tracking-wide">
                    Donation Reference
                  </p>
                  <p className="font-['Inter'] text-3xl font-bold text-[#D4B26A] tracking-widest">
                    {ref || '—'}
                  </p>
                </div>

                {/* Details */}
                {donation && (
                  <div className="bg-[#111f50]/5 border border-[#111f50]/10 rounded-2xl p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm font-['Inter']">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Donor</p>
                        <p className="text-[#111f50] font-semibold">{donation.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Amount</p>
                        <p className="text-[#111f50] font-semibold">
                          {Number(donation.total_price).toFixed(2)} MAD
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Status</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isPaid
                            ? <CheckCircle2 className="w-3 h-3" />
                            : <AlertCircle className="w-3 h-3" />
                          }
                          {(donation.payment_status || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {donation.transaction_id && (
                      <p className="text-xs text-gray-400 font-mono pt-1 border-t border-gray-100">
                        TXN: {donation.transaction_id}
                      </p>
                    )}
                  </div>
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
              </CardContent>
            </Card>

            <p className="text-center text-xs text-gray-400 font-['Inter']">
              A confirmation email has been sent to{' '}
              <strong className="text-gray-600">{donation?.customer_email || 'your email'}</strong>.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

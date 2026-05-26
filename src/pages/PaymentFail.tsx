import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header forceOpaque />
      <section className="bg-gradient-to-r from-[#111f50] to-[#1a2d5a]" style={{ paddingTop: '14rem', paddingBottom: '3rem' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-400/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="font-['Poppins'] font-bold text-white text-4xl mb-3">Payment Failed</h1>
          <p className="text-white/80 font-['Inter'] text-lg">Your payment could not be processed. No charge was made.</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 max-w-lg">
        <Card className="border-2 border-red-200 rounded-3xl shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">
                Your transaction was declined or cancelled. Your booking has been marked as cancelled.
                {ref && (
                  <span className="block mt-1 font-mono text-xs">Reference: {ref}</span>
                )}
              </p>
            </div>

            <p className="text-gray-600 font-['Inter'] text-sm">
              Common reasons: card declined, insufficient funds, session expired, or the payment was cancelled.
              Please try again or contact your bank if the issue persists.
            </p>

            <div className="space-y-3">
              <Link to="/book" className="block">
                <Button className="w-full bg-[#D4B26A] hover:bg-[#C9A758] text-white font-['Poppins'] font-semibold py-6 rounded-xl">
                  <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full font-['Poppins'] font-semibold py-6 rounded-xl border-2">
                  <Home className="w-5 h-5 mr-2" /> Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

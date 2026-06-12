import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppLogo } from '@/hooks/useCMS';

type Status = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const logoUrl = useAppLogo();
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    fetch(`/api/verify-email/${token}`, { method: 'GET' })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message);
        } else if (data.message?.toLowerCase().includes('expired')) {
          setStatus('expired');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logoUrl} alt="Logo" className="h-16 mx-auto object-contain hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-14 h-14 text-[hsl(227,65%,19%)] mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying your email…</h2>
              <p className="text-slate-500 text-sm">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Email Verified!</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Button asChild className="w-full h-11 bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] rounded-xl font-semibold">
                <Link to="/login">Continue to Login →</Link>
              </Button>
            </>
          )}

          {status === 'expired' && (
            <>
              <Mail className="w-14 h-14 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Link Expired</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <Button asChild variant="outline" className="w-full h-11 rounded-xl font-semibold border-slate-200">
                <Link to="/login">Back to Login</Link>
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
              <p className="text-slate-600 mb-6">{message || 'The verification link is invalid or has already been used.'}</p>
              <Button asChild variant="outline" className="w-full h-11 rounded-xl font-semibold border-slate-200">
                <Link to="/login">Back to Login</Link>
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Need help?{' '}
          <Link to="/contact" className="text-[hsl(227,65%,19%)] font-medium hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

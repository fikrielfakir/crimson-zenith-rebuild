import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setUserToken } from '@/lib/tokenStore';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const err   = searchParams.get('error');

    if (err) {
      setError(decodeURIComponent(err));
      return;
    }

    if (token) {
      setUserToken(token);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      navigate('/profile', { replace: true });
    } else {
      setError('Authentication failed. No token received.');
    }
  }, [searchParams, navigate, queryClient]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-red-100">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Sign-in Failed</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block px-6 py-2.5 bg-[hsl(227,65%,19%)] text-white rounded-xl font-semibold text-sm hover:bg-[hsl(227,65%,25%)] transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <svg className="animate-spin w-10 h-10 text-[hsl(227,65%,19%)] mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500 text-sm">Completing sign-in…</p>
      </div>
    </div>
  );
}

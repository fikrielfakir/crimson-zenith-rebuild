import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoAtj from '@/assets/logo-atj.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || t('auth.errors.tryAgain'));
      }
    } catch {
      setError(t('auth.errors.tryAgain'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Left Side - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(227,65%,19%)] via-[hsl(227,65%,19%,0.85)] to-[hsl(42,49%,70%,0.4)]" />

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[hsl(42,49%,70%,0.1)] blur-3xl" />
          <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[hsl(42,49%,70%,0.15)] blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-all duration-300"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t('auth.forgotPassword.backToLogin')}</span>
            </Link>
            <div className="flex-1 flex justify-center">
              <Link to="/" className="inline-block">
                <img
                  src={logoAtj}
                  alt="Logo"
                  className="w-auto object-contain hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ height: '90px' }}
                />
              </Link>
            </div>
            <div className="w-[120px]" />
          </div>

          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl font-bold leading-tight">
              {t('auth.forgotPassword.pageTitle')}<br />
              <span className="text-[hsl(42,49%,70%)]">{t('auth.forgotPassword.pageHighlight')}</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              {t('auth.forgotPassword.pageSubtitle')}
            </p>
          </div>

          <div className="text-white/60 text-sm">
            {t('auth.copyright')}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start sm:items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-y-auto">
        <div className={`w-full max-w-md py-4 sm:py-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/login"
                className="flex items-center gap-2 text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-all"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                <span className="font-medium text-sm">{t('auth.forgotPassword.backToLogin')}</span>
              </Link>
            </div>
            <div className="text-center">
              <Link to="/">
                <img
                  src={logoAtj}
                  alt="Logo"
                  className="w-auto object-contain hover:opacity-90 transition-opacity cursor-pointer mx-auto"
                  style={{ height: '70px' }}
                />
              </Link>
            </div>
          </div>

          {success ? (
            <div className="text-center p-8 rounded-2xl bg-green-50 border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">{t('auth.forgotPassword.successTitle')}</h3>
              <p className="text-green-700 mb-6">
                {t('auth.forgotPassword.successMessage', { email })}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[hsl(227,65%,19%)] font-semibold hover:text-[hsl(227,65%,30%)] transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                {t('auth.forgotPassword.returnToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('auth.forgotPassword.formTitle')}</h2>
                <p className="text-slate-600">{t('auth.forgotPassword.formSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">{t('auth.forgotPassword.emailLabel')}</Label>
                  <div className="relative group">
                    <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.forgotPassword.emailPlaceholder')}
                      className={`${isRtl ? 'pr-12' : 'pl-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-white font-semibold rounded-xl bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] transition-all duration-300 shadow-lg shadow-[hsl(227,65%,19%,0.25)] hover:shadow-xl hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('auth.forgotPassword.sending')}
                    </span>
                  ) : t('auth.forgotPassword.sendButton')}
                </Button>
              </form>

              <p className="mt-8 text-center text-slate-600">
                {t('auth.forgotPassword.rememberPassword')}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-colors"
                >
                  {t('auth.forgotPassword.signIn')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

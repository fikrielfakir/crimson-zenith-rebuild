import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { setUserToken } from '@/lib/tokenStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import logoAtj from "@/assets/logo-atj.png";

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.access_token) {
          setUserToken(data.access_token);
        }
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        navigate(redirectUrl);
      } else {
        setError(data.message || t('auth.errors.invalidCredentials'));
      }
    } catch (err) {
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
            backgroundImage: `url('https://api.thejourney-ma.org/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png')`,
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
              to="/"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-all duration-300 group"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t('auth.backToHome')}</span>
            </Link>
            <div className="flex-1 flex justify-center">
              <Link to="/" className="inline-block group">
                <img
                  src={logoAtj}
                  alt="Logo"
                  className="w-auto object-contain transition-all duration-300 cursor-pointer hover:opacity-90"
                  style={{ height: '90px' }}
                />
              </Link>
            </div>
            <div className="w-[120px]"></div>
          </div>

          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl font-bold leading-tight">
              {t('auth.login.welcomeTitle')}<br />
              <span className="text-[hsl(42,49%,70%)]">{t('auth.login.welcomeHighlight')}</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              {t('auth.login.welcomeSubtitle')}
            </p>

            <div className="space-y-4 pt-4">
              {[
                t('auth.login.feature1'),
                t('auth.login.feature2'),
                t('auth.login.feature3'),
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: `${(idx + 1) * 200}ms`,
                    transition: 'all 0.7s ease',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[hsl(42,49%,70%)]" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/60 text-sm">
            {t('auth.copyright')}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start sm:items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-y-auto">
        <div className={`w-full max-w-md py-4 sm:py-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-all duration-300"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                <span className="font-medium text-sm">{t('auth.backToHome')}</span>
              </Link>
            </div>
            <div className="text-center">
              <Link to="/" className="inline-block">
                <img
                  src={logoAtj}
                  alt="Logo"
                  className="w-auto object-contain transition-all duration-300 cursor-pointer hover:opacity-90 mx-auto"
                  style={{ height: '70px' }}
                />
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-600 text-lg">{t('auth.login.formSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">{t('auth.login.email')}</Label>
              <div className="relative group">
                <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.login.emailPlaceholder')}
                  className={`${isRtl ? 'pr-12' : 'pl-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">{t('auth.login.password')}</Label>
              <div className="relative group">
                <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  className={`${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] font-medium transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-white font-semibold rounded-xl bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] transition-all duration-300 shadow-lg shadow-[hsl(227,65%,19%,0.25)] hover:shadow-xl hover:shadow-[hsl(227,65%,19%,0.35)] hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('auth.login.signingIn')}
                </span>
              ) : t('auth.login.signIn')}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            {t('auth.login.noAccount')}{' '}
            <Link to="/signup" className="font-semibold text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-colors">
              {t('auth.login.signUpFree')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

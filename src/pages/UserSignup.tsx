import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import logoAtj from "@/assets/logo-atj.png";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
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

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.errors.passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || t('auth.errors.registrationFailed'));
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
              {t('auth.signup.joinTitle')}<br />
              <span className="text-[hsl(42,49%,70%)]">{t('auth.signup.joinHighlight')}</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              {t('auth.signup.joinSubtitle')}
            </p>

            <div className="space-y-4 pt-4">
              {[
                t('auth.signup.feature1'),
                t('auth.signup.feature2'),
                t('auth.signup.feature3'),
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

      {/* Right Side - Signup Form */}
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
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('auth.signup.createAccount')}</h2>
            <p className="text-slate-600">{t('auth.signup.fillDetails')}</p>
          </div>

          {success ? (
            <div className="text-center p-8 rounded-2xl bg-green-50 border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Account Created!</h3>
              <p className="text-green-700 mb-4">
                We've sent a verification link to <strong>{formData.email}</strong>.
                Please check your inbox and click the link to activate your account.
              </p>
              <p className="text-green-600 text-sm mb-6">Didn't receive it? Check your spam folder.</p>
              <a
                href="/login"
                className="inline-block text-[hsl(227,65%,19%)] font-semibold text-sm hover:underline"
              >
                Go to Login →
              </a>
            </div>
          ) : (
            <>
              <a
                href="/api/auth/google/redirect"
                className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-slate-700">Sign up with Google</span>
              </a>

              <div className="relative flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">{t('auth.signup.firstName')}</Label>
                    <div className="relative group">
                      <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder={t('auth.signup.firstNamePlaceholder')}
                        className={`${isRtl ? 'pr-12' : 'pl-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">{t('auth.signup.lastName')}</Label>
                    <div className="relative group">
                      <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder={t('auth.signup.lastNamePlaceholder')}
                        className={`${isRtl ? 'pr-12' : 'pl-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">{t('auth.signup.email')}</Label>
                  <div className="relative group">
                    <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.signup.emailPlaceholder')}
                      className={`${isRtl ? 'pr-12' : 'pl-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">{t('auth.signup.password')}</Label>
                  <div className="relative group">
                    <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('auth.signup.passwordPlaceholder')}
                      className={`${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">{t('auth.signup.confirmPassword')}</Label>
                  <div className="relative group">
                    <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors`} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                      className={`${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
                  className="w-full h-12 text-white font-semibold rounded-xl bg-[hsl(227,65%,19%)] hover:bg-[hsl(227,65%,25%)] transition-all duration-300 shadow-lg shadow-[hsl(227,65%,19%,0.25)] hover:shadow-xl hover:shadow-[hsl(227,65%,19%,0.35)] hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('auth.signup.creatingAccount')}
                    </span>
                  ) : t('auth.signup.createAccountBtn')}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                {t('auth.signup.termsNotice')}{' '}
                <Link to="/terms-of-service" className="text-[hsl(227,65%,19%)] hover:underline">
                  {t('auth.signup.termsOfService')}
                </Link>{' '}
                {t('auth.signup.and')}{' '}
                <Link to="/privacy-policy" className="text-[hsl(227,65%,19%)] hover:underline">
                  {t('auth.signup.privacyPolicy')}
                </Link>
              </p>

              <p className="mt-6 text-center text-slate-600">
                {t('auth.signup.alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-semibold text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-colors">
                  {t('auth.signup.signIn')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSignup;

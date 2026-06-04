import SEOHead from "@/components/SEOHead";
import { routeSEO } from "@/lib/seo.config";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  User,
  Mail,
  Phone,
  ChevronRight,
  Mountain,
  Camera,
  Waves,
  Compass,
  Users,
  MapPin,
  Loader2,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Mountain, Camera, Waves, Compass, Users, MapPin,
};

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-400' };
  if (score <= 3) return { score, label: 'Fair',   color: 'bg-yellow-400' };
  if (score <= 4) return { score, label: 'Good',   color: 'bg-blue-400' };
  return              { score, label: 'Strong', color: 'bg-green-500' };
}

export default function JoinUs() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading]                     = useState(false);
  const [clubs, setClubs]                         = useState<any[]>([]);
  const [clubsLoading, setClubsLoading]           = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedClub, setSelectedClub]           = useState('');
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirm, setShowConfirm]             = useState(false);
  const [appCheckLoading, setAppCheckLoading]     = useState(false);

  // Interests list — keys map to joinPage.interestXxx translation keys
  const INTEREST_KEYS: { key: string; label: string }[] = [
    { key: 'Mountain Trekking',    label: t('joinPage.interestMountainTrekking') },
    { key: 'Desert Adventures',    label: t('joinPage.interestDesertAdventures') },
    { key: 'Photography',          label: t('joinPage.interestPhotography') },
    { key: 'Water Sports',         label: t('joinPage.interestWaterSports') },
    { key: 'Cultural Tours',       label: t('joinPage.interestCulturalTours') },
    { key: 'Local Cuisine',        label: t('joinPage.interestLocalCuisine') },
    { key: 'Traditional Crafts',   label: t('joinPage.interestTraditionalCrafts') },
    { key: 'Historical Sites',     label: t('joinPage.interestHistoricalSites') },
    { key: 'Nature Conservation',  label: t('joinPage.interestNatureConservation') },
    { key: 'Community Service',    label: t('joinPage.interestCommunityService') },
    { key: 'Language Exchange',    label: t('joinPage.interestLanguageExchange') },
    { key: 'Wellness',             label: t('joinPage.interestWellness') },
  ];

  // Schemas built inside the component so validation messages are translated
  const schemaBase = z.object({
    applicantName:   z.string().min(2, t('joinPage.validationName')),
    email:           z.string().email(t('joinPage.validationEmail')),
    phone:           z.string().min(10, t('joinPage.validationPhone')),
    password:        z.string().optional().default(''),
    confirmPassword: z.string().optional().default(''),
    preferredClub:   z.string().optional(),
    interests:       z.array(z.string()).min(1, t('joinPage.validationInterests')),
    motivation:      z.string().min(50, t('joinPage.validationMotivation')),
    agreeToTerms:    z.boolean().refine(v => v === true, t('joinPage.validationTerms')),
  });

  const schemaWithPassword = schemaBase
    .extend({
      password:        z.string().min(8, t('joinPage.validationPassword')),
      confirmPassword: z.string().min(1, t('joinPage.validationConfirmPassword')),
    })
    .refine(d => d.password === d.confirmPassword, {
      message: t('joinPage.validationPasswordMatch'),
      path: ['confirmPassword'],
    });

  type FormData = z.infer<typeof schemaWithPassword>;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(isAuthenticated ? schemaBase : schemaWithPassword),
    defaultValues: {
      applicantName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      password: '', confirmPassword: '',
      preferredClub: '', interests: [], motivation: '', agreeToTerms: false,
    },
  });

  const motivation    = watch('motivation') ?? '';
  const agreeToTerms  = watch('agreeToTerms');
  const passwordValue = watch('password') ?? '';
  const strength      = getPasswordStrength(passwordValue);

  const strengthLabel =
    strength.label === 'Weak'   ? t('joinPage.strengthWeak')   :
    strength.label === 'Fair'   ? t('joinPage.strengthFair')   :
    strength.label === 'Good'   ? t('joinPage.strengthGood')   :
    strength.label === 'Strong' ? t('joinPage.strengthStrong') : '';

  // Fetch clubs
  useEffect(() => {
    fetch('/api/clubs', { headers: { Accept: 'application/json' } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.clubs ?? data?.data ?? [];
        setClubs(list.slice(0, 6));
      })
      .catch(() => setClubs([]))
      .finally(() => setClubsLoading(false));
  }, []);

  // If authenticated user already has an application, redirect to profile application tab
  useEffect(() => {
    if (!isAuthenticated) return;
    setAppCheckLoading(true);
    fetch('/api/user/applications', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const apps = Array.isArray(data) ? data : [];
        if (apps.length > 0) {
          navigate('/profile?tab=application', { replace: true });
        }
      })
      .catch(() => {})
      .finally(() => setAppCheckLoading(false));
  }, [isAuthenticated]);

  const toggleInterest = (key: string) => {
    const next = selectedInterests.includes(key)
      ? selectedInterests.filter(i => i !== key)
      : [...selectedInterests, key];
    setSelectedInterests(next);
    setValue('interests', next, { shouldValidate: true });
  };

  const selectClub = (id: string) => {
    const next = selectedClub === id ? '' : id;
    setSelectedClub(next);
    setValue('preferredClub', next);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        if (res.status === 422) {
          if (body?.errors?.email) {
            setError('email', { type: 'server', message: body.errors.email[0] });
            document.querySelector('input[name="email"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
          if (body?.errors?.confirmPassword) {
            setError('confirmPassword', { type: 'server', message: body.errors.confirmPassword[0] });
            return;
          }
        }
        throw new Error(body?.message ?? `Error ${res.status}`);
      }

      const result = await res.json();
      const didCreateAccount = result.accountCreated === true;

      if (isAuthenticated) {
        navigate('/profile?tab=application');
      } else if (didCreateAccount) {
        navigate('/login?redirect=' + encodeURIComponent('/profile?tab=application'));
      } else {
        navigate('/profile?tab=application');
      }
    } catch (err: any) {
      toast({ title: t('joinPage.errorTitle'), description: err?.message ?? t('joinPage.errorDesc'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <SEOHead {...routeSEO["/join-us"]} />
      <Header forceOpaque />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B1F5E 0%, #112470 50%, #0d2878 100%)',
          paddingTop: '14rem',
          paddingBottom: '5rem',
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: '#D6B98C', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#D6B98C', transform: 'translate(-30%, 30%)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#D6B98C]" />
              <span className="text-white/90 text-sm font-medium">{t('joinPage.openApplications')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight font-['Poppins']">
              {t('joinPage.heroTitle')}<br />
              <span style={{ color: '#D6B98C' }}>{t('joinPage.heroCommunity')}</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-xl mx-auto">
              {t('joinPage.heroSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto mt-12">
            {[
              { value: '1,200+', label: t('joinPage.statsMembers') },
              { value: '24',     label: t('joinPage.statsClubs') },
              { value: '180+',   label: t('joinPage.statsEvents') },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold font-['Poppins']" style={{ color: '#D6B98C' }}>{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loading spinner while checking for an existing application */}
      {isAuthenticated && appCheckLoading && (
        <main className="container mx-auto px-4 py-14 max-w-2xl flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0B1F5E] mb-3" />
          <p className="text-sm text-gray-400">{t('joinPage.checkingApplication')}</p>
        </main>
      )}

      {/* Form */}
      {!appCheckLoading && (
      <main className="container mx-auto px-4 py-14 max-w-2xl flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* ── 1. Personal Info + Account ───────────────────────────────── */}
          <Section number={1} title={t('joinPage.section1Title')} subtitle={t('joinPage.section1Subtitle')}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t('joinPage.fieldFullName')} required error={errors.applicantName?.message}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...register('applicantName')}
                    placeholder={t('joinPage.placeholderFullName')}
                    className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl ${errors.applicantName ? 'border-red-400' : ''}`}
                  />
                </div>
              </Field>
              <Field label={t('joinPage.fieldEmail')} required error={errors.email?.message}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder={t('joinPage.placeholderEmail')}
                    autoComplete="email"
                    className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl ${errors.email ? 'border-red-400' : ''}`}
                  />
                </div>
              </Field>
            </div>

            <Field label={t('joinPage.fieldPhone')} required error={errors.phone?.message}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...register('phone')}
                  placeholder={t('joinPage.placeholderPhone')}
                  className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl ${errors.phone ? 'border-red-400' : ''}`}
                />
              </div>
            </Field>

            {/* Password section — only shown when user doesn't have an account yet */}
            {!isAuthenticated && (
              <>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> {t('joinPage.createPassword')}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <Field label={t('joinPage.fieldPassword')} required error={errors.password?.message}>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('joinPage.placeholderPassword')}
                          autoComplete="new-password"
                          className={`pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl ${errors.password ? 'border-red-400' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </Field>

                    {/* Strength bar */}
                    {passwordValue.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : 'bg-gray-100'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {t('joinPage.strengthLabel')}{' '}
                          <span className={`font-medium ${
                            strength.label === 'Weak'   ? 'text-red-500'    :
                            strength.label === 'Fair'   ? 'text-yellow-600' :
                            strength.label === 'Good'   ? 'text-blue-600'   :
                            'text-green-600'
                          }`}>{strengthLabel}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <Field label={t('joinPage.fieldConfirmPassword')} required error={errors.confirmPassword?.message}>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        {...register('confirmPassword')}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder={t('joinPage.placeholderConfirmPassword')}
                        autoComplete="new-password"
                        className={`pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl ${errors.confirmPassword ? 'border-red-400' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed flex items-start gap-1.5">
                  <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {t('joinPage.passwordNote')}
                </p>
              </>
            )}

            {/* When already logged in — show a note instead */}
            {isAuthenticated && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  {t('joinPage.loggedInNote', { email: user?.email })}
                </p>
              </div>
            )}
          </Section>

          {/* ── 2. Club Preference ─────────────────────────────────────────── */}
          <Section number={2} title={t('joinPage.section2Title')} subtitle={t('joinPage.section2Subtitle')}>
            {clubsLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('joinPage.loadingClubs')}
              </div>
            ) : clubs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">{t('joinPage.noClubs')}</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {clubs.map(club => {
                  const Icon   = ICON_MAP[club.icon] ?? Users;
                  const active = selectedClub === String(club.id ?? club.slug ?? club.name);
                  return (
                    <button
                      key={club.id ?? club.name}
                      type="button"
                      onClick={() => selectClub(String(club.id ?? club.slug ?? club.name))}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        active
                          ? 'border-[#0B1F5E] bg-[#0B1F5E]/5'
                          : 'border-gray-200 bg-white hover:border-[#D6B98C]/60 hover:bg-[#D6B98C]/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-[#0B1F5E]' : 'bg-gray-100'}`}>
                          <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm leading-tight ${active ? 'text-[#0B1F5E]' : 'text-gray-800'}`}>
                            {club.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{club.description}</p>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-[#0B1F5E] flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Section>

          {/* ── 3. Interests ───────────────────────────────────────────────── */}
          <Section number={3} title={t('joinPage.section3Title')} subtitle={t('joinPage.section3Subtitle')}>
            <div className="flex flex-wrap gap-2">
              {INTEREST_KEYS.map(({ key, label }) => {
                const active = selectedInterests.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleInterest(key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                      active
                        ? 'bg-[#0B1F5E] text-white border-[#0B1F5E]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B1F5E]/50 hover:text-[#0B1F5E]'
                    }`}
                  >
                    {active && <span className="mr-1.5">✓</span>}{label}
                  </button>
                );
              })}
            </div>
            {errors.interests && (
              <p className="text-sm text-red-500 mt-2">{errors.interests.message}</p>
            )}
          </Section>

          {/* ── 4. Motivation ──────────────────────────────────────────────── */}
          <Section number={4} title={t('joinPage.section4Title')} subtitle={t('joinPage.section4Subtitle')}>
            <div className="relative">
              <Textarea
                {...register('motivation')}
                placeholder={t('joinPage.motivationPlaceholder')}
                className={`min-h-[140px] bg-white border-gray-200 focus:border-[#0B1F5E] rounded-xl resize-none text-sm leading-relaxed p-4 ${errors.motivation ? 'border-red-400' : ''}`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.motivation
                  ? <p className="text-sm text-red-500">{errors.motivation.message}</p>
                  : <span />
                }
                <span className={`text-xs ml-auto ${motivation.length >= 50 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  {motivation.length} {t('joinPage.minChars')}
                </span>
              </div>
            </div>
          </Section>

          {/* ── 5. Terms + Submit ──────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            {/* Terms checkbox */}
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" {...register('agreeToTerms')} className="sr-only peer" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  agreeToTerms
                    ? 'bg-[#0B1F5E] border-[#0B1F5E]'
                    : 'bg-white border-gray-300 group-hover:border-[#0B1F5E]/50'
                } ${errors.agreeToTerms ? 'border-red-400' : ''}`}>
                  {agreeToTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{t('joinPage.agreeLabel')}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {t('joinPage.agreeDesc')}
                </p>
                {errors.agreeToTerms && (
                  <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms.message}</p>
                )}
              </div>
            </label>

            {/* Info note */}
            <div className="flex items-start gap-3 bg-[#0B1F5E]/4 rounded-xl p-4">
              <div className="w-5 h-5 rounded-full bg-[#D6B98C]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#D6B98C] text-xs font-bold">i</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t('joinPage.infoNote')} <strong>{t('joinPage.infoNoteDays')}</strong>.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-semibold rounded-xl font-['Poppins'] shadow-lg transition-all duration-200"
              style={{ background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #0B1F5E 0%, #1a3485 100%)' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isAuthenticated ? t('joinPage.submittingLoggedIn') : t('joinPage.submittingGuest')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isAuthenticated ? t('joinPage.submitLoggedIn') : t('joinPage.submitGuest')}
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-center text-xs text-gray-400">
                {t('joinPage.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-[#0B1F5E] font-medium hover:underline">
                  {t('joinPage.signIn')}
                </Link>
              </p>
            )}
          </div>
        </form>
      </main>
      )}

      <Footer />
    </div>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────
function Section({ number, title, subtitle, children }: {
  number: number; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0B1F5E] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </div>
        <div>
          <h2 className="font-semibold text-[#0B1F5E] text-base font-['Poppins']">{title}</h2>
          {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-[#D6B98C] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

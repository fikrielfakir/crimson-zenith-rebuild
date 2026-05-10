import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  applicantName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  preferredClub: z.string().optional(),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
  agreeToTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
});
type FormData = z.infer<typeof schema>;

// ─── Static interests ─────────────────────────────────────────────────────────
const INTERESTS = [
  'Mountain Trekking', 'Desert Adventures', 'Photography', 'Water Sports',
  'Cultural Tours', 'Local Cuisine', 'Traditional Crafts', 'Historical Sites',
  'Nature Conservation', 'Community Service', 'Language Exchange', 'Wellness',
];

const ICON_MAP: Record<string, React.ElementType> = {
  Mountain, Camera, Waves, Compass, Users, MapPin,
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function JoinUs() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { applicantName: '', email: '', phone: '', preferredClub: '', interests: [], motivation: '', agreeToTerms: false },
  });

  const motivation = watch('motivation') ?? '';
  const agreeToTerms = watch('agreeToTerms');

  // Fetch real clubs from backend
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

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
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
        throw new Error(body?.message ?? `Error ${res.status}`);
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err?.message ?? 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />

        {/* Dark hero banner — gives the transparent header proper contrast */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0B1F5E 0%, #112470 50%, #0d2878 100%)',
            paddingTop: '14rem',
            paddingBottom: '4rem',
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
            style={{ background: '#D6B98C', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: '#D6B98C', transform: 'translate(-30%, 30%)' }} />

          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#D6B98C]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Poppins']">
              Application Submitted!
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto">
              Thank you for your interest. Our team will review your application and get back to you within 2–3 business days.
            </p>
          </div>
        </section>

        <main className="flex-1 flex items-start justify-center px-4 py-14">
          <div className="text-center max-w-lg w-full">
            <div className="bg-white border border-[#D6B98C]/30 rounded-2xl p-7 mb-10 text-left space-y-4 shadow-sm">
              <p className="text-xs font-semibold text-[#D6B98C] tracking-widest uppercase mb-5">What happens next</p>
              {[
                'Our team reviews your application',
                'We\'ll contact you for a brief conversation',
                'Upon approval, you\'ll receive your welcome kit',
                'Join events and meet your community!',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-[#0B1F5E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-gray-700 text-sm pt-1">{step}</p>
                </div>
              ))}
            </div>
            <Link to="/">
              <Button className="bg-[#0B1F5E] hover:bg-[#0B1F5E]/90 text-white px-10 py-6 rounded-xl text-base font-semibold font-['Poppins']">
                Return to Homepage
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B1F5E 0%, #112470 50%, #0d2878 100%)',
          paddingTop: '14rem',
          paddingBottom: '5rem',
        }}
      >
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: '#D6B98C', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{ background: '#D6B98C', transform: 'translate(-30%, 30%)' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#D6B98C]" />
              <span className="text-white/90 text-sm font-medium">Open Applications</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight font-['Poppins']">
              Join Our Adventure<br />
              <span style={{ color: '#D6B98C' }}>Community</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-xl mx-auto">
              Ready to explore Morocco's wonders with like-minded adventurers? Complete this application to become part of our vibrant community.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12">
            {[
              { value: '1,200+', label: 'Members' },
              { value: '24', label: 'Active Clubs' },
              { value: '180+', label: 'Events / Year' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold font-['Poppins']" style={{ color: '#D6B98C' }}>{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-14 max-w-2xl flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* ── 1. Personal Info ───────────────────────────────────────────── */}
          <Section number={1} title="Personal Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required error={errors.applicantName?.message}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input {...register('applicantName')} placeholder="Your full name"
                    className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] focus:ring-[#0B1F5E]/20 rounded-xl ${errors.applicantName ? 'border-red-400' : ''}`} />
                </div>
              </Field>
              <Field label="Email Address" required error={errors.email?.message}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input {...register('email')} type="email" placeholder="you@example.com"
                    className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] focus:ring-[#0B1F5E]/20 rounded-xl ${errors.email ? 'border-red-400' : ''}`} />
                </div>
              </Field>
            </div>
            <Field label="Phone Number" required error={errors.phone?.message}>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input {...register('phone')} placeholder="+212 6XX XXX XXX"
                  className={`pl-10 h-12 bg-white border-gray-200 focus:border-[#0B1F5E] focus:ring-[#0B1F5E]/20 rounded-xl ${errors.phone ? 'border-red-400' : ''}`} />
              </div>
            </Field>
          </Section>

          {/* ── 2. Club Preference ─────────────────────────────────────────── */}
          <Section number={2} title="Choose a Club" subtitle="Optional — pick the one that excites you most">
            {clubsLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading clubs…
              </div>
            ) : clubs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No clubs found. You can still apply!</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {clubs.map(club => {
                  const Icon = ICON_MAP[club.icon] ?? Users;
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
          <Section number={3} title="Your Interests" subtitle="Select everything that excites you">
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                      active
                        ? 'bg-[#0B1F5E] text-white border-[#0B1F5E]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0B1F5E]/50 hover:text-[#0B1F5E]'
                    }`}
                  >
                    {active && <span className="mr-1.5">✓</span>}{interest}
                  </button>
                );
              })}
            </div>
            {errors.interests && (
              <p className="text-sm text-red-500 mt-2">{errors.interests.message}</p>
            )}
          </Section>

          {/* ── 4. Motivation ──────────────────────────────────────────────── */}
          <Section number={4} title="Tell Us About Yourself" subtitle="Why do you want to join our community?">
            <div className="relative">
              <Textarea
                {...register('motivation')}
                placeholder="Share your passion for adventure, what you hope to experience, and how you'd like to contribute to our community…"
                className={`min-h-[140px] bg-white border-gray-200 focus:border-[#0B1F5E] focus:ring-[#0B1F5E]/20 rounded-xl resize-none text-sm leading-relaxed p-4 ${errors.motivation ? 'border-red-400' : ''}`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.motivation
                  ? <p className="text-sm text-red-500">{errors.motivation.message}</p>
                  : <span />
                }
                <span className={`text-xs ml-auto ${motivation.length >= 50 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  {motivation.length} / 50 min
                </span>
              </div>
            </div>
          </Section>

          {/* ── 5. Terms + Submit ──────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            {/* Terms checkbox */}
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  {...register('agreeToTerms')}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  agreeToTerms ? 'bg-[#0B1F5E] border-[#0B1F5E]' : 'bg-white border-gray-300 group-hover:border-[#0B1F5E]/50'
                } ${errors.agreeToTerms ? 'border-red-400' : ''}`}>
                  {agreeToTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">I agree to the terms and conditions</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  By submitting, you agree to our community guidelines, privacy policy, and terms of service. You consent to receive updates about events and activities.
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
                After submission, our team reviews your application within <strong>2–3 business days</strong>. We may reach out for a brief conversation before finalising your membership.
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
                  Submitting Application…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Application
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </main>

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

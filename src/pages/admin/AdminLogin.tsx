import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { setAdminToken } from '@/lib/tokenStore';
import { STAFF_ROLES, getDefaultRoute, type AdminRole } from '@/lib/adminPermissions';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavbarSettings } from '@/hooks/useCMS';
import logoAtj from '@/assets/logo-atj.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { data: navbarSettings } = useNavbarSettings();

  const logoUrl =
    navbarSettings?.logoUrl ||
    (navbarSettings as any)?.logo_url ||
    logoAtj;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      try {
        await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      } catch {}

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ username: credentials.username, password: credentials.password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const hasAccess = data.user?.isAdmin || STAFF_ROLES.includes(data.user?.role);
      if (!hasAccess) {
        toast({ title: t('admin.login.accessDeniedTitle'), description: t('admin.login.accessDeniedDesc'), variant: 'destructive' });
        return;
      }
      if (data.access_token) setAdminToken(data.access_token);
      queryClient.setQueryData(['adminMe'], data.user);
      toast({ title: t('admin.login.successTitle'), description: t('admin.login.successDesc') });
      const userRole = (data.user?.role as AdminRole) ?? 'admin';
      navigate(getDefaultRoute(userRole));
    },
    onError: (error: Error) => {
      toast({ title: t('admin.login.failedTitle'), description: error.message || t('admin.login.failedDesc'), variant: 'destructive' });
    },
  });

  const onSubmit = (data: LoginFormData) => loginMutation.mutate(data);

  return (
    <div className="flex min-h-screen relative">
      {/* ── Language switcher – top-right corner ── */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher textColor="#6b7280" className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-white rounded-lg px-2.5 py-1.5" />
      </div>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #0a1628 0%, #112250 45%, #1a3366 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D8C18D, transparent)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D8C18D, transparent)' }} />
        <div className="absolute top-1/2 right-8 w-px h-48 opacity-20" style={{ background: 'linear-gradient(to bottom, transparent, #D8C18D, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain drop-shadow-lg" />
        </div>

        {/* Centre copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium tracking-widest uppercase" style={{ borderColor: '#D8C18D40', color: '#D8C18D', background: '#D8C18D10' }}>
            <Shield className="w-3 h-3" />
            {t('admin.login.portalBadge')}
          </div>

          <h2 className="text-4xl font-bold leading-tight text-white">
            {t('admin.login.brandHeadingPre')}<br />
            <span style={{ color: '#D8C18D' }}>{t('admin.login.brandHeadingAccent')}</span>{' '}
            {t('admin.login.brandHeadingPost')}
          </h2>

          <p className="text-base leading-relaxed max-w-sm" style={{ color: '#94a8c8' }}>
            {t('admin.login.brandSubtitle')}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Clubs & Events', 'Bookings', 'CMS', 'Analytics'].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: '#D8C18D15', color: '#D8C18D', border: '1px solid #D8C18D30' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-sm" style={{ color: '#4a6080' }}>
            © {new Date().getFullYear()} The Journey Association · {t('admin.login.secureFooter')}
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain mx-auto" />
        </div>

        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t('admin.login.heading') || 'Sign in'}
            </h1>
            <p className="text-sm text-gray-500">
              {t('admin.login.description') || 'Enter your credentials to access the admin panel'}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('admin.login.usernameLabel') || 'Username or Email'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder={t('admin.login.usernamePlaceholder') || 'admin@journey.ma'}
                          autoComplete="username"
                          className="pl-10 h-11 border-gray-200 focus:border-[#112250] focus:ring-[#112250]/10 rounded-lg"
                          {...field}
                          disabled={loginMutation.isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t('admin.login.passwordLabel') || 'Password'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="pl-10 pr-10 h-11 border-gray-200 focus:border-[#112250] focus:ring-[#112250]/10 rounded-lg"
                          {...field}
                          disabled={loginMutation.isPending}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loginMutation.isPending}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me + forgot password row */}
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loginMutation.isPending}
                          className="border-gray-300 data-[state=checked]:bg-[#112250] data-[state=checked]:border-[#112250]"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal text-gray-600">
                        {t('admin.login.rememberMe') || 'Remember me'}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <button type="button" className="text-sm font-medium transition-colors" style={{ color: '#112250' }}>
                  {t('admin.login.forgotPassword') || 'Forgot password?'}
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #112250, #1a3a6e)', color: '#fff' }}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('admin.login.signingIn') || 'Signing in…'}
                  </span>
                ) : (
                  t('admin.login.signIn') || 'Sign In'
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {t('admin.login.protectedNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

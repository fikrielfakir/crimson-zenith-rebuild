import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { setAdminToken } from '@/lib/tokenStore';
import { STAFF_ROLES, getDefaultRoute, type AdminRole } from '@/lib/adminPermissions';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      // Prefetch CSRF cookie before submitting — required by Sanctum stateful API
      try {
        await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      } catch {
        // Non-fatal in local dev where Sanctum CSRF is not enforced
      }

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
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
        toast({
          title: 'Access Denied',
          description: 'You do not have admin panel access.',
          variant: 'destructive',
        });
        return;
      }

      // Store the Bearer token so apiFetch sends it on every request.
      // This is the stateless auth path — no session cookie needed.
      if (data.access_token) {
        setAdminToken(data.access_token);
      }

      // Populate the cache immediately so ProtectedRoute sees the user
      // before the navigate() call re-renders it.
      queryClient.setQueryData(['adminMe'], data.user);

      toast({
        title: 'Login successful',
        description: 'Welcome back to the admin dashboard!',
      });
      const userRole = (data.user?.role as AdminRole) ?? 'admin';
      navigate(getDefaultRoute(userRole));
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-2xl font-bold">JA</span>
          </div>
          <h1 className="text-3xl font-bold">{t('admin.login.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('admin.login.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.login.heading')}</CardTitle>
            <CardDescription>{t('admin.login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.login.usernameLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('admin.login.usernamePlaceholder')}
                          autoComplete="username"
                          {...field}
                          disabled={loginMutation.isPending}
                        />
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
                      <FormLabel>{t('admin.login.passwordLabel')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('admin.login.passwordPlaceholder')}
                            autoComplete="current-password"
                            {...field}
                            disabled={loginMutation.isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loginMutation.isPending}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal">
                        {t('admin.login.rememberMe')}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('admin.login.signingIn')}
                    </>
                  ) : (
                    t('admin.login.signIn')
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-sm text-muted-foreground">
                {t('admin.login.forgotPassword')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('admin.login.copyright')}
        </p>
      </div>
    </div>
  );
}

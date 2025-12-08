import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Mail, Lock, Home, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (credentials.email === 'user@morocclubs.com' && credentials.password === 'user123') {
      localStorage.setItem('userAuth', 'authenticated');
      localStorage.setItem('userEmail', credentials.email);
      navigate(redirectUrl);
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    if (redirectUrl !== '/profile') {
      sessionStorage.setItem('loginRedirect', redirectUrl);
    }
    window.location.href = '/api/login';
  };

  const handleReaplitLogin = () => {
    if (redirectUrl !== '/profile') {
      sessionStorage.setItem('loginRedirect', redirectUrl);
    }
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background Image */}
        <section className="relative py-20 overflow-hidden" style={{ paddingTop: '15rem' }}>
          {/* Background Image with Parallax */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png')`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
            }}
          />

          {/* Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />

          {/* Content */}
          <div className="relative container mx-auto px-6">
            {/* Breadcrumb Navigation */}
            <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link 
                    to="/" 
                    className="flex items-center text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
                  >
                    <Home className="w-4 h-4 mr-1.5" />
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
                  <span className="text-white font-semibold bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-lg">
                    Login
                  </span>
                </li>
              </ol>
            </nav>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                Welcome Back
              </h1>
              <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed drop-shadow-lg">
                Sign in to access your Morocco Clubs profile and manage your bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-6">
            <div className="max-w-md mx-auto">
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center text-white rounded-t-lg" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                  <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                  <p className="text-slate-200">
                    Access your Morocco Clubs account
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 border-slate-300 focus:ring-1"
                          style={{ '--tw-ring-color': 'hsl(var(--primary))', 'borderColor': 'hsl(var(--primary))' } as any}
                          value={credentials.email}
                          onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 border-slate-300 focus:ring-1"
                          style={{ '--tw-ring-color': 'hsl(var(--primary))', 'borderColor': 'hsl(var(--primary))' } as any}
                          value={credentials.password}
                          onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full text-white font-semibold py-2.5 hover:opacity-90 transition-opacity" 
                      style={{ backgroundColor: 'hsl(var(--primary))' }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="space-y-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-slate-300 hover:bg-slate-50"
                      onClick={handleGoogleLogin}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-slate-300 hover:bg-slate-50"
                      onClick={() => setError('Facebook login is not configured. Please contact administrator.')}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Sign in with Facebook
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-slate-300 hover:bg-slate-50"
                      onClick={handleReaplitLogin}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                      Sign in with Replit
                    </Button>
                  </div>

                  {/* Demo credentials */}
                  <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: 'hsl(var(--primary))' }}>
                    <p className="text-sm text-slate-600 mb-2 font-medium">Demo Credentials:</p>
                    <p className="text-sm text-slate-700"><strong>Email:</strong> user@morocclubs.com</p>
                    <p className="text-sm text-slate-700"><strong>Password:</strong> user123</p>
                  </div>

                  {/* Links */}
                  <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link to="/join" className="font-medium hover:opacity-80" style={{ color: 'hsl(var(--primary))' }}>
                        Join us
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Link to="/forgot-password" className="font-medium hover:opacity-80" style={{ color: 'hsl(var(--primary))' }}>
                        Forgot your password?
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserLogin;

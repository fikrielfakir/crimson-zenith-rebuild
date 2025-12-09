import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    setIsVisible(true);
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

  const handleReplitLogin = () => {
    if (redirectUrl !== '/profile') {
      sessionStorage.setItem('loginRedirect', redirectUrl);
    }
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/attached_assets/generated_images/Essaouira_coastal_fortifications_07abbfb6.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(227,65%,19%)] via-[hsl(227,65%,19%,0.85)] to-[hsl(42,49%,70%,0.4)]" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[hsl(42,49%,70%,0.1)] blur-3xl" />
          <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[hsl(42,49%,70%,0.15)] blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-[hsl(42,49%,70%)]" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Morocco Clubs</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl font-bold leading-tight">
              Welcome to<br />
              <span className="text-[hsl(42,49%,70%)]">Morocco Clubs</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Join our vibrant community and discover exclusive access to sports clubs, events, and activities across Morocco.
            </p>
            
            {/* Features list */}
            <div className="space-y-4 pt-4">
              {[
                'Access exclusive member events',
                'Book sports facilities instantly',
                'Connect with club members'
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 transition-all duration-700 delay-${(idx + 1) * 200}`}
                  style={{ 
                    opacity: isVisible ? 1 : 0, 
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    transitionDelay: `${(idx + 1) * 200}ms`
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-[hsl(42,49%,70%)]" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-white/60 text-sm">
            &copy; 2024 Morocco Clubs. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(227,65%,19%)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[hsl(42,49%,70%)]" />
              </div>
              <span className="text-xl font-bold text-[hsl(227,65%,19%)]">Morocco Clubs</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[hsl(227,65%,19%)] mb-2">Sign In</h2>
            <p className="text-slate-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] font-medium transition-colors"
              >
                Forgot password?
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
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all duration-300"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="h-12 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all duration-300"
              onClick={handleReplitLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 32 32" fill="none">
                <path d="M7 5.5C7 4.67157 7.67157 4 8.5 4H15.5C16.3284 4 17 4.67157 17 5.5V12H8.5C7.67157 12 7 11.3284 7 10.5V5.5Z" fill="#F26207"/>
                <path d="M17 12H25.5C26.3284 12 27 12.6716 27 13.5V18.5C27 19.3284 26.3284 20 25.5 20H17V12Z" fill="#F26207"/>
                <path d="M7 21.5C7 20.6716 7.67157 20 8.5 20H17V26.5C17 27.3284 16.3284 28 15.5 28H8.5C7.67157 28 7 27.3284 7 26.5V21.5Z" fill="#F26207"/>
              </svg>
              Replit
            </Button>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[hsl(227,65%,19%,0.05)] to-[hsl(42,49%,70%,0.1)] border border-[hsl(227,65%,19%,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[hsl(227,65%,19%)]" />
              <p className="text-sm text-[hsl(227,65%,19%)] font-semibold">Demo Access</p>
            </div>
            <p className="text-sm text-slate-600"><span className="font-medium">Email:</span> user@morocclubs.com</p>
            <p className="text-sm text-slate-600"><span className="font-medium">Password:</span> user123</p>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/join" className="font-semibold text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

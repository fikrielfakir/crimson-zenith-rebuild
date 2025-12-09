import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, Lock, Eye, EyeOff, User, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
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
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          {/* Top row: Back arrow left, Logo centered */}
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-white hover:text-white/80 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
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

          {/* Main Content */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-5xl font-bold leading-tight">
              Join Our<br />
              <span className="text-[hsl(42,49%,70%)]">Community</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Create your account and start exploring exclusive access to sports clubs, events, and activities across Morocco.
            </p>
            
            {/* Features list */}
            <div className="space-y-4 pt-4">
              {[
                'Free membership to get started',
                'Apply for full member access',
                'Connect with sports enthusiasts'
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

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile Header with back arrow and logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium text-sm">Back to Home</span>
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

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Your Account</h2>
            <p className="text-slate-600">Fill in your details to get started.</p>
          </div>

          {success ? (
            <div className="text-center p-8 rounded-2xl bg-green-50 border border-green-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Account Created!</h3>
              <p className="text-green-700">Redirecting you to the login page...</p>
            </div>
          ) : (
            <>
              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        className="pl-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        className="pl-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
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
                      placeholder="Create a password"
                      className="pl-12 pr-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[hsl(227,65%,19%)] transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-12 pr-12 h-12 border-slate-200 rounded-xl focus:border-[hsl(227,65%,19%)] focus:ring-2 focus:ring-[hsl(227,65%,19%,0.1)] transition-all bg-white"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </Button>
              </form>

              {/* Terms notice */}
              <p className="mt-6 text-center text-sm text-slate-500">
                By creating an account, you agree to our{' '}
                <Link to="/terms-of-service" className="text-[hsl(227,65%,19%)] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-[hsl(227,65%,19%)] hover:underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Sign in link */}
              <p className="mt-6 text-center text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[hsl(227,65%,19%)] hover:text-[hsl(227,65%,30%)] transition-colors">
                  Sign in
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

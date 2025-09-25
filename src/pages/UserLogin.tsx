import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple demo authentication for users
    if (credentials.email === 'user@morocclubs.com' && credentials.password === 'user123') {
      localStorage.setItem('userAuth', 'authenticated');
      localStorage.setItem('userEmail', credentials.email);
      navigate('/profile');
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    // Google login is handled through Replit OAuth integration
    window.location.href = '/api/login';
  };

  const handleReaplitLogin = () => {
    // Using Replit OAuth integration (supports Google, GitHub, X, Apple, email/password)
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-t-lg">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-orange-100">
              Sign in to access your Morocco Clubs profile
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
                    className="pl-10 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
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
                    className="pl-10 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
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
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold py-2.5" 
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
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200">
              <p className="text-sm text-slate-600 mb-2 font-medium">Demo Credentials:</p>
              <p className="text-sm text-slate-700"><strong>Email:</strong> user@morocclubs.com</p>
              <p className="text-sm text-slate-700"><strong>Password:</strong> user123</p>
            </div>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/join" className="text-orange-600 hover:text-orange-700 font-medium">
                  Join us
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserLogin;
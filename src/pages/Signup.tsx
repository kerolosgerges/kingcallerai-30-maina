import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTos, setAcceptedTos] = useState(false);

  const { currentUser, signup, authInitialized } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (authInitialized && currentUser) {
      // AuthContext handles redirect
    }
  }, [authInitialized, currentUser, navigate]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Name is required');

    if (!formData.email.trim()) newErrors.push('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');

    if (!formData.password) newErrors.push('Password is required');
    else if (formData.password.length < 8) newErrors.push('Password must be at least 8 characters');

    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');

    if (!acceptedTos) newErrors.push('You must accept the Terms and Privacy Policy to continue');

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      toast({ title: 'Success', description: 'Account created successfully!' });
      // Redirect handled by AuthContext
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    Object.values(checks).forEach(c => c && score++);
    const percentage = (score / 5) * 100;
    const strength = score >= 4 ? 'Strong' : score >= 3 ? 'Medium' : 'Weak';
    return { score, strength, percentage, checks };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-primary/10 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[420px] h-[420px] bg-blue-400/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[200px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Card className="w-full max-w-md border shadow-2xl rounded-2xl bg-white/95 backdrop-blur-sm transition-transform hover:scale-[1.01] duration-200">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <img
              src="https://www.kingcaller.ai/assets/images/logo.svg"
              alt="KingCaller AI"
              className="h-14 sm:h-16"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-extrabold text-foreground">Join KingCaller AI</CardTitle>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Create your account and start building AI agents
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password strength:</span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength.strength === 'Strong'
                          ? 'text-green-600'
                          : passwordStrength.strength === 'Medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <Progress value={passwordStrength.percentage} className="h-2" />
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordStrength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordStrength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordStrength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordStrength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Number
                    </div>
                    <div className={`flex items-center gap-2 ${passwordStrength.checks.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordStrength.checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms & Privacy acceptance */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTos}
                  onChange={(e) => setAcceptedTos(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-2 focus:ring-primary"
                  disabled={loading}
                  aria-describedby="terms-helper"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    Terms & Conditions
                  </Link>{' '}
                  and the{' '}
                  <Link to="/privacy" className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </Link>.
                  <span id="terms-helper" className="sr-only">
                    You must accept to create an account
                  </span>
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading || !acceptedTos}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

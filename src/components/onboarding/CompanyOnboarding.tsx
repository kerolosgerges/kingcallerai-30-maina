import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, MapPin, FileText, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface CompanyDetails {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyDescription: string;
}

interface CompanyOnboardingProps {
  onComplete: (companyDetails: CompanyDetails, subAccountId: string) => void;
}

export const CompanyOnboarding = ({ onComplete }: CompanyOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyDescription: ''
  });

  const handleInputChange = (field: keyof CompanyDetails, value: string) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!companyDetails.companyName.trim();
      case 2:
        return !!companyDetails.companyEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyDetails.companyEmail);
      case 3:
        return !!companyDetails.companyAddress.trim();
      case 4:
        return !!companyDetails.companyDescription.trim();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setError('');
      setStep(prev => prev + 1);
    } else {
      setError('Please fill in all required fields correctly.');
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const generateSubAccountId = (companyName: string): string => {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20) + '-' + Date.now().toString().slice(-6);
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || !currentUser) {
      setError('Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Generate sub-account ID from company name
      const subAccountId = generateSubAccountId(companyDetails.companyName);

      console.log('Creating company with details:', { companyDetails, subAccountId, ownerId: currentUser.uid });

      await onComplete(companyDetails, subAccountId);
    } catch (error: any) {
      console.error('Error creating company:', error);
      if (error.message?.includes('already exists')) {
        setError('A company with this name already exists. Please choose a different name.');
      } else if (error.message?.includes('Sub-account ID already exists')) {
        setError('This company name is already taken. Please choose a different name.');
      } else {
        setError('Failed to create company. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndGoToLogin = async () => {
    try {
      setLoading(true);
      await logout();
      // Navigation will be handled by App.tsx AuthRedirect component
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error signing out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Company Name',
      description: 'What\'s your company called?',
      icon: Building2,
      field: 'companyName' as keyof CompanyDetails,
      placeholder: 'Enter your company name',
      type: 'input'
    },
    {
      title: 'Official Email',
      description: 'Your company\'s official email address',
      icon: Mail,
      field: 'companyEmail' as keyof CompanyDetails,
      placeholder: 'company@example.com',
      type: 'email'
    },
    {
      title: 'Company Address',
      description: 'Where is your company located?',
      icon: MapPin,
      field: 'companyAddress' as keyof CompanyDetails,
      placeholder: 'Enter your company address',
      type: 'textarea'
    },
    {
      title: 'Company Details',
      description: 'Tell us about your company',
      icon: FileText,
      field: 'companyDescription' as keyof CompanyDetails,
      placeholder: 'Describe what your company does...',
      type: 'textarea'
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-primary/10 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://www.kingcaller.ai/assets/images/logo.svg"
              alt="KingCaller"
              className="h-12 w-auto"
            />
            <span className="font-bold text-lg text-primary tracking-tighter">KingCaller</span>
          </div>
          
          <div>
            <CardTitle className="text-2xl font-semibold">Welcome to KingCaller</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Let's set up your company to get started
            </CardDescription>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index + 1 <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <currentStepData.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={currentStepData.field} className="text-sm font-medium">
                {currentStepData.title} *
              </Label>
              {currentStepData.type === 'textarea' ? (
                <Textarea
                  id={currentStepData.field}
                  value={companyDetails[currentStepData.field]}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="min-h-[100px]"
                  required
                />
              ) : (
                <Input
                  id={currentStepData.field}
                  type={currentStepData.type === 'email' ? 'email' : 'text'}
                  value={companyDetails[currentStepData.field]}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className="h-11"
                  required
                />
              )}
            </div>
          </motion.div>

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleLogoutAndGoToLogin}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 4 ? (
                <Button onClick={nextStep} disabled={loading}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    'Creating Company...'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Alternative login option at the bottom */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Already have a company account?{' '}
              <Button 
                variant="link" 
                onClick={handleLogoutAndGoToLogin}
                disabled={loading}
                className="p-0 h-auto text-primary hover:underline"
              >
                Sign in with existing account
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

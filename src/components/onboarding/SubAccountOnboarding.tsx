import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Settings, CheckCircle, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useNavigate } from 'react-router-dom';
import type { SubAccount } from '@/types/platform';

// Common timezones for better UX
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (MST)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKST)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' }
];

// Common currencies
const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' }
];

interface SubAccountDetails {
  name: string;
  slug: string;
  description: string;
  companyAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  companyPhone: string;
  settings: {
    timezone: string;
    currency: string;
    language: string;
  };
  subscription: {
    tier: 'free' | 'starter' | 'professional' | 'enterprise';
    maxUsers: number;
    maxAssistants: number;
    maxContacts: number;
    features: string[];
  };
}

interface SubAccountOnboardingProps {
  onComplete: (subAccountDetails: Omit<SubAccount, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<string>;
}

export const SubAccountOnboarding = ({ onComplete }: SubAccountOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const { switchSubAccount } = useSubAccount();
  const navigate = useNavigate();

  const [subAccountDetails, setSubAccountDetails] = useState<SubAccountDetails>({
    name: '',
    slug: '',
    description: '',
    companyAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    companyPhone: '',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en'
    },
    subscription: {
      tier: 'professional',
      maxUsers: 25,
      maxAssistants: 50,
      maxContacts: 10000,
      features: ['advanced_analytics', 'priority_support', 'custom_integrations']
    }
  });

  const handleInputChange = (field: keyof SubAccountDetails, value: any) => {
    if (field === 'name') {
      // Auto-generate slug from name
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 20) + '-' + Date.now().toString().slice(-6);
      
      setSubAccountDetails(prev => ({ 
        ...prev, 
        [field]: value,
        slug: slug
      }));
    } else {
      setSubAccountDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (parent: keyof SubAccountDetails, field: string, value: any) => {
    setSubAccountDetails(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value
      }
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!subAccountDetails.name.trim();
      case 2:
        return !!subAccountDetails.description.trim();
      case 3:
        return !!(
          subAccountDetails.companyAddress.street.trim() &&
          subAccountDetails.companyAddress.city.trim() &&
          subAccountDetails.companyAddress.state.trim() &&
          subAccountDetails.companyAddress.zipCode.trim() &&
          subAccountDetails.companyPhone.trim()
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setError('');
      setStep(prev => prev + 1);
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(3) || !currentUser) {
      setError('Please complete all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const newSubAccountId = await onComplete({
        name: subAccountDetails.name,
        slug: subAccountDetails.slug,
        description: subAccountDetails.description,
        companyAddress: subAccountDetails.companyAddress,
        companyPhone: subAccountDetails.companyPhone,
        settings: subAccountDetails.settings,
        subscription: subAccountDetails.subscription,
        isActive: true
      });

      // Switch to the new sub-account and navigate to launchpad
      await switchSubAccount(newSubAccountId);
      navigate(`/${subAccountDetails.slug}/launchpad`);
    } catch (error: any) {
      console.error('Error creating sub-account:', error);
      if (error.message?.includes('already exists')) {
        setError('A sub-account with this name already exists. Please choose a different name.');
      } else {
        setError('Failed to create sub-account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndGoToLogin = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Error signing out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Sub-Account Name',
      description: 'What would you like to call your workspace?',
      icon: Building2
    },
    {
      title: 'Configuration',
      description: 'Set up your workspace preferences',
      icon: Settings
    },
    {
      title: 'Company Details',
      description: 'Add your company address and contact information',
      icon: MapPin
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
            <CardTitle className="text-2xl font-semibold">Create Your Workspace</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Set up your sub-account to get started
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

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Workspace Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={subAccountDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="My Awesome Workspace"
                    className="h-11"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    Workspace URL
                  </Label>
                  <Input
                    id="slug"
                    type="text"
                    value={subAccountDetails.slug}
                    disabled
                    className="h-11 bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your unique workspace identifier
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={subAccountDetails.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what this workspace will be used for..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium">
                      Timezone
                    </Label>
                    <Select 
                      value={subAccountDetails.settings.timezone} 
                      onValueChange={(value) => handleNestedChange('settings', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Currency
                    </Label>
                    <Select
                      value={subAccountDetails.settings.currency}
                      onValueChange={(value) => handleNestedChange('settings', 'currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm font-medium">
                    Street Address *
                  </Label>
                  <Input
                    id="street"
                    type="text"
                    value={subAccountDetails.companyAddress.street}
                    onChange={(e) => handleNestedChange('companyAddress', 'street', e.target.value)}
                    placeholder="123 Main Street"
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={subAccountDetails.companyAddress.city}
                      onChange={(e) => handleNestedChange('companyAddress', 'city', e.target.value)}
                      placeholder="New York"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State *
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      value={subAccountDetails.companyAddress.state}
                      onChange={(e) => handleNestedChange('companyAddress', 'state', e.target.value)}
                      placeholder="NY"
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-sm font-medium">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={subAccountDetails.companyAddress.zipCode}
                      onChange={(e) => handleNestedChange('companyAddress', 'zipCode', e.target.value)}
                      placeholder="10001"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Select 
                      value={subAccountDetails.companyAddress.country} 
                      onValueChange={(value) => handleNestedChange('companyAddress', 'country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPhone" className="text-sm font-medium">
                    Company Phone *
                  </Label>
                  <Input
                    id="companyPhone"
                    type="tel"
                    value={subAccountDetails.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                    required
                  />
                </div>
              </div>
            )}
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
              {step < 3 ? (
                <Button onClick={nextStep} disabled={loading}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    'Creating Workspace...'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Workspace
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

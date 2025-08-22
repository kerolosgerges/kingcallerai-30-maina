
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, Phone, Mail, Globe, AlertCircle, CheckCircle, Upload } from 'lucide-react';

interface BrandRegistrationProps {
  data?: any;
  onSave: (data: any) => void;
  onNext: () => void;
}

export const BrandRegistration: React.FC<BrandRegistrationProps> = ({ data, onSave, onNext }) => {
  const [formData, setFormData] = useState({
    legalBusinessName: data?.legalBusinessName || '',
    displayName: data?.displayName || '',
    ein: data?.ein || '',
    businessType: data?.businessType || '',
    industry: data?.industry || '',
    website: data?.website || '',
    businessAddress: {
      street: data?.businessAddress?.street || '',
      city: data?.businessAddress?.city || '',
      state: data?.businessAddress?.state || '',
      zipCode: data?.businessAddress?.zipCode || '',
      country: data?.businessAddress?.country || 'US',
    },
    primaryContact: {
      firstName: data?.primaryContact?.firstName || '',
      lastName: data?.primaryContact?.lastName || '',
      email: data?.primaryContact?.email || '',
      phone: data?.primaryContact?.phone || '',
      title: data?.primaryContact?.title || '',
    },
    businessDescription: data?.businessDescription || '',
    monthlyVolume: data?.monthlyVolume || '',
    ...data
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateEIN = (ein: string): boolean => {
    const einRegex = /^(\d{2}-\d{7}|\d{9})$/;
    return einRegex.test(ein);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateWebsite = (website: string): boolean => {
    if (!website) return true; // Optional field
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return urlRegex.test(website);
  };

  const validateZipCode = (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.legalBusinessName.trim()) {
      newErrors.legalBusinessName = 'Legal business name is required';
    }

    if (!formData.ein.trim()) {
      newErrors.ein = 'EIN is required';
    } else if (!validateEIN(formData.ein)) {
      newErrors.ein = 'Invalid EIN format (XX-XXXXXXX or XXXXXXXXX)';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.website && !validateWebsite(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    // Address validation
    if (!formData.businessAddress.street.trim()) {
      newErrors['businessAddress.street'] = 'Street address is required';
    }

    if (!formData.businessAddress.city.trim()) {
      newErrors['businessAddress.city'] = 'City is required';
    }

    if (!formData.businessAddress.state.trim()) {
      newErrors['businessAddress.state'] = 'State is required';
    }

    if (!formData.businessAddress.zipCode.trim()) {
      newErrors['businessAddress.zipCode'] = 'ZIP code is required';
    } else if (!validateZipCode(formData.businessAddress.zipCode)) {
      newErrors['businessAddress.zipCode'] = 'Invalid ZIP code format';
    }

    // Contact validation
    if (!formData.primaryContact.firstName.trim()) {
      newErrors['primaryContact.firstName'] = 'First name is required';
    }

    if (!formData.primaryContact.lastName.trim()) {
      newErrors['primaryContact.lastName'] = 'Last name is required';
    }

    if (!formData.primaryContact.email.trim()) {
      newErrors['primaryContact.email'] = 'Email is required';
    } else if (!validateEmail(formData.primaryContact.email)) {
      newErrors['primaryContact.email'] = 'Invalid email format';
    }

    if (!formData.primaryContact.phone.trim()) {
      newErrors['primaryContact.phone'] = 'Phone number is required';
    } else if (!validatePhone(formData.primaryContact.phone)) {
      newErrors['primaryContact.phone'] = 'Invalid phone number format';
    }

    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required';
    } else if (formData.businessDescription.length < 50) {
      newErrors.businessDescription = 'Business description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsValidating(true);
    
    if (validateForm()) {
      onSave(formData);
      onNext();
    }
    
    setIsValidating(false);
  };

  const updateFormData = (path: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Clear error when user starts typing
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          All information must match your official business registration documents. 
          This information will be verified against public records.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Enter your official business details as registered with the government
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legalBusinessName">
                Legal Business Name *
              </Label>
              <Input
                id="legalBusinessName"
                value={formData.legalBusinessName}
                onChange={(e) => updateFormData('legalBusinessName', e.target.value)}
                placeholder="ABC Corporation Inc."
                className={errors.legalBusinessName ? 'border-red-500' : ''}
              />
              {errors.legalBusinessName && (
                <p className="text-sm text-red-500">{errors.legalBusinessName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">
                Display Name (Optional)
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => updateFormData('displayName', e.target.value)}
                placeholder="ABC Corp"
              />
              <p className="text-xs text-muted-foreground">
                How customers will see your business name in messages
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ein">
                EIN (Employer Identification Number) *
              </Label>
              <Input
                id="ein"
                value={formData.ein}
                onChange={(e) => updateFormData('ein', e.target.value)}
                placeholder="XX-XXXXXXX"
                className={errors.ein ? 'border-red-500' : ''}
              />
              {errors.ein && (
                <p className="text-sm text-red-500">{errors.ein}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Format: XX-XXXXXXX or XXXXXXXXX
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select 
                  value={formData.businessType} 
                  onValueChange={(value) => updateFormData('businessType', value)}
                >
                  <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-sm text-red-500">{errors.businessType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => updateFormData('industry', value)}
                >
                  <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Professional Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                Website URL
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                placeholder="https://www.example.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyVolume">Expected Monthly SMS Volume</Label>
              <Select 
                value={formData.monthlyVolume} 
                onValueChange={(value) => updateFormData('monthlyVolume', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">Under 1,000</SelectItem>
                  <SelectItem value="10000">1,000 - 10,000</SelectItem>
                  <SelectItem value="50000">10,000 - 50,000</SelectItem>
                  <SelectItem value="100000">50,000 - 100,000</SelectItem>
                  <SelectItem value="500000">100,000 - 500,000</SelectItem>
                  <SelectItem value="1000000">500,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription">
                Business Description *
              </Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => updateFormData('businessDescription', e.target.value)}
                placeholder="Describe your business, what services/products you offer, and how you plan to use SMS messaging..."
                className={`min-h-[100px] ${errors.businessDescription ? 'border-red-500' : ''}`}
              />
              {errors.businessDescription && (
                <p className="text-sm text-red-500">{errors.businessDescription}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters. Be specific about your use case.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Address & Contact */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
              <CardDescription>
                Physical address where your business is registered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.businessAddress.street}
                  onChange={(e) => updateFormData('businessAddress.street', e.target.value)}
                  placeholder="123 Main Street"
                  className={errors['businessAddress.street'] ? 'border-red-500' : ''}
                />
                {errors['businessAddress.street'] && (
                  <p className="text-sm text-red-500">{errors['businessAddress.street']}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.businessAddress.city}
                    onChange={(e) => updateFormData('businessAddress.city', e.target.value)}
                    placeholder="New York"
                    className={errors['businessAddress.city'] ? 'border-red-500' : ''}
                  />
                  {errors['businessAddress.city'] && (
                    <p className="text-sm text-red-500">{errors['businessAddress.city']}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select 
                    value={formData.businessAddress.state} 
                    onValueChange={(value) => updateFormData('businessAddress.state', value)}
                  >
                    <SelectTrigger className={errors['businessAddress.state'] ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      {/* Add more states */}
                    </SelectContent>
                  </Select>
                  {errors['businessAddress.state'] && (
                    <p className="text-sm text-red-500">{errors['businessAddress.state']}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.businessAddress.zipCode}
                    onChange={(e) => updateFormData('businessAddress.zipCode', e.target.value)}
                    placeholder="12345"
                    className={errors['businessAddress.zipCode'] ? 'border-red-500' : ''}
                  />
                  {errors['businessAddress.zipCode'] && (
                    <p className="text-sm text-red-500">{errors['businessAddress.zipCode']}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={formData.businessAddress.country} 
                    onValueChange={(value) => updateFormData('businessAddress.country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Primary Contact
              </CardTitle>
              <CardDescription>
                Authorized person who can legally represent the business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.primaryContact.firstName}
                    onChange={(e) => updateFormData('primaryContact.firstName', e.target.value)}
                    placeholder="John"
                    className={errors['primaryContact.firstName'] ? 'border-red-500' : ''}
                  />
                  {errors['primaryContact.firstName'] && (
                    <p className="text-sm text-red-500">{errors['primaryContact.firstName']}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.primaryContact.lastName}
                    onChange={(e) => updateFormData('primaryContact.lastName', e.target.value)}
                    placeholder="Doe"
                    className={errors['primaryContact.lastName'] ? 'border-red-500' : ''}
                  />
                  {errors['primaryContact.lastName'] && (
                    <p className="text-sm text-red-500">{errors['primaryContact.lastName']}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.primaryContact.email}
                  onChange={(e) => updateFormData('primaryContact.email', e.target.value)}
                  placeholder="john@company.com"
                  className={errors['primaryContact.email'] ? 'border-red-500' : ''}
                />
                {errors['primaryContact.email'] && (
                  <p className="text-sm text-red-500">{errors['primaryContact.email']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.primaryContact.phone}
                  onChange={(e) => updateFormData('primaryContact.phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors['primaryContact.phone'] ? 'border-red-500' : ''}
                />
                {errors['primaryContact.phone'] && (
                  <p className="text-sm text-red-500">{errors['primaryContact.phone']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.primaryContact.title}
                  onChange={(e) => updateFormData('primaryContact.title', e.target.value)}
                  placeholder="CEO, President, etc."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <div className="text-sm text-muted-foreground">
          * Required fields
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isValidating}
          size="lg"
        >
          {isValidating ? 'Validating...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
};

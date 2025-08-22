
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building, Save, Loader2, AlertCircle } from 'lucide-react';
import { useSaasSettings } from '@/hooks/useSaasSettings';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

const industryOptions = [
  'Healthcare',
  'Finance',
  'Real Estate',
  'Education',
  'Legal',
  'Hospitality',
  'Retail',
  'E-commerce',
  'Transportation',
  'Insurance',
  'Marketing',
  'Construction',
  'Manufacturing',
  'Technology',
  'Telecommunications',
  'Non-Profit',
  'Entertainment & Media',
  'Government',
  'Logistics',
  'Recruitment',
];

const SaasSettingsTab = () => {
  const { currentSubAccount } = useSubAccount();
  const { 
    saasSettings, 
    isLoading, 
    updateSaasSettings, 
    createDefaultSettings,
    isUpdating,
    isCreating,
    error
  } = useSaasSettings();

  const [formData, setFormData] = useState({
    ownerName: '',
    companyName: '',
    phone: '',
    website: '',
    address: '',
    postalCode: '',
    industry: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (saasSettings) {
      setFormData({
        ownerName: saasSettings.ownerName || '',
        companyName: saasSettings.companyName || '',
        phone: saasSettings.phone || '',
        website: saasSettings.website || '',
        address: saasSettings.address || '',
        postalCode: saasSettings.postalCode || '',
        industry: saasSettings.industry || '',
        description: saasSettings.description || '',
      });
      setHasChanges(false);
    }
  }, [saasSettings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateSaasSettings(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save SAAS settings:', error);
    }
  };

  const handleCreateDefault = async () => {
    try {
      await createDefaultSettings();
    } catch (error) {
      console.error('Failed to create default settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading SAAS settings...</span>
      </div>
    );
  }

  // If no settings exist, show create default button
  if (!saasSettings && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            SAAS Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No SAAS settings found. Create default settings to get started.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleCreateDefault} 
            disabled={isCreating}
            className="mt-4"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Default Settings'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            SAAS Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Read-only Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">SAAS ID</Label>
              <div className="mt-1">
                <Badge variant="secondary" className="font-mono">
                  {currentSubAccount?.id || 'N/A'}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email (Read-only)</Label>
              <Input 
                value={saasSettings?.email || ''} 
                readOnly 
                className="mt-1 bg-muted/50"
              />
            </div>
          </div>

          <Separator />

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerName">SAAS Owner *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                placeholder="Enter owner name"
                className={errors.ownerName ? 'border-destructive' : ''}
              />
              {errors.ownerName && (
                <p className="text-sm text-destructive mt-1">{errors.ownerName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
                className={errors.companyName ? 'border-destructive' : ''}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                defaultCountry="US"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value || '')}
                className="react-phone-number-input w-full border border-input rounded-md px-3 py-2 text-sm"
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger className={errors.industry ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-destructive mt-1">{errors.industry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Business Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter business address"
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && (
              <p className="text-sm text-destructive mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your business"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaasSettingsTab;

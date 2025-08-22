import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneInput } from '@/components/ui/phone-input';
import { 
  Phone, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle,
  Search,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

interface PhoneNumberRegistrationProps {
  data?: any[];
  brandData?: any;
  campaignData?: any;
  onSave: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhoneNumberRegistration: React.FC<PhoneNumberRegistrationProps> = ({
  data = [],
  brandData,
  campaignData,
  onSave,
  onNext,
  onBack
}) => {
  const [phoneNumbers, setPhoneNumbers] = useState(data.length > 0 ? data : [{ 
    number: '', 
    type: 'longcode', 
    status: 'pending',
    registrationId: ''
  }]);
  const [searchAreaCode, setSearchAreaCode] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers(prev => [...prev, { 
      number: '', 
      type: 'longcode', 
      status: 'pending',
      registrationId: ''
    }]);
  };

  const handleRemovePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handlePhoneNumberChange = (index: number, field: string, value: string) => {
    setPhoneNumbers(prev => prev.map((phone, i) => 
      i === index ? { ...phone, [field]: value } : phone
    ));
  };

  const searchAvailableNumbers = async () => {
    if (!searchAreaCode || searchAreaCode.length !== 3) {
      toast.error('Please enter a valid 3-digit area code');
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call to search for available numbers
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNumbers = Array.from({ length: 10 }, (_, i) => 
        `+1${searchAreaCode}${Math.floor(Math.random() * 9000000) + 1000000}`
      );
      
      setAvailableNumbers(mockNumbers);
      toast.success(`Found ${mockNumbers.length} available numbers`);
    } catch (error) {
      toast.error('Failed to search for available numbers');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectNumber = (number: string) => {
    const emptyIndex = phoneNumbers.findIndex(phone => !phone.number);
    if (emptyIndex >= 0) {
      handlePhoneNumberChange(emptyIndex, 'number', number);
    } else {
      setPhoneNumbers(prev => [...prev, { 
        number, 
        type: 'longcode', 
        status: 'pending',
        registrationId: ''
      }]);
    }
    toast.success('Phone number added');
  };

  const validatePhoneNumbers = () => {
    const validNumbers = phoneNumbers.filter(phone => phone.number && phone.number.length > 10);
    if (validNumbers.length === 0) {
      toast.error('Please add at least one valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validatePhoneNumbers()) return;

    const updatedNumbers = phoneNumbers.map(phone => ({
      ...phone,
      brandId: brandData?.registrationId || 'pending',
      campaignId: campaignData?.registrationId || 'pending'
    }));

    onSave(updatedNumbers);
    onNext();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Phone className="h-6 w-6" />
          Phone Number Registration
        </h2>
        <p className="text-muted-foreground">
          Register phone numbers for A2P messaging campaigns
        </p>
      </div>

      {/* Search for Available Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Available Numbers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="areaCode">Area Code</Label>
              <Input
                id="areaCode"
                placeholder="e.g., 555"
                value={searchAreaCode}
                onChange={(e) => setSearchAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
              />
            </div>
            <Button 
              onClick={searchAvailableNumbers}
              disabled={isSearching || searchAreaCode.length !== 3}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {availableNumbers.length > 0 && (
            <div className="space-y-2">
              <Label>Available Numbers</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {availableNumbers.map((number, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectNumber(number)}
                    className="text-left justify-between"
                  >
                    {number}
                    <Plus className="h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Numbers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Registered Phone Numbers</span>
            <Button onClick={handleAddPhoneNumber} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Number
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-4 items-center p-4 border rounded-lg">
              <div className="flex-1">
                <Label>Phone Number {index + 1}</Label>
                <PhoneInput
                  value={phone.number}
                  onChange={(value) => handlePhoneNumberChange(index, 'number', value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="w-32">
                <Label>Type</Label>
                <select
                  value={phone.type}
                  onChange={(e) => handlePhoneNumberChange(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="longcode">Long Code</option>
                  <option value="shortcode">Short Code</option>
                  <option value="tollfree">Toll-Free</option>
                </select>
              </div>
              <div className="w-24">
                <Label>Status</Label>
                <Badge variant={phone.status === 'approved' ? 'default' : 'secondary'}>
                  {phone.status === 'approved' ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {phone.status}
                </Badge>
              </div>
              {phoneNumbers.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemovePhoneNumber(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Phone Number Requirements:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Numbers must be verified before use for A2P messaging</li>
            <li>Short codes require additional approval and higher fees</li>
            <li>Toll-free numbers have special compliance requirements</li>
            <li>All numbers will be registered with your brand and campaign</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Campaign
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          Continue to Compliance
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PhoneNumberRegistration;
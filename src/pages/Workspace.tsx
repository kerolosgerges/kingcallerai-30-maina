import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { FullScreenLoader } from '@/components/LoadingSpinner';
import { LogOut } from 'lucide-react';

const Workspace = () => {
  const {
    currentUser,
    createWorkspaceForUser,
    authInitialized,
    logout,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    postalCode: '',
    industry: '',
    logoFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    if (!authInitialized) return;
    if (!currentUser) navigate('/signup', { replace: true });
  }, [authInitialized, currentUser, navigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Business name is required';
    if (!form.phone || !isValidPhoneNumber(form.phone)) errs.phone = 'Valid phone number is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.address) errs.address = 'Address is required';
    if (!form.postalCode) errs.postalCode = 'Postal code is required';
    if (!form.industry) errs.industry = 'Industry is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    let logoUrl = '';

    try {
      if (form.logoFile) {
        const fileRef = ref(storage, `logos/${currentUser?.uid}_${form.logoFile.name}`);
        await uploadBytes(fileRef, form.logoFile);
        logoUrl = await getDownloadURL(fileRef);
      }

      await createWorkspaceForUser({
        name: form.name,
        phone: form.phone,
        email: form.email,
        website: form.website,
        address: form.address,
      });
    } catch (err) {
      console.error('Workspace creation failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!authInitialized) return <FullScreenLoader text="Checking authentication..." />;
  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <LogOut className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Business Workspace</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between items-center bg-muted p-4 rounded mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as:</p>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <Label>Business Email</Label>
                <Input name="email" value={form.email} onChange={handleChange} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <Label>Phone Number</Label>
                <PhoneInput
                  defaultCountry="US"
                  value={form.phone}
                  onChange={(value) => setForm(f => ({ ...f, phone: value || '' }))}
                  className="react-phone-number-input w-full border border-input rounded-md px-3 py-2 text-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div>
                <Label>Website</Label>
                <Input name="website" value={form.website} onChange={handleChange} />
              </div>

              <div>
                <Label>Industry</Label>
                <Select value={form.industry} onValueChange={val => setForm(f => ({ ...f, industry: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(ind => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && <p className="text-red-500 text-sm">{errors.industry}</p>}
              </div>

              <div>
                <Label>Business Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    setForm(prev => ({ ...prev, logoFile: e.target.files?.[0] || null }))
                  }
                />
              </div>

              <div>
                <Label>Business Address</Label>
                <Input name="address" value={form.address} onChange={handleChange} />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div>
                <Label>Postal Code</Label>
                <Input name="postalCode" value={form.postalCode} onChange={handleChange} />
                {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading || submitting}
            >
              {submitting ? 'Creating Workspace...' : 'Create Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Workspace;

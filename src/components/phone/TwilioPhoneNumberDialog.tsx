
import React, { useState } from 'react';
import { Phone, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTwilioSubaccounts } from '@/hooks/useTwilioSubaccounts';

interface TwilioPhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TwilioPhoneNumberDialog: React.FC<TwilioPhoneNumberDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [countryCode, setCountryCode] = useState('US');
  const [phoneNumberType, setPhoneNumberType] = useState<'local' | 'toll_free'>('local');
  const [areaCode, setAreaCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contains, setContains] = useState('');

  const {
    currentSubAccount,
    hasSubAccounts,
    purchasePhoneNumber,
    isLoading,
  } = useTwilioSubaccounts();

  const handlePurchase = async () => {
    if (!currentSubAccount) return;

    const request = {
      country_code: countryCode,
      phone_number_type: phoneNumberType,
      ...(phoneNumber && { phone_number: phoneNumber }),
      ...(areaCode && { area_code: areaCode }),
      ...(contains && { contains }),
    };

    const result = await purchasePhoneNumber(request);
    if (result) {
      onOpenChange(false);
      // Reset form
      setCountryCode('US');
      setPhoneNumberType('local');
      setAreaCode('');
      setPhoneNumber('');
      setContains('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Purchase Phone Number
          </DialogTitle>
          <DialogDescription>
            Purchase a new phone number from Twilio for your subaccount.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!hasSubAccounts && (
            <Alert>
              <AlertDescription>
                You need to create a Twilio subaccount first before purchasing phone numbers.
              </AlertDescription>
            </Alert>
          )}

          {currentSubAccount && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Purchasing for subaccount:</p>
              <p className="font-medium">{currentSubAccount.friendly_name}</p>
              <p className="text-xs text-muted-foreground font-mono">{currentSubAccount.sid}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="countryCode">Country Code</Label>
                <Select value={countryCode} onValueChange={setCountryCode} disabled={isLoading || !hasSubAccounts}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States (US)</SelectItem>
                    <SelectItem value="CA">Canada (CA)</SelectItem>
                    <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumberType">Number Type</Label>
                <Select value={phoneNumberType} onValueChange={(value: 'local' | 'toll_free') => setPhoneNumberType(value)} disabled={isLoading || !hasSubAccounts}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="toll_free">Toll Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Specific Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading || !hasSubAccounts}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="areaCode">Area Code (Optional)</Label>
                <Input
                  id="areaCode"
                  placeholder="415"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value)}
                  disabled={isLoading || !hasSubAccounts}
                />
              </div>
              <div>
                <Label htmlFor="contains">Contains Digits (Optional)</Label>
                <Input
                  id="contains"
                  placeholder="123"
                  value={contains}
                  onChange={(e) => setContains(e.target.value)}
                  disabled={isLoading || !hasSubAccounts}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isLoading || !hasSubAccounts || !currentSubAccount}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Purchasing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Purchase Number
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

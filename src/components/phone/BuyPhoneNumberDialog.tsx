import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { BuyPhoneNumberRequest, AvailablePhoneNumber } from '@/services/subAccountKingCallerAuth';

const formSchema = z.object({
  areaCode: z.string().min(3, 'Area code must be at least 3 digits'),
  label: z.string().min(1, 'Label is required'),
});

interface BuyPhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BuyPhoneNumberRequest) => void;
  getAvailableNumbers: (areaCode?: string) => Promise<AvailablePhoneNumber[]>;
  isLoading?: boolean;
}

export const BuyPhoneNumberDialog: React.FC<BuyPhoneNumberDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  getAvailableNumbers,
  isLoading = false,
}) => {
  const { currentSubAccount } = useSubAccount();
  const [availableNumbers, setAvailableNumbers] = useState<AvailablePhoneNumber[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<AvailablePhoneNumber | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaCode: '',
      label: '',
    },
  });

  const handleSearch = async () => {
    const areaCode = form.getValues('areaCode');
    if (!areaCode) return;

    setSearchLoading(true);
    try {
      const numbers = await getAvailableNumbers(areaCode);
      setAvailableNumbers(numbers);
    } catch (error) {
      console.error('Error searching for available numbers:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBuyNumber = () => {
    if (!selectedNumber || !currentSubAccount) return;

    const label = form.getValues('label');
    onSubmit({
      phoneNumber: selectedNumber.phoneNumber,
      label,
      subAccountId: currentSubAccount.id,
    });
    
    form.reset();
    setAvailableNumbers([]);
    setSelectedNumber(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buy Phone Number</DialogTitle>
          <DialogDescription>
            Search for available phone numbers by area code and purchase one for your account.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="areaCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Area Code</FormLabel>
                    <FormControl>
                      <Input placeholder="415" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="mb-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Support Line" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name for this phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {availableNumbers.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Available Numbers:</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableNumbers.map((number) => (
                    <Card
                      key={number.phoneNumber}
                      className={`cursor-pointer transition-colors ${
                        selectedNumber?.phoneNumber === number.phoneNumber
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedNumber(number)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{number.phoneNumber}</div>
                            <div className="text-sm text-gray-500">
                              {number.locality}, {number.region}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{number.price}</div>
                            <div className="flex gap-1">
                              {number.capabilities.voice && (
                                <Badge variant="secondary" className="text-xs">Voice</Badge>
                              )}
                              {number.capabilities.sms && (
                                <Badge variant="secondary" className="text-xs">SMS</Badge>
                              )}
                              {number.capabilities.mms && (
                                <Badge variant="secondary" className="text-xs">MMS</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleBuyNumber}
                disabled={!selectedNumber || isLoading}
              >
                {isLoading ? 'Purchasing...' : 'Buy Selected Number'}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
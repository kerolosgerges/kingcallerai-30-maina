import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { ImportPhoneNumberRequest } from '@/services/subAccountKingCallerAuth';

const formSchema = z.object({
  twilioPhoneNumber: z.string().min(1, 'Phone number is required').regex(/^\+\d{11,15}$/, 'Must be a valid phone number with country code (e.g., +1234567890)'),
  twilioSid: z.string().min(1, 'Twilio Account SID is required'),
  twilioAuthToken: z.string().min(1, 'Twilio Auth Token is required'),
  label: z.string().min(1, 'Label is required'),
});

interface ImportPhoneNumberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ImportPhoneNumberRequest) => void;
  isLoading?: boolean;
}

export const ImportPhoneNumberDialog: React.FC<ImportPhoneNumberDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twilioPhoneNumber: '',
      twilioSid: '',
      twilioAuthToken: '',
      label: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      twilioPhoneNumber: values.twilioPhoneNumber,
      twilioSid: values.twilioSid,
      twilioAuthToken: values.twilioAuthToken,
      label: values.label,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Phone Number from Twilio</DialogTitle>
          <DialogDescription>
            Import an existing phone number from your Twilio account. Make sure you have the correct credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="twilioPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+16154887321" {...field} />
                  </FormControl>
                  <FormDescription>
                    Include the country code (e.g., +1 for US)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Support Line" {...field} />
                  </FormControl>
                  <FormDescription>
                    A friendly name for this phone number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twilioSid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twilio Account SID</FormLabel>
                  <FormControl>
                    <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Twilio Account SID (starts with AC)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twilioAuthToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twilio Auth Token</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Twilio Auth Token (keep this secure)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Importing...' : 'Import Phone Number'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
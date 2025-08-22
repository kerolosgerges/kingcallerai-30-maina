import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountrySelector } from '@/components/ui/country-selector';
import { CustomPhoneInput } from '@/components/ui/phone-input';

const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  label: z.string().min(1, 'Label is required'),
});

const emailSchema = z.object({
  email: z.string().email('Valid email is required'),
  label: z.string().min(1, 'Label is required'),
});

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  postalCode: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
  profileImage: z.string().optional(),
  phoneNumbers: z.array(phoneNumberSchema).optional(),
  emails: z.array(emailSchema).optional(),
});

interface ContactCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
  isEditMode?: boolean;
  title?: string;
  description?: string;
}

export const ContactCreateDialog: React.FC<ContactCreateDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  initialData,
  isEditMode = false,
  title = "Create Contact",
  description = "Add a new contact to your database. Fill in the details below.",
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      title: '',
      company: '',
      country: '',
      address: '',
      pincode: '',
      postalCode: '',
      birthday: '',
      notes: '',
      profileImage: '',
      phoneNumbers: [{ phoneNumber: '', label: 'Office' }],
      emails: [{ email: '', label: 'Office' }],
    },
  });

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open && initialData) {
      form.reset(initialData);
    }
  }, [open, initialData, form]);

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control,
    name: 'phoneNumbers',
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control: form.control,
    name: 'emails',
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out empty phone numbers and emails and ensure required fields
    const phoneNumbers = values.phoneNumbers
      ?.filter(p => p.phoneNumber.trim() !== '')
      .map(p => ({
        phoneNumber: p.phoneNumber,
        label: p.label
      })) || [];
      
    const emails = values.emails
      ?.filter(e => e.email.trim() !== '')
      .map(e => ({
        email: e.email,
        label: e.label
      })) || [];
    
    onSubmit({
      name: values.name!, // name is required, form validation ensures it exists
      title: values.title,
      company: values.company,
      address: values.address,
      pincode: values.pincode,
      postalCode: values.postalCode,
      birthday: values.birthday,
      notes: values.notes,
      profileImage: values.profileImage,
      phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : undefined,
      emails: emails.length > 0 ? emails : undefined,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
           <DialogTitle>{title}</DialogTitle>
           <DialogDescription>
             {description}
           </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Sr. Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Tech Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>
                 
                 <FormField
                   control={form.control}
                   name="country"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Country</FormLabel>
                       <FormControl>
                         <CountrySelector
                           value={field.value}
                           onValueChange={field.onChange}
                           placeholder="Select country..."
                         />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                
                <div className="space-y-2">
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setProfileImageFile(file || null);

                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewUrl(reader.result as string);
                            form.setValue('profileImage', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>



              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Phone Numbers</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendPhone({ phoneNumber: '', label: 'Personal' })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Phone
                    </Button>
                  </div>
                  <div className="space-y-2">
                     {phoneFields.map((field, index) => (
                       <div key={field.id} className="flex gap-2 items-end">
                         <FormField
                           control={form.control}
                           name={`phoneNumbers.${index}.phoneNumber`}
                           render={({ field }) => (
                             <FormItem className="flex-1">
                               <FormControl>
                                 <CustomPhoneInput
                                   value={field.value}
                                   onChange={field.onChange}
                                   placeholder="Enter phone number"
                                 />
                               </FormControl>
                             </FormItem>
                           )}
                         />
                         <FormField
                           control={form.control}
                           name={`phoneNumbers.${index}.label`}
                           render={({ field }) => (
                             <FormItem className="w-24">
                               <FormControl>
                                 <Input placeholder="Label" {...field} />
                               </FormControl>
                             </FormItem>
                           )}
                         />
                         {phoneFields.length > 1 && (
                           <Button
                             type="button"
                             variant="ghost"
                             size="sm"
                             onClick={() => removePhone(index)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         )}
                       </div>
                     ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Email Addresses</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendEmail({ email: '', label: 'Personal' })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Email
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {emailFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-end">
                        <FormField
                          control={form.control}
                          name={`emails.${index}.email`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`emails.${index}.label`}
                          render={({ field }) => (
                            <FormItem className="w-24">
                              <FormControl>
                                <Input placeholder="Label" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {emailFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEmail(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Street, City, State, Country" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input placeholder="68004" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="SW1A 1AA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this contact..." 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
               <Button type="submit" disabled={isLoading}>
                 {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Contact' : 'Create Contact')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
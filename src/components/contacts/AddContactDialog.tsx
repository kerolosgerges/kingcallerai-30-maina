import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { contactService } from "@/services/ServiceRegistry";
import { Contact } from "@/pages/Contacts";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdded?: () => void;
}

export const AddContactDialog = ({ open, onOpenChange, onContactAdded }: AddContactDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !currentSubAccount) {
      toast({
        title: "Error",
        description: "You must be logged in and have a sub-account selected.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        status: "new",
        leadSource: "manual",
        tags: [],
        score: 0,
        customFields: {},
        activities: [],
        subAccountId: currentSubAccount.id,
        createdBy: currentUser.uid,
        title: '',
        address: '',
        pincode: '',
        birthday: '',
        notes: '',
        profileImage: '',
        avatar: '',
        phoneNumbers: formData.phone.trim() ? [{ countryCode: '+1', phoneNumber: formData.phone.trim(), label: 'Primary' }] : [],
        emails: formData.email.trim() ? [{ email: formData.email.trim(), label: 'Primary' }] : [],
      };

      const contactId = await contactService.createContact(
        currentSubAccount.id,
        contactData,
        currentUser.uid
      );

      if (contactId) {
        toast({
          title: "Success",
          description: "Contact added successfully!",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: ""
        });
        
        onContactAdded?.();
        onOpenChange(false);
      } else {
        throw new Error('Failed to create contact');
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Acme Corp"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
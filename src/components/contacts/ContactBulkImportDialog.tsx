import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ContactBulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkCreate: (data: any) => void;
  onBulkImportPincode: (data: any) => void;
  isLoading?: boolean;
}

export const ContactBulkImportDialog: React.FC<ContactBulkImportDialogProps> = ({
  open,
  onOpenChange,
  onBulkCreate,
  onBulkImportPincode,
  isLoading = false,
}) => {
  const [jsonData, setJsonData] = useState('');
  const [pincodes, setPincodes] = useState('');

  const handleBulkImport = () => {
    try {
      const contacts = JSON.parse(jsonData);
      onBulkCreate({ contacts });
      setJsonData('');
      onOpenChange(false);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handlePincodeImport = () => {
    try {
      const pincodeArray = pincodes.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
      onBulkImportPincode({ pincodes: pincodeArray });
      setPincodes('');
      onOpenChange(false);
    } catch (error) {
      alert('Invalid pincode format');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Import</DialogTitle>
          <DialogDescription>
            Import multiple contacts or pincodes at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Import Contacts (JSON)</h4>
            <Textarea
              placeholder="Paste JSON array of contacts..."
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={6}
            />
            <Button onClick={handleBulkImport} disabled={!jsonData || isLoading} className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Import Contacts
            </Button>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Import Pincodes</h4>
            <Textarea
              placeholder="Enter pincodes separated by commas: 68003, 68042, 68366"
              value={pincodes}
              onChange={(e) => setPincodes(e.target.value)}
              rows={3}
            />
            <Button onClick={handlePincodeImport} disabled={!pincodes || isLoading} className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Import Pincodes
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
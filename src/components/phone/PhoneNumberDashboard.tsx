import React, { useState } from 'react';
import { Plus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhoneNumberTable } from './PhoneNumberTable';
import { ImportPhoneNumberDialog } from './ImportPhoneNumberDialog';
import { BuyPhoneNumberDialog } from './BuyPhoneNumberDialog';
import { usePhoneNumberOperations } from '@/hooks/usePhoneNumberOperations';

export const PhoneNumberDashboard = () => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  
  const {
    phoneNumbers,
    subAccountPhoneNumbers,
    isLoading,
    handleImportPhoneNumber,
    handleBuyPhoneNumber,
    getAvailablePhoneNumbers,
  } = usePhoneNumberOperations();

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading phone numbers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📞 Phone Numbers</h1>
            <p className="text-gray-600">Manage your Twilio phone numbers</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              Import from Twilio
            </Button>
            <Button onClick={() => setShowBuyDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buy Phone Number
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phoneNumbers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sub-Account Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subAccountPhoneNumbers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {phoneNumbers.filter(n => n.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phone Numbers Table */}
      <PhoneNumberTable phoneNumbers={phoneNumbers} />

      {phoneNumbers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <Phone className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Phone Numbers</h3>
          <p className="text-gray-600 mb-4">
            Import existing numbers or buy new ones to get started
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              Import from Twilio
            </Button>
            <Button onClick={() => setShowBuyDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buy Phone Number
            </Button>
          </div>
        </div>
      )}

      {/* Import Phone Number Dialog */}
      <ImportPhoneNumberDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onSubmit={handleImportPhoneNumber}
        isLoading={isLoading}
      />

      {/* Buy Phone Number Dialog */}
      <BuyPhoneNumberDialog
        open={showBuyDialog}
        onOpenChange={setShowBuyDialog}
        onSubmit={handleBuyPhoneNumber}
        getAvailableNumbers={getAvailablePhoneNumbers}
        isLoading={isLoading}
      />
    </div>
  );
};
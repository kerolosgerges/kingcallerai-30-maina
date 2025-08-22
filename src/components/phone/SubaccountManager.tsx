
import React, { useState } from 'react';
import { Plus, Building, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTwilioSubaccounts } from '@/hooks/useTwilioSubaccounts';

export const SubaccountManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [friendlyName, setFriendlyName] = useState('');
  
  const {
    subAccounts,
    currentSubAccount,
    phoneNumbers,
    isLoading,
    hasSubAccounts,
    createSubAccount,
    setCurrentSubAccount,
  } = useTwilioSubaccounts();

  const handleCreateSubAccount = async () => {
    if (!friendlyName.trim()) return;
    
    const result = await createSubAccount(friendlyName.trim());
    if (result) {
      setFriendlyName('');
      setShowCreateForm(false);
    }
  };

  if (isLoading && !hasSubAccounts) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Loading subaccounts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Subaccount Status */}
      {hasSubAccounts ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Current Subaccount
            </CardTitle>
            <CardDescription>Manage your Twilio subaccount settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Active Subaccount</Label>
                  <Select
                    value={currentSubAccount?.sid || ''}
                    onValueChange={(value) => {
                      const selected = subAccounts.find(sub => sub.sid === value);
                      if (selected) setCurrentSubAccount(selected);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a subaccount" />
                    </SelectTrigger>
                    <SelectContent>
                      {subAccounts.map((subAccount) => (
                        <SelectItem key={subAccount.sid} value={subAccount.sid}>
                          {subAccount.friendly_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Subaccount
                </Button>
              </div>

              {currentSubAccount && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Subaccount SID</p>
                    <p className="font-mono text-sm">{currentSubAccount.sid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={currentSubAccount.status === 'active' ? 'default' : 'secondary'}>
                      {currentSubAccount.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Numbers</p>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="font-semibold">{phoneNumbers.length}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(currentSubAccount.date_created).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No Twilio subaccounts found. Create one to start purchasing phone numbers.
          </AlertDescription>
        </Alert>
      )}

      {/* Create Subaccount Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Subaccount</CardTitle>
            <CardDescription>Create a new Twilio subaccount for organizing your phone numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="friendlyName">Subaccount Name</Label>
                <Input
                  id="friendlyName"
                  placeholder="Enter a friendly name for your subaccount"
                  value={friendlyName}
                  onChange={(e) => setFriendlyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateSubAccount}
                  disabled={!friendlyName.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Subaccount
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFriendlyName('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

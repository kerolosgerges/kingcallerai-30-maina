
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NumberAssignmentProps {
  data?: any[];
  campaignData?: any;
  onSave: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PhoneNumber {
  id: string;
  number: string;
  carrier: string;
  region: string;
  type: string;
  status: string;
  costPerMonth?: number;
}

export const NumberAssignment: React.FC<NumberAssignmentProps> = ({
  data,
  campaignData,
  onSave,
  onNext,
  onBack
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>(data || []);
  const [availableNumbers, setAvailableNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for available phone numbers
  useEffect(() => {
    const fetchNumbers = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockNumbers: PhoneNumber[] = [
          {
            id: '1',
            number: '+1 (507) 580-5007',
            carrier: 'Twilio',
            region: 'Minnesota',
            type: 'Local',
            status: 'unregistered',
            costPerMonth: 1.00
          },
          {
            id: '2',
            number: '+1 (212) 555-0123',
            carrier: 'Bandwidth',
            region: 'New York',
            type: 'Local',
            status: 'unregistered',
            costPerMonth: 1.00
          },
          {
            id: '3',
            number: '+1 (800) 555-0199',
            carrier: 'Twilio',
            region: 'Toll-Free',
            type: 'Toll-Free',
            status: 'unregistered',
            costPerMonth: 3.00
          }
        ];
        
        setAvailableNumbers(mockNumbers);
        setLoading(false);
      }, 1000);
    };

    fetchNumbers();
  }, []);

  const handleNumberSelect = (numberId: string, checked: boolean) => {
    if (checked) {
      setSelectedNumbers(prev => [...prev, numberId]);
    } else {
      setSelectedNumbers(prev => prev.filter(id => id !== numberId));
    }
  };

  const handleSubmit = () => {
    if (selectedNumbers.length === 0) {
      toast.error('Please select at least one phone number');
      return;
    }

    const selectedNumberData = availableNumbers
      .filter(num => selectedNumbers.includes(num.id))
      .map(num => ({
        id: num.id,
        number: num.number,
        carrier: num.carrier,
        type: num.type
      }));

    onSave(selectedNumberData);
    onNext();
    toast.success(`Selected ${selectedNumbers.length} phone number(s) for registration`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading available phone numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Phone Numbers</CardTitle>
          {campaignData && (
            <p className="text-sm text-muted-foreground">
              Assigning numbers to campaign: <Badge variant="outline">{campaignData.campaignName}</Badge>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Select the phone numbers you want to register for A2P 10DLC messaging.
            Only unregistered numbers are shown.
          </p>
          
          {availableNumbers.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Available Numbers</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any unregistered phone numbers. Purchase new numbers to register them for SMS.
              </p>
              <Button variant="outline">
                Buy Phone Numbers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {availableNumbers.map((number) => (
                <div
                  key={number.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedNumbers.includes(number.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedNumbers.includes(number.id)}
                        onCheckedChange={(checked) => 
                          handleNumberSelect(number.id, checked as boolean)
                        }
                      />
                      <div>
                        <div className="font-medium">{number.number}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{number.carrier}</Badge>
                          <span>•</span>
                          <span>{number.region}</span>
                          <span>•</span>
                          <span>{number.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${number.costPerMonth}/month</div>
                      <div className="text-sm text-muted-foreground">
                        {number.status === 'unregistered' ? 'Available' : number.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Selected Numbers ({selectedNumbers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedNumbers.map((numberId) => {
                const number = availableNumbers.find(n => n.id === numberId);
                return number ? (
                  <div key={numberId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="font-medium">{number.number}</span>
                    <Badge variant="outline" className="text-green-700 border-green-700">
                      Selected
                    </Badge>
                  </div>
                ) : null;
              })}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
              <p className="text-sm text-blue-700">
                These numbers will be registered with The Campaign Registry (TCR) for your campaign.
                Registration typically takes 1-3 business days for approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          size="lg"
          disabled={selectedNumbers.length === 0}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

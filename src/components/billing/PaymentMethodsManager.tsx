
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'card';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default: boolean;
}

export const PaymentMethodsManager = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1234567890',
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      },
      is_default: true
    },
    {
      id: 'pm_0987654321',
      type: 'card',
      card: {
        brand: 'mastercard',
        last4: '5555',
        exp_month: 6,
        exp_year: 2026
      },
      is_default: false
    }
  ]);

  const [loading, setLoading] = useState<string | null>(null);

  const handleAddPaymentMethod = async () => {
    setLoading('add');
    try {
      // TODO: Implement Stripe payment method setup
      toast.success('Payment method setup initiated');
      console.log('Add payment method - implement Stripe setup intent');
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setLoading(null);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setLoading(paymentMethodId);
    try {
      // TODO: Implement set default payment method API call
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          is_default: method.id === paymentMethodId
        }))
      );
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
    } finally {
      setLoading(null);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    setLoading(paymentMethodId);
    try {
      // TODO: Implement remove payment method API call
      setPaymentMethods(methods => 
        methods.filter(method => method.id !== paymentMethodId)
      );
      toast.success('Payment method removed');
    } catch (error) {
      toast.error('Failed to remove payment method');
    } finally {
      setLoading(null);
    }
  };

  const getBrandIcon = (brand: string) => {
    // Return appropriate brand icon based on card brand
    return <CreditCard className="h-4 w-4" />;
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <Card className="rounded-2xl shadow-lg border border-muted/60 bg-background/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
        <CardDescription>
          Manage your payment methods for subscriptions and credits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No payment methods added</p>
            <Button onClick={handleAddPaymentMethod} disabled={loading === 'add'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    {getBrandIcon(method.card?.brand || 'card')}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatCardBrand(method.card?.brand || 'Card')} •••• {method.card?.last4}
                        </span>
                        {method.is_default && (
                          <Badge variant="default" className="bg-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method.card?.exp_month}/{method.card?.exp_year}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={loading === method.id}
                      >
                        Set Default
                      </Button>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading === method.id || method.is_default}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this payment method? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
            
            <Button onClick={handleAddPaymentMethod} disabled={loading === 'add'} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Payment Method
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Phone } from 'lucide-react';
import { useSubAccountKingCallerAuth } from '@/hooks/useSubAccountKingCallerAuth';

export const SubAccountKingCallerStatus = () => {
  const { 
    isConnected, 
    isConnecting, 
    error, 
    connect, 
    disconnect, 
    clearError 
  } = useSubAccountKingCallerAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          KingCaller API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-gray-400" />
                <Badge variant="secondary">
                  Not Connected
                </Badge>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            {isConnected ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnect}
                disabled={isConnecting}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="h-auto p-1"
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          {isConnected ? (
            'Ready to make API calls to KingCaller services.'
          ) : (
            'Connect to enable AI agent management, phone numbers, and voice features.'
          )}
        </div>
      </CardContent>
    </Card>
  );
};

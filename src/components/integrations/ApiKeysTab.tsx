import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const ApiKeysTab = () => {
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentSubAccount } = useSubAccount();

  useEffect(() => {
    const loadApiKey = async () => {
      if (!currentSubAccount?.id) return;
      
      setIsLoading(true);
      try {
        const docRef = doc(db, 'subaccounts', currentSubAccount.id, 'settings', 'apiKeys');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.elevenLabsKey) {
            setElevenLabsKey(data.elevenLabsKey);
          }
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, [currentSubAccount?.id]);

  const handleSaveKey = async () => {
    if (!elevenLabsKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    if (!currentSubAccount?.id) {
      toast({
        title: "Error",
        description: "No sub-account selected",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'subaccounts', currentSubAccount.id, 'settings', 'apiKeys');
      await setDoc(docRef, { elevenLabsKey }, { merge: true });
      
      toast({
        title: "Success",
        description: "ElevenLabs API key saved successfully"
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearKey = async () => {
    if (!currentSubAccount?.id) return;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'subaccounts', currentSubAccount.id, 'settings', 'apiKeys');
      await deleteDoc(docRef);
      setElevenLabsKey('');
      
      toast({
        title: "Success",
        description: "ElevenLabs API key cleared"
      });
    } catch (error) {
      console.error('Error clearing API key:', error);
      toast({
        title: "Error",
        description: "Failed to clear API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            API Keys Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ElevenLabs API Key */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">ElevenLabs API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your ElevenLabs API key for voice generation and Voice Library access
                </p>
              </div>
              <img 
                src="https://elevenlabs.io/favicon.ico" 
                alt="ElevenLabs" 
                className="w-8 h-8"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="elevenlabs-key">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="elevenlabs-key"
                    type={showKey ? "text" : "password"}
                    placeholder="Enter your ElevenLabs API key"
                    value={elevenLabsKey}
                    onChange={(e) => setElevenLabsKey(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleSaveKey} disabled={isLoading} className="shrink-0">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
              
              {elevenLabsKey && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600">✓ API key configured</span>
                  <Button variant="outline" size="sm" onClick={handleClearKey}>
                    Clear Key
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Don't have an API key? Get one from{' '}
              <a 
                href="https://elevenlabs.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ElevenLabs
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysTab;
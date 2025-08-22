
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Volume2 } from 'lucide-react';
import { useSubAccountKingCallerAuth } from '@/hooks/useSubAccountKingCallerAuth';
import { AmbientSound } from '@/services/subAccountKingCallerAuth';

interface AgentSpeechSettingsProps {
  settings: {
    ambientSound?: string;
    responsiveness?: number;
    interruptionSensitivity?: number;
    enableBackchannel?: boolean;
    backchannelFrequency?: number;
  };
  onChange: (settings: any) => void;
  disabled?: boolean;
}

export const AgentSpeechSettings: React.FC<AgentSpeechSettingsProps> = ({
  settings,
  onChange,
  disabled = false
}) => {
  const [ambientSounds, setAmbientSounds] = useState<AmbientSound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAmbientSounds, isConnected } = useSubAccountKingCallerAuth();

  useEffect(() => {
    if (isConnected) {
      loadAmbientSounds();
    }
  }, [isConnected]);

  const loadAmbientSounds = async () => {
    setIsLoading(true);
    try {
      console.log('AgentSpeechSettings: Loading ambient sounds...');
      const sounds = await getAmbientSounds();
      console.log('AgentSpeechSettings: Loaded ambient sounds:', sounds);
      setAmbientSounds(sounds);
    } catch (error) {
      console.error('AgentSpeechSettings: Error loading ambient sounds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    console.log(`AgentSpeechSettings: ${field} changed to:`, value);
    onChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Speech Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ambient Sound */}
        <div className="space-y-2">
          <Label>Background/Ambient Sound</Label>
          <Select
            value={settings.ambientSound || ''}
            onValueChange={(value) => handleChange('ambientSound', value)}
            disabled={disabled || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Loading sounds...' : 'Select ambient sound'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {ambientSounds.map((sound) => (
                <SelectItem key={sound.id} value={sound.id}>
                  {sound.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading ambient sounds...
            </div>
          )}
        </div>

        {/* Responsiveness */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Responsiveness</Label>
            <span className="text-sm text-muted-foreground">
              {((settings.responsiveness || 0.5) * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[settings.responsiveness || 0.5]}
            onValueChange={(value) => handleChange('responsiveness', value[0])}
            min={0}
            max={1}
            step={0.1}
            disabled={disabled}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How quickly the agent responds (0 = slow, 100 = immediate)
          </p>
        </div>

        {/* Interruption Sensitivity */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Interruption Sensitivity</Label>
            <span className="text-sm text-muted-foreground">
              {((settings.interruptionSensitivity || 0.5) * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[settings.interruptionSensitivity || 0.5]}
            onValueChange={(value) => handleChange('interruptionSensitivity', value[0])}
            min={0}
            max={1}
            step={0.1}
            disabled={disabled}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How easily the agent pauses when interrupted (0 = never, 100 = always)
          </p>
        </div>

        {/* Backchanneling */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Backchanneling</Label>
              <p className="text-xs text-muted-foreground">
                Active listening cues like "mm-hmm", "I see"
              </p>
            </div>
            <Switch
              checked={settings.enableBackchannel || false}
              onCheckedChange={(checked) => handleChange('enableBackchannel', checked)}
              disabled={disabled}
            />
          </div>

          {settings.enableBackchannel && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Backchannel Frequency</Label>
                <span className="text-sm text-muted-foreground">
                  {((settings.backchannelFrequency || 0.5) * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[settings.backchannelFrequency || 0.5]}
                onValueChange={(value) => handleChange('backchannelFrequency', value[0])}
                min={0}
                max={1}
                step={0.1}
                disabled={disabled}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How often the agent provides listening cues
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { Voice } from '@/services/subAccountKingCallerAuth';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string;
  onChange: (voiceId: string) => void;
  isLoading?: boolean;
  label?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onChange,
  isLoading = false,
  label = "Voice"
}) => {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  console.log('VoiceSelector: Rendering with voices:', voices);
  console.log('VoiceSelector: Selected voice:', selectedVoice);

  useEffect(() => {
    // Cleanup audio when component unmounts or voice changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(null);
    };
  }, []);

  const playVoiceSample = async (voice: Voice) => {
    console.log('VoiceSelector: Playing sample for voice:', voice);
    
    if (!voice.sampleUrl) {
      console.warn('VoiceSelector: No sample URL for voice:', voice.name);
      setAudioError('No sample available for this voice');
      return;
    }

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (isPlaying === voice.voiceId) {
        setIsPlaying(null);
        return;
      }

      setAudioError(null);
      setIsPlaying(voice.voiceId);

      const audio = new Audio(voice.sampleUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error('VoiceSelector: Error playing audio for voice:', voice.name);
        setAudioError('Failed to play voice sample');
        setIsPlaying(null);
        audioRef.current = null;
      };

      await audio.play();
      console.log('VoiceSelector: Playing audio sample for:', voice.name);
    } catch (error) {
      console.error('VoiceSelector: Error playing voice sample:', error);
      setAudioError('Failed to play voice sample');
      setIsPlaying(null);
      audioRef.current = null;
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(null);
  };

  const selectedVoiceData = voices.find(v => v.voiceId === selectedVoice);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading voices...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Select value={selectedVoice} onValueChange={onChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.length === 0 ? (
              <SelectItem value="no-voices" disabled>
                No voices available
              </SelectItem>
            ) : (
              voices.map((voice) => (
                <SelectItem key={voice.voiceId} value={voice.voiceId}>
                  <div className="flex items-center justify-between w-full">
                    <span>{voice.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {voice.provider} • {voice.gender}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {selectedVoiceData?.sampleUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => 
              isPlaying === selectedVoiceData.voiceId 
                ? stopPlayback() 
                : playVoiceSample(selectedVoiceData)
            }
            disabled={!selectedVoiceData}
            className="flex items-center space-x-1"
          >
            {isPlaying === selectedVoiceData.voiceId ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {audioError && (
        <p className="text-sm text-destructive">{audioError}</p>
      )}
      
      {selectedVoiceData && (
        <div className="text-xs text-muted-foreground">
          Selected: {selectedVoiceData.name} ({selectedVoiceData.provider})
        </div>
      )}
    </div>
  );
};
